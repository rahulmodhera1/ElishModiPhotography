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
          alt="An aerial view of a small boat carving a wake toward an anchored sailboat, in monochrome"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/*
        Two scrims.

        The pedestal is the one doing the real work, and it is sized in rem,
        not percent. A percentage-height gradient looked right at 900px tall
        and broke on a short, wide laptop window: the copy block is a fixed
        stack of rem-sized type, so on a shorter viewport it eats a bigger
        share of the box and its top edge lands higher up, past the strong
        part of a percentage gradient, over whatever the photograph happens to
        be doing there. That is what read as the headline "floating" with
        nothing under it, and it changed from device to device because it was
        tracking the wrong dimension.

        Sizing the dark band in rem instead ties it to the text stack's real
        height at each breakpoint rather than to the viewport's, so the same
        physical amount of image is darkened behind the copy everywhere, and
        the crop above it is free to vary without ever exposing the text.

        The gradient stops inside the pedestal are deliberately skewed, not
        the usual even 0/50/100 split: opacity holds at 85% out to 75% of the
        pedestal's own height and only fades in the last quarter. The eyebrow
        is the topmost line, so it is always the one closest to the fade edge
        and the one measured worst. An even midpoint gradient meant the
        pedestal had to be taller than the whole text stack just to keep the
        eyebrow out of the fade, which is exactly the miscalculation that
        shipped once already at 2-3:1. Pushing most of the pedestal to a flat,
        near-maximum opacity makes it forgiving of being slightly short rather
        than needing to be exactly right.

        None of this is eyeballed. scripts/check-hero-contrast.mjs measures
        the brightest 5% of pixels behind each line at five viewport shapes,
        including short, wide ones a "desktop" and a "mobile" preset both
        miss, and this pedestal is sized against that script, not a
        screenshot. Re-run it after touching any number here.

        The ambient top wash is unchanged: still percentage-based, because
        nothing rem-sized sits up there for a fixed size to fight.

        There used to be a third, left-weighted horizontal pass here, from
        when the copy sat pinned to the left edge. Now that the copy is
        centered, a lopsided full-height wash would darken one side of the
        photograph for no reason and still leave the other side of the
        centered text under-covered. The pedestal alone carries the copy;
        everything above it is left as close to untouched as contrast
        allows.
      */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-0 h-40 bg-gradient-to-b from-ink/50 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-0 h-[38rem] bg-gradient-to-t from-ink from-0% via-ink/85 via-75% to-transparent to-100% lg:h-[44rem]"
      />

      {/*
        Centered rather than pinned to the left edge. The boats and their
        wake sit in the top two thirds of this photograph and span nearly
        its full width, so the one part of the frame that stays clear at
        every crop is the lower band of open water: centering the copy
        there, instead of anchoring it to the left, keeps it off the
        subject while still reading as deliberately placed rather than
        stranded in a corner.
      */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center px-5 pb-16 pt-24 text-center sm:px-8 sm:pb-24">
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
          Portraits made to last a lifetime.
        </motion.h1>

        <motion.p
          className="mt-6 max-w-[46ch] text-[0.9375rem] leading-relaxed text-paper-dim sm:text-base"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.34, ease: EASE }}
        >
          Specializing in newborn, child, family, and portrait photography, thoughtfully
          composed with natural light throughout Toronto and the GTA.
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
