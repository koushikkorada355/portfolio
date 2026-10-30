import { GraduationCap, ExternalLink } from "lucide-react";
import { Section, SectionHeading } from "./ui";
import { education, profile } from "../data/content";
import { useLiveStats } from "../lib/stats";

function useAchievementCards() {
  const stats = useLiveStats();
  const { leetcode: lc, gfg, computed } = stats;
  const fmt = (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString("en-IN"));
  const bestStreak =
    gfg?.podLongestStreak != null || gfg?.podCurrentStreak != null
      ? Math.max(gfg?.podLongestStreak ?? 0, gfg?.podCurrentStreak ?? 0)
      : null;
  const rating = lc?.contest?.rating;
  const top = lc?.contest?.topPercent;

  return [
    {
      stat: fmt(computed.totalSolved === 0 ? null : computed.totalSolved),
      title: "Problems solved across both platforms",
      body: `LeetCode: ${fmt(lc?.problems?.all)} solved — ${fmt(lc?.problems?.medium)} Medium and ${fmt(lc?.problems?.hard)} Hard. GeeksforGeeks: ${fmt(gfg?.problemsSolved)} solved.`,
      link: profile.leetcode,
      linkLabel: "LeetCode profile",
    },
    {
      stat: lc?.rank != null ? fmt(lc.rank) : "—",
      title: "LeetCode global rank",
      body: `Contest rating ${rating != null ? fmt(rating) : "—"}${top != null ? ` — top ${top.toFixed(2)}% across ${fmt(lc?.contest?.attended)} contests` : ""}, plus a ${lc?.badge?.days ?? 500}-day daily-challenge badge.`,
      link: profile.leetcode,
      linkLabel: "View contests",
    },
    {
      stat: gfg?.instituteRank != null ? `#${gfg.instituteRank}` : "—",
      title: "Institute rank on GeeksforGeeks",
      body: `Coding score ${fmt(gfg?.codingScore)} with a ${fmt(bestStreak)}-day longest problem-of-the-day streak.`,
      link: profile.gfg,
      linkLabel: "GFG profile",
    },
  ];
}

export default function Education() {
  const achievements = useAchievementCards();
  return (
    <Section id="education">
      <SectionHeading
        index="06 — EDUCATION & ACHIEVEMENTS"
        title="Background and record"
      />
      <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative border-l border-base-600 pl-6">
          {education.map((e, i) => (
            <div key={e.degree} className={i > 0 ? "relative mt-8" : "relative"}>
              <span
                aria-hidden="true"
                className="absolute -left-[31px] top-1 flex h-5 w-5 items-center justify-center rounded-full border border-accent/50 bg-base-900"
              >
                <GraduationCap size={12} className="text-accent" aria-hidden="true" />
              </span>
              <p className="font-mono text-xs text-accent">{e.period}</p>
              <h3 className="mt-1.5 text-lg font-semibold text-white">
                {e.degree}
              </h3>
              <p className="mt-1 text-sm text-ink-dim">{e.school}</p>
              <p className="mt-2 inline-block rounded-md border border-base-600/70 bg-base-850 px-2.5 py-1 text-xs text-ink">
                {e.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {achievements.map((a) => (
            <div
              key={a.stat + a.title}
              className="flex items-start justify-between gap-4 rounded-xl border border-base-600/70 bg-base-850 p-5 transition-colors hover:border-accent/40"
            >
              <div className="flex items-start gap-4">
                <span className="hidden font-mono text-3xl font-bold text-accent sm:block">
                  {a.stat}
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold text-ink">
                    {a.title}
                    <span className="ml-2 font-mono text-lg text-accent sm:hidden">
                      {a.stat}
                    </span>
                  </h3>
                  <p className="mt-1 text-sm text-ink-dim">{a.body}</p>
                </div>
              </div>
              {a.link && (
                <a
                  href={a.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring mt-0.5 flex-none text-xs text-accent hover:text-accent-soft"
                >
                  <span className="inline-flex items-center gap-1 rounded-md border border-base-600 px-2.5 py-1.5">
                    {a.linkLabel}
                    <ExternalLink size={12} aria-hidden="true" />
                  </span>
                </a>
              )}
            </div>
          ))}
          <p className="text-center text-xs text-ink-faint">
            Also on my record:{" "}
            <a
              href="#certificates"
              className="text-accent underline underline-offset-2 focus-ring rounded-sm"
            >
              sealed credentials vault
            </a>
            {" · "}
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 focus-ring rounded-sm"
            >
              resume PDF
            </a>
          </p>
        </div>
      </div>
    </Section>
  );
}
