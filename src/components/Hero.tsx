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
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden"
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
        The full-bleed pedestal that used to sit here darkened a band all
        the way to the bottom edge of the viewport, which flattened the one
        part of this photograph, the open water below the boats, that the
        text doesn't need any help from. What replaces it is a single glow
        sized to the copy block itself (see the div just inside the content
        wrapper below): dark directly behind the type, fading out within a
        short distance on every side, so the water stays visibly water
        right up to the bottom of the frame instead of running into a dark
        band.

        The ambient top wash stays: a small, cheap way to keep the header's
        white logotype and nav readable over whatever the top of the crop
        is doing, and it never competes with the boats since it only
        reaches 10rem down.
      */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-0 h-40 bg-gradient-to-b from-ink/50 to-transparent"
      />

      {/*
        Centered horizontally, and pushed up off the bottom edge rather than
        pinned flush to it. The boats and their wake occupy roughly the top
        two thirds of this photograph, so the copy sits in the band below
        them; the mb reserves a real strip of clear water beneath the copy
        instead of letting it run to the very bottom of the viewport, which
        is the part of the frame most worth leaving alone. mt-auto plus a
        dvh-based mb (rather than a fixed rem one) keeps that bottom strip
        proportional to the viewport instead of eating the whole thing on a
        short window.
      */}
      <div className="relative z-10 mx-auto mt-auto mb-[13dvh] flex w-fit max-w-[calc(100%-2.5rem)] flex-col items-center px-5 text-center sm:mb-[15dvh] sm:max-w-[calc(100%-4rem)] sm:px-8">
        {/*
          The glow. w-fit on the wrapper above is what makes this hug the
          actual text, not the full 1400px content column: the widest line
          (the subhead, ~46ch) sets the box width, and the insets add a
          margin of breathing room around that on every side.

          This is a blurred solid, not a hand-tuned radial gradient. A
          gradient's falloff is exact math, and exact math still reads as a
          shape with an edge once it sits over a busy, textured background
          like open water: the first version of this looked like a rounded
          rectangle laid over the photograph. The blur is what actually
          softens it, the same way a stage light gets softened by a diffuser
          rather than by dimming it. z-[-1] keeps it under the type but
          above the photograph, inside this wrapper's own stacking context.

          The top and bottom reach are deliberately different, not the
          symmetric box the first version used. The wake crosses close
          behind the eyebrow, the topmost line, so a big symmetric blur
          bled up into it and started dimming the wake itself, exactly the
          "taking away from the photo" this exists to avoid. Below the copy
          is open water with nothing to protect, so that side can carry
          more reach without cost. Pulling the top in and reducing the
          blur radius keeps the glow from climbing into the wake; the
          smaller top margin is made up in contrast by the box's own
          opacity rather than by spread.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-6 -top-4 -bottom-14 z-[-1] rounded-[4rem] bg-ink blur-[45px] sm:-inset-x-10 sm:-top-6 sm:-bottom-20 sm:blur-[60px]"
        />

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
