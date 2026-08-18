/**
 * Recorta o fundo pintado das ilustrações dos bichos.
 *
 * Aqui o fundo não é branco: é um cinza quente que vai clareando de cima
 * para baixo, com uma linha de horizonte e a sombra do bicho no chão. Por
 * isso não dá para comparar cada pixel com uma cor fixa — a comparação é
 * com o vizinho de onde a mancha veio. A mancha cresce a partir das bordas
 * enquanto a cor quase não muda, e pára no contorno de tinta do desenho.
 *
 * No fim a borda do recorte é suavizada, senão fica serrilhada por cima
 * do fundo claro do site.
 *
 *   node scripts/recortar-bichos.mjs
 */

import sharp from "sharp";
import { mkdir } from "fs/promises";
import path from "path";

const ENTRADA = "images";
const SAIDA = "public/images/bichos";

/** o quanto a cor pode mudar de um pixel para o vizinho e ainda ser fundo */
const TOLERANCIA = 14;
/** e o quanto pode ter se afastado da cor de onde a mancha começou */
const DERIVA = 62;
const FOLGA = 4;

const BICHOS = ["girafa", "leao", "passaro", "urso"];

async function recortar(base) {
  const origem = path.join(ENTRADA, `${base}.png`);
  const { data, info } = await sharp(origem)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = info;
  const fundo = new Uint8Array(w * h);
  const fila = [];

  const cor = (p) => [data[p * 4], data[p * 4 + 1], data[p * 4 + 2]];
  const dif = (a, b) =>
    Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[2] - b[2]));

  const semente = cor(0);

  const tentar = (x, y, de) => {
    const p = y * w + x;
    if (fundo[p]) return;
    const c = cor(p);
    if (dif(c, de) > TOLERANCIA) return;
    if (dif(c, semente) > DERIVA) return;
    fundo[p] = 1;
    fila.push(p);
  };

  for (let x = 0; x < w; x++) {
    tentar(x, 0, cor(x));
    tentar(x, h - 1, cor((h - 1) * w + x));
  }
  for (let y = 0; y < h; y++) {
    tentar(0, y, cor(y * w));
    tentar(w - 1, y, cor(y * w + w - 1));
  }

  while (fila.length) {
    const p = fila.pop();
    const x = p % w;
    const y = (p / w) | 0;
    const de = cor(p);
    if (x > 0) tentar(x - 1, y, de);
    if (x < w - 1) tentar(x + 1, y, de);
    if (y > 0) tentar(x, y - 1, de);
    if (y < h - 1) tentar(x, y + 1, de);
  }

  let minX = w, minY = h, maxX = -1, maxY = -1;
  const alfa = Buffer.alloc(w * h, 255);
  for (let p = 0; p < w * h; p++) {
    if (fundo[p]) {
      alfa[p] = 0;
    } else {
      const x = p % w;
      const y = (p / w) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) throw new Error(`${base}: sobrou nada`);

  // suaviza a borda do recorte.
  // Atenção: o sharp devolve o resultado do blur em 3 canais mesmo tendo
  // recebido 1 — ler de 1 em 1 aqui produz a imagem listrada.
  const suave = await sharp(alfa, { raw: { width: w, height: h, channels: 1 } })
    .blur(0.8)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const passo = suave.info.channels;
  for (let p = 0; p < w * h; p++) data[p * 4 + 3] = suave.data[p * passo];

  const esq = Math.max(0, minX - FOLGA);
  const topo = Math.max(0, minY - FOLGA);
  const larg = Math.min(w, maxX + FOLGA + 1) - esq;
  const alt = Math.min(h, maxY + FOLGA + 1) - topo;

  const destino = path.join(SAIDA, `${base}.png`);
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: esq, top: topo, width: larg, height: alt })
    .png({ compressionLevel: 9 })
    .toFile(destino);

  const apagado = Math.round((fundo.reduce((s, v) => s + v, 0) / (w * h)) * 100);
  console.log(`${base.padEnd(10)} ${w}x${h} → ${larg}x${alt}  (${apagado}% virou transparente)`);
}

await mkdir(SAIDA, { recursive: true });
for (const b of BICHOS) await recortar(b);
console.log("\npronto — os bichos recortados estão em", SAIDA);
