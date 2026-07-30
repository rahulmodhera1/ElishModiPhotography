"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type PointerEvent } from "react";
import type { Photo } from "@/lib/work";

/**
 * One frame in the grid.
 *
 * Cursor-aware hover: a small "View" mark trails the pointer inside the tile.
 * It is spring interpolated rather than pinned to the raw coordinates, because
 * a value that tracks the mouse exactly reads as mechanical. The native system
 * cursor is never hidden or replaced.
 *
 * The pointer values are motion values, not React state. Tracking a pointer in
 * state re-renders the tree on every move and falls apart on a phone.
 *
 * The whole effect is gated on a fine pointer, so a tap on touch never fires a
 * phantom hover.
 */

const SPRING = { stiffness: 260, damping: 28, mass: 0.6 };

export function WorkTile({
  photo,
  index,
  aspect,
  sizes,
  onOpen,
}: {
  photo: Photo;
  index: number;
  aspect: string;
  sizes: string;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);
  const transform = useTransform(
    [sx, sy],
    ([tx, ty]: number[]) => `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`,
  );

  const handleMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  };

  return (
    <button
      ref={ref}
      type="button"
      onPointerMove={handleMove}
      onClick={onOpen}
      aria-label={`Open image ${index + 1}: ${photo.alt}`}
      className="group relative block w-full cursor-pointer overflow-hidden bg-ink-raised"
    >
      <div className={`relative w-full ${aspect}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          quality={82}
          sizes={sizes}
          /* Only the first row is worth eager loading. Everything below the
             fold waits, which is most of the page weight on a phone. */
          loading={index < 2 ? "eager" : "lazy"}
          className="motion-safe-transform object-cover duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.035]"
        />
      </div>

      {/* A hair of ink on hover so the trailing mark always has something to
          sit on, whatever the client uploads. */}
      <span
        aria-hidden
        className="absolute inset-0 bg-ink/0 transition-colors duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:bg-ink/25"
      />

      <motion.span
        aria-hidden
        style={{ transform }}
        className="pointer-events-none absolute left-0 top-0 hidden select-none whitespace-nowrap border border-paper/25 bg-ink/70 px-4 py-2 text-[0.625rem] uppercase tracking-[0.24em] text-paper opacity-0 backdrop-blur-sm transition-opacity duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:block"
      >
        View
      </motion.span>
    </button>
  );
}
