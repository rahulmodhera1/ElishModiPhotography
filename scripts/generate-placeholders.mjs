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

/** [relative path, width, height, label] */
const FILES = [
  ["hero/hero.jpg", 2400, 1600, "hero image"],
  ["about/portrait.jpg", 1400, 1750, "photographer portrait"],
  ["og/og-image.jpg", 1200, 630, "social share"],

  ["work/portrait/portrait-01.jpg", 1200, 1500, "portrait 01"],
  ["work/portrait/portrait-02.jpg", 1800, 1200, "portrait 02"],
  ["work/portrait/portrait-03.jpg", 1200, 1500, "portrait 03"],
  ["work/portrait/portrait-04.jpg", 1200, 1200, "portrait 04"],

  ["work/editorial/editorial-01.jpg", 1800, 1200, "editorial 01"],
  ["work/editorial/editorial-02.jpg", 1200, 1600, "editorial 02"],
  ["work/editorial/editorial-03.jpg", 1800, 1200, "editorial 03"],
  ["work/editorial/editorial-04.jpg", 1200, 1500, "editorial 04"],

  ["work/weddings/weddings-01.jpg", 1800, 1200, "weddings 01"],
  ["work/weddings/weddings-02.jpg", 1200, 1500, "weddings 02"],
  ["work/weddings/weddings-03.jpg", 1200, 1500, "weddings 03"],
  ["work/weddings/weddings-04.jpg", 2000, 1125, "weddings 04"],

  ["work/commercial/commercial-01.jpg", 1200, 1500, "commercial 01"],
  ["work/commercial/commercial-02.jpg", 1800, 1200, "commercial 02"],
  ["work/commercial/commercial-03.jpg", 1200, 1200, "commercial 03"],
  ["work/commercial/commercial-04.jpg", 1800, 1200, "commercial 04"],
];

const SPECIALTY_CARDS = [
  ["specialties/portrait.jpg", 1200, 1500, "portrait"],
  ["specialties/editorial.jpg", 1200, 1500, "editorial"],
  ["specialties/weddings.jpg", 1200, 1500, "weddings"],
  ["specialties/commercial.jpg", 1200, 1500, "commercial"],
];

async function main() {
  const all = [...FILES, ...SPECIALTY_CARDS];
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
