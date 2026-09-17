const { createCanvas, loadImage } = require('canvas');

async function getPreciseBox(imgPath) {
  const img = await loadImage(imgPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  function isWhite(x, y) {
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return false;
    const idx = (y * canvas.width + x) * 4;
    return data[idx] > 240 && data[idx+1] > 240 && data[idx+2] > 240;
  }

  let bestBox = null;
  // Scan carefully
  for (let y = 100; y < canvas.height - 100; y += 50) {
    for (let x = 100; x < canvas.width - 100; x += 50) {
      if (isWhite(x, y)) {
        let minX = x, maxX = x, minY = y, maxY = y;
        while (isWhite(minX - 1, y)) minX--;
        while (isWhite(maxX + 1, y)) maxX++;
        let centerX = Math.floor((minX + maxX)/2);
        while (isWhite(centerX, minY - 1)) minY--;
        while (isWhite(centerX, maxY + 1)) maxY++;
        
        const w = maxX - minX;
        const h = maxY - minY;
        
        if (w >= 500 && w <= 1100 && h >= 500 && h <= 1100 && Math.abs(w - h) < 250) {
           if (!bestBox || w * h > bestBox.w * bestBox.h) {
             bestBox = { x: minX, y: minY, w, h };
           }
        }
      }
    }
  }
  
  if (bestBox) {
    // refine left and right based on minY + h/2
    let midY = Math.floor(bestBox.y + bestBox.h/2);
    let minX = bestBox.x + Math.floor(bestBox.w/2);
    while (isWhite(minX - 1, midY)) minX--;
    let maxX = bestBox.x + Math.floor(bestBox.w/2);
    while (isWhite(maxX + 1, midY)) maxX++;
    bestBox.x = minX;
    bestBox.w = maxX - minX;
    
    // refine top and bottom based on minX + w/2
    let midX = Math.floor(bestBox.x + bestBox.w/2);
    let minY = bestBox.y + Math.floor(bestBox.h/2);
    while (isWhite(midX, minY - 1)) minY--;
    let maxY = bestBox.y + Math.floor(bestBox.h/2);
    while (isWhite(midX, maxY + 1)) maxY++;
    bestBox.y = minY;
    bestBox.h = maxY - minY;
  }
  
  if (bestBox) {
    let size = Math.min(bestBox.w, bestBox.h);
    let centerX = bestBox.x + bestBox.w / 2;
    let centerY = bestBox.y + bestBox.h / 2;
    let qrX = Math.round(centerX - size / 2);
    let qrY = Math.round(centerY - size / 2);
    
    // Padding
    let padding = 16;
    size = size - (padding * 2);
    qrX += padding;
    qrY += padding;
    
    console.log(`  { id: '${imgPath.match(/\d+/)[0]}', name: 'Design ${imgPath.match(/\d+/)[0]}', image: '/assets/templates/design-${imgPath.match(/\d+/)[0]}.png', defaultQrPosition: { x: ${qrX}, y: ${qrY} }, defaultQrSize: ${size} },`);
  } else {
    console.log(`Could not find box for ${imgPath}`);
  }
}

async function run() {
  console.log("export const TEMPLATES: Template[] = [");
  await getPreciseBox('public/assets/templates/design-01.png');
  await getPreciseBox('public/assets/templates/design-02.png');
  await getPreciseBox('public/assets/templates/design-03.png');
  await getPreciseBox('public/assets/templates/design-04.png');
  await getPreciseBox('public/assets/templates/design-05.png');
  await getPreciseBox('public/assets/templates/design-06.png');
  await getPreciseBox('public/assets/templates/design-07.png');
  await getPreciseBox('public/assets/templates/design-08.png');
  console.log("];");
}
run();
