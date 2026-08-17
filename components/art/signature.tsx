"use client";

/**
 * "Heitor" — a assinatura, na Autography.
 *
 * O nome não aparece: ele é escrito. Uma máscara abre da esquerda para a
 * direita no ritmo de uma mão, com uma pequena pausa no meio, e um ponto de
 * tinta corre na ponta da revelação como se fosse a caneta.
 */

export function Assinatura({
  className,
  animate = true,
  delay = 0,
  texto = "Heitor",
  duracao = 2.2,
}: {
  className?: string;
  animate?: boolean;
  delay?: number;
  texto?: string;
  duracao?: number;
}) {
  return (
    <span
      className={`assinatura ${animate ? "escrevendo" : ""} ${className ?? ""}`}
      style={
        {
          "--dur": `${duracao}s`,
          "--atraso": `${delay}s`,
        } as React.CSSProperties
      }
    >
      <span className="tinta">{texto}</span>
      <style jsx>{`
        .assinatura {
          font-family: var(--font-heitor), cursive;
          display: inline-block;
          position: relative;
          line-height: 0.82;
          /* a Autography deixa muito ar embaixo; isso reencosta o nome
             na linha de base ótica */
          padding-block: 0.14em 0.06em;
        }
        .tinta {
          display: inline-block;
        }
        /* o recorte só existe enquanto o nome está sendo escrito — parado,
           ele precisa aparecer inteiro */
        .escrevendo .tinta {
          clip-path: inset(0 100% -0.3em 0);
          animation: escrever-nome var(--dur) cubic-bezier(0.42, 0, 0.3, 1)
            var(--atraso) forwards;
        }
        @keyframes escrever-nome {
          0% { clip-path: inset(0 100% -0.3em 0); }
          38% { clip-path: inset(0 58% -0.3em 0); }
          52% { clip-path: inset(0 46% -0.3em 0); }
          100% { clip-path: inset(0 -4% -0.3em 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .escrevendo .tinta {
            animation: none;
            clip-path: none;
          }
        }
      `}</style>
    </span>
  );
}

/** O filete que separa as seções — o traço que sobra da assinatura. */
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
