import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * The only two button treatments on the site.
 *
 * Both press to scale(0.98) in 140ms. A button that does not move under the
 * finger reads as broken, and 140ms is short enough that the feedback arrives
 * before the user has finished pressing.
 *
 * The primary stays white on black rather than gold on black. White is the
 * higher contrast of the two and this is the button the whole page is pointing
 * at, so legibility wins. Gold goes to the secondary, which is where it can be
 * seen without competing: a gold hairline and gold label beside a solid white
 * button is the pairing that reads as considered rather than as two buttons
 * fighting.
 *
 * Contrast on ink: paper 17.99, gold 8.79. Both clear AA comfortably, and
 * neither ever sits on bare photography without a scrim behind it.
 */

const base =
  "motion-safe-transform inline-flex items-center justify-center whitespace-nowrap " +
  "px-7 h-12 text-[0.8125rem] uppercase tracking-[0.18em] " +
  "duration-[140ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-gold";

const variants = {
  solid: "bg-paper text-ink hover:bg-white",
  quiet:
    "border border-rule-gold text-gold hover:border-gold hover:bg-gold/[0.08]",
} as const;

type Variant = keyof typeof variants;

export function CTA({
  variant = "solid",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
    />
  );
}

export function CTAButton({
  variant = "solid",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} disabled:opacity-55 disabled:pointer-events-none ${className}`}
    />
  );
}
