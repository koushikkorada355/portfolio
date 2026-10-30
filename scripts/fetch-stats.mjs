// Fetches live DSA stats from LeetCode GraphQL + GFG profile page.
// Run manually via `npm run stats`, or automatically before every build (prebuild).
// Writes src/data/stats.json; on failure keeps the existing file intact.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LC_USERNAME = "koushik_korada27";
const GFG_USERNAME = "koushikkrujk";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "stats.json");

async function timedFetch(url, opts = {}, ms = 20000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}

async function fetchLeetCode() {
  const query = `
    query {
      matchedUser(username: "${LC_USERNAME}") {
        username
        profile { ranking }
        submissionCalendar
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
  const res = await timedFetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Referer: `https://leetcode.com/u/${LC_USERNAME}/` },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`leetcode HTTP ${res.status}`);
  const json = await res.json();
  const mu = json?.data?.matchedUser;
  const ac = mu?.submitStats?.acSubmissionNum ?? [];
  const get = (d) => ac.find((x) => x.difficulty === d)?.count ?? 0;
  const cr = json?.data?.userContestRanking;
  let submissionCalendar = {};
  try {
    submissionCalendar = JSON.parse(mu?.submissionCalendar ?? "{}");
  } catch {
    console.warn("leetcode submission calendar had an invalid format");
  }
  const problems = {
    all: get("All"),
    easy: get("Easy"),
    medium: get("Medium"),
    hard: get("Hard"),
  };
  if (!problems.all) throw new Error("leetcode empty stats");
  return {
    problems,
    rank: mu?.profile?.ranking ?? null,
    submissionCalendar,
    contest: cr
      ? {
          attended: cr.attendedContestsCount ?? 0,
          rating: cr.rating ? Math.round(cr.rating) : null,
          topPercent: cr.topPercentage != null ? Math.round(cr.topPercentage * 100) / 100 : null,
        }
      : null,
    badge: { name: "500-day daily-challenge badge", days: 500 },
  };
}

// Secondary source: alfa-leetcode-api (CORS-open wrapper). More uptime-tolerant than graphql.
async function fetchLeetCodeAlfa() {
  const base = await timedFetch(`https://alfa-leetcode-api.onrender.com/${LC_USERNAME}`, {}, 25000);
  if (!base.ok) throw new Error(`alfa base HTTP ${base.status}`);
  const baseJson = await base.json();

  const profile = await timedFetch(
    `https://alfa-leetcode-api.onrender.com/userProfile/${LC_USERNAME}`,
    {},
    25000
  );
  if (!profile.ok) throw new Error(`alfa profile HTTP ${profile.status}`);
  const profileJson = await profile.json();

  const problems = { all: 0, easy: 0, medium: 0, hard: 0 };
  for (const d of profileJson?.totalSubmissions ?? []) {
    const key = String(d.difficulty).toLowerCase();
    if (key in problems) problems[key] = d.count;
  }
  if (!problems.all) throw new Error("alfa empty stats");
  return {
    problems,
    rank: baseJson?.ranking ?? null,
    contest: null,
    badge: { name: "500-day daily-challenge badge", days: 500 },
  };
}

function mergeLeetCode(primary, fallback) {
  if (!fallback) return primary;
  return {
    problems: primary?.problems?.all ? primary.problems : fallback.problems,
    rank: primary?.rank ?? fallback.rank,
    contest: primary?.contest ?? fallback.contest,
    badge: primary?.badge ?? fallback.badge,
  };
}

async function fetchGFG() {
  const res = await timedFetch(`https://www.geeksforgeeks.org/profile/${GFG_USERNAME}`, {}, 20000);
  if (!res.ok) throw new Error(`gfg HTTP ${res.status}`);
  const html = (await res.text()).replace(/\\+/g, "");
  const grab = (key) => {
    const m = html.match(new RegExp(key + '"\\s*:\\s*(\\d+)'));
    return m ? Number(m[1]) : null;
  };
  // anchor coding score to its monthly_score neighbour to avoid other "score" keys
  const mScore = html.match(/"score"\s*:\s*(\d+)\s*,\s*"monthly_score"/);
  const stats = {
    codingScore: mScore ? Number(mScore[1]) : grab("coding_score"),
    problemsSolved: grab("total_problems_solved"),
    instituteRank: grab("institute_rank"),
    podLongestStreak: grab("pod_solved_longest_streak"),
    podCurrentStreak: grab("pod_solved_current_streak"),
  };
  if (stats.problemsSolved == null) throw new Error("gfg empty stats");
  return stats;
}

async function main() {
  const out = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};

  let changed = false;
  try {
    out.leetcode = await fetchLeetCode();
    changed = true;
    console.log("leetcode(graphql): OK", out.leetcode.problems.all, "solved, rank", out.leetcode.rank);
  } catch (e) {
    console.warn("leetcode graphql fetch failed:", e.message);
    try {
      out.leetcode = mergeLeetCode(out.leetcode, await fetchLeetCodeAlfa());
      changed = true;
      console.log("leetcode(alfa): OK", out.leetcode.problems.all, "solved, rank", out.leetcode.rank);
    } catch (e) {
      console.warn("leetcode alfa fetch failed:", e.message);
    }
  }
  try {
    out.gfg = await fetchGFG();
    changed = true;
    console.log("gfg: OK", out.gfg.codingScore, "score,", out.gfg.problemsSolved, "solved");
  } catch (e) {
    console.warn("gfg fetch failed:", e.message);
  }

  if (!changed) {
    console.warn("No source reachable — keeping existing stats.json as-is.");
    return;
  }
  out.fetchedAt = new Date().toISOString();
  out.username = { leetcode: LC_USERNAME, gfg: GFG_USERNAME };
  writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(
    "stats.json written — lc:",
    JSON.stringify(out.leetcode?.problems),
    "rank:",
    out.leetcode?.rank,
    "| gfg score:",
    out.gfg?.codingScore,
    "solved:",
    out.gfg?.problemsSolved
  );
}

main();
