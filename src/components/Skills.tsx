import { Section, SectionHeading } from "./ui";
import { skillGroups } from "../data/content";

export default function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        index="02 — SKILLS"
        title="Technologies I build with"
        lead="Grouped by where they appear in my actual projects — every item here is something I've used in shipped coursework or real repositories."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((g) => (
          <div
            key={g.title}
            className="rounded-xl border border-base-600/70 bg-base-850 p-5 transition-colors hover:border-accent/40"
          >
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
              {g.title}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li
                  key={s}
                  className="rounded-md border border-base-600/70 bg-base-900 px-2.5 py-1 text-[13px] text-ink-dim"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
