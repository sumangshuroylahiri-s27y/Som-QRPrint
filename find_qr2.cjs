const fs = require('fs');
const PNG = require('pngjs').PNG;
const glob = require('fs').readdirSync('public/assets/templates').filter(f => f.endsWith('.png'));

glob.sort().forEach(file => {
  const data = fs.readFileSync('public/assets/templates/' + file);
  const png = PNG.sync.read(data);
  const w = png.width;
  const h = png.height;
  
  function isWhite(x, y) {
      if(x < 0 || x >= w || y < 0 || y >= h) return false;
      let idx = (w * y + x) << 2;
      let r = png.data[idx];
      let g = png.data[idx+1];
      let b = png.data[idx+2];
      return r > 230 && g > 230 && b > 230; // Tolerate some anti-aliasing
  }

  // Use the previous rough estimates
  // We'll scan the middle to find exact borders
  let bestX = 0, bestY = 0, maxRun = 0;
  for (let y = 0; y < h; y += 10) {
    let currentRun = 0, runStartX = 0;
    for (let x = 0; x < w; x++) {
      if (isWhite(x, y)) {
        if (currentRun === 0) runStartX = x;
        currentRun++;
      } else {
        if (currentRun > maxRun) {
          let checkHeight = Math.floor(currentRun * 0.9);
          if (y + checkHeight < h && isWhite(runStartX + Math.floor(currentRun/2), y + checkHeight)) {
              if (currentRun > 100 && currentRun < w * 0.9) {
                  maxRun = currentRun;
                  bestY = y;
                  bestX = runStartX;
              }
          }
        }
        currentRun = 0;
      }
    }
  }

  // Refine box
  let cx = Math.floor(bestX + maxRun / 2);
  let cy = Math.floor(bestY + maxRun / 2);
  
  if (maxRun === 0) {
      console.log(`${file}: NOT FOUND`);
      return;
  }
  
  let left = cx, right = cx, top = cy, bottom = cy;
  while(isWhite(left - 1, cy)) left--;
  while(isWhite(right + 1, cy)) right++;
  while(isWhite(cx, top - 1)) top--;
  while(isWhite(cx, bottom + 1)) bottom++;

  let boxW = right - left;
  let boxH = bottom - top;
  
  // They are expected to be squares, so let's enforce size to the min of W and H
  let size = Math.min(boxW, boxH);
  
  // Actually, there could be slight noise. Let's just output the refined bounds
  console.log(`${file}: x=${left}, y=${top}, w=${boxW}, h=${boxH}, size=${size}`);
});
