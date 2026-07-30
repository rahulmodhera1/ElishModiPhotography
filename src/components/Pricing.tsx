"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { pricingNotes, site } from "@/lib/site";
import { offerings, pricingGroups } from "@/lib/work";
import { CTA } from "./CTA";
import { Reveal, useSafeReducedMotion } from "./Reveal";

/**
 * Session pricing, laid out as a tabbed rate card: two tabs, each opening a
 * dotted-leader list that ties a service straight to its price the way a menu
 * does. It is the one place on the site meant to be scanned rather than read.
 *
 * The two tabs are not decoration. "Portraits & Family" and "Vehicle &
 * Landscape" split the six offerings the one way that is actually true of the
 * work rather than invented to fill a second tab: a baby session and an
 * individual portrait are the same kind of booking in a way neither is like a
 * car or a landscape commission.
 *
 * The dotted leader is drawn with a single flex-1 dotted bottom border between
 * the name and the price, the same technique a printed menu uses. No table,
 * no grid lines, because a full ruled table is the "spec sheet" pattern this
 * site otherwise avoids.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function Pricing() {
  const [active, setActive] = useState<(typeof pricingGroups)[number]["id"]>(
    pricingGroups[0].id,
  );
  const reduce = useSafeReducedMotion();

  const group = pricingGroups.find((g) => g.id === active) ?? pricingGroups[0];
  const rows = offerings.filter((o) => (group.categories as string[]).includes(o.id));

  return (
    <section id="pricing" className="border-t border-rule-soft py-24 sm:py-32">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <h2 className="max-w-[16ch] font-display text-[2.1rem] leading-[1.1] tracking-[-0.01em] text-paper sm:text-[2.75rem]">
            {pricingNotes.heading}
          </h2>
          <p className="mt-5 max-w-[60ch] text-[0.9375rem] leading-[1.75] text-paper-dim">
            {pricingNotes.body}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-14 border-t border-rule-soft pt-10">
          <div
            role="tablist"
            aria-label="Pricing category"
            className="flex flex-wrap gap-x-8 gap-y-3"
          >
            {pricingGroups.map((g) => {
              const isActive = g.id === active;
              return (
                <button
                  key={g.id}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setActive(g.id)}
                  className={[
                    "relative pb-2 text-[0.8125rem] uppercase tracking-[0.18em] transition-colors duration-200",
                    isActive ? "text-paper" : "text-paper-faint hover:text-paper-dim",
                  ].join(" ")}
                >
                  {g.label}
                  {isActive ? (
                    <motion.span
                      layoutId="pricing-tab-underline"
                      className="absolute inset-x-0 bottom-0 h-px bg-gold"
                      transition={{ duration: 0.3, ease: EASE }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>

          <p className="mt-8 text-[0.6875rem] uppercase tracking-[0.24em] text-paper-faint">
            All prices in CAD. Per-guest pricing counts everyone photographed.
          </p>

          <AnimatePresence mode="wait" initial={false}>
            <motion.ul
              key={group.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="mt-4"
            >
              {rows.map((offering) => (
                <li
                  key={offering.id}
                  className="flex items-baseline gap-3 border-b border-rule-soft py-5 first:border-t first:border-t-transparent"
                >
                  <span className="shrink-0 font-display text-[1.05rem] leading-none text-paper sm:text-[1.25rem]">
                    {offering.title}
                  </span>
                  {offering.unit === "guest" ? (
                    <span className="shrink-0 text-[0.625rem] uppercase tracking-[0.2em] text-paper-faint">
                      Per guest
                    </span>
                  ) : null}
                  {/* The dotted leader. A flex-1 dashed rule sitting on the
                      baseline, doing the same job a printed menu's dot leader
                      does: tying a name to its price without a table. */}
                  <span
                    aria-hidden
                    className="mb-[0.3em] h-0 flex-1 border-b border-dotted border-rule"
                  />
                  <span className="shrink-0 font-display text-[1.05rem] leading-none text-gold tabular-nums sm:text-[1.25rem]">
                    ${offering.price}
                  </span>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>

          <div className="mt-10">
            <CTA href="#contact">{site.cta.contact}</CTA>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
