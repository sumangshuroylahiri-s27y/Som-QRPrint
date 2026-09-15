const fs = require('fs');
const PNG = require('pngjs').PNG;

function renderAscii(file) {
  const data = fs.readFileSync('public/assets/templates/' + file);
  const png = PNG.sync.read(data);
  const w = png.width;
  const h = png.height;
  
  // downsample to 80x40
  const outW = 80;
  const outH = 40;
  let out = '';
  
  for (let y = 0; y < outH; y++) {
    let row = '';
    for (let x = 0; x < outW; x++) {
       let origX = Math.floor(x * w / outW);
       let origY = Math.floor(y * h / outH);
       let idx = (w * origY + origX) << 2;
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
  console.log(file + ':\n' + out);
}

['design-01.png', 'design-02.png', 'design-03.png', 'design-04.png'].forEach(renderAscii);
