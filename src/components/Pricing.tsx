"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { pricingNotes, site } from "@/lib/site";
import { offerings, pricingGroups } from "@/lib/work";
import { CTA } from "./CTA";
import { Reveal, useSafeReducedMotion } from "./Reveal";

/**
 * Session investment, presented as a framed rate card rather than a bare list.
 *
 * Left column is the pitch: heading, what the price covers, the booking CTA.
 * Right column is the card itself, a bordered panel that holds its own
 * segmented switcher and a photograph beside every line, so the price sits
 * next to the work it is pricing rather than floating as a number on its own.
 *
 * The segmented control is deliberately not the underline tabs Work uses for
 * its filters. Repeating that exact control here would make the two sections
 * read as the same component reskinned; a bordered toggle with a filled
 * active state gives this card its own identity while staying inside the
 * same restraint: square corners, the one accent, no new colour.
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
    <section id="pricing" className="border-t border-rule-soft py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <h2 className="max-w-[16ch] font-display text-[2.1rem] leading-[1.1] tracking-[-0.01em] text-paper sm:text-[2.75rem]">
              {pricingNotes.heading}
            </h2>
            <p className="mt-5 max-w-[42ch] text-[0.9375rem] leading-[1.75] text-paper-dim">
              {pricingNotes.body}
            </p>
            <div className="mt-9">
              <CTA href="#contact">{site.cta.contact}</CTA>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-8">
            {/* The segmented switcher. Sits above the card, governs its content. */}
            <div
              role="tablist"
              aria-label="Pricing category"
              className="inline-flex border border-rule"
            >
              {pricingGroups.map((g, i) => {
                const isActive = g.id === active;
                return (
                  <button
                    key={g.id}
                    role="tab"
                    aria-selected={isActive}
                    type="button"
                    onClick={() => setActive(g.id)}
                    className={[
                      "px-5 py-2.5 text-[0.75rem] uppercase tracking-[0.18em] transition-colors duration-200",
                      i > 0 ? "border-l border-rule" : "",
                      isActive
                        ? "bg-gold/10 text-gold"
                        : "text-paper-faint hover:text-paper-dim",
                    ].join(" ")}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>

            {/* The card. A bordered panel is what turns a list into a rate
                card: it gives the prices a frame to sit inside, the way a
                printed menu is bound rather than loose pages. */}
            <div className="mt-6 border border-rule p-6 sm:p-8">
              <p className="text-[0.6875rem] uppercase tracking-[0.24em] text-paper-faint">
                All prices in CAD. Per-guest pricing counts everyone photographed.
              </p>

              <AnimatePresence mode="wait" initial={false}>
                <motion.ul
                  key={group.id}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="mt-6"
                >
                  {rows.map((offering) => (
                    <li
                      key={offering.id}
                      className="flex items-center gap-4 border-b border-rule-soft py-4 first:pt-0 last:border-b-0 last:pb-0 sm:gap-5"
                    >
                      {/* Decorative: the offering title beside it already says
                          what this is, so the image carries no alt text of
                          its own. */}
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden bg-ink-raised sm:h-16 sm:w-16">
                        <Image
                          src={offering.image}
                          alt=""
                          fill
                          quality={70}
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="font-display text-[1rem] leading-tight text-paper sm:text-[1.15rem]">
                          {offering.title}
                        </span>
                        {offering.unit === "guest" ? (
                          <span className="text-[0.625rem] uppercase tracking-[0.2em] text-paper-faint">
                            Per guest
                          </span>
                        ) : null}
                      </div>

                      {/* The dotted leader, hidden below sm where there is not
                          enough width left for it to do useful work once the
                          thumbnail and both text blocks are accounted for. */}
                      <span
                        aria-hidden
                        className="hidden h-0 flex-1 border-b border-dotted border-rule sm:mb-[0.3em] sm:block"
                      />

                      <span className="shrink-0 font-display text-[1.1rem] leading-tight text-gold tabular-nums sm:text-[1.3rem]">
                        ${offering.price}
                      </span>
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
