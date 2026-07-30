/**
 * One-off importer for the first batch of real photography.
 *
 * Camera originals are 6000x4000 and 5-8MB each, which is far more than any
 * breakpoint on this site asks for. This resizes them to 2400px on the long
 * edge, which still covers a retina full-bleed row, and re-encodes with
 * mozjpeg.
 *
 * It also drops EXIF. Phone and camera files routinely carry GPS coordinates,
 * and a family photographer's originals can pin the location of a client's
 * home. sharp strips metadata unless withMetadata() is called, so this is the
 * safe default rather than something to configure.
 *
 * Keep the untouched originals somewhere that is not git. This script writes
 * only the web derivatives.
 *
 * Run with:  node scripts/import-photos.mjs
 */
import { mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const LONG_EDGE = 2400;

/** [source, destination, note] */
const JOBS = [
  // The photographer's own portrait. The About panel is a 4:5 box, so this is
  // cropped to match rather than being squeezed by object-cover at render time.
  [
    "public/images/about/WhatsApp Image 2026-07-30 at 3.15.25 PM.jpeg",
    "public/images/about/portrait.jpg",
    { width: 1200, height: 1500 },
  ],

  // Portfolio. Each of these keeps its native 3:2 ratio; the grid crops per
  // tile from there.
  ["IMG_1438.JPG", "public/images/work/baby/baby-01.jpg", null],
  ["IMG_1766.JPG", "public/images/work/baby/baby-02.jpg", null],
  ["IMG_2482.JPG", "public/images/work/family/family-01.jpg", null],
  ["IMG_1756.JPG", "public/images/work/landscape/landscape-01.jpg", null],

  // Offering cards. Same frames for now, so the service list shows real work
  // instead of grey panels. Swap these for dedicated shots when there are more.
  ["IMG_1766.JPG", "public/images/offerings/baby.jpg", { width: 1600, height: 1200 }],
  ["IMG_2482.JPG", "public/images/offerings/family.jpg", { width: 1600, height: 1200 }],
  [
    "IMG_1756.JPG",
    "public/images/offerings/landscape.jpg",
    { width: 1600, height: 1200 },
  ],
];

/* Removed once the derivatives exist. The originals stay in git history if
   they are ever needed again. */
const CLEANUP = [
  "IMG_1438.JPG",
  "IMG_1756.JPG",
  "IMG_1766.JPG",
  "IMG_2482.JPG",
  "public/images/about/WhatsApp Image 2026-07-30 at 3.15.25 PM.jpeg",
];

async function main() {
  for (const [src, dest, box] of JOBS) {
    const out = join(ROOT, dest);
    await mkdir(dirname(out), { recursive: true });

    /* rotate() with no argument applies the EXIF orientation flag and then
       clears it, so the pixels are upright no matter how the phone was held. */
    let pipeline = sharp(join(ROOT, src)).rotate();

    pipeline = box
      ? pipeline.resize({ ...box, fit: "cover", position: "attention" })
      : pipeline.resize({
          width: LONG_EDGE,
          height: LONG_EDGE,
          fit: "inside",
          withoutEnlargement: true,
        });

    const info = await pipeline
      .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: "4:4:4" })
      .toFile(out);

    console.log(`${dest.padEnd(46)} ${info.width}x${info.height}  ${Math.round(info.size / 1024)}kb`);
  }

  for (const file of CLEANUP) {
    await rm(join(ROOT, file), { force: true });
  }
  console.log(`\nRemoved ${CLEANUP.length} originals from the working tree.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
