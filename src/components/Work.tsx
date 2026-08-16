"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState, type CSSProperties } from "react";
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

/** How many frames a phone shows before asking. Also the size of each batch. */
const MOBILE_BATCH = 6;

export function Work({
  filter,
  onFilterChange,
}: {
  filter: CategoryId | "all";
  onFilterChange: (next: CategoryId | "all") => void;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [shown, setShown] = useState(MOBILE_BATCH);
  const reduce = useSafeReducedMotion();

  const visible = useMemo<Photo[]>(
    () => (filter === "all" ? allPhotos : allPhotos.filter((p) => p.category === filter)),
    [filter],
  );

  /*
    A new filter is a new set, so it starts closed again. Without this, opening
    everything under "All" and then picking a category would silently expand
    that category too, and the reader would never see the control that did it.

    Derived from state rather than run in an effect: this needs to be true on
    the same render the filter changes on, not a paint later.
  */
  const [lastFilter, setLastFilter] = useState(filter);
  if (lastFilter !== filter) {
    setLastFilter(filter);
    setShown(MOBILE_BATCH);
  }

  const remaining = visible.length - shown;

  const filters = [
    { id: "all" as const, label: "All" },
    ...categories.map((c) => ({ id: c.id, label: c.label })),
  ];

  /* Elish's own words for the chosen category. "All" has none on purpose: a
     line that tried to describe six kinds of session at once would say nothing,
     and the work underneath is the introduction. */
  const description = categories.find((c) => c.id === filter)?.description ?? null;

  return (
    <section id="work" className="border-t border-rule-soft py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow">Portfolio</p>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-[16ch] font-display text-[2.1rem] leading-[1.1] tracking-[-0.01em] text-paper sm:text-[2.75rem]">
            A selection of recent sessions.
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
                    "relative shrink-0 whitespace-nowrap pt-3 pb-2 text-[0.75rem] uppercase tracking-[0.2em] transition-colors duration-200",
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

        {/*
          The description of whatever is selected, directly under the chips that
          selected it.

          Height animates rather than being reserved: on "All" there is no
          paragraph, and holding three empty lines open for a category nobody
          has picked yet would put a hole between the heading and the work. The
          grid below already carries `layout`, so it rides the height change
          instead of jumping.
        */}
        <AnimatePresence initial={false} mode="wait">
          {description ? (
            <motion.div
              key={filter}
              initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, height: "auto" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
              className="overflow-hidden"
            >
              <p
                aria-live="polite"
                className="mt-8 max-w-[68ch] text-[0.9375rem] leading-[1.75] text-paper-dim"
              >
                {description}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/*
          No `items-*` override here on purpose: CSS Grid's default alignment
          is stretch, and that default is what makes every tile in a row match
          its tallest row-mate. WorkTile relies on it (see the comment there).
        */}
        <motion.div
          layout={!reduce}
          className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-6 sm:gap-4"
          transition={{ duration: 0.45, ease: EASE }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((photo, i) => {
              const held = i >= shown;
              return (
                <motion.figure
                  key={photo.src}
                  layout={!reduce}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  /*
                    `hidden sm:block` rather than not rendering these at all,
                    which is what keeps the batching a phone-only concern: the
                    markup is identical at every width, so there is no viewport
                    measurement in render and nothing to mismatch at hydration.
                    From sm up the whole grid is there as it always was.
                  */
                  className={[
                    scaleClass[photo.scale],
                    "m-0",
                    held ? "hidden sm:block" : "",
                    i >= MOBILE_BATCH ? "tile-reveal" : "",
                  ].join(" ")}
                  style={{ "--reveal-index": i % MOBILE_BATCH } as CSSProperties}
                >
                  <WorkTile
                    photo={photo}
                    index={i}
                    aspect={scaleAspect[photo.scale]}
                    sizes={scaleSizes[photo.scale]}
                    onOpen={() => setOpenIndex(i)}
                  />
                </motion.figure>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/*
          Phone only. Eighteen frames at their true ratio is around five
          screens of scrolling before the page moves on, which reads as a site
          that will not end rather than as a body of work. A batch at a time
          keeps the section a reasonable length and makes seeing the rest a
          choice. From sm up the grid is short enough in rows that there is
          nothing to page through, so the control is not rendered.

          The count is in the label because "Show more" alone does not say
          whether it means three more or thirty.
        */}
        {remaining > 0 ? (
          <div className="mt-8 sm:hidden">
            <button
              type="button"
              onClick={() => setShown((n) => n + MOBILE_BATCH)}
              className="motion-safe-transform w-full border border-rule px-6 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-paper duration-[140ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-paper/45 active:scale-[0.99]"
            >
              Show {Math.min(remaining, MOBILE_BATCH)} more
              <span className="ml-2 text-paper-faint">
                {shown} of {visible.length}
              </span>
            </button>
          </div>
        ) : null}

        {/* Empty state. Reachable the moment the client removes the last photo
            from a category, which is exactly when a blank grid is confusing. */}
        {visible.length === 0 ? (
          <div className="mt-12 border border-rule-soft px-6 py-20 text-center">
            <p className="font-display text-2xl text-paper">No sessions in this category yet.</p>
            <p className="mx-auto mt-3 max-w-[42ch] text-sm leading-relaxed text-paper-dim">
              This selection will be updated soon. Browse another category below, or get
              in touch for recent examples.
            </p>
            <button
              type="button"
              onClick={() => onFilterChange("all")}
              className="motion-safe-transform mt-7 text-[0.75rem] uppercase tracking-[0.2em] text-gold duration-[140ms] active:scale-[0.98]"
            >
              View all work
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
