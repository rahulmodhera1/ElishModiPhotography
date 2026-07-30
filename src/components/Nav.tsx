"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { nav, site } from "@/lib/site";
import { CTA } from "./CTA";

/**
 * Transparent over the hero, solid once the photograph is behind you.
 *
 * The scroll state is read through Motion's useScroll rather than a scroll
 * listener, so it is batched with the frame instead of firing on every tick.
 *
 * Height is 72px at desktop, one line, never two.
 *
 * TO USE A REAL LOGO: drop it at public/images/brand/logo-light.svg and swap
 * the wordmark span below for next/image. The light mark is the one that goes
 * here because the nav always sits on a dark ground.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > 64;
    setSolid((prev) => (prev === next ? prev : next));
  });

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
          solid || menuOpen
            /* Opaque enough to stay readable if backdrop-filter is unavailable,
               translucent enough that the blur still reads when it is. */
            ? "border-b border-rule-soft bg-ink/94 backdrop-blur-lg"
            : "border-b border-transparent bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8">
          <a
            href="#top"
            className="font-display text-[1.35rem] leading-none tracking-[0.02em] text-paper"
          >
            {site.wordmark}
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-9 lg:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative text-[0.75rem] uppercase tracking-[0.2em] text-paper-dim transition-colors duration-200 hover:text-paper"
              >
                {item.label}
                {/* Underline wipes in from the left rather than fading, so the
                    hover reads as directional instead of decorative. */}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/*
              Wrapped rather than given a `hidden` class of its own: the CTA
              already sets inline-flex, and two display utilities on one element
              resolve by stylesheet order rather than by the order written here.
            */}
            <span className="hidden sm:block">
              <CTA href="#contact" className="h-10 px-6">
                {site.cta.contact}
              </CTA>
            </span>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="motion-safe-transform grid h-11 w-11 place-items-center text-paper duration-[140ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.94] lg:hidden"
            >
              {menuOpen ? <XIcon size={22} weight="light" /> : <ListIcon size={22} weight="light" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 top-[72px] z-30 border-b border-rule-soft bg-ink/97 backdrop-blur-lg lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.26, ease: EASE }}
          >
            <nav aria-label="Mobile" className="flex flex-col px-5 py-4">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-rule-soft py-4 font-display text-2xl text-paper last:border-b-0"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.04 + i * 0.05, ease: EASE }}
                >
                  {item.label}
                </motion.a>
              ))}
              {/* Only needed below sm, where the header CTA is not rendered. */}
              <span className="mt-5 block sm:hidden">
                <CTA
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                  className="w-full"
                >
                  {site.cta.contact}
                </CTA>
              </span>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
