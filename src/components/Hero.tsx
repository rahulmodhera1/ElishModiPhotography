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
        {/*
          Two different crops, because a phone and a monitor are not looking
          at the same picture.

          Wide: anchored to the bottom. Where the window is shorter than 1:2
          there is vertical overflow to spend, and spending it off the top
          lifts the boats further up the frame and hands the extra water to
          the copy underneath. On windows near the photograph's own 2:1 there
          is nothing to crop and the value is simply inert.

          Narrow: a phone only ever shows about a quarter of this frame's
          width, so the choice is which quarter. Anchoring left lands on the
          wake and the runabout and leaves the sailboat off the right edge
          entirely, which is both the stronger vertical composition and the
          one whose subject sits highest, so the copy clears it.
        */}
        <Image
          src="/images/hero/hero.jpg"
          alt="An aerial view of a small boat carving a wake toward an anchored sailboat, in monochrome"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[22%_50%] sm:object-[50%_100%]"
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
        Centered horizontally, and sitting in the band of open water the
        crop opens up below the boats. mt-auto pushes the block down; the mb
        reserves a strip of clear water underneath it so the copy is framed
        by the photograph rather than parked on its bottom edge.

        The mb is in dvh, not rem, so that strip stays proportional: on a
        short window a fixed margin would claim the same pixels the copy
        needs to stay clear of the boats, which is the failure this whole
        section is tuned against. It is clamped at both ends so it cannot
        collapse to nothing on a very short window or run away on a very
        tall one.
      */}
      <div className="relative z-10 mx-auto mt-auto mb-[clamp(1.25rem,8dvh,5.5rem)] flex w-fit max-w-[calc(100%-2.5rem)] flex-col items-center px-5 text-center sm:max-w-[calc(100%-4rem)] sm:px-8">
        {/*
          The glow. w-fit on the wrapper above is what makes this hug the
          actual text, not the full 1400px content column: the widest line
          (the subhead, ~46ch) sets the box width, and the insets add a
          margin of breathing room around that on every side.

          It's two blurred shapes stacked, not one, and not a hand-tuned
          radial gradient. A gradient's falloff is exact math, and exact
          math still reads as a shape with an edge once it sits over a
          busy, textured background like open water. A single solid blurred
          shape was the version before this one, and at full opacity with a
          moderate blur it had the same problem from the other direction:
          the centre stayed flat, fully opaque black, so it read as a
          rounded rectangle laid over the photograph rather than a shadow
          the copy was sitting in. Nothing in between the two failure modes
          exists at a single opacity and a single blur radius.

          The fix is to split the job. The core, directly behind the text,
          is smaller, tightly blurred and holds most of the opacity: that
          is what actually delivers the contrast. The halo around it is
          bigger, far more blurred, and much lower opacity: it has almost
          nothing to say about contrast and everything to say about not
          having an edge, fading the core into the water gradually enough
          that the eye never finds a boundary to read as a shape. z-[-1] on
          both keeps them under the type but above the photograph, inside
          this wrapper's own stacking context; the core is written second
          so it paints in front of the halo.

          The top reach on both is deliberately tighter than the sides and
          bottom. The wake crosses close behind the eyebrow, the topmost
          line, so a generous top would bleed into it and start dimming the
          wake itself, exactly the "taking away from the photo" this exists
          to avoid. Below and beside the copy is open water with nothing to
          protect, so those sides can carry more reach for free.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-14 -top-6 -bottom-24 z-[-1] rounded-[6rem] bg-ink/40 blur-[70px] sm:-inset-x-24 sm:-top-8 sm:-bottom-32 sm:blur-[100px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-5 -top-3 -bottom-10 z-[-1] rounded-[3rem] bg-ink/75 blur-[30px] sm:-inset-x-8 sm:-top-4 sm:-bottom-14 sm:blur-[38px]"
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

        {/*
          Fluid, and keyed to viewport HEIGHT as much as width, which is the
          unusual part and the necessary one. Breakpoint type sizes only know
          how wide the window is, so a headline tuned on a 900px-tall laptop
          stays exactly as tall on a 620px one, where it no longer fits in
          the water below the boats. Feeding vh into the clamp lets the
          headline give height back on short windows, which is precisely
          where the clearance is scarce.

          The min() against vw is the phone guard: on a 390px screen the
          height-driven value would be far too wide and wrap to three lines,
          so width wins there and height wins everywhere else.

          The gaps below are fluid for the same reason. A headline that gives
          height back while the space around it does not just moves the
          problem: on a 620px window the four fixed margins were worth more
          than a line of the headline.

          From lg up the line-length cap comes off and the size switches to a
          width-driven one, so the headline sets on a single line instead of
          wrapping to two. That is the whole shape of this block: two wrapped
          lines made a tall narrow column with the photograph left idle on
          either side of it, and one long line spends that width instead. It
          also costs half the height, which the boats above get back as
          clearance. The vh term stays as a ceiling rather than the driver,
          because a short window still cannot afford a headline sized purely
          off a wide one.
        */}
        <motion.h1
          className="mt-[clamp(0.65rem,1.8vh,1.25rem)] max-w-[16ch] font-display text-[min(10.5vw,clamp(1.9rem,5.5vh+0.2rem,4.25rem))] leading-[1.05] tracking-[-0.015em] text-paper lg:max-w-none lg:text-[min(4.9vw,clamp(2rem,7.5vh,5.5rem))]"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.24, ease: EASE }}
        >
          Portraits made to last a lifetime.
        </motion.h1>

        {/*
          Supporting line and buttons: stacked on a phone, side by side from
          lg.

          Stacked under a headline that now runs full width, these two were
          the whole of the leftover space: a 736px paragraph and a 330px
          button pair sitting under a 1141px headline, tapering away to
          nothing. Setting them in a row instead makes the bottom of the
          block about as wide as the headline, so the copy reads as a slab
          rather than a funnel, and costs one row of height rather than two.

          The paragraph is capped well short of the headline on purpose. It
          is body copy, and a measure that matched the headline would run to
          about 105 characters a line, which is past the point where the eye
          loses its place returning to the left edge. Width here comes from
          setting it beside the buttons, not from stretching the line.

          That cap is the smaller of a character count and a share of the
          viewport, because the two limits bind at opposite ends. The buttons
          beside it are a fixed width, so a paragraph capped only in ch keeps
          the row the same width while the headline above it shrinks with the
          viewport, and by 1024px the row is running edge to edge under a
          headline half its length. The vw term shrinks the paragraph in step
          so the row keeps tracking the headline; the ch term takes back over
          on wide screens, where the row should stop growing and the measure
          is what matters again.
        */}
        <div className="mt-[clamp(0.65rem,1.8vh,1.25rem)] flex flex-col items-center gap-[clamp(1rem,3vh,2rem)] lg:flex-row lg:items-center lg:gap-12">
          <motion.p
            className="max-w-[56ch] text-[0.9rem] leading-relaxed text-paper-dim sm:text-[0.9375rem] lg:max-w-[min(60ch,38vw)] lg:text-left"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.34, ease: EASE }}
          >
            Specializing in newborn, child, family, and portrait photography, thoughtfully
            composed with natural light throughout Toronto and the GTA.
          </motion.p>

          {/* Side by side even on a phone. Stacked, these two cost 100px of
              the clear water; in a row they cost 44px, and at 350px of usable
              width both still clear a comfortable tap target. */}
          <motion.div
            className="flex shrink-0 flex-row flex-wrap items-center justify-center gap-3 sm:gap-4"
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
      </div>
    </section>
  );
}
