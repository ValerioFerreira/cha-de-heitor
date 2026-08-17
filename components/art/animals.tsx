/**
 * O universo do Heitor tem três moradores — girafa, passarinho e elefante.
 * Três, e não sete: o encanto vem de reencontrar o mesmo bicho, não de
 * conhecer um novo a cada seção.
 */

const AREIA = "#f0d8b6";
const MANCHA = "#c9a074";
const CASCO = "#8a6a4d";
const LINHA = "#4a3728";
const AZUL = "#8fb4d1";
const CEU = "#d1e2f3";

type Props = { className?: string; title?: string };

function svgProps(title?: string) {
  return {
    role: title ? ("img" as const) : ("presentation" as const),
    "aria-label": title,
    "aria-hidden": title ? undefined : true,
  };
}

export function Girafa({
  className,
  title,
  variant = "inteira",
}: Props & { variant?: "inteira" | "espiando" }) {
  const cabeca = (
    <g>
      {/* orelha */}
      <path d="M 110 58 C 99 51 90 54 91 62 C 92 69 102 71 111 66 Z" fill={AREIA} />
      {/* ossicones */}
      <g stroke={CASCO} strokeWidth={3.4} strokeLinecap="round" fill={CASCO}>
        <path d="M 121 50 L 118 38" />
        <circle cx={117} cy={35} r={3.6} stroke="none" />
        <path d="M 135 47 L 136 35" />
        <circle cx={136} cy={32} r={3.6} stroke="none" />
      </g>
      {/* cabeça + focinho */}
      <path
        d="M 111 68 C 114 52 132 45 145 51 C 158 57 160 72 151 81 C 142 90 122 88 114 80 Z"
        fill={AREIA}
      />
      <ellipse cx={152} cy={70} rx={3} ry={2.2} fill={CASCO} opacity={0.75} />
      <circle cx={131} cy={62} r={2.8} fill={LINHA} />
      <path d="M 126 56 c 3 -3 8 -3 11 -1" stroke={LINHA} strokeWidth={1.6} fill="none" strokeLinecap="round" />
    </g>
  );

  if (variant === "espiando") {
    return (
      <svg viewBox="0 0 200 140" className={className} {...svgProps(title)}>
        <g filter="url(#aq-linha)">
          <path d="M 108 152 C 106 118 110 92 116 70" stroke={AREIA} strokeWidth={22} strokeLinecap="round" fill="none" />
          <g fill={MANCHA} opacity={0.55}>
            <ellipse cx={106} cy={128} rx={6} ry={5} />
            <ellipse cx={110} cy={106} rx={5.5} ry={4.6} />
          </g>
          {cabeca}
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 260" className={className} {...svgProps(title)}>
      <g filter="url(#aq-linha)">
        {/* pernas */}
        <g stroke={AREIA} strokeWidth={10} strokeLinecap="round" fill="none">
          <path d="M 62 190 C 60 210 60 226 62 240" />
          <path d="M 82 196 C 81 214 81 228 82 242" />
          <path d="M 108 194 C 109 212 109 228 108 242" />
          <path d="M 124 186 C 127 206 127 226 126 240" />
        </g>
        <g stroke={CASCO} strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.8}>
          <path d="M 62 238 v 3" />
          <path d="M 82 240 v 3" />
          <path d="M 108 240 v 3" />
          <path d="M 126 238 v 3" />
        </g>
        {/* cauda */}
        <path d="M 128 172 C 141 179 145 194 140 204" stroke={AREIA} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        <circle cx={140} cy={207} r={5} fill={CASCO} />
        {/* corpo */}
        <path
          d="M 46 192 C 34 168 46 144 76 140 C 108 136 128 156 126 184 C 124 208 66 214 46 192 Z"
          fill={AREIA}
        />
        {/* pescoço */}
        <path d="M 106 152 C 104 120 108 92 116 70" stroke={AREIA} strokeWidth={22} strokeLinecap="round" fill="none" />
        {/* crina */}
        <path d="M 100 148 C 98 118 102 92 110 68" stroke={CASCO} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.55} />
        {/* manchas */}
        <g fill={MANCHA} opacity={0.5}>
          <ellipse cx={62} cy={168} rx={9} ry={7.5} />
          <ellipse cx={86} cy={158} rx={10} ry={8} />
          <ellipse cx={84} cy={184} rx={8.5} ry={7} />
          <ellipse cx={108} cy={172} rx={8} ry={7} />
          <ellipse cx={62} cy={188} rx={7} ry={5.5} />
          <ellipse cx={105} cy={130} rx={6} ry={5} />
          <ellipse cx={109} cy={106} rx={5.5} ry={4.6} />
        </g>
        {cabeca}
      </g>
    </svg>
  );
}

export function Passarinho({ className, title }: Props) {
  return (
    <svg viewBox="0 0 100 76" className={className} {...svgProps(title)}>
      <g filter="url(#aq-linha)">
        <g stroke={AZUL} strokeWidth={2.6} strokeLinecap="round" fill="none">
          <path d="M 28 44 C 18 42 10 38 4 32" />
          <path d="M 28 49 C 18 51 10 54 5 58" />
        </g>
        <path
          d="M 27 44 C 23 30 38 20 54 24 C 70 28 80 39 78 49 C 76 59 60 63 46 59 C 36 56 29 52 27 44 Z"
          fill={CEU}
        />
        <path d="M 43 37 C 53 33 66 38 68 46 C 61 51 49 47 43 37 Z" fill={AZUL} opacity={0.75} />
        <path d="M 78 41 L 92 45 L 78 49 Z" fill="#d8a15e" />
        <circle cx={68} cy={36} r={2.2} fill={LINHA} />
      </g>
    </svg>
  );
}

export function Elefante({ className, title }: Props) {
  return (
    <svg viewBox="0 0 220 190" className={className} {...svgProps(title)}>
      <g filter="url(#aq-linha)">
        <g stroke={CEU} strokeWidth={18} strokeLinecap="round" fill="none">
          <path d="M 70 142 v 26" />
          <path d="M 98 148 v 22" />
          <path d="M 128 148 v 22" />
          <path d="M 152 140 v 28" />
        </g>
        <path
          d="M 58 146 C 40 134 36 104 54 86 C 72 68 112 62 138 74 C 164 86 172 116 160 140 C 149 160 82 160 58 146 Z"
          fill={CEU}
        />
        <path
          d="M 76 82 C 56 76 42 92 47 112 C 52 132 72 138 84 128 C 76 114 74 96 76 82 Z"
          fill={AZUL}
          opacity={0.65}
        />
        <path d="M 152 118 C 170 130 172 154 160 166 C 150 176 136 170 138 158" stroke={CEU} strokeWidth={15} fill="none" strokeLinecap="round" />
        <path d="M 62 148 C 48 152 42 162 44 172" stroke={CEU} strokeWidth={4} fill="none" strokeLinecap="round" />
        <circle cx={143} cy={99} r={3} fill={LINHA} />
        <path d="M 137 91 c 4 -3 9 -3 12 -1" stroke={LINHA} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
