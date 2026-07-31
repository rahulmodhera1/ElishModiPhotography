/**
 * Measures whether the hero copy clears the subject of the hero photograph.
 *
 * Why this exists: the hero has two independent things sizing themselves
 * against the viewport, the photograph's crop and the copy block's height,
 * and they are laid out by completely different rules. object-cover crops
 * against the viewport's aspect ratio; the copy stack is type, sized in rem
 * and vh. There is no CSS relationship between them, so "the text sits below
 * the boats" holds at the window you happened to look at and quietly breaks
 * at the next one. It broke twice: first on a short laptop window, then on a
 * wide short one, both times invisible in a 1440x900 screenshot.
 *
 * So this computes, per viewport, where the photograph's subject band ends
 * on screen and where the copy begins, and reports the gap.
 *
 * The subject band is not hardcoded, it is measured off the graded file:
 * the boats and the wake are the only things in this frame bright enough to
 * clear the highlight threshold, so the lowest row that still holds a real
 * cluster of highlights is the bottom of the subject. That means re-cropping
 * the hero in scripts/grade-hero.mjs cannot leave a stale constant behind
 * here, which is a mistake already made once by hand.
 *
 * Run it after changing the hero image, its crop, the copy, or any of the
 * type sizes in Hero.tsx.
 *
 * Requires a browser and Playwright, which are dev-only and not project
 * dependencies:
 *
 *   npm i -D playwright && npx playwright install chromium
 *   npm run build && npm start          # in another terminal
 *   node scripts/check-hero-clearance.mjs
 */
import { join } from "node:path";
import sharp from "sharp";

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error(
    "playwright is not installed. Run: npm i -D playwright && npx playwright install chromium",
  );
  process.exit(1);
}

const URL = process.env.SITE_URL ?? "http://localhost:3000";
const HERO = join(process.cwd(), "public/images/hero/hero.jpg");

/* Minimum acceptable gap. Not zero: the subject band is measured off
   highlights, and a hull's dark underside extends a little below its bright
   deck, so a few pixels of slack is not real clearance. */
const MIN_GAP = 10;

/* Highlight threshold and the run length that counts as "a subject rather
   than a glint", both in the graded file's own 0-255 greyscale. */
const BRIGHT = 185;
const MIN_RUN = 40;

/**
 * Lowest normalised y still holding a cluster of highlights, optionally
 * within the left `widthFraction` of the frame.
 */
async function subjectBottom(widthFraction = 1) {
  const { data, info } = await sharp(HERO)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const limit = Math.round(info.width * widthFraction);
  const run = Math.round(MIN_RUN * widthFraction);
  let lowest = 0;

  for (let y = 0; y < info.height; y++) {
    let n = 0;
    for (let x = 0; x < limit; x++) if (data[y * info.width + x] > BRIGHT) n++;
    if (n > run) lowest = y;
  }
  return lowest / info.height;
}

/*
  Deliberately includes short and wide shapes. A "desktop" and a "mobile"
  preset are both tall enough to hide the failure this script exists to
  catch; 1280x620 and 1440x758 are the ones that actually bite.
*/
const WIDE = await subjectBottom();
/* The narrow crop anchors left and leaves the sailboat off-frame, so on a
   phone the lowest subject is the runabout, not the hull. */
const NARROW = await subjectBottom(0.42);

const VIEWPORTS = [
  ["desktop", 1440, 900, WIDE],
  ["mobile", 390, 844, NARROW],
  ["mobile-large", 430, 932, NARROW],
  ["laptop-short", 1440, 758, WIDE],
  ["laptop-zoomed", 1280, 620, WIDE],
  ["wide", 1920, 940, WIDE],
  ["ultrawide", 2560, 1080, WIDE],
  ["tablet", 820, 1180, WIDE],
];

console.log(
  `subject band ends at ${WIDE.toFixed(3)} of the frame (${NARROW.toFixed(3)} in the phone crop)\n`,
);

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
let failed = false;

for (const [name, width, height, subject] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);

  const gap = await page.evaluate((s) => {
    const img = document.querySelector("#top img");
    const box = img.getBoundingClientRect();

    /* Replicate object-cover plus object-position to find where a normalised
       image y lands inside the box. */
    const posY = (() => {
      const v = getComputedStyle(img).objectPosition.split(" ")[1];
      return v.endsWith("%") ? parseFloat(v) / 100 : 0.5;
    })();
    const scale = Math.max(box.width / img.naturalWidth, box.height / img.naturalHeight);
    const shown = img.naturalHeight * scale;
    const yInBox = -(shown - box.height) * posY + s * shown;

    /* Then the parallax scale, which is on the wrapper and about its centre. */
    const k = new DOMMatrixReadOnly(
      getComputedStyle(img.closest("div")).transform,
    ).a || 1;
    const mid = box.height / 2;
    const subjectY = box.top + mid + (yInBox - mid) * k;

    return document.querySelector("#top .eyebrow").getBoundingClientRect().top - subjectY;
  }, subject);

  const ok = gap >= MIN_GAP;
  if (!ok) failed = true;
  console.log(
    `${name.padEnd(13)} gap ${Math.round(gap).toString().padStart(5)}px  ${ok ? "clear" : "TOO TIGHT"}`,
  );
  await page.close();
}

await browser.close();

if (failed) {
  console.error(`\nThe hero copy comes within ${MIN_GAP}px of the boats at one or more sizes.`);
  console.error("Fix by cropping more off the top in scripts/grade-hero.mjs, or by giving the");
  console.error("copy block back more height on short windows in Hero.tsx.");
  process.exit(1);
}
console.log(`\nHero copy clears the subject by at least ${MIN_GAP}px at every size.`);
