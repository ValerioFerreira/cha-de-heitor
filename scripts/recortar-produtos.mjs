/**
 * Recorta o fundo branco das fotos de produto.
 *
 * As fotos vieram de e-commerce, sobre branco. Nenhum truque de CSS resolve
 * isso: `multiply` apaga o branco mas também come os produtos claros (o
 * pacote de lenços sumia), e clarear a moldura faz o mesmo. A única saída
 * honesta é tirar o branco de verdade, uma vez, aqui.
 *
 * O preenchimento começa pelas bordas e só se espalha por pixels quase
 * brancos — assim o branco de dentro da embalagem (a fralda, o rótulo do
 * Bepantol) continua lá. Depois o resultado é aparado no conteúdo, para que
 * a imagem não carregue margem vazia.
 *
 *   node scripts/recortar-produtos.mjs
 */

import sharp from "sharp";
import { mkdir, readdir } from "fs/promises";
import path from "path";

const ENTRADA = "images";
const SAIDA = "public/images/produtos";

/** quão perto de branco um pixel precisa estar para contar como fundo */
const LIMITE = 236;
/** margem de segurança em volta do recorte, em pixels */
const FOLGA = 6;

const PRODUTOS = [
  "lenco-umedecido",
  "bepantol",
  "fralda-p-18",
  "fralda-g-30",
  "fralda-p-38",
  "fralda-g-36",
  "fralda-p-46",
  "fralda-g-78",
  "fralda-g-92",
];

async function acharArquivo(base) {
  const arquivos = await readdir(ENTRADA);
  const achado = arquivos.find((a) => path.parse(a).name === base);
  if (!achado) throw new Error(`não achei ${base} em ${ENTRADA}/`);
  return path.join(ENTRADA, achado);
}

function quaseBranco(d, i) {
  return d[i] >= LIMITE && d[i + 1] >= LIMITE && d[i + 2] >= LIMITE;
}

async function recortar(base) {
  const origem = await acharArquivo(base);
  const { data, info } = await sharp(origem)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = info;
  const fundo = new Uint8Array(w * h);
  const fila = [];

  // semeia a partir das quatro bordas
  const semear = (x, y) => {
    const p = y * w + x;
    if (fundo[p]) return;
    if (!quaseBranco(data, p * 4)) return;
    fundo[p] = 1;
    fila.push(p);
  };
  for (let x = 0; x < w; x++) {
    semear(x, 0);
    semear(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    semear(0, y);
    semear(w - 1, y);
  }

  // espalha só pelo que continua quase branco
  while (fila.length) {
    const p = fila.pop();
    const x = p % w;
    const y = (p / w) | 0;
    if (x > 0) semear(x - 1, y);
    if (x < w - 1) semear(x + 1, y);
    if (y > 0) semear(x, y - 1);
    if (y < h - 1) semear(x, y + 1);
  }

  // apaga o fundo e mede o que sobrou
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let p = 0; p < w * h; p++) {
    if (fundo[p]) {
      data[p * 4 + 3] = 0;
    } else {
      const x = p % w;
      const y = (p / w) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0) throw new Error(`${base}: a imagem inteira virou fundo`);

  const esq = Math.max(0, minX - FOLGA);
  const topo = Math.max(0, minY - FOLGA);
  const larg = Math.min(w, maxX + FOLGA + 1) - esq;
  const alt = Math.min(h, maxY + FOLGA + 1) - topo;

  const destino = path.join(SAIDA, `${base}.png`);
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .extract({ left: esq, top: topo, width: larg, height: alt })
    .png({ compressionLevel: 9 })
    .toFile(destino);

  const cortado = Math.round((1 - (larg * alt) / (w * h)) * 100);
  console.log(
    `${base.padEnd(20)} ${w}x${h} → ${larg}x${alt}  (${cortado}% de moldura vazia a menos)`
  );
}

await mkdir(SAIDA, { recursive: true });
for (const p of PRODUTOS) await recortar(p);
console.log("\npronto — as imagens recortadas estão em", SAIDA);
