"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import { useCallback, useEffect, useRef } from "react";
import type { Photo } from "@/lib/work";

/**
 * Full screen viewer. The chrome is deliberately thin: a counter, a close, and
 * two arrows that only exist on pointer devices. On touch you swipe, which is
 * what a phone user tries first anyway.
 *
 * Dismissal is velocity based rather than distance based. A quick flick counts
 * even if it only travelled 40px, because that is what a flick means.
 */

const SWIPE_DISTANCE = 90;
const SWIPE_VELOCITY = 0.35;
const EASE = [0.16, 1, 0.3, 1] as const;

export function Lightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: Photo[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  const go = useCallback(
    (step: number) => {
      if (index === null || photos.length === 0) return;
      onNavigate((index + step + photos.length) % photos.length);
    },
    [index, photos.length, onNavigate],
  );

  /* Keyboard: escape closes, arrows page. No animation is tied to these keys
     beyond the crossfade the mouse gets, because repeat presses should not
     feel like waiting. */
  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      } else if (event.key === "ArrowRight") {
        go(1);
      } else if (event.key === "ArrowLeft") {
        go(-1);
      }
    };

    /* Lock the page behind the overlay without letting the layout jump when
       the scrollbar disappears. */
    const { body, documentElement } = document;
    const gutter = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
      restoreFocusTo.current?.focus?.();
    };
  }, [open, go, onClose]);

  const photo = index === null ? null : photos[index];

  return (
    <AnimatePresence>
      {open && photo ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${index + 1} of ${photos.length}. ${photo.alt}`}
          className="fixed inset-0 z-50 flex flex-col bg-ink/97 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: EASE }}
        >
          <div className="flex items-center justify-between px-5 py-5 sm:px-8">
            {/* Gold here because the lightbox is the one full-screen moment on
                the site, and the counter is the only standing type in it. */}
            <p className="font-sans text-[0.6875rem] uppercase tracking-[0.28em] text-gold tabular-nums">
              {String(index + 1).padStart(2, "0")} of {String(photos.length).padStart(2, "0")}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close image viewer"
              className="motion-safe-transform grid h-11 w-11 place-items-center rounded-full border border-rule text-paper duration-[140ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-paper/45 active:scale-[0.94]"
            >
              <XIcon size={18} weight="light" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 pb-3 sm:px-16 sm:pb-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={photo.src}
                className="relative flex h-full w-full items-center justify-center"
                drag={reduce ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.14}
                onDragEnd={(_, info) => {
                  const flicked = Math.abs(info.velocity.x) > SWIPE_VELOCITY * 1000;
                  const dragged = Math.abs(info.offset.x) > SWIPE_DISTANCE;
                  if (!flicked && !dragged) return;
                  go(info.offset.x < 0 ? 1 : -1);
                }}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  quality={90}
                  sizes="(max-width: 640px) 100vw, 90vw"
                  className="max-h-full w-auto max-w-full select-none object-contain"
                  draggable={false}
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Arrows are pointer-only. On touch the gesture is the control. */}
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="motion-safe-transform absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-rule text-paper duration-[140ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-paper/45 active:scale-[0.94] sm:grid"
            >
              <CaretLeftIcon size={18} weight="light" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="motion-safe-transform absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-rule text-paper duration-[140ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-paper/45 active:scale-[0.94] sm:grid"
            >
              <CaretRightIcon size={18} weight="light" />
            </button>
          </div>

          <p className="px-5 pb-6 text-center font-sans text-xs leading-relaxed text-paper-faint sm:px-8">
            {photo.alt}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
