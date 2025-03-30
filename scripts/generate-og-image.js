const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateOgImage() {
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.resolve(__dirname, '../public');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Path to SVG and output PNG
    const svgPath = path.resolve(__dirname, '../public/og-image.svg');
    const pngPath = path.resolve(__dirname, '../public/og-image.png');

    // Convert SVG to PNG
    await sharp(svgPath)
      .resize(1200, 630)
      .png()
      .toFile(pngPath);

    console.log('✅ Open Graph image generated successfully!');
  } catch (error) {
    console.error('❌ Error generating Open Graph image:', error);
  }
}

generateOgImage(); 