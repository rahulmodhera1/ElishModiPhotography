"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import {
  categories,
  photos as allPhotos,
  scaleAspect,
  scaleClass,
  scaleSizes,
  type CategoryId,
  type Photo,
} from "@/lib/work";
import { Lightbox } from "./Lightbox";
import { useSafeReducedMotion } from "./Reveal";
import { WorkTile } from "./WorkTile";

/**
 * Selected work.
 *
 * The grid is a six column bed and every tile declares its own span, so a
 * full-bleed frame can sit above a pair of portrait crops the way it would in
 * a printed book. There is no uniform column anywhere in it.
 *
 * Filtering animates because the tiles genuinely move: the layout prop is
 * carrying a state change, not decorating one.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Work({
  filter,
  onFilterChange,
}: {
  filter: CategoryId | "all";
  onFilterChange: (next: CategoryId | "all") => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduce = useSafeReducedMotion();

  const visible = useMemo<Photo[]>(
    () => (filter === "all" ? allPhotos : allPhotos.filter((p) => p.category === filter)),
    [filter],
  );

  const filters = [
    { id: "all" as const, label: "All" },
    ...categories.map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <section id="work" className="border-t border-rule-soft py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow">Portfolio</p>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[16ch] font-display text-[2.1rem] leading-[1.1] tracking-[-0.01em] text-paper sm:text-[2.75rem]">
            Selected work.
          </h2>

          {/*
            Filters wrap rather than scroll horizontally. Five short labels fit
            in two lines at 390px, and every category stays visible: a filter
            parked off the right edge of a scroll container is a filter nobody
            uses.
          */}
          <div
            role="tablist"
            aria-label="Filter portfolio by category"
            className="flex flex-wrap gap-x-7 gap-y-3 lg:flex-nowrap"
          >
            {filters.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => onFilterChange(item.id)}
                  className={[
                    "relative shrink-0 whitespace-nowrap pb-2 text-[0.75rem] uppercase tracking-[0.2em] transition-colors duration-200",
                    active ? "text-paper" : "text-paper-faint hover:text-paper-dim",
                  ].join(" ")}
                >
                  {item.label}
                  {active ? (
                    <motion.span
                      layoutId="filter-underline"
                      className="absolute inset-x-0 bottom-0 h-px bg-gold"
                      transition={{ duration: 0.3, ease: EASE }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <motion.div
          layout={!reduce}
          className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-6 sm:gap-4"
          transition={{ duration: 0.45, ease: EASE }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((photo, i) => (
              <motion.figure
                key={photo.src}
                layout={!reduce}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: EASE }}
                className={`${scaleClass[photo.scale]} m-0`}
              >
                <WorkTile
                  photo={photo}
                  index={i}
                  aspect={scaleAspect[photo.scale]}
                  sizes={scaleSizes[photo.scale]}
                  onOpen={() => setOpenIndex(i)}
                />
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state. Reachable the moment the client removes the last photo
            from a category, which is exactly when a blank grid is confusing. */}
        {visible.length === 0 ? (
          <div className="mt-12 border border-rule-soft px-6 py-20 text-center">
            <p className="font-display text-2xl text-paper">Nothing filed here yet.</p>
            <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-paper-dim">
              This part of the archive is still being scanned. Try another category, or
              ask and I will send recent work directly.
            </p>
            <button
              type="button"
              onClick={() => onFilterChange("all")}
              className="motion-safe-transform mt-7 text-[0.75rem] uppercase tracking-[0.2em] text-gold duration-[140ms] active:scale-[0.98]"
            >
              Show everything
            </button>
          </div>
        ) : null}
      </div>

      <Lightbox
        photos={visible}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
}
