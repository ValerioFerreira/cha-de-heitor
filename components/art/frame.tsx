/**
 * Moldura de retrato antiga.
 *
 * Desenhada à mão em SVG, como o resto da ilustração do site — nada de
 * imagem de moldura. É montada em anéis concêntricos, que é como uma
 * moldura entalhada de verdade se comporta: cada faixa pega a luz de um
 * jeito, e é o contraste entre elas que dá o relevo.
 *
 *   0–9    filete escuro da borda de fora
 *   9–24   chanfro claro (a face que recebe a luz)
 *   24–33  sombra do entalhe
 *   33–50  a gola, onde correm as contas
 *   50–58  vale escuro
 *   58–66  filete claro que encosta na fotografia
 *
 * O `viewBox` é 2:3 porque a fotografia é 2:3. Trocando a proporção da
 * foto, os ornamentos de canto esticam junto — refaça as contas.
 */

const L = 600; // largura do viewBox
const A = 900; // altura
const ESP = 66; // espessura total da moldura

const ESCURO = "#3f2e20";
const MEDIO = "#6b4f38";
const CASCA = "#8a6a4d";
const TAUPE = "#b3926f";
const CLARO = "#cfae86";
const BRILHO = "#e2c79f";

/** um anel: o retângulo de fora menos o de dentro */
function aro(inicio: number, fim: number) {
  return [
    `M ${inicio} ${inicio} H ${L - inicio} V ${A - inicio} H ${inicio} Z`,
    `M ${fim} ${fim} H ${L - fim} V ${A - fim} H ${fim} Z`,
  ].join(" ");
}

/** as contas que correm pela gola */
function contas() {
  const y1 = 41.5;
  const y2 = A - 41.5;
  const x1 = 41.5;
  const x2 = L - 41.5;
  const passo = 26;
  const pontos: [number, number][] = [];

  for (let x = x1 + passo; x < x2 - passo / 2; x += passo) {
    pontos.push([x, y1], [x, y2]);
  }
  for (let y = y1 + passo; y < y2 - passo / 2; y += passo) {
    pontos.push([x1, y], [x2, y]);
  }
  return pontos;
}

/**
 * Ornamento de canto: uma volta de acanto que sobe da quina e se enrola.
 * Desenhado uma vez, no canto superior esquerdo, e espelhado nos outros.
 */
const VOLUTA =
  "M 14 132 C 12 92 26 58 60 36 C 84 20 112 16 128 24 C 142 31 142 48 129 55 C 118 61 106 55 107 44 C 108 36 116 32 123 35";

function Canto() {
  return (
    <g>
      {/* a sombra vem primeiro, deslocada: é ela que dá o relevo */}
      <path
        d={VOLUTA}
        fill="none"
        stroke={ESCURO}
        strokeWidth={7.5}
        strokeLinecap="round"
        opacity={0.55}
        transform="translate(2.5,3)"
      />
      <path
        d={VOLUTA}
        fill="none"
        stroke={CLARO}
        strokeWidth={5.5}
        strokeLinecap="round"
      />
      <path
        d="M 26 128 C 25 96 38 68 66 50 C 86 37 108 34 120 40"
        fill="none"
        stroke={BRILHO}
        strokeWidth={2.4}
        strokeLinecap="round"
        opacity={0.85}
      />
      {/* folha que abre para dentro */}
      <path
        d="M 40 118 C 46 92 62 74 88 64 C 78 78 72 92 70 108 C 62 104 50 108 40 118 Z"
        fill={CLARO}
        opacity={0.9}
      />
      <path
        d="M 118 30 C 130 22 146 22 154 30 C 146 34 136 36 128 34 Z"
        fill={BRILHO}
        opacity={0.8}
      />
      <circle cx={132} cy={44} r={4.5} fill={BRILHO} />
    </g>
  );
}

/** Pequena crista no alto e no pé, para a moldura ter frente e verso. */
function Crista({ embaixo = false }: { embaixo?: boolean }) {
  return (
    <g transform={embaixo ? `translate(${L / 2}, ${A - 6}) scale(1,-1)` : `translate(${L / 2}, 6)`}>
      <path
        d="M -62 32 C -40 8 -18 -2 0 -2 C 18 -2 40 8 62 32 C 40 24 18 20 0 20 C -18 20 -40 24 -62 32 Z"
        fill={ESCURO}
        opacity={0.5}
        transform="translate(1,3)"
      />
      <path
        d="M -62 32 C -40 8 -18 -2 0 -2 C 18 -2 40 8 62 32 C 40 24 18 20 0 20 C -18 20 -40 24 -62 32 Z"
        fill={CLARO}
      />
      <path
        d="M -28 24 C -16 8 -8 2 0 2 C 8 2 16 8 28 24 C 16 18 8 15 0 15 C -8 15 -16 18 -28 24 Z"
        fill={BRILHO}
        opacity={0.9}
      />
      <circle cx={0} cy={27} r={6} fill={BRILHO} />
    </g>
  );
}

export function MolduraRetrato({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  // atenção: `inset` em % usa a largura no eixo horizontal e a altura no
  // vertical. Usar o mesmo número nos dois deixa uma folga no topo e no pé.
  const recuoX = (ESP / L) * 100;
  const recuoY = (ESP / A) * 100;

  return (
    <figure className={`retrato ${className ?? ""}`}>
      <div className="janela">{children}</div>

      <svg className="madeira" viewBox={`0 0 ${L} ${A}`} aria-hidden preserveAspectRatio="none">
        <defs>
          <linearGradient id="mold-luz" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={TAUPE} />
            <stop offset="42%" stopColor={CASCA} />
            <stop offset="100%" stopColor={MEDIO} />
          </linearGradient>
          <linearGradient id="mold-chanfro" x1="0" y1="0" x2="0.6" y2="1">
            <stop offset="0%" stopColor={BRILHO} />
            <stop offset="55%" stopColor={CLARO} />
            <stop offset="100%" stopColor={CASCA} />
          </linearGradient>
        </defs>

        {/* corpo da moldura */}
        <path d={aro(0, ESP)} fill="url(#mold-luz)" fillRule="evenodd" />

        {/* as faixas do entalhe */}
        <path d={aro(0, 9)} fill={ESCURO} fillRule="evenodd" />
        <path d={aro(9, 24)} fill="url(#mold-chanfro)" fillRule="evenodd" />
        <path d={aro(24, 33)} fill={MEDIO} fillRule="evenodd" opacity={0.9} />
        <path d={aro(50, 58)} fill={ESCURO} fillRule="evenodd" opacity={0.75} />
        <path d={aro(58, ESP)} fill={BRILHO} fillRule="evenodd" opacity={0.85} />

        {/* contas na gola */}
        <g>
          {contas().map(([x, y], i) => (
            <g key={i}>
              <circle cx={x + 1} cy={y + 1.4} r={3.8} fill={ESCURO} opacity={0.5} />
              <circle cx={x} cy={y} r={3.4} fill={BRILHO} opacity={0.9} />
            </g>
          ))}
        </g>

        {/* cantos, espelhados */}
        <g>
          <Canto />
          <g transform={`translate(${L},0) scale(-1,1)`}>
            <Canto />
          </g>
          <g transform={`translate(0,${A}) scale(1,-1)`}>
            <Canto />
          </g>
          <g transform={`translate(${L},${A}) scale(-1,-1)`}>
            <Canto />
          </g>
        </g>

        <Crista />
        <Crista embaixo />

        {/* sombra que a moldura joga sobre a fotografia */}
        <path
          d={`M ${ESP} ${ESP} H ${L - ESP} V ${A - ESP} H ${ESP} Z M ${ESP + 10} ${ESP + 10} H ${
            L - ESP - 10
          } V ${A - ESP - 10} H ${ESP + 10} Z`}
          fill={ESCURO}
          fillRule="evenodd"
          opacity={0.28}
        />
      </svg>

      <style jsx>{`
        .retrato {
          position: relative;
          aspect-ratio: ${L} / ${A};
          filter: drop-shadow(0 26px 34px rgba(4, 20, 30, 0.55));
        }
        .janela {
          position: absolute;
          inset: ${recuoY}% ${recuoX}%;
          overflow: hidden;
          background: #1b2b38;
        }
        .retrato :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .madeira {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
      `}</style>
    </figure>
  );
}
