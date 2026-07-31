/**
 * Grades the hero photograph to sit inside a black, white and gold page.
 *
 * The source is an aerial shot of boats on open water: a small runabout
 * carving a wake toward an anchored sailboat, already fairly desaturated
 * from the water and overcast light. Dropped in untouched it is close to the
 * palette already, but still needs:
 *
 *   1. A tighter crop than the portfolio version. See CROP_TOP below; this is
 *      the one step that is about layout rather than colour, and it is the
 *      reason the hero copy has anywhere to sit.
 *   2. Monochrome. The page is black and white; the hero is the page's
 *      background, not a portfolio piece, so it follows the palette exactly
 *      rather than approximately.
 *   3. Split-tone rather than tint. tint() carries colour through the
 *      midtones, which is the definition of sepia and reads as an old
 *      photograph. Building the gold as an alpha mask off the luminance puts
 *      it only in the highlights, mainly the wake itself, and leaves the deep
 *      water neutral black. That is the difference between "aged" and "black
 *      and white with a gold cast".
 *   4. A gentle top-to-bottom grade rather than the sky-specific one a
 *      horizon shot needs. There is no sky in this frame, it is water end to
 *      end, so the top is left almost untouched (aerial haze already lightens
 *      distance naturally) and the bottom third is grounded darker, which
 *      also happens to be where the page's own text sits.
 *   5. A vignette, so the frame closes into the page ground instead of ending
 *      at a hard edge. Kept deliberately weak: the water is the point of this
 *      photograph and has to read unbroken corner to corner.
 *
 * The source is the full-colour frame that also sits in the portfolio under
 * Landscape, where the work is shown uncropped, exactly as it was taken.
 * Reading from that file rather than keeping a second copy of the camera
 * original means there is one master and no chance of the two drifting.
 *
 * TO CHANGE THE HERO: point SRC at the new photograph and re-run. Expect to
 * retune CROP_TOP for where the new frame's subject sits, TONE_FLOOR and the
 * gradient stops for its tonal balance, and re-run
 * scripts/check-hero-contrast.mjs afterward: it is the thing that actually
 * decides whether the copy is still readable, not how the grade looks in a
 * screenshot.
 *
 * Run with:  node scripts/grade-hero.mjs
 */
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = join(ROOT, "public/images/work/landscape/landscape-04.jpg");
const OUT = join(ROOT, "public/images/hero/hero.jpg");
const OUT_W = 2400;
const GOLD = { r: 201, g: 169, b: 97 };

/**
 * Fraction of the source height cut from the top, and the whole reason the
 * hero is not simply the portfolio frame.
 *
 * In the uncropped frame every subject, the wake, both boats and the far
 * launch, sits between roughly 28% and 66% of the height. That leaves only
 * the bottom third as clear water, and the hero copy block is taller than a
 * third of most windows, so the type had nowhere to go that was not on top
 * of a boat. No amount of moving the text fixes that; the frame itself has
 * to give the type somewhere to live.
 *
 * Cutting the top drops the subject band to end around 53% and takes the
 * frame to roughly 2:1, which is a hero shape rather than a print shape.
 * What is lost is the far end of the wake's upper curve, which was the
 * emptiest part of the picture. What is kept is the whole sweep from the
 * left edge down to the runabout, both boats, and a much larger stretch of
 * open water underneath them.
 *
 * The exact value is set by the worst case, not the typical one: a short
 * laptop window is where the copy has least room, and it is measurable, so
 * this was tuned against the clearance measured at 1280x620 rather than
 * against how the crop looks at 1440x900.
 */
const CROP_TOP = 0.27;

/* Luminance floor below which no gold is applied, and the ceiling alpha at
   pure white. Keeping the floor high is what protects the shadows. */
const TONE_FLOOR = 100;
const TONE_MAX = 0.42;

async function splitTone(greyBuf, W, H) {
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

/* Gentle top-to-bottom grade. No sky to protect here, so this is mostly about
   grounding the bottom third rather than rescuing a blown-out top. */
const gradient = (W, H) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#000" stop-opacity="0.10"/>
        <stop offset="35%"  stop-color="#000" stop-opacity="0.02"/>
        <stop offset="65%"  stop-color="#000" stop-opacity="0.10"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.42"/>
      </linearGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#g)"/>
    </svg>`,
  );

/* Barely-there: just enough to keep the frame from ending on a hard edge.
   The water needs to read unbroken corner to corner. */
const vignette = (W, H) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs><radialGradient id="v" cx="50%" cy="46%" r="90%">
        <stop offset="70%"  stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.22"/>
      </radialGradient></defs>
      <rect width="${W}" height="${H}" fill="url(#v)"/>
    </svg>`,
  );

async function main() {
  const meta = await sharp(SRC).metadata();
  const top = Math.round(meta.height * CROP_TOP);
  const cropH = meta.height - top;

  const W = OUT_W;
  const H = Math.round((cropH / meta.width) * OUT_W);

  const grey = await sharp(SRC)
    .rotate()
    .extract({ left: 0, top, width: meta.width, height: cropH })
    .resize(W, H, { fit: "cover" })
    .greyscale()
    /* Milder than the castle's grade: this source already has real contrast
       between the whitewater and the deep water, so it needs lifting, not
       rescuing. */
    .linear(1.22, -28)
    .toColourspace("srgb")
    .png()
    .toBuffer();

  let buf = await splitTone(grey, W, H);
  buf = await sharp(buf).composite([{ input: gradient(W, H), blend: "over" }]).png().toBuffer();
  buf = await sharp(buf).composite([{ input: vignette(W, H), blend: "over" }]).png().toBuffer();

  const info = await sharp(buf)
    .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(OUT);

  const stats = await sharp(OUT).stats();
  console.log(
    `hero.jpg  ${info.width}x${info.height}  ${(info.width / info.height).toFixed(2)}:1  ` +
      `${Math.round(info.size / 1024)}kb  ` +
      `mean rgb ${stats.channels.slice(0, 3).map((c) => Math.round(c.mean)).join(",")}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
