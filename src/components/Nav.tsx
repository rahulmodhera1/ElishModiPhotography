"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { nav, site } from "@/lib/site";
import { CTA } from "./CTA";
import { useSafeReducedMotion } from "./Reveal";

/**
 * TWO SHAPES, ONE ROW OF MARKUP
 *
 * Desktop keeps the bar: transparent over the hero, solid once the photograph
 * is behind you, edge to edge.
 *
 * Below lg it is a floating pill instead. A full-width transparent strip has
 * no edges of its own, so on a phone it did not read as a control sitting on
 * the photograph, it read as text that happened to be lying on it, and the
 * wordmark was competing with whatever was behind it. Insetting the bar and
 * giving it a border, a blur and a ground of its own puts it clearly in front
 * of the picture at any brightness, which matters more here than usual because
 * the hero photograph is client-swappable.
 *
 * The menu opens inside that pill rather than as a separate sheet below it, so
 * the pill grows into a panel: one object changing size, not two objects
 * appearing in sequence. That is the whole reason the surface classes live on
 * a wrapper instead of on <header>.
 *
 * The scroll state is read through Motion's useScroll rather than a scroll
 * listener, so it is batched with the frame instead of firing on every tick.
 *
 * Height is 72px at desktop, one line, never two. On mobile the pill is 60px
 * inside a 12px inset, which comes to the same 72px, so the scroll-padding in
 * globals.css still lands anchors correctly on both.
 *
 * TO USE A REAL LOGO: drop it at public/images/brand/logo-light.svg and swap
 * the wordmark span below for next/image. The light mark is the one that goes
 * here because the nav always sits on a dark ground.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Nav() {
  const { scrollY } = useScroll();
  const reduce = useSafeReducedMotion();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    const next = value > 64;
    setSolid((prev) => (prev === next ? prev : next));
  });

  /* Escape closes it. The backdrop covers pointer dismissal; this covers a
     keyboard, which a phone can have attached and a small laptop always does. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  /*
    Reduced motion keeps the menu's opacity and height changes, because those
    are what make it legible as opening, and drops the travel and the blur,
    which are the parts that are only there to feel good.
  */
  /*
    The links ride the panel open rather than waiting for it. Sequencing them
    after the height finished left a beat of empty card on screen with nothing
    in it, which reads as the menu having stalled: the container was done at
    440ms and the last link did not land until past a second. Overlapping them
    is both quicker and calmer, and the pill's overflow-hidden already keeps a
    link from showing above the edge it is sliding out of.
  */
  const panelVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: { duration: reduce ? 0.15 : 0.26, ease: EASE },
    },
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: reduce ? 0.15 : 0.42,
        ease: EASE,
        delayChildren: reduce ? 0 : 0.08,
        staggerChildren: reduce ? 0 : 0.05,
      },
    },
  };

  const itemVariants = reduce
    ? { closed: { opacity: 0 }, open: { opacity: 1 } }
    : {
        closed: { opacity: 0, y: -10, filter: "blur(4px)" },
        open: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.36, ease: EASE },
        },
      };

  return (
    <>
      {/*
        Dismiss layer. Only below lg, where the menu exists at all, and only
        while it is open. Sits under the header and over everything else, so a
        tap anywhere on the page closes the menu instead of hitting a link the
        reader could not really see.

        aria-hidden and not a button. It duplicates the toggle, which is
        already in the tree two elements away, and a second "Close menu"
        control that a screen reader announces but a sighted user experiences
        as empty space is worse than no control at all. Pointer users get it,
        keyboard users get Escape, and the accessibility tree stays honest.
      */}
      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            aria-hidden
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <div className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <header
        className={[
          "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
          /*
            lg-only, because below it the surface is the pill's, not the
            header's. Left unqualified these would paint a second full-width
            bar behind the floating one.
          */
          solid
            /* Opaque enough to stay readable if backdrop-filter is unavailable,
               translucent enough that the blur still reads when it is. */
            ? "lg:border-b lg:border-rule-soft lg:bg-ink/94 lg:backdrop-blur-lg"
            : "lg:border-b lg:border-transparent lg:bg-transparent",
        ].join(" ")}
      >
        <div
          className={[
            "mx-3 mt-3 overflow-hidden rounded-[1.375rem] border backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
            /* At lg the pill unwinds back into the header's own bar. */
            "lg:mx-0 lg:mt-0 lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:shadow-none lg:backdrop-blur-none",
            solid || menuOpen
              ? "border-paper/15 bg-ink/85 shadow-lg shadow-ink/60"
              : "border-paper/10 bg-ink/40 shadow-md shadow-ink/30",
          ].join(" ")}
        >
          {/* sm:px-6 keeps the Inquire button clear of the pill's corner
              radius on a tablet, where the row is wide enough for the two to
              meet. */}
          <div className="mx-auto flex h-[60px] max-w-[1400px] items-center justify-between gap-6 px-4 sm:px-6 lg:h-[72px] lg:px-8">
            <a
              href="#top"
              onClick={() => setMenuOpen(false)}
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

            <div className="flex items-center gap-2">
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
                className="motion-safe-transform -mr-1.5 grid h-11 w-11 place-items-center text-paper duration-[140ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.9] lg:hidden"
              >
                {/*
                  The two marks swap through a quarter turn rather than cutting,
                  so the control reads as one thing changing state. mode="wait"
                  keeps them from overlapping mid-rotation.
                */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={menuOpen ? "close" : "open"}
                    className="grid place-items-center"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, rotate: -90, scale: 0.7 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, rotate: 90, scale: 0.7 }}
                    transition={{ duration: reduce ? 0.12 : 0.24, ease: EASE }}
                  >
                    {menuOpen ? (
                      <XIcon size={22} weight="light" />
                    ) : (
                      <ListIcon size={22} weight="light" />
                    )}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/*
            Inside the pill, so opening grows the one surface rather than
            dropping a second panel under it. The pill's overflow-hidden is
            what clips the links while the height is still animating.
          */}
          <AnimatePresence initial={false}>
            {menuOpen ? (
              <motion.div
                id="mobile-menu"
                key="menu"
                className="lg:hidden"
                variants={panelVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                <nav aria-label="Mobile" className="flex flex-col px-4 pb-4 sm:px-5">
                  <span className="mb-1 block h-px bg-rule-soft" />
                  {nav.map((item) => (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="border-b border-rule-soft py-3.5 font-display text-2xl text-paper last:border-b-0"
                      variants={itemVariants}
                    >
                      {item.label}
                    </motion.a>
                  ))}
                  {/* Only needed below sm, where the header CTA is not rendered. */}
                  <motion.span className="mt-4 block sm:hidden" variants={itemVariants}>
                    <CTA
                      href="#contact"
                      onClick={() => setMenuOpen(false)}
                      className="w-full"
                    >
                      {site.cta.contact}
                    </CTA>
                  </motion.span>
                </nav>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}
