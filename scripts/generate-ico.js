const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 32, 48];
const sourceDir = path.join(__dirname, '../public');
const outputFile = path.join(sourceDir, 'favicon.ico');

// Create an array of promises for each size
const promises = sizes.map(size => {
  const inputFile = path.join(sourceDir, `favicon-${size}x${size}.png`);
  return sharp(inputFile)
    .resize(size, size)
    .toBuffer();
});

// Generate the ICO file
Promise.all(promises)
  .then(buffers => {
    // Combine the buffers into a single ICO file
    const icoBuffer = Buffer.concat(buffers);
    fs.writeFileSync(outputFile, icoBuffer);
    console.log('ICO file generated successfully!');
  })
  .catch(err => {
    console.error('Error generating ICO file:', err);
  }); 