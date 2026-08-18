"use client";

import Image from "next/image";

/**
 * Os bichos do quarto do Heitor.
 *
 * Os arquivos originais vêm com o fundo pintado — um cinza quente que
 * clareia de cima para baixo, com horizonte e sombra no chão. Como esse
 * fundo não é branco, nenhum modo de mesclagem o apaga: ele foi recortado
 * de verdade por `scripts/recortar-bichos.mjs`, e o que chega aqui já é
 * só o bicho.
 */

const BICHOS = {
  girafa: { src: "/images/bichos/girafa.png", w: 214, h: 342, alt: "Uma girafinha de lenço azul" },
  leao: { src: "/images/bichos/leao.png", w: 242, h: 308, alt: "Um leãozinho sentado" },
  passaro: { src: "/images/bichos/passaro.png", w: 298, h: 270, alt: "Um passarinho azul" },
  urso: { src: "/images/bichos/urso.png", w: 234, h: 296, alt: "Um ursinho sentado" },
} as const;

export type NomeBicho = keyof typeof BICHOS;

export function Bicho({
  nome,
  className,
  espelhado = false,
  balanca = false,
}: {
  nome: NomeBicho;
  className?: string;
  /** vira o bicho para o outro lado */
  espelhado?: boolean;
  /** um balanço lentíssimo, para quando ele fica muito tempo na tela */
  balanca?: boolean;
}) {
  const b = BICHOS[nome];
  return (
    <span className={`bicho ${balanca ? "balanca" : ""} ${className ?? ""}`} aria-hidden>
      <Image src={b.src} alt="" width={b.w} height={b.h} sizes="200px" />
      <style jsx>{`
        .bicho {
          display: block;
          line-height: 0;
          transform: ${espelhado ? "scaleX(-1)" : "none"};
        }
        .bicho :global(img) {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 10px 14px rgba(90, 66, 44, 0.16));
        }
        .balanca {
          animation: balancar 7s ease-in-out infinite;
          transform-origin: 50% 92%;
        }
        @keyframes balancar {
          0%, 100% { transform: ${espelhado ? "scaleX(-1)" : "scaleX(1)"} rotate(-1.6deg); }
          50% { transform: ${espelhado ? "scaleX(-1)" : "scaleX(1)"} rotate(1.6deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .balanca { animation: none; }
        }
      `}</style>
    </span>
  );
}
