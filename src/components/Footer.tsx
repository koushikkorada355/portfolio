import { profile } from "../data/content";

const nav = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Focus", href: "#focus" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-base-600/60">
      <div className="mx-auto flex max-w-shell flex-col items-center gap-4 px-5 py-8 sm:flex-row sm:justify-between sm:px-8">
        <a
          href="#top"
          className="focus-ring rounded-md font-mono text-sm text-ink-dim hover:text-ink"
        >
          {`<${"sai-koushik"} />`}
        </a>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-5">
          {nav.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="focus-ring rounded-sm text-sm text-ink-faint hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-xs text-ink-faint">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring rounded-sm hover:text-ink"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring rounded-sm hover:text-ink"
          >
            LinkedIn
          </a>
          <span>© {new Date().getFullYear()} Sai Koushik Korada</span>
        </div>
      </div>
    </footer>
  );
}
