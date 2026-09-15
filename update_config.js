import fs from 'fs';

const configPath = 'src/config.ts';
let content = fs.readFileSync(configPath, 'utf-8');

const boxes = {
  '01': { x: 904, y: 1107, w: 668, h: 617 },
  '02': { x: 913, y: 1125, w: 652, h: 608 },
  '03': { x: 1292, y: 2231, w: 751, h: 684 },
  '04': { x: 904, y: 1111, w: 675, h: 607 },
  '05': { x: 897, y: 1117, w: 682, h: 655 },
  '06': { x: 808, y: 1205, w: 865, h: 806 },
  '07': { x: 819, y: 1188, w: 847, h: 748 },
  '08': { x: 770, y: 1135, w: 877, h: 893 }
};

for (const [id, box] of Object.entries(boxes)) {
  const size = Math.min(box.w, box.h);
  const cx = box.x + Math.floor((box.w - size) / 2);
  const cy = box.y + Math.floor((box.h - size) / 2);
  
  const regex = new RegExp(`({ id: '${id}', name: '[^]+?', image: '[^]+?', defaultQrPosition: )({ x: \\d+, y: \\d+ })(, defaultQrSize: )(\\d+)( })`);
  content = content.replace(regex, `$1{ x: ${cx}, y: ${cy} }$3${size}$5`);
}

fs.writeFileSync(configPath, content);
