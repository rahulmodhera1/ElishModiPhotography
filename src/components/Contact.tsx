"use client";

import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { InstagramLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { shootTypes, site } from "@/lib/site";
import { CTAButton } from "./CTA";
import { Reveal } from "./Reveal";

/**
 * The form.
 *
 * Labels sit above their inputs and stay visible. Placeholders are examples,
 * never the label. Errors render directly under the field they belong to and
 * are wired to the input with aria-describedby, so a screen reader hears the
 * problem in the right place rather than in a summary at the top.
 *
 * Every input clears WCAG AA against the ink ground: paper text on ink,
 * paper-faint placeholders, and a gold focus rule that is the same accent
 * used everywhere else on the page.
 *
 * Errors are the one place gold is not used. Nobody reads gold as "something
 * went wrong", so validation messages get the alert token instead, and the
 * field they belong to takes a matching border. That token exists for this
 * purpose only and appears nowhere else on the site.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

type Status = "idle" | "sending" | "sent" | "failed";
type Errors = Partial<Record<"name" | "email" | "shootType" | "message", string>>;

const field =
  "w-full border bg-transparent px-4 py-3.5 text-[0.9375rem] text-paper " +
  "placeholder:text-paper-faint transition-colors duration-200 " +
  "hover:border-paper/30 focus:border-gold focus:outline-none " +
  /* aria-invalid drives the colour, so the border and the screen-reader state
     can never disagree about whether a field is in error. */
  "border-rule aria-invalid:border-alert";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setErrors({});

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 422) {
        const data = (await response.json()) as { errors?: Errors };
        setErrors(data.errors ?? {});
        setStatus("idle");
        /* Move the user to the first thing that needs fixing. */
        const first = Object.keys(data.errors ?? {})[0];
        if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        return;
      }

      if (!response.ok) throw new Error("request failed");

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <section id="contact" className="border-t border-rule-soft py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Reveal>
          <h2 className="max-w-[16ch] font-display text-[2.4rem] leading-[1.08] tracking-[-0.015em] text-paper sm:text-[3.25rem] lg:text-[4rem]">
            Let&rsquo;s plan your session.
          </h2>
          <p className="mt-5 max-w-[50ch] text-[0.9375rem] leading-relaxed text-paper-dim">
            Tell me a little about what you have in mind, and I will follow up within
            two business days.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-7" delay={0.06}>
            {status === "sent" ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="border border-rule px-7 py-14"
                role="status"
              >
                <p className="font-display text-[1.75rem] leading-tight text-paper">
                  Message received.
                </p>
                <p className="mt-4 max-w-[44ch] text-[0.9375rem] leading-relaxed text-paper-dim">
                  I personally review every inquiry and will respond within two business
                  days. For time-sensitive requests, please call directly.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="motion-safe-transform mt-8 text-[0.75rem] uppercase tracking-[0.2em] text-gold duration-[140ms] active:scale-[0.98]"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-6">
                {/* Honeypot, hidden from people and from assistive tech. */}
                <div aria-hidden className="hidden">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Field
                    id="name"
                    label="Name"
                    error={errors.name}
                    placeholder="Ellery Nakamura"
                    autoComplete="name"
                  />
                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    error={errors.email}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label
                      htmlFor="shootType"
                      className="text-[0.6875rem] uppercase tracking-[0.24em] text-paper-dim"
                    >
                      Session type
                    </label>
                    <select
                      id="shootType"
                      name="shootType"
                      defaultValue=""
                      aria-invalid={Boolean(errors.shootType)}
                      aria-describedby={errors.shootType ? "shootType-error" : undefined}
                      className={`${field} appearance-none`}
                    >
                      <option value="" disabled>
                        Choose one
                      </option>
                      {shootTypes.map((type) => (
                        <option key={type} value={type} className="bg-ink text-paper">
                          {type}
                        </option>
                      ))}
                    </select>
                    <FieldError id="shootType-error" message={errors.shootType} />
                  </div>

                  <div className="grid gap-2">
                    <label
                      htmlFor="date"
                      className="text-[0.6875rem] uppercase tracking-[0.24em] text-paper-dim"
                    >
                      Date
                      <span className="ml-2 normal-case tracking-normal text-paper-faint">
                        optional
                      </span>
                    </label>
                    <input id="date" name="date" type="date" className={field} />
                    <p className="text-xs text-paper-faint">
                      An approximate date is fine if your plans are not yet confirmed.
                    </p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="message"
                    className="text-[0.6875rem] uppercase tracking-[0.24em] text-paper-dim"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    placeholder="Tell me about your vision, location, and preferred date."
                    className={`${field} resize-y`}
                  />
                  <FieldError id="message-error" message={errors.message} />
                </div>

                {status === "failed" ? (
                  <p role="alert" className="border border-alert/50 px-4 py-3 text-sm text-paper">
                    Something went wrong and your message was not sent. Please try again,
                    or email me directly at{" "}
                    <a href={`mailto:${site.email}`} className="text-alert underline underline-offset-4">
                      {site.email}
                    </a>
                    .
                  </p>
                ) : null}

                <div className="pt-2">
                  <CTAButton type="submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending" : "Send inquiry"}
                  </CTAButton>
                </div>
              </form>
            )}
          </Reveal>

          <Reveal className="lg:col-span-5" delay={0.12}>
            <dl className="space-y-9">
              <div>
                <dt className="text-[0.6875rem] uppercase tracking-[0.24em] text-paper-faint">
                  Email
                </dt>
                <dd className="mt-2.5">
                  <a
                    href={`mailto:${site.email}`}
                    className="font-display text-[1.5rem] text-paper transition-colors duration-200 hover:text-gold sm:text-[1.75rem]"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-[0.6875rem] uppercase tracking-[0.24em] text-paper-faint">
                  Phone
                </dt>
                <dd className="mt-2.5">
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="font-display text-[1.5rem] text-paper transition-colors duration-200 hover:text-gold sm:text-[1.75rem]"
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>

              <div>
                <dt className="text-[0.6875rem] uppercase tracking-[0.24em] text-paper-faint">
                  Instagram
                </dt>
                <dd className="mt-2.5">
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2.5 font-display text-[1.5rem] text-paper transition-colors duration-200 hover:text-gold sm:text-[1.75rem]"
                  >
                    <InstagramLogoIcon size={22} weight="light" />
                    {site.instagramHandle}
                  </a>
                </dd>
              </div>

              {/* The one gold mark in this section: it separates how to reach
                  him from where he works, and keeps the closing panel from
                  going entirely monochrome. */}
              <div className="border-t border-rule-gold pt-9">
                <dt className="text-[0.6875rem] uppercase tracking-[0.24em] text-paper-faint">
                  Service area
                </dt>
                <dd className="mt-2.5 max-w-[34ch] text-[0.9375rem] leading-relaxed text-paper-dim">
                  {site.serviceArea}.
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  type = "text",
  ...props
}: {
  id: "name" | "email";
  label: string;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div className="grid gap-2">
      <label
        htmlFor={id}
        className="text-[0.6875rem] uppercase tracking-[0.24em] text-paper-dim"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={field}
        {...props}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs leading-relaxed text-alert">
      {message}
    </p>
  );
}
