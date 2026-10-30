import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Github, Linkedin, ArrowDown, FileText } from "lucide-react";
import { profile } from "../data/content";

function Portrait() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-accent/30 bg-base-850">
        <span className="font-mono text-7xl font-bold text-accent" aria-hidden="true">
          SK
        </span>
      </div>
    );
  }
  return (
    <img
      src="/me.jpg"
      alt="Portrait of Sai Koushik Korada"
      width={480}
      height={600}
      loading="eager"
      onError={() => setFailed(true)}
      className="aspect-square w-full rounded-2xl border border-accent/30 object-cover object-top"
    />
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.07) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 40% 0%, black 40%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 40% 0%, black 40%, transparent 75%)",
        }}
      />
      <div className="mx-auto grid max-w-shell gap-12 px-5 pb-20 pt-32 sm:px-8 sm:pt-40 md:grid-cols-[1.15fr_0.85fr] md:items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 font-mono text-sm text-accent"
          >
            Sai Koushik Korada — {profile.headline}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-[3.4rem]"
          >
            I build full-stack{" "}
            <span className="gradient-text">systems that think</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-ink-dim sm:text-lg"
          >
            Full stack developer and AI engineer working at the seam where real
            backend engineering meets LLMs — LangGraph agent workflows, RAG
            pipelines, event-driven microservices, and the FastAPI and React
            layers that tie them together. I like problems where correctness
            matters: concurrency, memory, recovery, and APIs that hold up.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="gradient-btn focus-ring inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
            >
              Explore My Projects
              <ArrowDown size={15} aria-hidden="true" />
            </a>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-lg border border-base-600 px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent/50 hover:text-accent"
            >
              <FileText size={15} aria-hidden="true" />
              View Resume
            </a>
            <div className="ml-1 flex items-center gap-1">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="focus-ring rounded-md p-2 text-ink-dim transition-colors hover:text-ink"
              >
                <Github size={19} strokeWidth={1.8} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="focus-ring rounded-md p-2 text-ink-dim transition-colors hover:text-ink"
              >
                <Linkedin size={19} strokeWidth={1.8} />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative mx-auto w-full max-w-xs md:h-full md:max-w-sm md:justify-self-end"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-3 -z-10 rounded-3xl border border-base-600/60 bg-base-900/40"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative rounded-xl border border-base-600/80 p-1 shadow-2xl shadow-black/50">
            <Portrait />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
