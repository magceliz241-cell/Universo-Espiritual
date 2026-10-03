/**
 * Gera public/tarot/<id>.webp: as 78 cartas do Rider-Waite-Smith em traço dourado sobre roxo.
 *
 * Fonte: arte original de Pamela Colman Smith (1909), em domínio público no Brasil (autora falecida em 1951)
 * e nos EUA. Escaneamentos obtidos do repositório MIT metabismuth/tarot-json (pasta cards/).
 * Só o TRAÇO (tinta preta) é aproveitado: as cores da impressão são descartadas, e a faixa de título e a borda
 * (onde fica a marca da gráfica) são recortadas.
 *
 * Uso: node scripts/build-tarot-art.mjs   (requer rede para raw.githubusercontent.com)
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const BASE = "https://raw.githubusercontent.com/metabismuth/tarot-json/master/cards/";
const OUT = path.join(import.meta.dirname, "..", "public", "tarot");
const RANKS = ["ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "page", "knight", "queen", "king"];
const SUITS = { c: "cups", p: "pentacles", s: "swords", w: "wands" };

function files() {
  const list = [];
  for (let i = 0; i <= 21; i++) list.push([`m${String(i).padStart(2, "0")}.jpg`, `major-${String(i).padStart(2, "0")}`]);
  for (const [k, suit] of Object.entries(SUITS))
    RANKS.forEach((rank, i) => list.push([`${k}${String(i + 1).padStart(2, "0")}.jpg`, `${suit}-${rank}`]));
  return list;
}

/** Traço original em dourado sobre roxo. */
async function convert(input, out, width = 300) {
  const { data, info } = await sharp(input).extract({ left: 9, top: 9, width: 330, height: 534 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, o = Buffer.alloc(W * H * 3);
  // 1) tinta escura por pixel; 2) densidade local (janela 11×11): traço é fino, área pintada é densa
  const dark = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) dark[i] = Math.min(1, Math.max(0, (118 - Math.max(data[i * 3], data[i * 3 + 1], data[i * 3 + 2])) / 55));
  const I = new Float64Array((W + 1) * (H + 1));
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++)
    I[(y + 1) * (W + 1) + x + 1] = dark[y * W + x] + I[y * (W + 1) + x + 1] + I[(y + 1) * (W + 1) + x] - I[y * (W + 1) + x];
  const R = 5;
  const dens = (x, y) => {
    const x0 = Math.max(0, x - R), y0 = Math.max(0, y - R), x1 = Math.min(W, x + R + 1), y1 = Math.min(H, y + R + 1);
    return (I[y1 * (W + 1) + x1] - I[y0 * (W + 1) + x1] - I[y1 * (W + 1) + x0] + I[y0 * (W + 1) + x0]) / ((x1 - x0) * (y1 - y0));
  };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const p = (y * W + x) * 3, L = 0.3 * data[p] + 0.59 * data[p + 1] + 0.11 * data[p + 2];
    const solid = Math.min(1, Math.max(0, (dens(x, y) - 0.5) / 0.3));
    const line = Math.min(1, Math.pow(dark[y * W + x] * (1 - solid), 0.8) * 1.1); // manchas escuras grandes ficam roxas
    const fill = (1 - L / 255) * 0.16; // volume suave das áreas pintadas
    const a = line + fill * (1 - line);
    const dx = (x - W / 2) / (W / 2), dy = (y - H * 0.42) / (H / 1.6), d = Math.min(1, Math.sqrt(dx * dx + dy * dy));
    const bg = [42 - 24 * d, 28 - 16 * d, 70 - 36 * d]; // roxo #2a1c46 → #120c22
    const t = y / H, gold = [242 - 52 * t, 212 - 62 * t, 140 - 70 * t]; // dourado #f2d48c → #be9646
    for (let c = 0; c < 3; c++) o[p + c] = Math.round(bg[c] * (1 - a) + gold[c] * a);
  }
  await sharp(o, { raw: { width: W, height: H, channels: 3 } }).resize({ width }).webp({ quality: 74 }).toFile(out);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [file, id] of files()) {
    const res = await fetch(BASE + file);
    if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
    await convert(Buffer.from(await res.arrayBuffer()), path.join(OUT, `${id}.webp`));
  }
  console.log(`${files().length} cartas em ${OUT}`);
})();
