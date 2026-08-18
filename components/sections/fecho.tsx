"use client";

import Image from "next/image";
import { useState } from "react";
import { CONTEUDO } from "@/data/content";
import CardFanCarousel, { type CardItem } from "@/components/ui/card-fan-carousel";
import { Assinatura } from "@/components/art/signature";
import { Faisca } from "@/components/art/motifs";
import { Reveal } from "@/components/shared/reveal";

/* ── 06 · a galeria ────────────────────────────────────────── */

/**
 * As fotos num leque de cartas (componente do 21st.dev, em
 * `components/ui/card-fan-carousel.tsx`).
 *
 * Cada carta é uma lâmina de papel e a foto entra inteira, sem corte: o
 * ultrassom de perfil é largo, os retratos são altos, e cortar qualquer um
 * dos dois tira justamente o que importa.
 */
const CARTAS: CardItem[] = [
  {
    imgUrl: "/images/casal-1.jpg",
    alt: "Valério e Nathalie sentados no chão, sorrindo",
    largura: 3662,
    altura: 5493,
  },
  {
    imgUrl: "/images/ultrassom-perfil.jpeg",
    alt: "Ultrassom de perfil do Heitor",
    largura: 2724,
    altura: 1807,
  },
  {
    imgUrl: "/images/casal-2.jpg",
    alt: "Valério beijando a testa de Nathalie, as mãos sobre a barriga",
    largura: 4057,
    altura: 6085,
  },
  {
    imgUrl: "/images/ultrassom-frente.jpeg",
    alt: "Ultrassom do rostinho do Heitor",
    largura: 566,
    altura: 909,
  },
  {
    imgUrl: "/images/familia.jpg",
    alt: "Ilustração de Valério e Nathalie com o Heitor no colo",
    largura: 1684,
    altura: 2528,
  },
];

export function Galeria() {
  return (
    <section id="galeria" className="galeria">
      <Reveal forca="destaque">
        <CardFanCarousel cards={CARTAS} />
      </Reveal>

      <style jsx>{`
        .galeria {
          padding: clamp(3rem, 10vh, 6rem) clamp(0.5rem, 3vw, 2rem);
          max-width: 1180px;
          margin-inline: auto;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}

/* ── 07 · a última palavra ─────────────────────────────────── */

const ESTRELAS = [
  { x: 12, y: 14, t: 10, d: 0 },
  { x: 84, y: 9, t: 14, d: 1.4 },
  { x: 68, y: 26, t: 8, d: 2.6 },
  { x: 22, y: 34, t: 12, d: 3.4 },
  { x: 92, y: 44, t: 9, d: 1.9 },
  { x: 6, y: 52, t: 11, d: 4.2 },
];

export function Final() {
  return (
    <section className="final">
      <span className="ceu" aria-hidden>
        {ESTRELAS.map((_, i) => (
          <Faisca key={i} className="estrela" />
        ))}
      </span>

      <Reveal forca="destaque">
        <p className="texto">{CONTEUDO.final.texto}</p>
      </Reveal>

      <Reveal atraso={200}>
        <p className="nome">
          <Assinatura animate={false} />
        </p>
      </Reveal>

      <Reveal atraso={340}>
        {/* a máscara dissolve os quatro cantos, para a ilustração terminar
            no azul da noite em vez de num retângulo */}
        <div className="familia">
          <Image
            src="/images/familia.jpg"
            alt="Ilustração de Valério e Nathalie com o Heitor no colo, no quarto dele"
            width={1684}
            height={2528}
            sizes="(max-width: 780px) 88vw, 460px"
          />
        </div>
      </Reveal>

      <Reveal atraso={440}>
        <p className="pais">{CONTEUDO.final.assinatura}</p>
      </Reveal>

      <style jsx>{`
        .final {
          position: relative;
          padding: clamp(5rem, 16vh, 9rem) clamp(1.5rem, 6vw, 4rem) clamp(2rem, 6vh, 3rem);
          text-align: center;
          max-width: 760px;
          margin-inline: auto;
          color: var(--color-ceu);
        }
        .ceu { position: absolute; inset: 0; pointer-events: none; }
        .final :global(.estrela) {
          position: absolute;
          color: #cfe0ef;
          opacity: 0;
          animation: piscar 6s ease-in-out infinite;
        }
        ${ESTRELAS.map(
          (e, i) => `.final :global(.estrela:nth-child(${i + 1})) {
            left: ${e.x}%; top: ${e.y}%; width: ${e.t}px; animation-delay: ${e.d}s;
          }`
        ).join("\n")}
        @keyframes piscar {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          50% { opacity: 0.75; transform: scale(1); }
        }
        .texto {
          font-family: var(--font-editorial);
          font-size: clamp(1.4rem, 6.4vw, 2.2rem);
          line-height: 1.4;
          text-wrap: balance;
        }
        .nome {
          font-size: clamp(3.5rem, 18vw, 6rem);
          line-height: 0.8;
          margin-top: clamp(1.5rem, 5vw, 2.5rem);
          color: #dce8f3;
        }
        .familia {
          margin: clamp(1rem, 4vw, 2rem) auto 0;
          width: min(88%, 460px);
          --dissolve: radial-gradient(
            ellipse 64% 60% at 50% 46%,
            #000 8%,
            rgba(0, 0, 0, 0.92) 38%,
            rgba(0, 0, 0, 0.45) 66%,
            transparent 88%
          );
          -webkit-mask-image: var(--dissolve);
          mask-image: var(--dissolve);
        }
        .familia :global(img) {
          width: 100%;
          height: auto;
          display: block;
        }
        .pais {
          font-family: var(--font-mao);
          font-size: 1.05rem;
          color: rgba(209, 226, 243, 0.7);
          margin-top: clamp(-3.5rem, -9vw, -1.5rem);
        }
        @media (prefers-reduced-motion: reduce) {
          .final :global(.estrela) { animation: none; opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}

/* ── 08 · rodapé ───────────────────────────────────────────── */

export function Rodape() {
  return (
    <footer className="rodape">
      <Compartilhar />
      <p>
        {CONTEUDO.evento.data} · {CONTEUDO.evento.local}, {CONTEUDO.evento.cidade}
      </p>
      <style jsx>{`
        .rodape {
          padding: clamp(1.5rem, 5vh, 2.5rem) clamp(1.5rem, 6vw, 4rem) clamp(4rem, 10vh, 6rem);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.75rem;
        }
        p {
          font-family: var(--font-ui);
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(209, 226, 243, 0.45);
        }
      `}</style>
    </footer>
  );
}

function Compartilhar() {
  const [copiado, setCopiado] = useState(false);

  async function enviar() {
    const url = window.location.origin;
    const texto = `Chá de fraldas do Heitor — 20 de agosto, 19h30, em Olinda. ${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Esperando Heitor", text: texto, url });
        return;
      } catch {
        /* a pessoa fechou o menu; segue para o link do WhatsApp */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2500);
  }

  return (
    <button type="button" onClick={enviar}>
      {copiado ? "Abrindo o WhatsApp…" : "Compartilhar"}
      <style jsx>{`
        button {
          font-family: var(--font-ui);
          font-size: 0.74rem;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          padding: 0.85rem 1.9rem;
          background: transparent;
          border: 1px solid rgba(209, 226, 243, 0.35);
          color: rgba(209, 226, 243, 0.85);
          cursor: pointer;
          border-radius: 1px;
          transition: border-color 300ms ease, color 300ms ease;
        }
        button:hover { border-color: rgba(209, 226, 243, 0.7); color: #eaf2fa; }
      `}</style>
    </button>
  );
}
