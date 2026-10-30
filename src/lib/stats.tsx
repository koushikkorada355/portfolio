import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import bundledStats from "../data/stats.json";

export type LiveStats = {
  leetcode: {
    problems: { all: number; easy: number; medium: number; hard: number };
    rank: number | null;
    contest: {
      attended: number;
      rating: number | null;
      topPercent: number | null;
    } | null;
    badge: { name: string; days: number };
    submissionCalendar?: Record<string, number>;
  };
  gfg: {
    codingScore: number | null;
    problemsSolved: number;
    instituteRank: number | null;
    podLongestStreak: number | null;
    podCurrentStreak: number | null;
  };
  fetchedAt?: string;
  username?: { leetcode: string; gfg: string };
  computed: {
    totalSolved: number;
    bestStreak: number;
    live: boolean;
  };
};

export type SubmissionCalendar = Record<string, number>;

export type StatsContextValue = LiveStats & {
  getLeetCodeActivity: (
    year: number
  ) => Promise<SubmissionCalendar>;
};

const LC_USERNAME = bundledStats.username?.leetcode ?? "koushik_korada27";
const GFG_USERNAME = bundledStats.username?.gfg ?? "koushikkrujk";

const ALFA_BASE = "https://alfa-leetcode-api.onrender.com";
const GFG_PROFILE_URL = `https://www.geeksforgeeks.org/profile/${GFG_USERNAME}`;
const REFRESH_INTERVAL_MS = 30 * 60 * 1000;

const LC_GRAPHQL = /* GraphQL */ `
  query {
    matchedUser(username: "${LC_USERNAME}") {
      username
      profile { ranking }
      submitStats: submitStatsGlobal {
        acSubmissionNum { difficulty count }
      }
    }
    userContestRanking(username: "${LC_USERNAME}") {
      attendedContestsCount
      rating
      topPercentage
    }
  }`;

const LC_CALENDAR_GRAPHQL = /* GraphQL */ `
  query UserCalendar($username: String!, $year: Int) {
    matchedUser(username: $username) {
      userCalendar(year: $year) {
        submissionCalendar
      }
    }
  }`;

function computeExtras(
  leetcode: LiveStats["leetcode"],
  gfg: LiveStats["gfg"]
): LiveStats["computed"] {
  const total = (leetcode?.problems?.all ?? 0) + (gfg?.problemsSolved ?? 0);
  const bestStreak = Math.max(
    gfg?.podLongestStreak ?? 0,
    gfg?.podCurrentStreak ?? 0
  );
  return { totalSolved: total, bestStreak, live: false };
}

function fromBundled(): LiveStats {
  const s = bundledStats as unknown as LiveStats;
  return { ...s, computed: computeExtras(s.leetcode, s.gfg) };
}

async function fetchJson(url: string, ms = 8000, init?: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

async function fetchText(url: string, ms = 10000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(String(res.status));
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

function parseGfgStats(html: string): LiveStats["gfg"] {
  const normalized = html.replace(/\\+/g, "");
  const grab = (key: string) => {
    const match = normalized.match(new RegExp(`${key}"\\s*:\\s*(\\d+)`));
    return match ? Number(match[1]) : null;
  };
  const scoreMatch = normalized.match(/"score"\s*:\s*(\d+)\s*,\s*"monthly_score"/);
  const stats = {
    codingScore: scoreMatch ? Number(scoreMatch[1]) : grab("coding_score"),
    problemsSolved: grab("total_problems_solved"),
    instituteRank: grab("institute_rank"),
    podLongestStreak: grab("pod_solved_longest_streak"),
    podCurrentStreak: grab("pod_solved_current_streak"),
  };
  const { problemsSolved } = stats;
  if (problemsSolved == null) throw new Error("GFG profile did not contain problem stats");
  return { ...stats, problemsSolved };
}

function parseSubmissionCalendar(value: unknown): SubmissionCalendar {
  const parsed =
    typeof value === "string"
      ? (JSON.parse(value) as unknown)
      : value;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("LeetCode returned an invalid submission calendar.");
  }

  return Object.entries(parsed).reduce<SubmissionCalendar>((calendar, [timestamp, count]) => {
    if (/^\d+$/.test(timestamp) && typeof count === "number" && count >= 0) {
      calendar[timestamp] = count;
    }
    return calendar;
  }, {});
}

async function refreshGfg(): Promise<LiveStats["gfg"] | null> {
  const urls = [
    "/api/gfg",
    GFG_PROFILE_URL,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(GFG_PROFILE_URL)}`,
  ];
  let lastError: unknown;
  for (const url of urls) {
    try {
      const response = await fetchText(url);
      return url === "/api/gfg" ? (JSON.parse(response) as LiveStats["gfg"]) : parseGfgStats(response);
    } catch (error) {
      lastError = error;
      // Try the next source; profile pages often reject browser-origin requests.
    }
  }
  console.warn("Live GFG refresh unavailable.", lastError);
  return null;
}

// Primary browser path: alfa-leetcode-api (CORS `*`) — always reachable.
// NOTE: only totalSolved + ranking are taken from alfa; its per-difficulty
// counts use different semantics than LeetCode's official acSubmissionNum,
// so difficulty splits stay from the build-time GraphQL fetch.
async function refreshLeetCodeAlfa(): Promise<Partial<LiveStats["leetcode"]> | null> {
  const [profile, base] = await Promise.all([
    fetchJson(`${ALFA_BASE}/userProfile/${LC_USERNAME}`),
    fetchJson(`${ALFA_BASE}/${LC_USERNAME}`),
  ]);
  if (profile?.totalSolved == null) return null;
  return {
    problems: { all: profile.totalSolved, easy: null } as never,
    rank: base?.ranking ?? null,
  };
}

// Secondary: direct GraphQL (works wherever CORS permits; gives contest data).
async function refreshLeetCodeDirect(): Promise<Partial<LiveStats["leetcode"]> | null> {
  const json = await fetchJson("https://leetcode.com/graphql", 7000, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: LC_GRAPHQL }),
  });
  const mu = json?.data?.matchedUser;
  const ac = mu?.submitStats?.acSubmissionNum ?? [];
  const get = (d: string) =>
    ac.find((x: { difficulty: string }) => x.difficulty === d)?.count ?? 0;
  if (!get("All")) return null;
  const cr = json?.data?.userContestRanking;
  let submissionCalendar: Record<string, number> | undefined;
  try {
    submissionCalendar = mu?.submissionCalendar
      ? JSON.parse(mu.submissionCalendar)
      : undefined;
  } catch {
    console.warn("LeetCode submission calendar had an invalid format.");
  }
  return {
    problems: {
      all: get("All"),
      easy: get("Easy"),
      medium: get("Medium"),
      hard: get("Hard"),
    },
    rank: mu?.profile?.ranking ?? null,
    submissionCalendar,
    contest: cr
      ? {
          attended: cr.attendedContestsCount ?? 0,
          rating: cr.rating ? Math.round(cr.rating) : null,
          topPercent:
            cr.topPercentage != null
              ? Math.round(cr.topPercentage * 100) / 100
              : null,
        }
      : null,
  };
}

export function StatsProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<LiveStats>(fromBundled);
  const calendarRequests = useRef(
    new Map<number, Promise<SubmissionCalendar>>()
  );
  const fallbackCalendarRequest = useRef<Promise<SubmissionCalendar> | null>(null);

  const fetchLeetCodeActivityFallback = useCallback(async () => {
    if (!fallbackCalendarRequest.current) {
      fallbackCalendarRequest.current = fetchJson(`${ALFA_BASE}/userProfile/${LC_USERNAME}`)
        .then((json) => parseSubmissionCalendar(json?.submissionCalendar))
        .catch((error) => {
          fallbackCalendarRequest.current = null;
          throw error;
        });
    }
    return fallbackCalendarRequest.current;
  }, []);

  const getLeetCodeActivity = useCallback((year: number) => {
    const cached = calendarRequests.current.get(year);
    if (cached) return cached;

    const request = fetchJson("https://leetcode.com/graphql", 7000, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: `https://leetcode.com/u/${LC_USERNAME}/`,
      },
      body: JSON.stringify({
        query: LC_CALENDAR_GRAPHQL,
        variables: { username: LC_USERNAME, year },
      }),
    })
      .then((json) => {
        const serialized = json?.data?.matchedUser?.userCalendar?.submissionCalendar;
        if (typeof serialized !== "string") {
          throw new Error("LeetCode activity was not available for this year.");
        }
        return parseSubmissionCalendar(serialized);
      })
      .catch(async (error) => {
        console.warn("Direct LeetCode calendar unavailable; trying fallback.", error);
        try {
          return await fetchLeetCodeActivityFallback();
        } catch (fallbackError) {
          calendarRequests.current.delete(year);
          throw fallbackError;
        }
      });

    calendarRequests.current.set(year, request);
    return request;
  }, [fetchLeetCodeActivityFallback]);

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      let fresh: Partial<LiveStats["leetcode"]> = {};
      try {
        fresh = (await refreshLeetCodeDirect()) ?? {};
      } catch {
        console.warn("Live LeetCode GraphQL refresh unavailable; trying fallback.");
      }
      if (!fresh.problems) {
        try {
          fresh = (await refreshLeetCodeAlfa()) ?? {};
        } catch {
          console.warn("Live LeetCode fallback refresh unavailable.");
        }
      }

      const gfg = await refreshGfg();
      if (cancelled || (!fresh.problems && !gfg)) return;
      setStats((s) => {
        const problems = fresh.problems
          ? fresh.problems.easy != null
            ? (fresh.problems as LiveStats["leetcode"]["problems"])
            : { ...s.leetcode.problems, all: fresh.problems.all }
          : s.leetcode.problems;
        const leetcode = fresh.problems
          ? { ...s.leetcode, ...fresh, problems }
          : s.leetcode;
        const nextGfg = gfg ?? s.gfg;
        const computed = computeExtras(leetcode, nextGfg);
        return {
          ...s,
          leetcode,
          gfg: nextGfg,
          computed: { ...computed, live: true },
          fetchedAt: new Date().toISOString(),
        };
      });
    };

    void refresh();
    const interval = window.setInterval(() => void refresh(), REFRESH_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const value = useMemo(
    () => ({ ...stats, getLeetCodeActivity }),
    [stats, getLeetCodeActivity]
  );
  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}

const StatsContext = createContext<StatsContextValue>({
  ...fromBundled(),
  getLeetCodeActivity: async () => ({}),
});

export function useLiveStats() {
  return useContext(StatsContext);
}
