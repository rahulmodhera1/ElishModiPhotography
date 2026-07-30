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
- **One accent, one radius.** The accent is a darkroom amber (`--color-safelight`)
  used for focus rings, active filters and hairlines. Corners are square
  everywhere, with the single exception of the round lightbox controls.
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
