import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionHeading({
  index,
  title,
  lead,
}: {
  index: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="font-mono text-xs tracking-[0.25em] text-accent mb-3">
        {index}
      </p>
      <h2 className="gradient-text text-2xl font-bold sm:text-3xl">{title}</h2>
      {lead && <p className="mt-3 text-base text-ink-dim leading-relaxed">{lead}</p>}
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 border-t border-base-600/60 ${className}`}
    >
      <div className="mx-auto max-w-shell px-5 py-16 sm:px-8 sm:py-24">
        {children}
      </div>
    </section>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

