/**
 * Measures the real contrast of the hero copy against the photograph behind it.
 *
 * Why this exists: the page average lies. When this was first checked, the hero
 * copy averaged a comfortable 6:1 while the gold eyebrow was actually sitting at
 * 1.92:1 where it crossed a patch of sunlit stone. Type over a photograph has to
 * be measured against the brightest part of what is behind it, not the mean.
 *
 * So this hides the hero copy, screenshots the background, and for each line
 * takes the brightest 5% of pixels in that line's own bounding box. That is the
 * number that decides whether the text is readable.
 *
 * Run it after changing the hero image, the grading, or either scrim.
 *
 * Requires a browser and Playwright, which are dev-only and not project
 * dependencies:
 *
 *   npm i -D playwright && npx playwright install chromium
 *   npm run build && npm start          # in another terminal
 *   node scripts/check-hero-contrast.mjs
 */
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

/* WCAG AA: 4.5:1 for body text, 3:1 for large text. Every line here is small. */
const AA = 4.5;

const linear = (c) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const lum = (r, g, b) => 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
const lumHex = (hex) => lum(...[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
const ratio = (a, b) => {
  const [hi, lo] = [a, b].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

/* Must match the tokens the hero actually uses. */
const FOREGROUND = {
  eyebrow: "#d9bc6a", // gold-bright
  headline: "#f5f4f1", // paper
  subhead: "#a8a7a3", // paper-dim
};

const VIEWPORTS = [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
];

/* CHROMIUM_PATH lets CI or a sandbox point at a browser it already has,
   instead of downloading a second copy. */
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);
let failed = false;

for (const [name, width, height] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const boxes = await page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
    };
    return {
      eyebrow: box("#top .eyebrow"),
      headline: box("#top h1"),
      subhead: box("#top p:not(.eyebrow)"),
    };
  });

  await page.addStyleTag({ content: "#top h1, #top p, #top a { visibility: hidden !important; }" });
  await page.waitForTimeout(300);
  const shot = await page.screenshot();

  for (const [line, box] of Object.entries(boxes)) {
    if (!box || box.w < 2 || box.h < 2) continue;
    const { data, info } = await sharp(shot)
      .extract({
        left: Math.max(0, box.x),
        top: Math.max(0, box.y),
        width: Math.min(box.w, width - box.x),
        height: Math.min(box.h, height - box.y),
      })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const lums = [];
    for (let i = 0; i < data.length; i += info.channels) {
      lums.push(lum(data[i], data[i + 1], data[i + 2]));
    }
    lums.sort((a, b) => a - b);
    const brightest = lums[Math.floor(lums.length * 0.95)];

    const r = ratio(lumHex(FOREGROUND[line]), brightest);
    const ok = r >= AA;
    if (!ok) failed = true;
    console.log(`${name.padEnd(8)} ${line.padEnd(9)} ${r.toFixed(2)}:1  ${ok ? "pass" : "FAIL"}`);
  }

  await page.close();
}

await browser.close();

if (failed) {
  console.error(`\nAt least one line is under ${AA}:1 against the brightest part of the image.`);
  console.error("Fix by strengthening a scrim in Hero.tsx, or by re-grading in scripts/grade-hero.mjs.");
  process.exit(1);
}
console.log(`\nAll hero copy clears ${AA}:1 against the brightest 5% behind it.`);
