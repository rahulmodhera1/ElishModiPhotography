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
  /* PLACEHOLDER: swap for the real base city and service radius. */
  city: "Toronto",
  serviceArea: "Toronto and the GTA, available across Ontario and for travel",
  discipline: "Portrait & Editorial Photographer",

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

/* PLACEHOLDER bio. First person, warm, unhurried. Rewrite in Elish's voice. */
export const about = {
  heading: "I photograph people the way they actually are.",
  body: [
    "I started shooting on a borrowed film body in my last year of school and never really put it down. Fourteen years later I still work slowly, still shoot a roll or two alongside the digital, and still think the best frame usually arrives after the one everybody expected.",
    "Sessions run unhurried on purpose. We talk first, we walk, and somewhere in there you forget the camera is out. That is the frame I am waiting for.",
  ],
  pullQuote:
    "A portrait is not a pose you hold. It is the half second right after you stop holding it.",
  specialties: ["Portrait", "Editorial", "Weddings", "Commercial", "35mm film"],
} as const;

/* PLACEHOLDER testimonials. Replace with real, permissioned client quotes. */
export const testimonials = [
  {
    quote:
      "We booked a founder profile and got something closer to a character study.",
    name: "Priya Raghunathan",
    role: "Head of Brand, Marlowe & Fen",
  },
  {
    quote:
      "He shot our wedding like a guest who happened to be brilliant. Nobody felt watched.",
    name: "Dan Okonkwo",
    role: "Married in Prince Edward County",
  },
  {
    quote:
      "I have been photographed a lot and I usually hate it. This was the first set I did not want to cut.",
    name: "Simone Vasquez",
    role: "Stage actor",
  },
] as const;

/* PLACEHOLDER pricing. Confirm real numbers with the client before launch. */
export const packages = [
  {
    name: "Portrait Session",
    from: "$650",
    duration: "90 minutes, one location",
    includes: [
      "Pre-shoot call to plan looks and light",
      "25 finished frames, hand graded",
      "Web and print files, delivered in ten days",
    ],
  },
  {
    name: "Editorial & Brand",
    from: "$1,900",
    duration: "Half or full day, crew as needed",
    includes: [
      "Treatment, shot list and location scout",
      "Full licensed gallery, usage agreed up front",
      "Retouching on selects, rush delivery available",
    ],
    featured: true,
  },
  {
    name: "Wedding Coverage",
    from: "$3,400",
    duration: "Eight hours, second shooter included",
    includes: [
      "Engagement session in the lead up",
      "Roughly 600 finished frames plus a film set",
      "Print-ready archive and an album credit",
    ],
  },
] as const;

export const shootTypes = [
  "Portrait",
  "Editorial or brand",
  "Wedding",
  "Commercial",
  "Not sure yet",
] as const;
