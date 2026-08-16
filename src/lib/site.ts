/**
 * Single source of truth for everything the client will want to change.
 *
 * The introduction and the reviews below are Elish's own copy and real client
 * quotes. What is still placeholder is marked as such inline: the contact
 * details, the city and service area, and the pricing notes. Nothing in the
 * components hardcodes copy, so editing this file edits the site.
 */

export const site = {
  name: "Elish Modi",
  wordmark: "Elish Modi",
  /* PLACEHOLDER: swap for the real base city and service radius. Prices are
     quoted in CAD throughout, so the base is assumed to be Canada. */
  city: "Toronto",
  serviceArea: "Toronto and the GTA, with availability across Ontario and for travel",
  discipline: "Portrait & Family Photographer",

  /* PLACEHOLDER contact details. Replace all three before the site goes live. */
  email: "hello@elishmodi.com",
  phone: "+1 (416) 837-2194",
  phoneHref: "+14168372194",
  instagram: "https://instagram.com/elishmodi",
  instagramHandle: "@elishmodi",

  /* One label per intent. "Inquire" is the contact CTA everywhere on the page. */
  cta: {
    contact: "Inquire",
    work: "View Work",
  },
} as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
] as const;

/**
 * Elish's introduction, in his own words. The closing line of what he sent is
 * set as the pull quote rather than a fourth paragraph, so the section ends on
 * it and nothing here is written for him.
 */
export const about = {
  heading: "Introduction.",
  body: [
    "Hi, I'm Elish. Welcome to my page! I am a versatile photographer specializing in capturing meaningful, high-quality imagery across a range of subjects, including babies, children, families, individual portraits, couples, products, and landscapes.",
    "My work is rooted in a natural, timeless style that emphasizes authentic emotion, thoughtful composition, and attention to detail.",
    "From preserving the earliest moments of a baby's life to creating confident individual portraits, warm family memories, polished product imagery, and inspiring landscape visuals, I approach each session with creativity, care, and professionalism.",
  ],
  pullQuote:
    "My goal is to deliver images that feel genuine, visually compelling, and lasting—whether for personal memories, branding, or storytelling.",
  specialties: [
    "Babies",
    "Children",
    "Families",
    "Portraits",
    "Couples",
    "Vehicles",
    "Landscapes",
  ],
} as const;

/**
 * Real, permissioned client reviews, quoted as they were given. `date` is when
 * the session happened and is shown with the attribution, so a short quote
 * still carries its context.
 *
 * Add new ones the same way: quote verbatim, name as the client signed it.
 */
export const testimonials = [
  {
    quote: "Elish did a great job capturing photos of us at our baby shower!",
    name: "Pooja & Jay",
    role: "Baby shower",
    date: "May 2024",
  },
  {
    quote:
      "We wanted a candid photoshoot of our date in Kingston, ON and Elish captured high quality photos we can look back on.",
    name: "Pearly & Shikhar",
    role: "Couples session, Kingston ON",
    date: "July 2023",
  },
] as const;

/**
 * The per-session prices live with the offerings in src/lib/work.ts, next to
 * the thing being priced, so there is one place to edit and no chance of the
 * two lists drifting apart.
 *
 * These are the notes that sit under them. PLACEHOLDER: confirm what is
 * actually included and what travel costs before launch.
 */
export const pricingNotes = {
  heading: "Session investment.",
  body: "Every session includes a personal consultation, a professionally edited gallery, and high-resolution files ready for both print and web. Per-guest pricing includes everyone being photographed. Travel outside the GTA and rush delivery are quoted individually before booking.",
} as const;

/* Mirrors the offerings, plus product photography, which is announced but not
   yet priced, and an escape hatch for anything unlisted. Someone asking about
   product work is exactly who the "coming soon" panel is written for, so the
   form has to be able to take that inquiry. */
export const shootTypes = [
  "Baby photos",
  "Child photos",
  "Family photos",
  "Individual portraits",
  "Couples portraits",
  "Vehicle photography",
  "Landscape photos",
  "Product photography (coming soon)",
  "Something else",
] as const;
