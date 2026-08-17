"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { comingSoon, formatPrice, offerings, type CategoryId } from "@/lib/work";
import { RevealImage } from "./Reveal";

/**
 * The offerings, with what each one is and what it costs.
 *
 * No filler tile. Spans alternate 7/5, 5/7, 7/5 down a twelve column bed so no
 * two rows mirror each other, and the odd card out ends the grid full width.
 *
 * The caption sits below the image rather than over it. That keeps the price
 * legible whatever photograph the client uploads, and it keeps this section
 * visually distinct from the portfolio grid further down, which is bare
 * full-bleed images with no type on them at all.
 *
 * Each card is a real control: it filters the portfolio to that category and
 * scrolls you there. The panel under the grid is the exception: product work is
 * announced, not yet bookable, so it has no price, no photograph and no filter.
 */

/* One per offering, in order. Seven cards is an odd number, so the last one
   takes the full twelve rather than sitting alone in a seven and leaving five
   columns of nothing beside it. Landscape is the one that carries it: the
   large-format commission is the right thing to end the grid wide on. */
const spans = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-12",
];

/*
  At lg the two cells in a row share one fixed image height, so the captions
  underneath start on the same line. Driving the crop from aspect ratio instead
  looks tidy in isolation but leaves a well of dead space under whichever cell
  came out shorter, which is the gap that makes a grid look accidental. The
  asymmetry comes from the column spans alone.

  Below lg there are no rows to align, so nothing is bought by forcing a shape.
  The cell takes each photograph's own ratio, set per card from the manifest
  dimensions. A fixed 3:2 here was cropping the 4:3 frames top and bottom and
  cutting the one portrait frame nearly in half, on the narrow screens least
  able to spare the composition.
*/
const IMAGE_BOX =
  "aspect-[var(--card-ratio)] lg:aspect-auto lg:h-[26rem] xl:h-[30rem]";

export function Offerings({ onSelect }: { onSelect: (id: CategoryId) => void }) {
  return (
    <section id="services" className="border-t border-rule-soft py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <p className="eyebrow">Services</p>

        <h2 className="mt-6 max-w-[20ch] font-display text-[2.1rem] leading-[1.1] tracking-[-0.01em] text-paper sm:text-[2.75rem]">
          Portrait, family &amp; specialty sessions.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-12 lg:grid-cols-12 lg:gap-y-16">
          {offerings.map((item, i) => (
            <RevealImage key={item.id} className={spans[i]} delay={(i % 2) * 0.06}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                className="group block w-full text-left"
              >
                <div
                  className={`relative w-full overflow-hidden bg-ink-raised ${IMAGE_BOX}`}
                  style={
                    { "--card-ratio": `${item.width} / ${item.height}` } as CSSProperties
                  }
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    quality={82}
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="motion-safe-transform object-cover duration-[700ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
                  />
                </div>

                <div className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <h3 className="font-display text-[1.6rem] leading-tight text-paper sm:text-[1.85rem]">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 max-w-[44ch] text-[0.9375rem] leading-relaxed text-paper-dim">
                      {item.blurb}
                    </p>
                    <p className="mt-4 text-[0.75rem] uppercase tracking-[0.2em] text-gold">
                      {formatPrice(item.price, item.unit)}
                    </p>
                  </div>
                  <span className="motion-safe-transform mt-2 shrink-0 text-paper-faint duration-[300ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:text-gold group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRightIcon size={22} weight="light" />
                  </span>
                </div>
              </button>
            </RevealImage>
          ))}
        </div>

        {/*
          The one service that is announced rather than sold. No photograph,
          because there is none: a stock-looking placeholder over a service that
          does not exist yet would be the only dishonest frame on the page. A
          bordered panel with the label where the price goes says the same thing
          and says it faster.

          Not a button either. Every card above filters the portfolio to its
          category, and there is nothing here to filter to.
        */}
        <div className="mt-12 border border-rule-soft px-6 py-8 sm:px-8 sm:py-10 lg:mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
            <h3 className="font-display text-[1.6rem] leading-tight text-paper sm:text-[1.85rem]">
              {comingSoon.title}
            </h3>
            <p className="shrink-0 text-[0.75rem] uppercase tracking-[0.2em] text-gold">
              {comingSoon.note}
            </p>
          </div>
          <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-paper-dim">
            {comingSoon.blurb}
          </p>
        </div>
      </div>
    </section>
  );
}
