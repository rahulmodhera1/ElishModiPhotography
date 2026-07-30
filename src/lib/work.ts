/**
 * Offerings, categories and the portfolio manifest.
 *
 * The six categories and their prices are the real ones. The descriptions and
 * the photographs are still placeholder and need replacing before launch.
 *
 * ADDING A PHOTO IS ONE LINE. Drop the file into
 * public/images/work/<category>/ and add an entry to `photos` below. Nothing
 * else in the codebase needs to change: the filter chips, the counts, the grid
 * rhythm and the lightbox all read from that array.
 */

export const categories = [
  /* `label` is the filter chip, kept short so seven chips still fit two lines
     on a phone. `title` is the full offering name used everywhere else. */
  { id: "baby", label: "Baby", title: "Baby Photos" },
  { id: "child", label: "Child", title: "Child Photos" },
  { id: "family", label: "Family", title: "Family Photos" },
  { id: "portraits", label: "Portraits", title: "Individual Portraits" },
  { id: "vehicle", label: "Vehicle", title: "Vehicle Photography" },
  { id: "landscape", label: "Landscape", title: "Landscape Photos" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];
export type Scale = "full" | "wide" | "tall" | "half";

/**
 * What each session costs.
 *
 * `unit` is the pricing model, not a marketing frame. Two of these are charged
 * per guest and four are flat, and the site says so plainly rather than
 * wrapping everything in "starting at".
 *
 * PLACEHOLDER: the `blurb` lines are written to fit, not dictated by Elish.
 * Prices are real.
 */
export const offerings = [
  {
    id: "baby" as const,
    title: "Baby Photos",
    price: 120,
    unit: "fixed" as const,
    blurb:
      "Newborn and first-year sessions, shot at your place in whatever light the room gives us.",
    image: "/images/offerings/baby.jpg",
    alt: "Placeholder: baby offering card, infant in soft window light",
  },
  {
    id: "child" as const,
    title: "Child Photos",
    price: 60,
    unit: "guest" as const,
    blurb: "Sessions that run at a child's pace rather than a schedule's.",
    image: "/images/offerings/child.jpg",
    alt: "Placeholder: child offering card, young child mid movement",
  },
  {
    id: "family" as const,
    title: "Family Photos",
    price: 60,
    unit: "guest" as const,
    blurb:
      "Everyone in one frame, plus the in-between moments that usually turn out better.",
    image: "/images/offerings/family.jpg",
    alt: "Placeholder: family offering card, group outdoors in late light",
  },
  {
    id: "portraits" as const,
    title: "Individual Portraits",
    price: 120,
    unit: "fixed" as const,
    blurb:
      "Headshots and personal portraits for people who would rather not perform.",
    image: "/images/offerings/portraits.jpg",
    alt: "Placeholder: portrait offering card, single subject three quarter turn",
  },
  {
    id: "vehicle" as const,
    title: "Vehicle Photography",
    price: 60,
    unit: "fixed" as const,
    blurb: "Your car shot properly. Clean lines, good light, frames worth printing.",
    image: "/images/offerings/vehicle.jpg",
    alt: "Placeholder: vehicle offering card, car in low evening sun",
  },
  {
    id: "landscape" as const,
    title: "Landscape Photos",
    price: 500,
    unit: "fixed" as const,
    blurb:
      "Commissioned landscape work, scouted and delivered print-ready at large format.",
    image: "/images/offerings/landscape.jpg",
    alt: "Placeholder: landscape offering card, wide view with strong horizon",
  },
];

/** "$120 CAD fixed price" or "$60 CAD per guest". One formatter, used everywhere. */
export function formatPrice(price: number, unit: "fixed" | "guest") {
  return `$${price} CAD ${unit === "guest" ? "per guest" : "fixed price"}`;
}

export type Photo = {
  src: string;
  category: CategoryId;
  /* Real descriptive alt text. Never the filename, never "photo". */
  alt: string;
  width: number;
  height: number;
  /**
   * Composition slot in the grid, not a crop:
   *   "full"  full-bleed row, the images that carry a page
   *   "wide"  two thirds of the row
   *   "half"  half a row
   *   "tall"  a third of the row, portrait crop
   * Mix them. A uniform column of one scale is what this grid exists to avoid.
   */
  scale: Scale;
};

export const photos: Photo[] = [
  {
    src: "/images/work/family/family-01.jpg",
    category: "family",
    alt: "Placeholder: family of four on a porch step, late afternoon light",
    width: 1800,
    height: 1200,
    scale: "wide",
  },
  {
    src: "/images/work/baby/baby-01.jpg",
    category: "baby",
    alt: "Placeholder: newborn asleep on a knitted blanket, overhead frame",
    width: 1200,
    height: 1500,
    scale: "tall",
  },
  {
    src: "/images/work/landscape/landscape-01.jpg",
    category: "landscape",
    alt: "Placeholder: wide valley at first light, low mist along the treeline",
    width: 2000,
    height: 1125,
    scale: "full",
  },
  {
    src: "/images/work/portraits/portraits-01.jpg",
    category: "portraits",
    alt: "Placeholder: close portrait, three quarter turn, shallow depth of field",
    width: 1200,
    height: 1500,
    scale: "half",
  },
  {
    src: "/images/work/child/child-01.jpg",
    category: "child",
    alt: "Placeholder: child running through a doorway, caught mid stride",
    width: 1800,
    height: 1200,
    scale: "half",
  },
  {
    src: "/images/work/vehicle/vehicle-01.jpg",
    category: "vehicle",
    alt: "Placeholder: sports car in profile against a concrete wall",
    width: 1800,
    height: 1200,
    scale: "wide",
  },
  {
    src: "/images/work/baby/baby-02.jpg",
    category: "baby",
    alt: "Placeholder: parent's hands holding a newborn's feet, close crop",
    width: 1200,
    height: 1200,
    scale: "tall",
  },
  {
    src: "/images/work/family/family-02.jpg",
    category: "family",
    alt: "Placeholder: family walking away from camera along a shoreline",
    width: 1800,
    height: 1200,
    scale: "half",
  },
  {
    src: "/images/work/portraits/portraits-02.jpg",
    category: "portraits",
    alt: "Placeholder: studio portrait on a grey ground, single hard key light",
    width: 1200,
    height: 1500,
    scale: "half",
  },
  {
    src: "/images/work/vehicle/vehicle-02.jpg",
    category: "vehicle",
    alt: "Placeholder: detail of a car's front wheel and badge at golden hour",
    width: 1800,
    height: 1200,
    scale: "full",
  },
  {
    src: "/images/work/child/child-02.jpg",
    category: "child",
    alt: "Placeholder: child at a kitchen table, side light from a window",
    width: 1200,
    height: 1500,
    scale: "tall",
  },
  {
    src: "/images/work/landscape/landscape-02.jpg",
    category: "landscape",
    alt: "Placeholder: lone building against open sky, long lens compression",
    width: 1800,
    height: 1200,
    scale: "wide",
  },
  {
    src: "/images/work/family/family-03.jpg",
    category: "family",
    alt: "Placeholder: three generations seated together, available light",
    width: 1200,
    height: 1500,
    scale: "half",
  },
  {
    src: "/images/work/portraits/portraits-03.jpg",
    category: "portraits",
    alt: "Placeholder: environmental portrait at a work bench, mid conversation",
    width: 1800,
    height: 1200,
    scale: "half",
  },
  {
    src: "/images/work/baby/baby-03.jpg",
    category: "baby",
    alt: "Placeholder: baby held over a parent's shoulder, backlit doorway",
    width: 1200,
    height: 1500,
    scale: "tall",
  },
  {
    src: "/images/work/child/child-03.jpg",
    category: "child",
    alt: "Placeholder: two children on a couch, one laughing off frame",
    width: 1800,
    height: 1200,
    scale: "wide",
  },
  {
    src: "/images/work/landscape/landscape-03.jpg",
    category: "landscape",
    alt: "Placeholder: coastline from height, long exposure on the water",
    width: 2000,
    height: 1125,
    scale: "full",
  },
  {
    src: "/images/work/vehicle/vehicle-03.jpg",
    category: "vehicle",
    alt: "Placeholder: car interior, dashboard detail in low evening light",
    width: 1200,
    height: 1200,
    scale: "half",
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
