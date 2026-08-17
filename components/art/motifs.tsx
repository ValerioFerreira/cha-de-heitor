/** Peças pequenas: as que aparecem sozinhas e as que montam a cena final. */

const AREIA = "#f0d8b6";
const CEU = "#d1e2f3";
const AZUL = "#8fb4d1";
const TAUPE = "#b3926f";
const CASCA = "#8a6a4d";
const LINHA = "#4a3728";
const PAPEL = "#fbf7f0";

type P = { className?: string; style?: React.CSSProperties };

export function Balao({ className, cor = CEU }: P & { cor?: string }) {
  return (
    <svg viewBox="0 0 80 130" className={className} aria-hidden>
      <g filter="url(#aq-linha)">
        <path d="M 40 8 C 58 8 70 24 68 44 C 66 64 52 80 40 86 C 28 80 14 64 12 44 C 10 24 22 8 40 8 Z" fill={cor} />
        <path d="M 28 24 C 24 32 23 42 26 50" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6} />
        <path d="M 36 86 L 40 94 L 44 86 Z" fill={cor} />
        <path d="M 40 94 C 46 104 34 110 40 122" stroke={CASCA} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function Folha({ className }: P) {
  return (
    <svg viewBox="0 0 60 90" className={className} aria-hidden>
      <g filter="url(#aq-linha)">
        <path d="M 30 4 C 52 24 54 58 30 84 C 6 58 8 24 30 4 Z" fill="#c9d9c4" />
        <path d="M 30 10 v 70" stroke="#7f9779" strokeWidth={1.6} strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function Faisca({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M 12 0 C 13 8 16 11 24 12 C 16 13 13 16 12 24 C 11 16 8 13 0 12 C 8 11 11 8 12 0 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Coracao({ className }: P) {
  return (
    <svg viewBox="0 0 48 44" className={className} aria-hidden>
      <path
        d="M 24 42 C 8 30 2 21 2 14 C 2 6 8 2 13 2 C 18 2 22 6 24 10 C 26 6 30 2 35 2 C 40 2 46 6 46 14 C 46 21 40 30 24 42 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Pegadas({ className }: P) {
  return (
    <svg viewBox="0 0 140 60" className={className} aria-hidden>
      <g fill={TAUPE} opacity={0.5}>
        {[0, 34, 68, 102].map((x, i) => (
          <g key={x} transform={`translate(${x}, ${i % 2 ? 26 : 4}) rotate(${i % 2 ? 8 : -8})`}>
            <ellipse cx={10} cy={14} rx={7.5} ry={9} />
            <circle cx={4} cy={4} r={2.4} />
            <circle cx={10} cy={2} r={2.4} />
            <circle cx={16} cy={4.5} r={2.2} />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Envelope da carta — usado na cena final. */
export function Envelope({ className, aberto = false }: P & { aberto?: boolean }) {
  return (
    <svg viewBox="0 0 220 150" className={className} aria-hidden>
      <rect x={4} y={16} width={212} height={128} rx={3} fill={PAPEL} stroke={TAUPE} strokeWidth={1.4} />
      {aberto ? (
        <path d="M 4 16 L 110 -34 L 216 16" fill={PAPEL} stroke={TAUPE} strokeWidth={1.4} strokeLinejoin="round" />
      ) : (
        <path d="M 4 16 L 110 88 L 216 16" fill={AREIA} fillOpacity={0.35} stroke={TAUPE} strokeWidth={1.4} strokeLinejoin="round" />
      )}
      <path d="M 4 144 L 84 74 M 216 144 L 136 74" stroke={TAUPE} strokeWidth={1} opacity={0.5} />
      {!aberto && (
        <g transform="translate(110,88)">
          <g transform="translate(-16,-15) scale(0.66)">
            <path
              d="M 24 42 C 8 30 2 21 2 14 C 2 6 8 2 13 2 C 18 2 22 6 24 10 C 26 6 30 2 35 2 C 40 2 46 6 46 14 C 46 21 40 30 24 42 Z"
              fill="#b04a4a"
            />
          </g>
        </g>
      )}
    </svg>
  );
}

/**
 * A caixa vem em três peças para que algo possa ser guardado *dentro* dela:
 * o fundo fica atrás da carga, a frente na frente, e a tampa desce por cima.
 * Todas usam o mesmo viewBox, então empilham exatamente.
 */
const CAIXA_VB = "0 0 260 220";

export function CaixaFundo({ className, style }: P) {
  return (
    <svg viewBox={CAIXA_VB} className={className} style={style} aria-hidden>
      {/* boca da caixa — o escuro que dá profundidade */}
      <path d="M 44 64 L 216 64 L 216 112 L 44 112 Z" fill="#8a6a4d" />
      <path d="M 44 64 L 216 64 L 206 82 L 54 82 Z" fill="#6a4f38" />
      <path d="M 44 64 L 54 82 L 54 112 L 44 112 Z" fill="#7a5b41" />
      <path d="M 216 64 L 206 82 L 206 112 L 216 112 Z" fill="#7a5b41" />
    </svg>
  );
}

export function CaixaFrente({ className, style }: P) {
  return (
    <svg viewBox={CAIXA_VB} className={className} style={style} aria-hidden>
      <path d="M 42 104 L 218 104 L 210 198 L 50 198 Z" fill={AREIA} />
      <path d="M 42 104 L 218 104 L 210 198 L 50 198 Z" fill="url(#caixa-luz)" opacity={0.5} />
      <path d="M 118 104 L 142 104 L 139 198 L 121 198 Z" fill={AZUL} opacity={0.8} />
      <path d="M 42 104 L 218 104" stroke={TAUPE} strokeWidth={1.6} opacity={0.55} />
      <defs>
        <linearGradient id="caixa-luz" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor={CASCA} stopOpacity="0.25" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CaixaTampa({ className, style, ...rest }: P & Record<string, unknown>) {
  return (
    <svg viewBox={CAIXA_VB} className={className} style={style} aria-hidden {...rest}>
      <path d="M 30 60 L 230 60 L 222 94 L 38 94 Z" fill="#ecd0a8" />
      <path d="M 30 60 L 230 60 L 226 70 L 34 70 Z" fill="#f4dfbe" />
      <path d="M 116 60 L 144 60 L 143 94 L 117 94 Z" fill={AZUL} opacity={0.85} />
      {/* laço */}
      <path
        d="M 130 62 C 116 46 96 46 96 58 C 96 68 116 68 130 62 C 144 68 164 68 164 58 C 164 46 144 46 130 62 Z"
        fill={AZUL}
        opacity={0.9}
      />
      <circle cx={130} cy={62} r={5} fill="#7ba5c6" />
    </svg>
  );
}

/** As três camadas empilhadas — só para exibir a caixa parada. */
export function Caixa({ className, tampa = "fechada" }: P & { tampa?: "aberta" | "fechada" }) {
  const camada: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  };
  return (
    <span className={className} style={{ position: "relative", display: "block", aspectRatio: "260/220" }}>
      <CaixaFundo style={camada} />
      <CaixaFrente style={camada} />
      <CaixaTampa
        style={
          tampa === "aberta"
            ? { ...camada, transform: "translateY(-26%) rotate(-5deg)" }
            : camada
        }
      />
    </span>
  );
}

/** Arco — a forma que mascara as fotografias e volta como moldura. */
export function ArcoMask({ id }: { id: string }) {
  return (
    <svg width="0" height="0" aria-hidden style={{ position: "absolute" }}>
      <defs>
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path d="M 0 1 L 0 0.42 C 0 0.14 0.22 0 0.5 0 C 0.78 0 1 0.14 1 0.42 L 1 1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function Nuvem({ className }: P) {
  return (
    <svg viewBox="0 0 220 90" className={className} aria-hidden>
      <g filter="url(#aq-bleed)" opacity={0.5}>
        <ellipse cx={70} cy={54} rx={54} ry={26} fill="#fff" />
        <ellipse cx={130} cy={44} rx={46} ry={30} fill="#fff" />
        <ellipse cx={168} cy={58} rx={38} ry={20} fill="#fff" />
      </g>
    </svg>
  );
}

export function LinhaTinta({ className }: P) {
  return (
    <svg viewBox="0 0 400 12" className={className} aria-hidden preserveAspectRatio="none">
      <path
        d="M 2 7 C 60 3 120 9 200 6 C 280 3 340 8 398 5"
        fill="none"
        stroke={LINHA}
        strokeWidth={1.2}
        strokeLinecap="round"
        opacity={0.35}
      />
    </svg>
  );
}
