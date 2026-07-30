import { packages, site } from "@/lib/site";
import { Reveal } from "./Reveal";
import { CTA } from "./CTA";

/**
 * Pricing as a ledger, not a plan comparison.
 *
 * Three rows, each one a price on the left and what it buys on the right.
 * There are no tier cards, no checkmark columns and no "most popular" badge,
 * because none of those are how a photographer quotes a job.
 */
export function Packages() {
  return (
    <section
      id="packages"
      className="border-t border-rule-soft bg-ink-raised py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <h2 className="max-w-[20ch] font-display text-[2.1rem] leading-[1.1] tracking-[-0.01em] text-paper sm:text-[2.75rem]">
            Starting points, not a menu.
          </h2>
          <p className="mt-5 max-w-[52ch] text-[0.9375rem] leading-[1.75] text-paper-dim">
            Every job gets quoted properly once I know the scope. These are the floors,
            so you can tell early whether we are in the same range.
          </p>
        </Reveal>

        <div className="mt-14">
          {packages.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.06}>
              <div className="grid grid-cols-1 gap-6 border-t border-rule py-10 sm:gap-10 lg:grid-cols-12 lg:py-12">
                <div className="lg:col-span-4">
                  <h3 className="font-display text-[1.75rem] leading-tight text-paper sm:text-[2rem]">
                    {tier.name}
                  </h3>
                  <p className="mt-3 text-[0.6875rem] uppercase tracking-[0.24em] text-paper-faint">
                    {tier.duration}
                  </p>
                </div>

                <div className="lg:col-span-3">
                  <p className="font-display text-[2.5rem] leading-none text-paper tabular-nums sm:text-[3rem]">
                    {tier.from}
                  </p>
                  <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.24em] text-paper-faint">
                    Starting at
                  </p>
                </div>

                <ul className="space-y-3 lg:col-span-5">
                  {tier.includes.map((line) => (
                    <li
                      key={line}
                      className="flex gap-4 text-[0.9375rem] leading-relaxed text-paper-dim"
                    >
                      <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-safelight" />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="flex flex-col gap-5 border-t border-rule pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[46ch] text-[0.9375rem] leading-relaxed text-paper-dim">
              Travel, licensing and second shooters are quoted per job. Ask and I will
              put a real number on it.
            </p>
            <CTA href="#contact" className="shrink-0">
              {site.cta.contact}
            </CTA>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
