import { Mail, MapPin, Github, Linkedin, ArrowUpRight, Phone } from "lucide-react";
import { Section } from "./ui";
import { profile } from "../data/content";

export default function Contact() {
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
    "Software engineering opportunity — via portfolio"
  )}`;

  return (
    <Section id="contact">
      <div className="rounded-2xl border border-base-600/70 bg-base-850 px-6 py-12 text-center sm:px-12">
        <p className="font-mono text-xs tracking-[0.25em] text-accent">
          CONTACT
        </p>
        <h2 className="mx-auto mt-4 max-w-xl text-3xl font-bold text-white sm:text-4xl">
          Let&apos;s talk about engineering work
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-dim">
          I&apos;m open to internships and full-time roles in full stack and AI
          engineering, as well as collaboration on agent and backend projects.
          The fastest way to reach me is email — I reply promptly.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={mailto}
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-base-950 transition-colors hover:bg-accent-soft"
          >
            <Mail size={16} aria-hidden="true" />
            Email me
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-2 rounded-lg border border-base-600 px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-accent/50 hover:text-accent"
          >
            <Linkedin size={16} aria-hidden="true" />
            Connect on LinkedIn
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>

        <address className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm not-italic text-ink-faint">
          <a
            href={mailto}
            className="focus-ring inline-flex items-center gap-1.5 rounded-sm hover:text-ink"
          >
            <Mail size={14} aria-hidden="true" />
            {profile.email}
          </a>
          <span className="inline-flex items-center gap-1.5">
            <Phone size={14} aria-hidden="true" />
            {profile.phone}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={14} aria-hidden="true" />
            Andhra Pradesh, India
          </span>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-1.5 rounded-sm hover:text-ink"
          >
            <Github size={14} aria-hidden="true" />
            github.com/koushikkorada355
          </a>
        </address>
      </div>
    </Section>
  );
}
