const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'img');
const files = [
  { name: 'foto band.jpg', width: 800, quality: 75 },
  { name: 'foto fakultas.jpg', width: 500, quality: 75 },
  { name: 'foto pengurus.jpg', width: 500, quality: 75 },
  { name: 'solitaire 1.png', width: 800, quality: 75 },
  { name: 'rosetta.jpg', width: 500, quality: 75 },
  { name: 'lokahome.png', width: 500, quality: 75 },
  { name: 'rock walpaper.png', width: 500, quality: 70 },
];

async function compress() {
  for (const f of files) {
    const input = path.join(imgDir, f.name);
    const ext = path.extname(f.name).toLowerCase();
    const isPng = ext === '.png';
    const tmp = path.join(imgDir, `tmp_${f.name}`);
    try {
      let pipeline = sharp(input).resize({ width: f.width, withoutEnlargement: true });
      if (isPng) {
        pipeline = pipeline.png({ quality: f.quality, palette: true });
      } else {
        pipeline = pipeline.jpeg({ quality: f.quality, mozjpeg: true });
      }
      await pipeline.toFile(tmp);
      const oldSize = fs.statSync(input).size;
      const newSize = fs.statSync(tmp).size;
      fs.renameSync(tmp, input);
      console.log(`${f.name}: ${(oldSize/1024/1024).toFixed(2)}MB → ${(newSize/1024/1024).toFixed(2)}MB (${(100-newSize/oldSize*100).toFixed(1)}% smaller)`);
    } catch (err) {
      console.error(`Error compressing ${f.name}: ${err.message}`);
    }
  }
}

compress();
