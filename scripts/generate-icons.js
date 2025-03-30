const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 48, name: 'favicon-48x48.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' }
];

const sourceSvg = path.join(__dirname, '../public/favicon.svg');
const outputDir = path.join(__dirname, '../public');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate PNG icons
Promise.all(sizes.map(({ size, name }) => {
  return sharp(sourceSvg)
    .resize(size, size)
    .png()
    .toFile(path.join(outputDir, name));
})).then(() => {
  console.log('All icons generated successfully!');
}).catch(err => {
  console.error('Error generating icons:', err);
}); 