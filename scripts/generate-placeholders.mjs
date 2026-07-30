/**
 * Generates the neutral placeholder JPGs that ship in /public/images.
 *
 * These exist so the layout has real files at real aspect ratios (no layout
 * shift, no broken <img> during development). They are NOT photography and
 * they are not meant to survive launch: replace each file in place, keeping
 * the filename and roughly the aspect ratio, and the site picks it up.
 *
 * Run with:  node scripts/generate-placeholders.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

const ROOT = join(process.cwd(), "public", "images");

/**
 * A lit field with an off-centre fall-off, so each tile carries the tonal mass
 * a photograph would. These sit meaningfully brighter than the page ground:
 * a placeholder that matches the background makes the layout look empty rather
 * than unfinished, and hides real spacing problems during review.
 */
function panel(w, h, label, seed) {
  const cx = 28 + ((seed * 37) % 46);
  const cy = 22 + ((seed * 53) % 52);
  const tone = seed % 3;
  const hi = tone === 0 ? "#6f6257" : tone === 1 ? "#5d646b" : "#6b6459";
  const mid = tone === 0 ? "#3a332e" : tone === 1 ? "#2f3438" : "#38342d";
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>
      <radialGradient id="g" cx="${cx}%" cy="${cy}%" r="82%">
        <stop offset="0%" stop-color="${hi}"/>
        <stop offset="48%" stop-color="${mid}"/>
        <stop offset="100%" stop-color="#17171a"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
          font-family="Helvetica, Arial, sans-serif" font-size="${Math.max(12, Math.round(Math.min(w, h) / 32))}"
          letter-spacing="${Math.max(2, Math.round(Math.min(w, h) / 130))}"
          fill="#efede8b0">${label.toUpperCase()}</text>
  </svg>`);
}

/**
 * [relative path, width, height, label]
 *
 * Dimensions here must match the width/height recorded in src/lib/work.ts, or
 * the reserved box will not match the file and the page will shift on load.
 */
const FILES = [
  ["hero/hero.jpg", 2400, 1600, "hero image"],
  ["about/portrait.jpg", 1400, 1750, "photographer portrait"],
  ["og/og-image.jpg", 1200, 630, "social share"],

  ["work/baby/baby-01.jpg", 1200, 1500, "baby 01"],
  ["work/baby/baby-02.jpg", 1200, 1200, "baby 02"],
  ["work/baby/baby-03.jpg", 1200, 1500, "baby 03"],

  ["work/child/child-01.jpg", 1800, 1200, "child 01"],
  ["work/child/child-02.jpg", 1200, 1500, "child 02"],
  ["work/child/child-03.jpg", 1800, 1200, "child 03"],

  ["work/family/family-01.jpg", 1800, 1200, "family 01"],
  ["work/family/family-02.jpg", 1800, 1200, "family 02"],
  ["work/family/family-03.jpg", 1200, 1500, "family 03"],

  ["work/portraits/portraits-01.jpg", 1200, 1500, "portraits 01"],
  ["work/portraits/portraits-02.jpg", 1200, 1500, "portraits 02"],
  ["work/portraits/portraits-03.jpg", 1800, 1200, "portraits 03"],

  ["work/vehicle/vehicle-01.jpg", 1800, 1200, "vehicle 01"],
  ["work/vehicle/vehicle-02.jpg", 1800, 1200, "vehicle 02"],
  ["work/vehicle/vehicle-03.jpg", 1200, 1200, "vehicle 03"],

  ["work/landscape/landscape-01.jpg", 2000, 1125, "landscape 01"],
  ["work/landscape/landscape-02.jpg", 1800, 1200, "landscape 02"],
  ["work/landscape/landscape-03.jpg", 2000, 1125, "landscape 03"],
];

const OFFERING_CARDS = [
  ["offerings/baby.jpg", 1600, 1200, "baby photos"],
  ["offerings/child.jpg", 1200, 1500, "child photos"],
  ["offerings/family.jpg", 1200, 1500, "family photos"],
  ["offerings/portraits.jpg", 1600, 1200, "individual portraits"],
  ["offerings/vehicle.jpg", 1600, 1200, "vehicle photography"],
  ["offerings/landscape.jpg", 1200, 1500, "landscape photos"],
];

async function main() {
  const all = [...FILES, ...OFFERING_CARDS];
  for (const [rel, w, h, label] of all) {
    const out = join(ROOT, rel);
    await mkdir(dirname(out), { recursive: true });
    const buf = await sharp(panel(w, h, label, rel.length + w))
      .jpeg({ quality: 78, mozjpeg: true })
      .toBuffer();
    await writeFile(out, buf);
  }

  // Wordmark marks. Two colourways so the nav can sit over photography or over ink.
  const mark = (fill) => `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="34" viewBox="0 0 260 34">
  <text x="0" y="25" font-family="Georgia, 'Times New Roman', serif" font-size="26" letter-spacing="1.5" fill="${fill}">Elish Modi</text>
</svg>`;
  await mkdir(join(ROOT, "brand"), { recursive: true });
  await writeFile(join(ROOT, "brand", "logo-dark.svg"), mark("#0b0b0c"));
  await writeFile(join(ROOT, "brand", "logo-light.svg"), mark("#efede8"));

  const favicon = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
    <rect width="512" height="512" fill="#0b0b0c"/>
    <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
      font-family="Georgia, serif" font-size="300" fill="#efede8">E</text>
  </svg>`);
  await sharp(favicon).png().toFile(join(ROOT, "brand", "favicon.png"));

  console.log(`Wrote ${all.length} placeholder images plus brand marks.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
