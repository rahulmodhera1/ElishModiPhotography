"use client";

import Image from "next/image";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { specialties, type CategoryId } from "@/lib/work";
import { RevealImage } from "./Reveal";

/**
 * Four disciplines, four cells, no filler tile. The spans run 7/5 then 5/7 so
 * the pair of rows do not mirror each other, which is what stops this reading
 * as a card row.
 *
 * Each card is a real control: it scrolls to the portfolio with its filter
 * already applied. That is the only reason the label sits on the image rather
 * than under it.
 */

const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];
const heights = ["lg:aspect-[16/10]", "lg:aspect-[4/5]", "lg:aspect-[4/5]", "lg:aspect-[16/10]"];

export function Specialties({ onSelect }: { onSelect: (id: CategoryId) => void }) {
  return (
    <section id="services" className="mx-auto max-w-[1400px] px-5 pb-24 sm:px-8 sm:pb-32">
      <h2 className="max-w-[20ch] font-display text-[2.1rem] leading-[1.1] tracking-[-0.01em] text-paper sm:text-[2.75rem]">
        Four kinds of work, one way of working.
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        {specialties.map((item, i) => (
          <RevealImage key={item.id} className={spans[i]} delay={i * 0.05}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className="group relative block w-full overflow-hidden bg-ink-raised text-left"
            >
              <div className={`relative aspect-[3/2] w-full ${heights[i]}`}>
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  quality={82}
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="motion-safe-transform object-cover duration-[700ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]"
                />
              </div>

              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent transition-opacity duration-500 group-hover:opacity-90"
              />

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-7">
                <div>
                  <h3 className="font-display text-[1.75rem] leading-none text-paper sm:text-[2rem]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 max-w-[34ch] text-[0.8125rem] leading-relaxed text-paper-dim">
                    {item.blurb}
                  </p>
                </div>
                <span className="motion-safe-transform mb-1 shrink-0 text-safelight duration-[300ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1 group-hover:-translate-y-1">
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
