"use client";

import Image from "next/image";
import { CONTEUDO } from "@/data/content";
import { Assinatura, Rubrica } from "@/components/art/signature";
import { Bicho } from "@/components/shared/bicho";
import { Reveal } from "@/components/shared/reveal";

/* ── 01 · a primeira tela ──────────────────────────────────── */

export function Hero() {
  const { hero, evento } = CONTEUDO;

  return (
    <header className="hero">
      <div className="dentro">
        <p className="eyebrow">chá de fraldas · {evento.data.toLowerCase()}</p>

        <h1 className="nome">
          <Assinatura duracao={2.6} delay={0.35} />
          <span className="sr">Heitor</span>
        </h1>

        <div className="figura">
          <div className="retrato">
            <Image
              src="/images/casal-1.jpg"
              alt="Valério e Nathalie sentados no chão, as mãos sobre a barriga"
              fill
              priority
              sizes="(max-width: 780px) 78vw, 40vw"
              style={{ objectFit: "cover", objectPosition: "50% 42%" }}
            />
          </div>
          {/* a girafa fica encostada na foto, nunca por cima do texto */}
          <Bicho nome="girafa" className="girafa" balanca />
        </div>

        <div className="dizeres">
          <h2 className="titulo">{hero.titulo}</h2>
          <p className="mensagem">{hero.mensagem}</p>
        </div>
      </div>

      <style jsx>{`
        .hero {
          min-height: 100svh;
          display: flex;
          align-items: center;
          padding: clamp(4.5rem, 12vh, 7rem) clamp(1.25rem, 6vw, 4rem) 3rem;
        }
        .dentro {
          position: relative;
          width: 100%;
          max-width: 1180px;
          margin-inline: auto;
          display: grid;
          gap: clamp(1.25rem, 4vw, 2rem);
        }
        .eyebrow {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: clamp(0.82rem, 3.2vw, 0.95rem);
          color: var(--color-casca);
        }
        .nome {
          font-family: var(--font-heitor);
          font-size: clamp(5.5rem, 30vw, 11rem);
          line-height: 0.78;
          color: var(--color-navy);
          margin-left: -0.06em;
        }
        .sr {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
        }
        .figura {
          position: relative;
          width: min(78%, 340px);
          margin-left: auto;
          margin-right: calc(clamp(1.25rem, 6vw, 4rem) * -1);
        }
        .retrato {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          clip-path: url(#arco);
          background: var(--color-bruma);
          animation: subir 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both;
        }
        .hero :global(.girafa) {
          position: absolute;
          left: clamp(-72px, -22%, -40px);
          bottom: -4%;
          width: clamp(88px, 24vw, 132px);
          z-index: 2;
          animation: espiar 1.4s cubic-bezier(0.34, 1.35, 0.64, 1) 2.2s both;
        }
        .dizeres { max-width: 34ch; }
        .titulo {
          font-family: var(--font-editorial);
          font-size: clamp(1.5rem, 6.2vw, 2.4rem);
          line-height: 1.16;
          color: var(--color-navy);
          font-weight: 400;
          animation: subir 1.2s cubic-bezier(0.22, 1, 0.36, 1) 1.5s both;
        }
        .mensagem {
          margin-top: 1rem;
          font-size: clamp(0.98rem, 3.9vw, 1.08rem);
          line-height: 1.72;
          color: var(--color-grafite);
          animation: subir 1.2s cubic-bezier(0.22, 1, 0.36, 1) 1.8s both;
        }

        @keyframes subir {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes espiar {
          from { opacity: 0; transform: translateY(40%); }
          to { opacity: 1; transform: none; }
        }

        /* ── telas maiores: o nome atravessa o retrato ───────── */
        @media (min-width: 800px) {
          .dentro {
            grid-template-columns: 1fr minmax(300px, 40%);
            grid-template-areas:
              "eyebrow retrato"
              "nome    retrato"
              "dizeres retrato";
            align-items: center;
            column-gap: clamp(2rem, 5vw, 5rem);
          }
          .eyebrow { grid-area: eyebrow; align-self: end; }
          .nome { grid-area: nome; position: relative; z-index: 2; }
          .dizeres { grid-area: dizeres; }
          .figura {
            grid-area: retrato;
            width: 100%;
            max-width: none;
            margin: 0;
            margin-right: clamp(-4rem, -3vw, -1rem);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .retrato, .titulo, .mensagem, .hero :global(.girafa) {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </header>
  );
}

/* ── 02 · a mensagem dos pais ──────────────────────────────── */

export function Historia() {
  const { historia } = CONTEUDO;

  return (
    <section id="historia" className="historia">
      {/* A cegonha traz a própria animação em SMIL (asas e balanço), então
          entra como <img> — o otimizador do Next não serve SVG animado e
          um <Image> aqui mataria o movimento. */}
      <img src="/images/bebe-cegonha.svg" alt="" aria-hidden className="cegonha" />

      <Reveal as="p" className="rotulo">{historia.rotulo}</Reveal>

      <Reveal forca="destaque" atraso={120}>
        <p className="texto">{historia.texto}</p>
      </Reveal>

      <Reveal atraso={280} className="fim">
        <Rubrica className="filete" />
        <p className="pais">{historia.assinatura}</p>
      </Reveal>

      <style jsx>{`
        .historia {
          position: relative;
          padding: clamp(5rem, 16vh, 9rem) clamp(1.5rem, 8vw, 4rem);
          max-width: 820px;
          margin-inline: auto;
          text-align: center;
          /* a cegonha sai pela esquerda de propósito; sem isto ela cria
             barra de rolagem horizontal no celular */
          overflow: hidden;
        }
        /* ao fundo, ao lado do texto: no celular ela sobe para o canto,
           bem apagada, para não disputar com a leitura */
        .cegonha {
          position: absolute;
          z-index: 0;
          pointer-events: none;
          top: 2%;
          left: -14%;
          width: clamp(190px, 52vw, 300px);
          height: auto;
          opacity: 0.3;
        }
        @media (min-width: 860px) {
          .cegonha {
            top: 50%;
            left: -12%;
            transform: translateY(-50%);
            width: clamp(300px, 30vw, 400px);
            opacity: 0.55;
          }
        }
        .historia :global(.rotulo) {
          position: relative;
          z-index: 1;
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 0.92rem;
          color: var(--color-casca);
          margin-bottom: clamp(1.5rem, 5vw, 2.5rem);
        }
        .texto {
          position: relative;
          z-index: 1;
          font-family: var(--font-editorial);
          font-size: clamp(1.28rem, 5.4vw, 2rem);
          line-height: 1.45;
          color: var(--color-navy);
          text-wrap: balance;
        }
        .historia :global(.fim) {
          position: relative;
          z-index: 1;
          margin-top: clamp(2rem, 7vw, 3.5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .historia :global(.filete) { width: 160px; color: var(--color-taupe); }
        .pais {
          font-family: var(--font-mao);
          font-size: clamp(1.1rem, 4.4vw, 1.35rem);
          color: var(--color-casca);
        }
      `}</style>
    </section>
  );
}
