"use client";

import Image from "next/image";
import { CONTEUDO } from "@/data/content";
import { Assinatura, Rubrica } from "@/components/art/signature";
import { Girafa, Passarinho } from "@/components/art/animals";
import { Reveal } from "@/components/shared/reveal";

/* ── 01 · a primeira tela ──────────────────────────────────── */

export function Hero() {
  const { hero, evento } = CONTEUDO;

  return (
    <header className="hero">
      <div className="dentro">
        <p className="eyebrow">
          chá de fraldas · {evento.data.toLowerCase()}
        </p>

        <h1 className="nome">
          <Assinatura duracao={2.6} delay={0.35} />
          <span className="sr">Heitor</span>
        </h1>

        <div className="retrato">
          <Image
            src="/images/casal-1.jpg"
            alt="Valério e Nathalie sentados no chão, as mãos sobre a barriga"
            fill
            priority
            sizes="(max-width: 780px) 78vw, 40vw"
            style={{ objectFit: "cover", objectPosition: "50% 42%" }}
          />
          <Girafa variant="espiando" className="girafa" />
        </div>

        <div className="dizeres">
          <h2 className="titulo">{hero.titulo}</h2>
          <p className="mensagem">{hero.mensagem}</p>
        </div>

        <a href="#historia" className="descer">
          <span>{hero.convite}</span>
          <i />
        </a>
      </div>

      <style jsx>{`
        .hero {
          min-height: 100svh;
          display: flex;
          align-items: center;
          padding: clamp(4.5rem, 12vh, 7rem) clamp(1.25rem, 6vw, 4rem) 3rem;
        }
        .dentro {
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
        .retrato {
          position: relative;
          width: min(78%, 340px);
          aspect-ratio: 3 / 4;
          margin-left: auto;
          margin-right: calc(clamp(1.25rem, 6vw, 4rem) * -1);
          clip-path: url(#arco);
          background: var(--color-bruma);
          animation: subir 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both;
        }
        .retrato :global(.girafa) {
          position: absolute;
          left: -14%;
          bottom: -2%;
          width: 42%;
          height: auto;
          animation: espiar 1.2s cubic-bezier(0.34, 1.4, 0.64, 1) 2.4s both;
        }
        .dizeres {
          max-width: 34ch;
        }
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
        .descer {
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 0.9rem;
          color: var(--color-casca);
          text-decoration: none;
          animation: subir 1s ease 2.4s both;
        }
        .descer i {
          display: block;
          width: 1px;
          height: 34px;
          background: linear-gradient(var(--color-taupe), transparent);
          animation: respirar 2.8s ease-in-out infinite;
          transform-origin: top;
        }

        @keyframes subir {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes espiar {
          from { opacity: 0; transform: translateY(46%); }
          to { opacity: 1; transform: none; }
        }
        @keyframes respirar {
          0%, 100% { transform: scaleY(0.55); opacity: 0.5; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        /* ── telas maiores: o nome atravessa o retrato ───────── */
        @media (min-width: 800px) {
          .dentro {
            grid-template-columns: 1fr minmax(300px, 40%);
            grid-template-areas:
              "eyebrow retrato"
              "nome    retrato"
              "dizeres retrato"
              "descer  retrato";
            align-items: center;
            column-gap: clamp(2rem, 5vw, 5rem);
          }
          .eyebrow { grid-area: eyebrow; align-self: end; }
          .nome { grid-area: nome; position: relative; z-index: 2; }
          .dizeres { grid-area: dizeres; }
          .descer { grid-area: descer; }
          .retrato {
            grid-area: retrato;
            width: 100%;
            max-width: none;
            margin: 0;
            margin-right: clamp(-4rem, -3vw, -1rem);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .retrato, .titulo, .mensagem, .descer, .retrato :global(.girafa) {
            animation: none;
            opacity: 1;
            transform: none;
          }
          .descer i { animation: none; }
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
      <Reveal as="p" className="rotulo">{historia.rotulo}</Reveal>

      <Reveal forca="destaque" atraso={120}>
        <p className="texto">{historia.texto}</p>
      </Reveal>

      <Reveal atraso={280} className="fim">
        <Rubrica className="filete" />
        <p className="pais">{historia.assinatura}</p>
        <Passarinho className="passaro" />
      </Reveal>

      <style jsx>{`
        .historia {
          padding: clamp(5rem, 16vh, 9rem) clamp(1.5rem, 8vw, 4rem);
          max-width: 820px;
          margin-inline: auto;
          text-align: center;
        }
        .historia :global(.rotulo) {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 0.92rem;
          color: var(--color-casca);
          margin-bottom: clamp(1.5rem, 5vw, 2.5rem);
        }
        .texto {
          font-family: var(--font-editorial);
          font-size: clamp(1.28rem, 5.4vw, 2rem);
          line-height: 1.45;
          color: var(--color-navy);
          text-wrap: balance;
        }
        .historia :global(.fim) {
          margin-top: clamp(2rem, 7vw, 3.5rem);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .historia :global(.filete) {
          width: 160px;
          color: var(--color-taupe);
        }
        .pais {
          font-family: var(--font-mao);
          font-size: clamp(1.1rem, 4.4vw, 1.35rem);
          color: var(--color-casca);
        }
        .historia :global(.passaro) {
          width: 54px;
          height: auto;
          margin-top: 0.75rem;
          opacity: 0.85;
        }
      `}</style>
    </section>
  );
}
