import { Section, SectionHeading, Reveal } from "./ui";
import { profile } from "../data/content";
import { useLiveStats } from "../lib/stats";

export default function About() {
  const stats = useLiveStats();
  const { leetcode: lc, gfg, computed } = stats;
  const fmt = (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString("en-IN"));
  const bestStreak =
    gfg?.podLongestStreak != null || gfg?.podCurrentStreak != null
      ? Math.max(gfg?.podLongestStreak ?? 0, gfg?.podCurrentStreak ?? 0)
      : null;
  const rating = lc?.contest?.rating;
  const top = lc?.contest?.topPercent;

  return (
    <Section id="about">
      <SectionHeading index="01 — ABOUT" title="What I work on" />
      <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
        <Reveal className="space-y-4 text-base leading-relaxed text-ink-dim sm:text-[17px]">
          <p>
            I&apos;m a Computer Science undergraduate at RGUKT, Srikakulam, and
            I spend most of my time building software where AI workflows and
            backend systems have to actually work together. My projects are
            full-stack in the strict sense: a FastAPI service, a database
            schema, an agent graph, and a React client — each designed around
            the same domain.
          </p>
          <p>
            On the AI side, I build LLM applications with LangGraph and
            LangChain — pipeline states like summarization, chat, tool calling,
            memory, and document retrieval, connected by conditional routing so
            the assistant behaves predictably rather than improvising. On the
            systems side, I&apos;ve built a modular e-commerce platform of
            Node.js microservices communicating over Kafka, with Redis-backed
            caching, distributed locks, and gateway-level authentication.
          </p>
          <div className="rounded-xl border border-accent/25 bg-accent-mute/30 p-5">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-mono text-xs uppercase tracking-widest text-accent">
                Data structures &amp; algorithms
              </p>
              <p className="font-mono text-3xl font-bold text-accent">
                {fmt(computed.totalSolved)}
              </p>
            </div>
            <p className="mt-1 flex items-center gap-2 text-xs text-ink-faint">
              problems solved across both platforms
              {computed.live && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-accent">
                  <span
                    aria-hidden="true"
                    className="relative flex h-1.5 w-1.5"
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                  </span>
                  live
                </span>
              )}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="border-l border-accent/30 pl-4">
                <a
                  href={profile.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ink transition-colors hover:text-accent focus-ring rounded-sm"
                >
                  LeetCode ↗
                </a>
                <ul className="mt-1.5 space-y-1 text-[13px] text-ink-dim">
                  <li>
                    {fmt(lc?.problems?.all)} solved ·{" "}
                    {fmt(lc?.problems?.medium)} Medium · {fmt(lc?.problems?.hard)} Hard
                  </li>
                  <li>
                    Rank {lc?.rank != null ? fmt(lc.rank) : "—"}
                    {rating != null && <> · rating {fmt(rating)}</>}
                    {top != null && <> (top {top.toFixed(2)}%)</>}
                  </li>
                  <li>{lc?.badge?.name ?? "500-day daily-challenge badge"}</li>
                </ul>
              </div>
              <div className="border-l border-accent/30 pl-4">
                <a
                  href={profile.gfg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ink transition-colors hover:text-accent focus-ring rounded-sm"
                >
                  GeeksforGeeks ↗
                </a>
                <ul className="mt-1.5 space-y-1 text-[13px] text-ink-dim">
                  <li>
                    Coding score {fmt(gfg?.codingScore)} · institute rank #{gfg?.instituteRank ?? "—"}
                  </li>
                  <li>
                    {fmt(gfg?.problemsSolved)} solved · {fmt(bestStreak)}-day longest streak
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <p>
            That volume shows up in how I engineer: I&apos;d rather reach for a
            database constraint or a clear state machine than trust a prompt
            where two users race for the same slot. Complexity, edge cases, and
            correctness under real conditions are what I enjoy — and what the
            daily grind keeps sharp.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-xl border border-base-600/70 bg-base-850 p-6">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-ink-faint">
              Quick facts
            </p>
            <dl className="space-y-3 text-sm">
              {[
                ["Role", "Full Stack · AI Engineering"],
                ["Degree", "B.Tech CSE, RGUKT Srikakulam"],
                ["Core stack", "MERN · Python · FastAPI · React"],
                ["AI focus", "LangGraph · LangChain · RAG"],
                ["DSA volume", `${fmt(computed.totalSolved)} across LeetCode & GFG`],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between gap-4 border-b border-base-600/50 pb-3 last:border-0 last:pb-0"
                >
                  <dt className="text-ink-faint">{k}</dt>
                  <dd className="text-right font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
