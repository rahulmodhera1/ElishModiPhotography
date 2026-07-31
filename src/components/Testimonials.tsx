"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { testimonials } from "@/lib/site";
import { useSafeReducedMotion } from "./Reveal";

/**
 * One quote at a time, set large.
 *
 * The crossfade carries a subtle blur. Without it you see two blocks of text
 * overlapping mid-transition, which reads as two objects swapping rather than
 * one changing. The blur bridges them.
 *
 * Under reduced motion the auto-advance stops and the crossfade becomes a cut,
 * but the markup is identical in both modes. Swapping in a different subtree
 * for the reduced case would mean the server and the client disagree about
 * what to render, which is a hydration error rather than an accessibility win.
 * Every quote stays reachable through the controls underneath.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const DWELL = 7000;

export function Testimonials() {
  const reduce = useSafeReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setInterval(advance, DWELL);
    return () => window.clearInterval(id);
  }, [reduce, paused, advance]);

  const current = testimonials[index];
  const fade = reduce
    ? { duration: 0 }
    : { duration: 0.45, ease: EASE };

  return (
    <section
      className="border-t border-rule-soft py-20 sm:py-24 lg:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {/* Reserve the tallest quote's height so advancing never shifts the
            page. Sized to three lines of display type plus the attribution,
            which is the cap a quote here is written to. */}
        <div className="min-h-[16rem] sm:min-h-[15rem]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={current.name}
              initial={reduce ? false : { opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(6px)" }}
              transition={fade}
            >
              <blockquote
                aria-live="polite"
                className="max-w-[22ch] font-display text-[1.9rem] leading-[1.25] tracking-[-0.01em] text-paper sm:max-w-[26ch] sm:text-[2.6rem] lg:max-w-[30ch] lg:text-[3rem]"
              >
                &ldquo;{current.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 text-[0.6875rem] uppercase tracking-[0.24em] text-paper-faint">
                {current.name}
                <span className="mt-1.5 block normal-case tracking-normal text-paper-dim">
                  {current.role}
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {/* Real controls, not decoration: each line jumps to that quote. */}
        <div className="mt-10 flex gap-3">
          {testimonials.map((item, i) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show the quote from ${item.name}`}
              aria-current={i === index}
              className="group h-8 w-12 pt-4"
            >
              <span
                className={[
                  "block h-px w-full transition-colors duration-300",
                  i === index ? "bg-gold" : "bg-rule group-hover:bg-paper-faint",
                ].join(" ")}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
