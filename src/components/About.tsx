import Image from "next/image";
import { about } from "@/lib/site";
import { Reveal, RevealImage } from "./Reveal";

/**
 * Asymmetric split. The portrait takes five columns; both columns share the
 * same top edge, so the face and the headline land in the same glance instead
 * of the portrait trailing in a beat late.
 *
 * No eyebrow here. The heading already names the section, so an "About" label
 * above an "About Elish Modi." headline would only say it twice.
 */
export function About() {
  return (
    <section id="about" className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:py-28">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
        <RevealImage className="lg:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-raised">
            <Image
              src="/images/about/portrait.jpg"
              alt="Elish Modi, photographed in a lobby in a white shirt, turned toward the camera"
              fill
              quality={88}
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover"
            />
          </div>
        </RevealImage>

        <div className="lg:col-span-7 lg:pl-4">
          <Reveal>
            <h2 className="max-w-[18ch] font-display text-[2.1rem] leading-[1.1] tracking-[-0.01em] text-paper sm:text-[2.75rem] lg:text-[3.25rem]">
              {about.heading}
            </h2>
          </Reveal>

          <div className="mt-8 space-y-5">
            {about.body.map((paragraph, i) => (
              <Reveal key={i} delay={0.06 + i * 0.06}>
                <p className="max-w-[58ch] text-[0.9375rem] leading-[1.75] text-paper-dim">
                  {paragraph}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.18}>
            <blockquote className="mt-12 border-l border-gold pl-6">
              <p className="max-w-[40ch] font-display text-[1.4rem] leading-[1.4] text-paper sm:text-[1.6rem]">
                {about.pullQuote}
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={0.24}>
            <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-rule-soft pt-7">
              {about.specialties.map((tag) => (
                <li
                  key={tag}
                  className="text-[0.6875rem] uppercase tracking-[0.24em] text-paper-faint"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
