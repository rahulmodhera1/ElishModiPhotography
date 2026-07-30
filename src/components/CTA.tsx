import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * The only two button treatments on the site.
 *
 * Both press to scale(0.98) in 140ms. A button that does not move under the
 * finger reads as broken, and 140ms is short enough that the feedback arrives
 * before the user has finished pressing.
 *
 * Contrast: solid is paper on ink (near maximum), quiet is paper on a 1px rule
 * over an ink ground. Neither ever sits on bare photography without a scrim.
 */

const base =
  "motion-safe-transform inline-flex items-center justify-center whitespace-nowrap " +
  "px-7 h-12 text-[0.8125rem] uppercase tracking-[0.18em] " +
  "duration-[140ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-safelight";

const variants = {
  solid: "bg-paper text-ink hover:bg-white",
  quiet:
    "border border-rule text-paper hover:border-paper/45 hover:bg-paper/[0.06]",
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
