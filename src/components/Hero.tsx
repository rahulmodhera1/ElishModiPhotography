"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { site } from "@/lib/site";
import { CTA } from "./CTA";
import { useSafeReducedMotion } from "./Reveal";

/**
 * The magazine cover. One photograph, edge to edge, with the least type that
 * still says who this is and what to do next.
 *
 * Four text elements, which is the ceiling: eyebrow, headline, one line of
 * subtext, two CTAs. Nothing else lives here.
 *
 * The parallax is written as a transform template string rather than Motion's
 * `y` shorthand, because the shorthand runs on the main thread and this is the
 * one element still animating while the page is finishing its first paint.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useSafeReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const shift = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const transform = useMotionTemplate`translate3d(0, ${shift}px, 0) scale(1.09)`;

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 -z-10"
        style={reduce ? undefined : { transform }}
      >
        <Image
          src="/images/hero/hero.jpg"
          alt="Placeholder: full bleed hero frame. Replace with the single strongest image in the book."
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Scrim. Without it the headline is white type on unknown photography,
          which is a contrast failure waiting for the client's first upload. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/55 to-ink/25"
      />

      <div className="mx-auto w-full max-w-[1400px] px-5 pb-16 pt-24 sm:px-8 sm:pb-24">
        <motion.p
          className="eyebrow"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
        >
          {site.city} &middot; {site.discipline}
        </motion.p>

        <motion.h1
          className="mt-6 max-w-[16ch] font-display text-[2.6rem] leading-[1.04] tracking-[-0.015em] text-paper sm:text-6xl lg:text-[4.75rem]"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
        >
          Photographs that still look like you.
        </motion.h1>

        <motion.p
          className="mt-6 max-w-[46ch] text-[0.9375rem] leading-relaxed text-paper-dim sm:text-base"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.34, ease: EASE }}
        >
          Babies, children, families and portraits, made slowly and in daylight where
          possible, for people who would rather not perform.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.44, ease: EASE }}
        >
          <CTA href="#work">{site.cta.work}</CTA>
          <CTA href="#contact" variant="quiet">
            {site.cta.contact}
          </CTA>
        </motion.div>
      </div>
    </section>
  );
}
