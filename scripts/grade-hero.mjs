/**
 * Grades the hero photograph to sit inside a black, white and gold page.
 *
 * The source is a bright, blue-sky, green-foliage colour frame. Dropped in
 * untouched it fights the palette on every axis, so this does four things:
 *
 *   1. Monochrome. The page is black and white; the hero is the page's
 *      background, not a portfolio piece, so it follows the palette.
 *   2. Split-tone rather than tint. tint() carries colour through the
 *      midtones, which is the definition of sepia and reads as an old
 *      photograph. Building the gold as an alpha mask off the luminance puts
 *      it only in the highlights and leaves the shadows neutral black. That is
 *      the difference between "aged" and "black and white with a gold cast".
 *   3. A graduated darkening across the sky. The sky is roughly 40% of the
 *      frame and near-white, which would put a pale band directly under a
 *      transparent nav on a black site. Darkening it top-down is the same move
 *      as an ND grad on the lens, and it also pushes the castle forward as the
 *      focal point.
 *   4. A vignette, so the frame closes into the page ground instead of ending
 *      at a hard edge.
 *
 * The source is the full-colour frame that also sits in the portfolio under
 * Landscape, where the work is shown exactly as it was taken. Reading from
 * that file rather than keeping a second copy of the camera original means
 * there is one master and no chance of the two drifting.
 *
 * TO CHANGE THE HERO: point SRC at the new photograph and re-run. Expect to
 * retune TONE_FLOOR and the gradient stops for a frame with a different
 * tonal balance; the values below are fitted to a bright sky over grey stone.
 *
 * Run with:  node scripts/grade-hero.mjs
 */
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = join(ROOT, "public/images/work/landscape/landscape-02.jpg");
const OUT = join(ROOT, "public/images/hero/hero.jpg");
const W = 2400;
const H = 1600;
const GOLD = { r: 201, g: 169, b: 97 };

/* Luminance floor below which no gold is applied, and the ceiling alpha at
   pure white. Keeping the floor high is what protects the shadows. */
const TONE_FLOOR = 104;
const TONE_MAX = 0.44;

async function splitTone(greyBuf) {
  const a = (TONE_MAX * 255) / (255 - TONE_FLOOR);
  const mask = await sharp(greyBuf)
    .linear(a, -a * TONE_FLOOR)
    .toColourspace("b-w")
    .raw()
    .toBuffer();

  const gold = await sharp({
    create: { width: W, height: H, channels: 3, background: GOLD },
  })
    .raw()
    .toBuffer();

  const rgba = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    rgba[i * 4] = gold[i * 3];
    rgba[i * 4 + 1] = gold[i * 3 + 1];
    rgba[i * 4 + 2] = gold[i * 3 + 2];
    rgba[i * 4 + 3] = mask[i];
  }

  return sharp(greyBuf)
    .composite([{ input: rgba, raw: { width: W, height: H, channels: 4 }, blend: "over" }])
    .png()
    .toBuffer();
}

/* Graduated darkening: heavy at the top of the sky, gone by the rooflines,
   with a light touch returning at the very bottom under the headline. */
const gradient = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#000" stop-opacity="0.74"/>
      <stop offset="30%"  stop-color="#000" stop-opacity="0.34"/>
      <stop offset="52%"  stop-color="#000" stop-opacity="0.04"/>
      <stop offset="78%"  stop-color="#000" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.30"/>
    </linearGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
  </svg>`,
);

const vignette = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs><radialGradient id="v" cx="50%" cy="46%" r="74%">
      <stop offset="38%"  stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.55"/>
    </radialGradient></defs>
    <rect width="${W}" height="${H}" fill="url(#v)"/>
  </svg>`,
);

async function main() {
  const grey = await sharp(SRC)
    .rotate()
    .resize(W, H, { fit: "cover" })
    .greyscale()
    /* Lift contrast and crush the blacks so the foliage reads as true black
       against the page rather than as dark grey. */
    .linear(1.3, -42)
    .toColourspace("srgb")
    .png()
    .toBuffer();

  let buf = await splitTone(grey);
  buf = await sharp(buf).composite([{ input: gradient, blend: "over" }]).png().toBuffer();
  buf = await sharp(buf).composite([{ input: vignette, blend: "over" }]).png().toBuffer();

  const info = await sharp(buf)
    .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(OUT);

  const stats = await sharp(OUT).stats();
  console.log(
    `hero.jpg  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}kb  ` +
      `mean rgb ${stats.channels.slice(0, 3).map((c) => Math.round(c.mean)).join(",")}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
