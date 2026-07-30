# Elish Modi Photography

Portfolio site. Next.js App Router, TypeScript, Tailwind v4, Motion, deployed
on Vercel.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Handing this to the client

Three files cover almost everything anyone will want to change.

| To change | Edit |
| --- | --- |
| Name, city, email, phone, Instagram, service area, bio, testimonials, pricing notes | `src/lib/site.ts` |
| The six offerings, their prices and descriptions, and the whole photo manifest | `src/lib/work.ts` |
| The photographs themselves | `public/images/` (see `public/images/README.md`) |

The six offerings and their prices come from the client and are real:

| Offering | Price |
| --- | --- |
| Baby Photos | $120 CAD fixed |
| Child Photos | $60 CAD per guest |
| Family Photos | $60 CAD per guest |
| Individual Portraits | $120 CAD fixed |
| Vehicle Photography | $60 CAD fixed |
| Landscape Photos | $500 CAD fixed |

Prices live in the `offerings` array in `src/lib/work.ts`, next to the thing
being priced, so the offering cards and the portfolio categories cannot drift
apart. The descriptions beside them are placeholder.

**Every string in `src/lib/site.ts` is placeholder copy.** It is written in a
photographer's voice rather than lorem ipsum so the layout can be judged
honestly, but none of it is Elish's actual words, prices or clients. The
testimonials in particular are invented and must be replaced with real,
permissioned quotes before launch.

Five real photographs are in: Elish's own portrait in About, two baby frames,
one family frame and one landscape. Everything else in `public/images/` is
still a generated tonal placeholder. Regenerate the placeholder set with
`node scripts/generate-placeholders.mjs`.

`scripts/import-photos.mjs` shows how the real ones were brought in: resized to
2400px on the long edge, re-encoded with mozjpeg, and **stripped of EXIF**.
That last part matters for a family photographer. Camera and phone originals
routinely carry GPS coordinates, and publishing them can pin the location of a
client's home. Never copy an original straight into `public/`.

## Adding a photo

Drop the file in `public/images/work/<category>/`, then add one line to the
`photos` array in `src/lib/work.ts`. The filters, counts, grid rhythm and
lightbox all read from that array. Full instructions and the field meanings are
in `public/images/README.md`.

## Design decisions worth knowing before you edit

- **The theme is locked dark.** Not a missing light mode. Photography reads
  against a near-black ground, so no section inverts. Tokens are in
  `src/app/globals.css`.
- **Black, white, gold, and nothing else.** The accent is an antique champagne
  gold (`--color-gold`), deliberately not a saturated metallic yellow. It is
  rationed to small marks: eyebrows, prices, hairlines, active filters, focus
  rings, the secondary CTA outline, the lightbox counter. **Do not give it
  area.** The moment gold fills a panel it stops being an accent and becomes a
  colour scheme, which is the difference between expensive and costume.
- **`--color-alert` is not a second accent.** It is a functional state colour
  for form validation only. Gold cannot carry an error, because nobody reads
  gold as "something went wrong".
- **One radius.** Corners are square everywhere, with the single exception of
  the round lightbox controls.
- **Contrast is measured, not eyeballed.** Against the ink ground: paper 17.99,
  paper-dim 8.22, paper-faint 5.59, gold 8.79, alert 6.59. All clear WCAG AA
  for body text. If you change a token, re-check it before shipping.
- **Type over a photograph is measured against the brightest part of it,** not
  the average. The hero copy was averaging a comfortable 6:1 while the gold
  eyebrow was actually at 1.92:1 where it crossed sunlit stone. Averages are
  the wrong test. `--color-gold-bright` exists for exactly this case: same
  hue, higher luminance, for small type sitting on an image.

## The hero

`public/images/hero/hero.jpg` is generated, not uploaded. `scripts/grade-hero.mjs`
reads the full-colour master at `public/images/work/landscape/landscape-02.jpg`
and grades it to monochrome with a gold split-tone, a darkened sky and a
vignette. One master, two outputs, no chance of the two drifting.

To change the hero, point `SRC` in that script at the new photograph and re-run.
Expect to retune `TONE_FLOOR` and the gradient stops: the values are fitted to a
bright sky over grey stone and will not suit a frame with a different tonal
balance.

Then check the copy is still readable on it:

```bash
npm i -D playwright && npx playwright install chromium
npm run build && npm start        # in another terminal
node scripts/check-hero-contrast.mjs
```

It hides the hero copy, screenshots what is behind it, and measures each line
against the brightest 5% of its own background. It exits non-zero if anything
drops under 4.5:1. Do not swap the hero photograph without running it.

The hero is graded because it is the page's background, not a portfolio piece.
**Portfolio photographs are never colour-treated** — those are the work, and
they are shown as they were taken.
- **Type is Bodoni Moda over Geist.** The didone carries headlines and prices
  only. Body copy is never set in the serif.
- **Motion respects `prefers-reduced-motion`,** through `useSafeReducedMotion()`
  in `src/components/Reveal.tsx`. Use that hook, not Motion's `useReducedMotion`
  directly: the server has no media queries, so reading the preference during
  the first client render breaks hydration.
- **AVIF is deliberately disabled** in `next.config.ts`. The AVIF encoder was
  measured crushing a source averaging rgb(50,54,58) down to rgb(18,19,20),
  while WebP and JPEG returned it untouched. That is unacceptable on a site
  built around low-key photography. Re-measure before turning it back on.

## Wiring up the contact form

`src/app/api/inquiry/route.ts` validates submissions, rejects honeypot hits and
currently logs the result. It does not send mail yet. The header comment in that
file has a worked example using Resend; drop it in at the marked spot and set
`RESEND_API_KEY` and `INQUIRY_TO` in the Vercel project. Nothing on the client
needs to change.

## Before launch

- [ ] Replace the remaining placeholder images, above all `hero/hero.jpg`,
      which should be the single strongest frame in the book
- [ ] Fill out the thinner categories: child, portraits and vehicle have no
      real photographs yet
- [ ] Rewrite all copy in `src/lib/site.ts`, especially the testimonials, which
      are currently invented and need to be real, permissioned client quotes
- [ ] Rewrite the six `blurb` descriptions in `src/lib/work.ts` in Elish's words
- [ ] Confirm what each session includes, in `pricingNotes`
- [ ] Confirm the real city and service area
- [ ] Point `NEXT_PUBLIC_SITE_URL` at the production domain so OG tags resolve
- [ ] Wire the inquiry endpoint to a real mail transport
- [ ] Drop the real logo into `public/images/brand/` and swap the type wordmark
      in `src/components/Nav.tsx` and `src/components/Footer.tsx`
