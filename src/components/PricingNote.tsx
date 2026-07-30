import { pricingNotes, site } from "@/lib/site";
import { Reveal } from "./Reveal";
import { CTA } from "./CTA";

/**
 * What the numbers mean, and the ask.
 *
 * The per-session prices are already on the offering cards above. Repeating
 * all six here as a pricing table would be the same list twice, so this
 * section does the job the table cannot: it explains what is included, what
 * gets quoted separately, and then asks for the booking.
 */
export function PricingNote() {
  return (
    <section
      id="pricing"
      className="border-t border-rule-soft bg-ink-raised py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            <h2 className="font-display text-[1.9rem] leading-[1.15] tracking-[-0.01em] text-paper sm:text-[2.4rem] lg:col-span-5">
              {pricingNotes.heading}
            </h2>

            <div className="lg:col-span-7">
              <p className="max-w-[60ch] text-[0.9375rem] leading-[1.75] text-paper-dim">
                {pricingNotes.body}
              </p>
              <div className="mt-9">
                <CTA href="#contact">{site.cta.contact}</CTA>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
