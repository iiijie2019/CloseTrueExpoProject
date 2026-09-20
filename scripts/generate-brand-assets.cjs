// Render the editable vector logo with sharp: NODE_PATH=/path/to/sharp/node_modules node scripts/generate-brand-assets.cjs
const fs = require('node:fs');
const sharp = require('sharp');
const path = require('node:path');
const assets = path.join(__dirname, '..', 'assets', 'images');
const svg = fs.readFileSync(path.join(assets, 'word-grove-logo.svg'), 'utf8');
const mark = svg.match(/<g id="mark">([\s\S]*?)<\/g>/)[1];
const wrap = body => `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${body}</svg>`;
const foreground = wrap(mark);
async function render(source, name, width) {
  await sharp(Buffer.from(source)).resize(width, width).png().toFile(path.join(assets, name));
}
(async () => {
  await render(svg, 'icon.png', 1024);
  await render(svg, 'favicon.png', 64);
  await render(foreground, 'android-icon-foreground.png', 1024);
  await render(wrap('<rect width="1024" height="1024" fill="#2E5945"/>'), 'android-icon-background.png', 1024);
  await render(wrap(mark.replace(/#[A-Fa-f0-9]{6}/g, '#FFFFFF')), 'android-icon-monochrome.png', 1024);
  await sharp(Buffer.from(foreground)).trim().resize(512, 512, { fit: 'contain', background: '#00000000' }).png().toFile(path.join(assets, 'splash-icon.png'));
  fs.writeFileSync(path.join(assets, '..', 'expo.icon', 'Assets', 'word-grove.svg'), foreground);
})().catch(error => { console.error(error); process.exitCode = 1; });
