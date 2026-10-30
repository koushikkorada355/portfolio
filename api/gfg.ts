const GFG_PROFILE_URL = "https://www.geeksforgeeks.org/profile/koushikkrujk";

type Request = {
  method?: string;
};

type Response = {
  status: (code: number) => Response;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
};

function parseStats(html: string) {
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
  if (stats.problemsSolved == null) {
    throw new Error("GFG profile did not contain problem stats");
  }
  return stats;
}

export default async function handler(req: Request, res: Response) {
  if (req.method && req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const response = await fetch(GFG_PROFILE_URL, {
      headers: { "User-Agent": "Mozilla/5.0 portfolio-stats/1.0" },
    });
    if (!response.ok) throw new Error(`GFG returned HTTP ${response.status}`);
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.status(200).json(parseStats(await response.text()));
  } catch (error) {
    console.error("GFG stats refresh failed:", error);
    res.status(502).json({ error: "Unable to refresh GFG stats" });
  }
}
