import { useEffect, useState } from "react";
import { Github, Linkedin, Menu, X } from "lucide-react";
import { profile } from "../data/content";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Focus", href: "#focus" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { label: "GitHub", href: profile.github, Icon: Github },
  { label: "LinkedIn", href: profile.linkedin, Icon: Linkedin },
];

function SocialIcon({
  label,
  href,
  Icon,
  className = "",
}: {
  label: string;
  href: string;
  Icon: typeof Github;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`focus-ring rounded-md p-2 text-ink-dim transition-colors hover:text-accent ${className}`}
    >
      <Icon size={18} strokeWidth={1.8} />
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled || open
          ? "border-b border-base-600/60 bg-base-950/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-shell items-center justify-between px-5 sm:px-8"
      >
        <a
          href="#top"
          className="focus-ring rounded-md font-mono text-sm font-semibold"
        >
          <span className="gradient-text">{`<${"sai-koushik"} />`}</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="focus-ring rounded-md text-sm text-ink-dim transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <div className="h-4 w-px bg-base-600" aria-hidden="true" />
          {socials.map((s) => (
            <SocialIcon key={s.label} {...s} />
          ))}
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring rounded-md border border-accent/30 px-3 py-1.5 text-sm text-accent transition-colors hover:bg-accent/10"
          >
            Resume
          </a>
        </div>

        <div className="md:hidden flex items-center gap-1">
          {socials.map((s) => (
            <SocialIcon key={s.label} {...s} />
          ))}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="focus-ring rounded-md p-2 text-ink-dim hover:text-ink"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-base-600/60 md:hidden">
          <div className="flex flex-col px-5 pb-4 pt-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-md py-3 text-sm text-ink-dim hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-2 rounded-md border border-accent/30 px-4 py-2.5 text-center text-sm text-accent"
            >
              View Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
