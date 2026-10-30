import { Section, SectionHeading } from "./ui";
import { engineeringFocus, profile } from "../data/content";
import { useLiveStats } from "../lib/stats";

export default function EngineeringFocus() {
  const stats = useLiveStats();
  const { leetcode: lc, gfg, computed } = stats;
  const fmt = (n: number | null | undefined) => (n ?? 0).toLocaleString("en-IN");

  return (
    <Section id="focus">
      <SectionHeading
        index="04 — FOCUS"
        title="How I approach engineering"
        lead="Five themes, each written from work I can show in a repository — not a manifesto."
      />
      <div className="grid gap-px overflow-hidden rounded-xl border border-base-600/70 bg-base-600/70 sm:grid-cols-2 lg:grid-cols-3">
        {engineeringFocus.map((f) => (
          <div key={f.title} className="bg-base-850 p-6">
            <h3 className="mb-2 text-[15px] font-semibold text-ink">
              {f.title}
            </h3>
            <p className="text-sm leading-relaxed text-ink-dim">{f.body}</p>
          </div>
        ))}

        <div className="bg-base-850 p-6">
          <p className="font-mono text-4xl font-bold text-accent">
            {fmt(computed.totalSolved)}
          </p>
          <h3 className="mb-2 mt-2 text-[15px] font-semibold text-ink">
            Problem-solving &amp; data structures
          </h3>
          <p className="text-sm leading-relaxed text-ink-dim">
            {fmt(computed.totalSolved)} problems split across LeetCode and
            GeeksforGeeks — {fmt(lc?.problems?.hard)} of them Hard — keep the
            habit of reasoning about complexity and edge cases before writing
            code. GFG institute rank #{gfg?.instituteRank}.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={profile.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded-md border border-base-600 px-2.5 py-1 font-mono text-xs text-ink-dim transition-colors hover:border-accent/50 hover:text-accent"
            >
              LeetCode ↗
            </a>
            <a
              href={profile.gfg}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded-md border border-base-600 px-2.5 py-1 font-mono text-xs text-ink-dim transition-colors hover:border-accent/50 hover:text-accent"
            >
              GeeksforGeeks ↗
            </a>
          </div>
        </div>

        <div className="flex flex-col bg-accent p-6 text-base-950">
          <h3 className="mb-2 text-[15px] font-semibold">Currently building</h3>
          <p className="text-sm leading-relaxed">
            Deepening LangGraph multi-step agent design and production patterns
            for LLM-powered services. Open to internships and full-time roles
            where these problems show up daily.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="focus-ring mt-4 inline-flex w-fit items-center rounded-md bg-base-950/20 px-2.5 py-1 font-mono text-xs font-semibold text-base-950 transition-colors hover:bg-base-950/30"
          >
            Get in touch ↗
          </a>
        </div>
      </div>
    </Section>
  );
}
