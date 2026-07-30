/**
 * The portfolio manifest.
 *
 * ADDING A PHOTO IS ONE LINE. Drop the file into
 * public/images/work/<category>/ and add an entry below. Nothing else in the
 * codebase needs to change: the filter chips, the counts, the grid rhythm and
 * the lightbox all read from this array.
 *
 * `width` and `height` are the file's real pixel dimensions. They are required
 * so next/image can reserve the box before the bytes land, which is what keeps
 * cumulative layout shift at zero.
 *
 * `scale` drives the editorial grid. It is a composition choice, not a crop:
 *   "full"   full-bleed row, the images that carry a page
 *   "wide"   two thirds of the row
 *   "tall"   a third of the row, portrait crop
 *   "half"   half a row
 * Mix them. A uniform column of one scale is the thing this grid exists to avoid.
 */

export const categories = [
  { id: "portrait", label: "Portrait" },
  { id: "editorial", label: "Editorial" },
  { id: "weddings", label: "Weddings" },
  { id: "commercial", label: "Commercial" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];
export type Scale = "full" | "wide" | "tall" | "half";

export type Photo = {
  src: string;
  category: CategoryId;
  /* Real descriptive alt text. Never the filename, never "photo". */
  alt: string;
  width: number;
  height: number;
  scale: Scale;
};

export const photos: Photo[] = [
  {
    src: "/images/work/editorial/editorial-01.jpg",
    category: "editorial",
    alt: "Placeholder: editorial spread, subject seated against a window in hard afternoon light",
    width: 1800,
    height: 1200,
    scale: "wide",
  },
  {
    src: "/images/work/portrait/portrait-01.jpg",
    category: "portrait",
    alt: "Placeholder: close portrait, three quarter turn, shallow depth of field",
    width: 1200,
    height: 1500,
    scale: "tall",
  },
  {
    src: "/images/work/weddings/weddings-04.jpg",
    category: "weddings",
    alt: "Placeholder: wide reception frame taken from the back of the room",
    width: 2000,
    height: 1125,
    scale: "full",
  },
  {
    src: "/images/work/portrait/portrait-02.jpg",
    category: "portrait",
    alt: "Placeholder: environmental portrait in a workshop, subject mid conversation",
    width: 1800,
    height: 1200,
    scale: "half",
  },
  {
    src: "/images/work/commercial/commercial-01.jpg",
    category: "commercial",
    alt: "Placeholder: product still life on a raw plaster surface",
    width: 1200,
    height: 1500,
    scale: "half",
  },
  {
    src: "/images/work/editorial/editorial-02.jpg",
    category: "editorial",
    alt: "Placeholder: fashion editorial, full length figure against a painted backdrop",
    width: 1200,
    height: 1600,
    scale: "tall",
  },
  {
    src: "/images/work/weddings/weddings-01.jpg",
    category: "weddings",
    alt: "Placeholder: couple leaving the ceremony, backlit through a doorway",
    width: 1800,
    height: 1200,
    scale: "wide",
  },
  {
    src: "/images/work/commercial/commercial-02.jpg",
    category: "commercial",
    alt: "Placeholder: brand campaign frame, model holding the product at eye level",
    width: 1800,
    height: 1200,
    scale: "wide",
  },
  {
    src: "/images/work/portrait/portrait-03.jpg",
    category: "portrait",
    alt: "Placeholder: studio portrait on grey seamless, single hard key light",
    width: 1200,
    height: 1500,
    scale: "tall",
  },
  {
    src: "/images/work/editorial/editorial-03.jpg",
    category: "editorial",
    alt: "Placeholder: reportage frame from a magazine assignment, subject walking",
    width: 1800,
    height: 1200,
    scale: "half",
  },
  {
    src: "/images/work/weddings/weddings-02.jpg",
    category: "weddings",
    alt: "Placeholder: detail of hands and rings, natural light",
    width: 1200,
    height: 1500,
    scale: "half",
  },
  {
    src: "/images/work/commercial/commercial-04.jpg",
    category: "commercial",
    alt: "Placeholder: interiors frame shot for a hospitality client",
    width: 1800,
    height: 1200,
    scale: "full",
  },
  {
    src: "/images/work/portrait/portrait-04.jpg",
    category: "portrait",
    alt: "Placeholder: square crop portrait, subject looking off frame",
    width: 1200,
    height: 1200,
    scale: "half",
  },
  {
    src: "/images/work/editorial/editorial-04.jpg",
    category: "editorial",
    alt: "Placeholder: beauty editorial, tight crop on the eyes",
    width: 1200,
    height: 1500,
    scale: "half",
  },
  {
    src: "/images/work/weddings/weddings-03.jpg",
    category: "weddings",
    alt: "Placeholder: first dance, dragged shutter with flash",
    width: 1200,
    height: 1500,
    scale: "tall",
  },
  {
    src: "/images/work/commercial/commercial-03.jpg",
    category: "commercial",
    alt: "Placeholder: square packaging shot on a seamless background",
    width: 1200,
    height: 1200,
    scale: "wide",
  },
];

/**
 * The specialty cards. Each one deep links into the portfolio with its filter
 * already applied, which is why the grid reads the category out of the URL hash.
 */
export const specialties = [
  {
    id: "portrait" as const,
    title: "Portrait",
    blurb: "Sessions for people who do not love being photographed.",
    image: "/images/specialties/portrait.jpg",
    alt: "Placeholder: portrait specialty card, subject in soft window light",
  },
  {
    id: "editorial" as const,
    title: "Editorial",
    blurb: "Assignment and profile work for magazines and brands.",
    image: "/images/specialties/editorial.jpg",
    alt: "Placeholder: editorial specialty card, styled figure on location",
  },
  {
    id: "weddings" as const,
    title: "Weddings",
    blurb: "Full day coverage, documentary first, quietly directed.",
    image: "/images/specialties/weddings.jpg",
    alt: "Placeholder: wedding specialty card, couple in late evening light",
  },
  {
    id: "commercial" as const,
    title: "Commercial",
    blurb: "Campaign, product and interiors work with licensing sorted up front.",
    image: "/images/specialties/commercial.jpg",
    alt: "Placeholder: commercial specialty card, product on a textured surface",
  },
];

/** Tailwind column spans per scale. Mobile is always a single column. */
export const scaleClass: Record<Scale, string> = {
  full: "sm:col-span-6",
  wide: "sm:col-span-4",
  tall: "sm:col-span-2",
  half: "sm:col-span-3",
};

/** Aspect ratio the tile is cropped to, so the grid keeps an editorial rhythm. */
export const scaleAspect: Record<Scale, string> = {
  full: "aspect-[16/7]",
  wide: "aspect-[4/3]",
  tall: "aspect-[4/5]",
  half: "aspect-[3/2]",
};

/** Sizes attribute per scale, so the browser never downloads more than it paints. */
export const scaleSizes: Record<Scale, string> = {
  full: "(max-width: 640px) 100vw, 1400px",
  wide: "(max-width: 640px) 100vw, 930px",
  tall: "(max-width: 640px) 100vw, 470px",
  half: "(max-width: 640px) 100vw, 700px",
};
