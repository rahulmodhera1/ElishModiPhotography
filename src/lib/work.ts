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
      "Newborn and first-year sessions photographed in the comfort of your own home, using soft, natural light.",
    image: "/images/offerings/baby.jpg",
    alt: "A baby wrapped in a pink blanket, looking straight up at the camera",
  },
  {
    id: "child" as const,
    title: "Child Photos",
    price: 60,
    unit: "guest" as const,
    blurb: "Relaxed, unscripted sessions that capture genuine expressions at your child's own pace.",
    image: "/images/offerings/child.jpg",
    alt: "Placeholder: child offering card, young child mid movement",
  },
  {
    id: "family" as const,
    title: "Family Photos",
    price: 60,
    unit: "guest" as const,
    blurb:
      "Timeless family portraits that capture both posed moments and the connection between them.",
    image: "/images/offerings/family.jpg",
    alt: "A father carrying his daughter in a chest carrier on a clifftop path",
  },
  {
    id: "portraits" as const,
    title: "Individual Portraits",
    price: 120,
    unit: "fixed" as const,
    blurb:
      "Professional headshots and personal portraits designed to look natural, polished, and true to you.",
    image: "/images/offerings/portraits.jpg",
    alt: "Placeholder: portrait offering card, single subject three quarter turn",
  },
  {
    id: "vehicle" as const,
    title: "Vehicle Photography",
    price: 60,
    unit: "fixed" as const,
    blurb: "Automotive photography with clean composition and refined lighting, for images worth printing.",
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
    alt: "The lakeshore at sunset, town and water framed through a narrow gap",
  },
];

/** "$120 CAD fixed price" or "$60 CAD per guest". One formatter, used everywhere. */
export function formatPrice(price: number, unit: "fixed" | "guest") {
  return `$${price} CAD ${unit === "guest" ? "per guest" : "fixed price"}`;
}

/**
 * How the six offerings split across the two pricing tabs.
 *
 * The split is people versus objects and places, which is the one grouping
 * that is true of the work itself rather than invented to fill a second tab:
 * a baby session and a portrait session are the same kind of booking in a way
 * neither is like a car or a landscape commission.
 */
export const pricingGroups = [
  { id: "people" as const, label: "Portraits & Family", categories: ["baby", "child", "family", "portraits"] },
  { id: "places" as const, label: "Vehicle & Landscape", categories: ["vehicle", "landscape"] },
] satisfies { id: string; label: string; categories: CategoryId[] }[];

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
  /*
    The first real frames. All four are 3:2 out of the camera, so they sit in
    slots that crop them gently: "half" is 3:2 exactly, "wide" trims a little,
    "full" letterboxes. None of them go in a "tall" slot, which would cut a
    landscape frame down to 4:5 and lose half the composition.
  */
  {
    src: "/images/work/family/family-01.jpg",
    category: "family",
    alt: "A father carrying his daughter in a chest carrier on a clifftop path, both squinting into low sun",
    width: 2400,
    height: 1600,
    scale: "half",
  },
  {
    src: "/images/work/baby/baby-01.jpg",
    category: "baby",
    alt: "A newborn's curled hand held sharp in the foreground, her face soft behind it",
    width: 2400,
    height: 1600,
    scale: "half",
  },
  {
    src: "/images/work/landscape/landscape-01.jpg",
    category: "landscape",
    alt: "The lakeshore at sunset, the town and the water framed through a narrow gap",
    width: 2400,
    height: 1600,
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
    scale: "tall",
  },
  {
    src: "/images/work/baby/baby-02.jpg",
    category: "baby",
    alt: "A baby wrapped in a pink blanket, looking straight up at the camera",
    width: 2400,
    height: 1600,
    scale: "wide",
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
    alt: "A castle at the end of a formal garden path, framed by trees on both sides",
    width: 2400,
    height: 1600,
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
    src: "/images/work/landscape/landscape-04.jpg",
    category: "landscape",
    alt: "An aerial view of a small boat carving a wake toward an anchored sailboat on open water",
    width: 2400,
    height: 1600,
    scale: "wide",
    /* Also the master for the hero. scripts/grade-hero.mjs reads this file and
       writes the graded monochrome version to public/images/hero/hero.jpg. */
  },
  {
    src: "/images/work/vehicle/vehicle-03.jpg",
    category: "vehicle",
    alt: "Placeholder: car interior, dashboard detail in low evening light",
    width: 1200,
    height: 1200,
    /* Full width so the unfiltered grid ends on a complete row rather than a
       lone third-width tile. */
    scale: "full",
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
