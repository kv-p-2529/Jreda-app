// One-off generator: builds Android launcher icons + a splash logo from
// src/assets/logo.png. Run with `node scripts/gen-app-assets.js` after the logo
// changes. Requires `sharp` (installed via `npm i --no-save sharp`).
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src/assets/logo.png');
const RES = path.join(ROOT, 'android/app/src/main/res');

// Launcher icon pixel sizes per density bucket.
const DENSITIES = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

// Square icon: logo centered on white with ~16% padding.
async function makeSquare(size) {
  const pad = Math.round(size * 0.16);
  const inner = size - pad * 2;
  const logo = await sharp(SRC)
    .resize(inner, inner, { fit: 'contain', background: TRANSPARENT })
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: WHITE },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toBuffer();
}

// Round icon: the square clipped to a circle.
async function makeRound(size) {
  const square = await makeSquare(size);
  const circle = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${
      size / 2
    }" r="${size / 2}" fill="#fff"/></svg>`,
  );
  return sharp(square)
    .composite([{ input: circle, blend: 'dest-in' }])
    .png()
    .toBuffer();
}

(async () => {
  for (const [bucket, size] of Object.entries(DENSITIES)) {
    const dir = path.join(RES, `mipmap-${bucket}`);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'ic_launcher.png'), await makeSquare(size));
    fs.writeFileSync(
      path.join(dir, 'ic_launcher_round.png'),
      await makeRound(size),
    );
    console.log(`icons ${bucket} (${size}px) ✓`);
  }

  // Splash logo — larger, transparent background (sits on the splash colour).
  const splash = await sharp(SRC)
    .resize(384, 384, { fit: 'contain', background: TRANSPARENT })
    .png()
    .toBuffer();
  const drawableDir = path.join(RES, 'drawable');
  fs.mkdirSync(drawableDir, { recursive: true });
  fs.writeFileSync(path.join(drawableDir, 'splash_logo.png'), splash);
  console.log('splash_logo.png ✓');
  console.log('Done.');
})();
