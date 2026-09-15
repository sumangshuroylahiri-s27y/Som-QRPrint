const fs = require('fs');
const PNG = require('pngjs').PNG;

const files = fs.readdirSync('public/assets/templates').filter(f => f.endsWith('.png')).sort();

let results = {};

files.forEach(file => {
  const data = fs.readFileSync('public/assets/templates/' + file);
  const png = PNG.sync.read(data);
  const w = png.width;
  const h = png.height;
  
  function isWhite(x, y) {
      if(x < 0 || x >= w || y < 0 || y >= h) return false;
      let idx = (w * y + x) << 2;
      return png.data[idx] > 230 && png.data[idx+1] > 230 && png.data[idx+2] > 230;
  }

  let bestX = 0, bestY = 0, maxScore = 0, bestSize = 0;
  
  // We expect a white box of size roughly 550 to 900
  // Let's sample points to find a large white region
  for (let y = 500; y < 2500; y += 20) {
      for (let x = 300; x < 1500; x += 20) {
          if (!isWhite(x, y)) continue;
          // check if it's the top-left of a box
          let w_run = 0;
          while (w_run < 1000 && isWhite(x + w_run, y)) w_run++;
          
          if (w_run > 500 && w_run < 1200) {
              let h_run = 0;
              while (h_run < 1000 && isWhite(x, y + h_run)) h_run++;
              if (Math.abs(w_run - h_run) < 150) {
                  // check center
                  if (isWhite(x + Math.floor(w_run/2), y + Math.floor(h_run/2))) {
                      let score = w_run * h_run;
                      if (score > maxScore) {
                          maxScore = score;
                          bestX = x;
                          bestY = y;
                          bestSize = Math.min(w_run, h_run);
                      }
                  }
              }
          }
      }
  }
  
  // refine
  let left = bestX;
  while(isWhite(left - 1, bestY + 50)) left--;
  let top = bestY;
  while(isWhite(bestX + 50, top - 1)) top--;
  let right = bestX + bestSize;
  while(isWhite(right + 1, bestY + 50)) right++;
  let bottom = bestY + bestSize;
  while(isWhite(bestX + 50, bottom + 1)) bottom++;
  
  console.log(`${file}: x=${left}, y=${top}, w=${right-left}, h=${bottom-top}`);
});
