"use client";

import { motion, type Variants } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * Reduced-motion, but safe to render on the server.
 *
 * The server has no media queries, so it always renders the full-motion tree.
 * Reading the preference during the first client render therefore disagrees
 * with the server markup, and React fails hydration. useSyncExternalStore
 * solves exactly this: React hydrates against the server snapshot (false),
 * then immediately re-renders with the real value, and it keeps tracking
 * changes if the preference is toggled while the page is open.
 *
 * Use this everywhere instead of Motion's useReducedMotion. The one exception
 * is a subtree that only ever mounts from a user interaction, such as the
 * lightbox, which the server never renders at all.
 */
export function useSafeReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

/**
 * Scroll reveal. Used for one purpose only: letting a section arrive in the
 * order it is meant to be read, rather than landing all at once.
 *
 * Enter animations get ease-out because the user is watching the first frame
 * most closely, and ease-out puts the movement there. 600ms is longer than the
 * 300ms UI ceiling on purpose: this is editorial pacing, not a dropdown, and
 * it fires once per element per visit.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "figure";
}) {
  const reduce = useSafeReducedMotion();
  const Tag = motion[as];
  const Plain = as;

  /*
    Under reduced motion the reveal is dropped entirely rather than softened to
    a fade. A scroll reveal gates whether content is visible at all, and tying
    that to an IntersectionObserver means anyone who jumps down the page with a
    skip link or an anchor can land on a section that never got observed. Plain
    markup always renders.
  */
  if (reduce) {
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

/**
 * Stagger container. Children arrive 60ms apart, which reads as a cascade
 * without making anyone wait for the last one.
 */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/**
 * Clip-path wipe for the large images. The frame reveals from the bottom edge
 * the way a print comes up in a tray. Purely photographic, so it is disabled
 * under reduced motion rather than softened.
 */
export function RevealImage({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useSafeReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ clipPath: "inset(0 0 14% 0)", opacity: 0 }}
      whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
