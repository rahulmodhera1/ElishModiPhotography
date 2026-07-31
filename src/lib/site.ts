/**
 * Single source of truth for everything the client will want to change.
 *
 * PLACEHOLDER COPY: every string below is written in a photographer's voice
 * but none of it is Elish's actual words. Swap it before launch. Nothing in
 * the components hardcodes copy, so editing this file edits the site.
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

/* PLACEHOLDER bio. First person, confident, professional. Rewrite in Elish's voice. */
export const about = {
  heading: "About Elish Modi.",
  body: [
    "I'm a Toronto-based portrait and family photographer dedicated to creating natural, refined imagery for clients across the GTA and beyond.",
    "My approach favors soft natural light and genuine expression over rigid posing. The result is a collection of images that feel authentic to who you are, not performed for the camera.",
    "Every session begins with a conversation about what matters most to you, and ends with a carefully edited gallery designed to be treasured for years to come.",
    "Beyond portrait and family sessions, I also photograph vehicles and landscapes for clients seeking one exceptional print of something they love.",
  ],
  pullQuote:
    "A great portrait is never a pose you hold. It is the moment just after you let it go.",
  specialties: ["Babies", "Children", "Families", "Portraits", "Vehicles", "Landscapes"],
} as const;

/**
 * PLACEHOLDER testimonials. These are invented and must be replaced with real,
 * permissioned client quotes before launch.
 *
 * Keep them pointed at offerings that actually exist. A quote praising a shoot
 * that is not on the price list reads as borrowed copy.
 */
export const testimonials = [
  {
    quote:
      "He came when our daughter was nine days old and worked around her, not the other way round.",
    name: "Priya Raghunathan",
    role: "Baby session",
  },
  {
    quote:
      "Three generations and two toddlers in one afternoon. Nobody felt managed, and we still got the frame we wanted.",
    name: "Dan Okonkwo",
    role: "Family session",
  },
  {
    quote:
      "I have been photographed a lot and I usually hate it. This is the first portrait of me I actually use.",
    name: "Simone Vasquez",
    role: "Individual portrait",
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

/* Mirrors the six offerings, plus an escape hatch for anything unlisted. */
export const shootTypes = [
  "Baby photos",
  "Child photos",
  "Family photos",
  "Individual portraits",
  "Vehicle photography",
  "Landscape photos",
  "Something else",
] as const;
