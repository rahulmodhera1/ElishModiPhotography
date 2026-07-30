"use client";

import Image from "next/image";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { formatPrice, offerings, type CategoryId } from "@/lib/work";
import { RevealImage } from "./Reveal";

/**
 * The six offerings, with what each one is and what it costs.
 *
 * Six items, six cells, no filler tile. Spans alternate 7/5, 5/7, 7/5 down a
 * twelve column bed so no two rows mirror each other.
 *
 * The caption sits below the image rather than over it. That keeps the price
 * legible whatever photograph the client uploads, and it keeps this section
 * visually distinct from the portfolio grid further down, which is bare
 * full-bleed images with no type on them at all.
 *
 * Each card is a real control: it filters the portfolio to that category and
 * scrolls you there.
 */

const spans = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-7",
  "lg:col-span-5",
];

/*
  At lg the two cells in a row share one fixed image height, so the captions
  underneath start on the same line. Driving the crop from aspect ratio instead
  looks tidy in isolation but leaves a well of dead space under whichever cell
  came out shorter, which is the gap that makes a grid look accidental. The
  asymmetry comes from the column spans alone. Below lg it is one column and
  the aspect ratio takes over again.
*/
const IMAGE_BOX = "aspect-[3/2] lg:aspect-auto lg:h-[26rem] xl:h-[30rem]";

export function Offerings({ onSelect }: { onSelect: (id: CategoryId) => void }) {
  return (
    <section id="services" className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 sm:py-32">
      <h2 className="max-w-[20ch] font-display text-[2.1rem] leading-[1.1] tracking-[-0.01em] text-paper sm:text-[2.75rem]">
        Six things I shoot, one way of working.
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-12 lg:grid-cols-12 lg:gap-y-16">
        {offerings.map((item, i) => (
          <RevealImage key={item.id} className={spans[i]} delay={(i % 2) * 0.06}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className="group block w-full text-left"
            >
              <div className={`relative w-full overflow-hidden bg-ink-raised ${IMAGE_BOX}`}>
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
    </section>
  );
}
