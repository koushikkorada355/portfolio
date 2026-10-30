import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  Lock,
  LockOpen,
  X,
} from "lucide-react";
import { Section, SectionHeading, Reveal } from "./ui";
import { certificates } from "../data/content";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Certificates() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  const showPrevious = () =>
    setActiveIndex((index) => (index - 1 + certificates.length) % certificates.length);
  const showNext = () =>
    setActiveIndex((index) => (index + 1) % certificates.length);
  const activeCertificate = certificates[activeIndex];

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrevious();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <Section id="certificates">
      <SectionHeading
        index="07 — CERTIFICATES"
        title="Credentials vault"
        lead="Verification records are sealed — open the vault to inspect and verify each one."
      />
      <Reveal>
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="focus-ring group relative block w-full overflow-hidden rounded-xl border border-base-600/70 bg-base-850 p-6 text-left transition-colors hover:border-accent/40 sm:p-8"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/10 blur-3xl transition-opacity group-hover:opacity-100 sm:opacity-0"
          />
          <div className="relative flex flex-wrap items-center gap-4">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 flex-none items-center justify-center rounded-xl border border-accent/30 bg-base-900 text-accent transition-transform group-hover:scale-105"
            >
              <Lock size={20} strokeWidth={1.8} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                Certificate vault
              </p>
              <p className="mt-1.5 text-base font-semibold text-white">
                {certificates.length} verified credential
                {certificates.length === 1 ? "" : "s"} — sealed
              </p>
              <p className="mt-1 text-sm text-ink-dim">
                Each credential carries its issuer, ID, and a live verification
                link.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-base-950 transition-colors group-hover:bg-accent-soft">
              <LockOpen size={14} aria-hidden="true" />
              Unlock vault
            </span>
          </div>
        </button>
      </Reveal>

      <AnimatePresence>
        {open && (
          <motion.div
            key="vault"
            className="fixed inset-0 z-[70] overflow-y-auto p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.15 : 0.25 }}
          >
            <motion.div
              aria-hidden="true"
              className="absolute inset-0 bg-base-950/90 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="certificates-vault-title"
              className="relative mx-auto mt-8 w-full max-w-2xl rounded-3xl border border-accent/25 bg-base-900 p-6 shadow-2xl sm:mt-16 sm:p-8"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.97 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: reduce ? 0.15 : 0.4, ease: EASE }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 right-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
              />
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                className="focus-ring absolute right-4 top-4 rounded-md border border-base-600 p-2 text-ink-dim transition-colors hover:border-accent/50 hover:text-accent"
              >
                <X size={16} aria-hidden="true" />
                <span className="sr-only">Close credentials vault</span>
              </button>

              <div className="relative flex items-start gap-3 pr-10">
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-lg border border-accent/30 bg-base-850 text-accent"
                >
                  <LockOpen size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                    Vault opened
                  </p>
                  <h3
                    id="certificates-vault-title"
                    className="mt-1 text-xl font-bold text-white"
                  >
                    Verified credentials
                  </h3>
                  <p className="mt-1 text-sm text-ink-dim">
                    {certificates.length} credential
                    {certificates.length === 1 ? "" : "s"} on record — click
                    verify to check each with its issuer.
                  </p>
                </div>
              </div>

              <div className="relative mt-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeCertificate.credentialId}
                    className="rounded-xl border border-base-600/70 bg-base-850 p-5"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
                    animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, x: -24 }}
                    transition={{ duration: reduce ? 0.1 : 0.22, ease: EASE }}
                  >
                    <Reveal>
                      <div className="flex min-h-[190px] flex-col gap-5">
                        <div className="flex min-w-0 items-start gap-3">
                          <span
                            aria-hidden="true"
                            className="mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-accent/25 bg-base-900 text-accent"
                          >
                            <BadgeCheck size={16} strokeWidth={1.8} />
                          </span>
                          <div>
                            <h4 className="text-[15px] font-semibold text-ink">
                              {activeCertificate.title}
                            </h4>
                            <p className="mt-0.5 text-sm text-ink-dim">
                              {activeCertificate.issuer} · {activeCertificate.date}
                            </p>
                            <p className="mt-1.5 font-mono text-xs text-accent">
                              ID: {activeCertificate.credentialId}
                            </p>
                          </div>
                        </div>
                        <a
                          href={activeCertificate.verifyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="focus-ring mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-base-950 transition-colors hover:bg-accent-soft"
                        >
                          Verify
                          <ExternalLink size={13} aria-hidden="true" />
                        </a>
                      </div>
                    </Reveal>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={showPrevious}
                    aria-label="Previous certificate"
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-base-600 px-3 py-2 text-sm text-ink-dim transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <ArrowLeft size={14} aria-hidden="true" />
                    Previous
                  </button>
                  <p className="font-mono text-xs text-ink-faint" aria-live="polite">
                    {activeIndex + 1} / {certificates.length}
                  </p>
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Next certificate"
                    className="focus-ring inline-flex items-center gap-2 rounded-full border border-base-600 px-3 py-2 text-sm text-ink-dim transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    Next
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
