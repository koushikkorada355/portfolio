import { ArrowUpRight, Github, Layers3 } from "lucide-react";
import { Section, SectionHeading, Reveal } from "./ui";
import { projects, type Project } from "../data/content";

function ProjectLinks({ p }: { p: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {p.demo && (
        <a
          href={p.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-xs font-bold text-base-950 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-accent-soft"
        >
          View live <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      )}
      <a
        href={p.repo}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-base-600 px-3.5 py-2 text-xs font-semibold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
      >
        <Github size={14} aria-hidden="true" />
        Source
      </a>
    </div>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-base-600/80 bg-base-900/80 px-2.5 py-1 font-mono text-[10px] text-ink-dim transition-colors duration-300 group-hover:border-accent/30 group-hover:text-ink"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function ProjectCard({ p, index, featured = false }: { p: Project; index: number; featured?: boolean }) {
  return (
    <Reveal className={featured ? "lg:col-span-2" : ""} delay={index * 0.08}>
      <article
        className={`group relative h-full overflow-hidden rounded-3xl border border-base-600/70 bg-base-850 transition-all duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-[0_20px_70px_-35px_rgba(45,212,191,0.55)] ${
          featured ? "p-6 sm:p-8 lg:p-10" : "p-6 sm:p-7"
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-accent/15"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="relative flex h-full flex-col">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="h-px w-8 bg-base-600 transition-all duration-500 group-hover:w-14 group-hover:bg-accent/60" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                {p.dimension}
              </span>
            </div>
            <Layers3
              size={18}
              className="text-ink-faint transition-colors duration-300 group-hover:text-accent"
              aria-hidden="true"
            />
          </div>

          <div className={featured ? "max-w-3xl" : ""}>
            <h3 className={`font-bold tracking-tight text-white ${featured ? "text-2xl sm:text-4xl" : "text-xl"}`}>
              {p.title}
            </h3>
            <p className={`mt-3 leading-relaxed text-ink ${featured ? "text-base sm:text-lg" : "text-sm"}`}>
              {p.tagline}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-faint">{p.problem}</p>
          </div>

          <div className="mt-7">
            <ul className={`grid gap-x-8 gap-y-3 ${featured ? "lg:grid-cols-2" : ""}`}>
              {p.approach.slice(0, featured ? p.approach.length : 2).map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-dim">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-accent transition-transform duration-300 group-hover:scale-150" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto flex flex-col gap-5 border-t border-base-600/60 pt-6 sm:flex-row sm:items-end sm:justify-between">
            <Stack items={p.stack} />
            <ProjectLinks p={p} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Projects() {
  return (
    <Section id="projects" className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
      <SectionHeading
        index="03 — PROJECTS"
        title="Systems built to hold up"
        lead="A closer look at the decisions behind my featured work — from agent workflows to distributed transactions."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            p={project}
            index={index}
            featured={index === 0}
          />
        ))}
      </div>
    </Section>
  );
}
