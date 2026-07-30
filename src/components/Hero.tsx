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
      /*
        isolate creates a stacking context. Without it the layers below would
        need negative z-indexes to sit behind the copy, and a negative z-index
        child escapes its parent when the parent is not a stacking context: it
        paints behind the body background, which is opaque here, so the
        photograph disappears entirely. Everything in this section is at zero
        or above.
      */
      className="relative isolate flex min-h-[100dvh] flex-col justify-end overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={reduce ? undefined : { transform }}
      >
        <Image
          src="/images/hero/hero.jpg"
          alt="A castle at the end of a formal garden path, framed by trees, in monochrome"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/*
        Two scrims, not one.

        The vertical pass darkens the foot of the frame. On its own it was not
        enough: measured against the brightest 5% of pixels behind each line,
        the gold eyebrow fell to 1.92:1 where it crossed sunlit stone, which is
        a straight legibility failure. The page average looked fine, which is
        exactly why an average is the wrong test for type over a photograph.

        The horizontal pass fixes it by weighting the darkness to the left,
        where all the copy lives, and leaving the right side of the frame open
        so the building is still doing its job. Both are kept generous enough
        to hold up if this photograph is swapped for a brighter one.
      */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15"
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-gradient-to-r from-ink via-ink/45 to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-5 pb-16 pt-24 sm:px-8 sm:pb-24">
        <motion.p
          /* gold-bright, not gold: this is the only eyebrow that sits on a
             photograph rather than on the page ground. See globals.css. */
          className="eyebrow text-gold-bright"
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
