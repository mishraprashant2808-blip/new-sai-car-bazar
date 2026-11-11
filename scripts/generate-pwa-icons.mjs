import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generatePwaIcons() {
  const root = process.cwd();
  const dir = path.join(root, 'public', 'icons');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const svgPath = path.join(root, 'public', 'icon.svg');
  const svg = fs.readFileSync(svgPath);

  // Standard PWA Android & Favicons
  await sharp(svg).resize(192, 192).png().toFile(path.join(dir, 'icon-192x192.png'));
  await sharp(svg).resize(512, 512).png().toFile(path.join(dir, 'icon-512x512.png'));
  await sharp(svg).resize(32, 32).png().toFile(path.join(dir, 'favicon-32x32.png'));
  await sharp(svg).resize(16, 16).png().toFile(path.join(dir, 'favicon-16x16.png'));

  // Apple Touch Icons for iOS
  await sharp(svg).resize(180, 180).png().toFile(path.join(dir, 'apple-touch-icon.png'));
  await sharp(svg).resize(180, 180).png().toFile(path.join(dir, 'apple-touch-icon-180x180.png'));
  await sharp(svg).resize(152, 152).png().toFile(path.join(dir, 'apple-touch-icon-152x152.png'));
  await sharp(svg).resize(167, 167).png().toFile(path.join(dir, 'apple-touch-icon-167x167.png'));

  // Maskable Adaptive Icons (with safe zone margin)
  const inner192 = await sharp(svg).resize(154, 154).toBuffer();
  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 }
    }
  }).composite([{ input: inner192, top: 19, left: 19 }]).png().toFile(path.join(dir, 'icon-maskable-192x192.png'));

  const inner512 = await sharp(svg).resize(410, 410).toBuffer();
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 15, g: 23, b: 42, alpha: 1 }
    }
  }).composite([{ input: inner512, top: 51, left: 51 }]).png().toFile(path.join(dir, 'icon-maskable-512x512.png'));

  console.log('PWA icons successfully generated in public/icons');
}

generatePwaIcons().catch(console.error);

