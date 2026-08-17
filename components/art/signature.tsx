"use client";

/**
 * "Heitor" — a assinatura.
 *
 * Não é uma fonte: são treze traços desenhados à mão, na ordem em que
 * uma pessoa escreveria. O último traço é a rubrica, que passa por baixo
 * de tudo — e é essa mesma linha que volta no site inteiro como filete
 * entre as seções.
 */

type Traco = { d: string; w: number; dur: number };

const TRACOS: Traco[] = [
  // H — haste esquerda, quase vertical, com o laço de entrada no topo
  { d: "M 148 44 C 128 40 116 52 114 74 C 110 122 102 178 98 232 C 97 246 106 252 118 246", w: 9, dur: 0.6 },
  // H — haste direita, sai por baixo para encontrar o "e"
  { d: "M 214 46 C 206 96 196 158 192 208 C 190 226 202 236 220 228", w: 9, dur: 0.5 },
  // H — travessão, subindo de leve e passando das duas hastes
  { d: "M 88 154 C 124 138 170 134 208 142", w: 5, dur: 0.3 },
  // e
  { d: "M 250 196 C 266 190 282 184 288 176 C 293 169 288 162 280 164 C 268 167 258 184 260 200 C 262 218 284 222 300 208", w: 7, dur: 0.5 },
  // i
  { d: "M 306 210 C 314 190 324 172 332 164 C 338 158 344 162 342 172 C 339 186 334 200 338 210 C 342 220 356 216 366 204", w: 7, dur: 0.42 },
  // t — haste
  { d: "M 374 204 C 382 172 396 126 404 102 C 408 90 416 92 414 104 C 409 132 396 176 394 198 C 393 212 406 216 418 204", w: 7, dur: 0.5 },
  // o — laço fechado, saída baixa para não virar arco com o r
  { d: "M 492 172 C 486 159 468 155 456 165 C 442 176 438 197 448 207 C 458 216 475 209 481 195 C 485 185 484 175 490 171 C 496 167 502 174 502 184", w: 7, dur: 0.52 },
  // r — a haste sobe em ponta e desce até a linha
  { d: "M 506 212 C 513 194 521 178 527 170 C 532 164 537 168 534 177 C 531 188 529 200 532 209", w: 7, dur: 0.4 },
  // r — o bracinho, que sobe e pára (não fecha em arco, senão vira "n")
  { d: "M 535 175 C 546 165 559 164 569 171", w: 6, dur: 0.24 },
  // t — corte
  { d: "M 372 140 C 392 131 414 131 432 139", w: 4.5, dur: 0.22 },
  // pingo do i
  { d: "M 346 126 c 4 -1 6 2 4 5", w: 6.5, dur: 0.14 },
  // rubrica
  { d: "M 532 209 C 584 210 662 194 718 200 C 770 205 774 238 724 241 C 648 245 460 254 300 257 C 200 259 128 255 92 247", w: 4.5, dur: 1.1 },
];

export function Assinatura({
  className,
  animate = true,
  delay = 0,
  title = "Heitor",
}: {
  className?: string;
  animate?: boolean;
  delay?: number;
  title?: string;
}) {
  let t = delay;

  return (
    <svg
      viewBox="0 0 820 300"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g filter="url(#aq-linha)">
        {TRACOS.map((traco, i) => {
          const start = t;
          t += traco.dur * 0.78; // encavala um pouco: a mão não pára entre letras
          return (
            <path
              key={i}
              d={traco.d}
              strokeWidth={traco.w}
              pathLength={1}
              className={animate ? "traco" : undefined}
              style={
                animate
                  ? ({
                      "--dur": `${traco.dur}s`,
                      "--delay": `${start}s`,
                    } as React.CSSProperties)
                  : undefined
              }
            />
          );
        })}
      </g>

      <style>{`
        .traco {
          stroke-dasharray: 1 1.001;
          stroke-dashoffset: 1;
          animation: escrever-traco var(--dur) cubic-bezier(0.55, 0, 0.45, 1) var(--delay) forwards;
        }
        @keyframes escrever-traco {
          to { stroke-dashoffset: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .traco { animation: none; stroke-dashoffset: 0; }
        }
      `}</style>
    </svg>
  );
}

/** Só a rubrica — o filete que separa as seções. */
export function Rubrica({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 700 90" className={className} fill="none" stroke="currentColor" aria-hidden>
      <path
        d="M 12 44 C 60 32 190 30 300 48 C 410 66 520 62 596 44 C 640 34 668 40 688 52"
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.5}
      />
    </svg>
  );
}
