const fs = require("fs");
const { PNG } = require("pngjs");

const input = process.argv[2];
const output = process.argv[3];
/** Écart max par canal pour considérer un pixel comme « fond clair » (coins) */
const lightTol = Number(process.argv[4] || 18);
/** Pixels très foncés à retirer (tous les canaux ≤ max). -1 = ne pas retirer le noir */
const maxBlack = Number(process.argv[5] || 28);

const buf = fs.readFileSync(input);
const png = PNG.sync.read(buf);
const w = png.width;
const h = png.height;

function rgb(x, y) {
  const i = (w * y + x) << 2;
  return [png.data[i], png.data[i + 1], png.data[i + 2]];
}

const corners = [rgb(0, 0), rgb(w - 1, 0), rgb(0, h - 1), rgb(w - 1, h - 1)];
const br = Math.round(corners.reduce((s, p) => s + p[0], 0) / 4);
const bg = Math.round(corners.reduce((s, p) => s + p[1], 0) / 4);
const bb = Math.round(corners.reduce((s, p) => s + p[2], 0) / 4);

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const i = (w * y + x) << 2;
    const r = png.data[i];
    const g = png.data[i + 1];
    const b = png.data[i + 2];

    const onLightPlate =
      Math.abs(r - br) <= lightTol &&
      Math.abs(g - bg) <= lightTol &&
      Math.abs(b - bb) <= lightTol;

    const onDarkPlate =
      maxBlack >= 0 &&
      r <= maxBlack &&
      g <= maxBlack &&
      b <= maxBlack;

    png.data[i + 3] = onLightPlate || onDarkPlate ? 0 : 255;
  }
}

fs.writeFileSync(output, PNG.sync.write(png));
console.log("OK", w, "x", h, "lightKey", br, bg, bb, "lightTol", lightTol, "maxBlack", maxBlack);
