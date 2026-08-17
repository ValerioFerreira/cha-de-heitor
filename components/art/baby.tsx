/**
 * Heitor — o personagem que acompanha os presentes.
 *
 * Um só desenho, seis posições. Cabeça, corpo e membros são peças
 * separadas para que as posições sejam variações da mesma criança,
 * e não seis bebês diferentes.
 *
 * Cada forma leva um contorno de tinta por baixo do preenchimento:
 * sem ele a pele some contra os fundos claros do site.
 */

export type BabyPose =
  | "sentado"
  | "espiando"
  | "acenando"
  | "placa"
  | "dormindo"
  | "alcancando";

const PELE = "#f2d8c2";
const CABELO = "#9b7350";
const LINHA = "#7a5a3f";
const TRACO = "#4a3728";
const BLUSH = "#e5ab99";

type Props = {
  pose?: BabyPose;
  roupa?: string;
  className?: string;
  title?: string;
};

type Membro = { d: string; w: number };

/** Desenha os membros duas vezes: contorno por baixo, pele por cima. */
function Membros({ lista, cor = PELE }: { lista: Membro[]; cor?: string }) {
  return (
    <>
      <g fill="none" stroke={LINHA} strokeLinecap="round" opacity={0.55}>
        {lista.map((m, i) => (
          <path key={`c${i}`} d={m.d} strokeWidth={m.w + 3} />
        ))}
      </g>
      <g fill="none" stroke={cor} strokeLinecap="round">
        {lista.map((m, i) => (
          <path key={`p${i}`} d={m.d} strokeWidth={m.w} />
        ))}
      </g>
    </>
  );
}

function Mao({ x, y, r = 8.5 }: { x: number; y: number; r?: number }) {
  return <circle cx={x} cy={y} r={r} fill={PELE} stroke={LINHA} strokeWidth={1.6} strokeOpacity={0.55} />;
}

function Cabeca({ dormindo = false }: { dormindo?: boolean }) {
  return (
    <g>
      <g stroke={LINHA} strokeWidth={1.8} strokeOpacity={0.55}>
        <circle cx={-45} cy={6} r={8.5} fill={PELE} />
        <circle cx={45} cy={6} r={8.5} fill={PELE} />
        <ellipse cx={0} cy={0} rx={45} ry={42} fill={PELE} />
      </g>

      <path
        d="M -13 -40 C -9 -55 9 -59 15 -48 C 19 -40 9 -34 1 -38"
        fill="none"
        stroke={CABELO}
        strokeWidth={5}
        strokeLinecap="round"
      />

      {dormindo ? (
        <g fill="none" stroke={TRACO} strokeWidth={2.6} strokeLinecap="round">
          <path d="M -24 4 c 5 -7 12 -7 17 0" />
          <path d="M 7 4 c 5 -7 12 -7 17 0" />
        </g>
      ) : (
        <g fill={TRACO}>
          <ellipse cx={-15} cy={2} rx={3.4} ry={4.2} />
          <ellipse cx={15} cy={2} rx={3.4} ry={4.2} />
          <circle cx={-13.8} cy={0.4} r={1.1} fill="#fff" />
          <circle cx={16.2} cy={0.4} r={1.1} fill="#fff" />
        </g>
      )}

      <path d="M -6 17 c 4 5 9 5 12 0" fill="none" stroke={TRACO} strokeWidth={2.4} strokeLinecap="round" />

      <g fill={BLUSH} opacity={0.45}>
        <ellipse cx={-27} cy={13} rx={8} ry={4.5} />
        <ellipse cx={27} cy={13} rx={8} ry={4.5} />
      </g>
    </g>
  );
}

const CORPO_D =
  "M 68 118 C 61 148 61 182 72 194 C 88 206 112 206 128 194 C 139 182 139 148 132 118 C 112 110 88 110 68 118 Z";

function Corpo({ roupa }: { roupa: string }) {
  return (
    <g>
      <path d={CORPO_D} fill={roupa} stroke={LINHA} strokeWidth={1.8} strokeOpacity={0.55} />
      <path d="M 74 117 C 88 111 112 111 126 117" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.6} />
      <circle cx={100} cy={150} r={2.6} fill="#fff" opacity={0.75} />
      <circle cx={100} cy={166} r={2.6} fill="#fff" opacity={0.75} />
    </g>
  );
}

/* pernas sentadas — as mesmas em quase todas as poses */
const PERNAS: Membro[] = [
  { d: "M 86 188 C 74 204 58 212 44 210", w: 17 },
  { d: "M 114 188 C 126 204 142 212 156 210", w: 17 },
];

const BRACOS_SOLTOS: Membro[] = [
  { d: "M 74 130 C 60 144 54 160 56 174", w: 14 },
  { d: "M 126 130 C 140 144 146 160 144 174", w: 14 },
];

export function Baby({ pose = "sentado", roupa = "#d1e2f3", className, title }: Props) {
  return (
    <svg
      viewBox="0 0 200 240"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <g filter="url(#aq-linha)">
        {pose === "dormindo" && (
          <g transform="translate(-14,14)">
            {/* deitado de lado, joelhos encolhidos, cabeça à direita */}
            <Membros
              lista={[
                { d: "M 72 178 C 52 184 40 198 48 210", w: 16 },
                { d: "M 88 190 C 68 198 58 210 66 220", w: 16 },
              ]}
            />
            <Mao x={48} y={212} r={9} />
            <Mao x={67} y={222} r={9} />
            <path
              d="M 44 172 C 38 150 56 134 88 132 C 122 130 146 142 148 164 C 150 186 124 196 90 196 C 62 196 48 188 44 172 Z"
              fill={roupa}
              stroke={LINHA}
              strokeWidth={1.8}
              strokeOpacity={0.55}
            />
            <Membros lista={[{ d: "M 122 168 C 138 174 146 186 140 196", w: 13 }]} />
            <Mao x={138} y={198} r={8} />
            <g transform="translate(158,148) rotate(10)">
              <Cabeca dormindo />
            </g>
            {/* o sono */}
            <g fill="none" stroke={LINHA} strokeWidth={2.2} strokeLinecap="round" opacity={0.35}>
              <path d="M 176 92 c 7 -5 14 4 7 9 c -7 5 0 11 7 8" />
              <path d="M 196 68 c 5 -4 10 3 5 6 c -5 4 0 8 5 6" />
            </g>
          </g>
        )}

        {pose === "sentado" && (
          <g>
            <Membros lista={PERNAS} />
            <Corpo roupa={roupa} />
            <Membros lista={BRACOS_SOLTOS} />
            <Mao x={56} y={176} />
            <Mao x={144} y={176} />
            <g transform="translate(100,78)">
              <Cabeca />
            </g>
          </g>
        )}

        {pose === "acenando" && (
          <g>
            <Membros lista={PERNAS} />
            <Corpo roupa={roupa} />
            <g className="aceno">
              <Membros lista={[{ d: "M 126 130 C 144 120 154 102 152 86", w: 14 }]} />
              <Mao x={151} y={82} r={9} />
            </g>
            <Membros lista={[BRACOS_SOLTOS[0]]} />
            <Mao x={56} y={176} />
            <g transform="translate(100,78)">
              <Cabeca />
            </g>
            <style>{`
              .aceno { transform-box: fill-box; transform-origin: 20% 90%; animation: acenar 2.6s ease-in-out infinite; }
              @keyframes acenar {
                0%, 60%, 100% { transform: rotate(0deg); }
                70% { transform: rotate(-13deg); }
                80% { transform: rotate(6deg); }
                90% { transform: rotate(-8deg); }
              }
              @media (prefers-reduced-motion: reduce) { .aceno { animation: none; } }
            `}</style>
          </g>
        )}

        {pose === "alcancando" && (
          <g>
            <Membros lista={PERNAS} />
            <Corpo roupa={roupa} />
            <Membros
              lista={[
                { d: "M 74 128 C 54 112 46 88 50 64", w: 14 },
                { d: "M 126 128 C 146 112 154 88 150 64", w: 14 },
              ]}
            />
            <Mao x={49} y={59} r={9.5} />
            <Mao x={151} y={59} r={9.5} />
            <g transform="translate(100,92)">
              <Cabeca />
            </g>
          </g>
        )}

        {pose === "placa" && (
          <g>
            <Membros lista={PERNAS} />
            <Corpo roupa={roupa} />
            <g transform="rotate(-4 100 152)">
              <path
                d="M 60 130 L 140 130 L 140 176 L 60 176 Z"
                fill="#fdfaf4"
                stroke={LINHA}
                strokeWidth={1.8}
                strokeOpacity={0.7}
              />
              <path
                d="M 74 146 h 52 M 74 159 h 32"
                stroke={LINHA}
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.4}
              />
            </g>
            <Membros lista={[
              { d: "M 76 128 C 66 136 62 146 66 154", w: 12 },
              { d: "M 124 128 C 134 136 138 146 134 154", w: 12 },
            ]} />
            <Mao x={66} y={152} r={7.5} />
            <Mao x={134} y={152} r={7.5} />
            <g transform="translate(100,74)">
              <Cabeca />
            </g>
          </g>
        )}

        {pose === "espiando" && (
          <g transform="translate(0,40)">
            <g transform="translate(100,74)">
              <Cabeca />
            </g>
            <Membros lista={[
              { d: "M 56 112 C 54 122 58 130 66 132" , w: 12 },
              { d: "M 144 112 C 146 122 142 130 134 132", w: 12 },
            ]} />
            <g stroke={LINHA} strokeWidth={1.8} strokeOpacity={0.55}>
              <ellipse cx={62} cy={128} rx={12} ry={9.5} fill={PELE} />
              <ellipse cx={138} cy={128} rx={12} ry={9.5} fill={PELE} />
            </g>
            <g stroke={LINHA} strokeWidth={1.5} strokeLinecap="round" opacity={0.5}>
              <path d="M 56 124 v 8 M 62 123 v 9 M 68 124 v 8" />
              <path d="M 132 124 v 8 M 138 123 v 9 M 144 124 v 8" />
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
