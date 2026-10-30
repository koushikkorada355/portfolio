import { Briefcase } from "lucide-react";
import { Section, SectionHeading, Reveal } from "./ui";
import { experience } from "../data/content";

export default function Experience() {
  return (
    <Section id="experience">
      <SectionHeading
        index="05 — EXPERIENCE"
        title="Verified hands-on experience"
      />
      <div>
        <Reveal>
          <div className="rounded-xl border border-base-600/70 bg-base-850 p-6">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-accent/30 bg-base-900 text-accent"
              >
                <Briefcase size={18} strokeWidth={1.8} />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {experience.role}
                </h3>
                <p className="mt-0.5 text-sm text-ink-dim">
                  {experience.org} · {experience.partner}
                </p>
                <p className="mt-1 font-mono text-xs text-accent">
                  {experience.meta} · {experience.period}
                </p>
              </div>
            </div>
            <ul className="mt-5 space-y-3 md:max-w-3xl">
              {experience.points.map((a, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-dim">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-accent/70"
                  />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
