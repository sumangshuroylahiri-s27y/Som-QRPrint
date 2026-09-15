const fs = require('fs');
const PNG = require('pngjs').PNG;
const glob = require('fs').readdirSync('public/assets/templates').filter(f => f.endsWith('.png'));

glob.sort().forEach(file => {
  const data = fs.readFileSync('public/assets/templates/' + file);
  const png = PNG.sync.read(data);
  const w = png.width;
  const h = png.height;
  
  // Try to find the first white pixel run that is large enough
  // Let's just output the dimensions for now
  console.log(`${file}: ${w}x${h}`);
  
  // Find a large white square
  // A naive approach: look for a row with a long run of white pixels
  let maxWhiteRun = 0;
  let bestY = 0;
  let bestX = 0;
  
  for (let y = 0; y < h; y += 10) {
    let currentRun = 0;
    let runStartX = 0;
    for (let x = 0; x < w; x++) {
      let idx = (w * y + x) << 2;
      let r = png.data[idx];
      let g = png.data[idx+1];
      let b = png.data[idx+2];
      if (r > 240 && g > 240 && b > 240) {
        if (currentRun === 0) runStartX = x;
        currentRun++;
      } else {
        if (currentRun > maxWhiteRun) {
          // Verify it's a square by checking down
          let isSquare = true;
          let checkHeight = Math.floor(currentRun * 0.9);
          if (y + checkHeight < h) {
             let checkIdx = (w * (y + checkHeight) + runStartX + Math.floor(currentRun/2)) << 2;
             if (png.data[checkIdx] < 240) isSquare = false;
          } else {
             isSquare = false;
          }
          
          if (isSquare && currentRun > 100) {
              maxWhiteRun = currentRun;
              bestY = y;
              bestX = runStartX;
          }
        }
        currentRun = 0;
      }
    }
  }
  
  console.log(`  -> Best white square at x=${bestX}, y=${bestY}, size=${maxWhiteRun}`);
});
