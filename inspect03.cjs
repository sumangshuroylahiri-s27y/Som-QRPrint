const fs = require('fs');
const PNG = require('pngjs').PNG;

function inspect(file, cx, cy, sz) {
  const data = fs.readFileSync('public/assets/templates/' + file);
  const png = PNG.sync.read(data);
  const w = png.width;
  
  let out = '';
  // print a 40x20 ascii art of the region
  let step = Math.floor(sz / 20);
  for (let y = cy - sz/2; y < cy + sz/2; y += step) {
      let row = '';
      for (let x = cx - sz/2; x < cx + sz/2; x += step) {
         let idx = (w * Math.floor(y) + Math.floor(x)) << 2;
         let r = png.data[idx];
         let g = png.data[idx+1];
         let b = png.data[idx+2];
         let lum = (r + g + b) / 3;
         if (lum > 220) row += ' ';
         else if (lum > 150) row += '.';
         else if (lum > 100) row += ':';
         else if (lum > 50) row += '#';
         else row += '@';
      }
      out += row + '\n';
  }
  console.log(file + ' centered at ' + cx + ',' + cy + ':\n' + out);
}

inspect('design-03.png', 906 + 330, 1120 + 330, 800);
