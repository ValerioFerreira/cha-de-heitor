"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CONTEUDO } from "@/data/content";
import { Assinatura } from "@/components/art/signature";
import { Faisca } from "@/components/art/motifs";
import { Reveal } from "@/components/shared/reveal";

/* ── 06 · a galeria ────────────────────────────────────────── */

/**
 * Nenhuma imagem é recortada: cada uma entra inteira, no formato em que foi
 * entregue, e o quadro se ajusta a ela. É por isso que aqui não há máscara
 * em arco nem `object-fit: cover` — o ultrassom é largo, os retratos são
 * altos, e cortar qualquer um dos dois tirava justamente o que importa.
 */
const CENAS = [
  {
    src: "/images/casal-1.jpg",
    alt: "Valério e Nathalie sentados no chão, sorrindo",
    w: 3662,
    h: 5493,
  },
  {
    src: "/images/ultrassom-perfil.jpeg",
    alt: "Ultrassom de perfil do Heitor",
    w: 2724,
    h: 1807,
  },
  {
    src: "/images/casal-2.jpg",
    alt: "Valério beijando a testa de Nathalie, as mãos sobre a barriga",
    w: 4057,
    h: 6085,
  },
  {
    src: "/images/ultrassom-frente.jpeg",
    alt: "Ultrassom do rostinho do Heitor",
    w: 566,
    h: 909,
  },
];

export function Galeria() {
  const trilho = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const raf = { id: 0 };
    const medir = () => {
      const el = trilho.current;
      raf.id = 0;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const percorrivel = r.height - window.innerHeight;
      if (percorrivel <= 0) return setP(0);
      setP(Math.min(1, Math.max(0, -r.top / percorrivel)));
    };
    const aoRolar = () => {
      if (!raf.id) raf.id = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      cancelAnimationFrame(raf.id);
    };
  }, []);

  const atual = p * (CENAS.length - 1);

  return (
    <section id="galeria" className="trilho" ref={trilho}>
      <div className="palco">
        <div className="janela">
          {CENAS.map((c, i) => {
            const d = Math.abs(atual - i);
            const peso = Math.max(0, 1 - d);
            return (
              <figure key={c.src} style={{ opacity: peso, zIndex: Math.round(peso * 10) }}>
                <Image
                  src={c.src}
                  alt={c.alt}
                  width={c.w}
                  height={c.h}
                  sizes="(max-width: 780px) 88vw, 60vw"
                  style={{
                    // a câmera nunca pára: a imagem em foco continua se
                    // aproximando devagar, mas sem nunca ultrapassar o quadro
                    transform: `scale(${0.985 + (1 - d) * 0.03})`,
                    filter: `blur(${d * 6}px)`,
                  }}
                />
              </figure>
            );
          })}
        </div>

        <div className="pontos" aria-hidden>
          {CENAS.map((c, i) => (
            <span key={c.src} data-ativo={Math.round(atual) === i} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .trilho { height: 340svh; position: relative; }
        .palco {
          position: sticky;
          top: 0;
          height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(1.25rem, 4vw, 2rem);
          padding: clamp(3rem, 8vh, 5rem) clamp(1.25rem, 5vw, 4rem);
        }
        .janela {
          position: relative;
          width: 100%;
          flex: 1;
          min-height: 0;
          display: grid;
          place-items: center;
        }
        figure {
          grid-area: 1 / 1;
          display: grid;
          place-items: center;
          transition: opacity 420ms linear;
        }
        .janela :global(img) {
          max-width: min(88vw, 780px);
          max-height: 68svh;
          width: auto;
          height: auto;
          object-fit: contain;
          box-shadow: 0 30px 60px -34px rgba(43, 33, 25, 0.55);
        }
        .pontos { display: flex; gap: 0.5rem; }
        .pontos span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--color-taupe);
          opacity: 0.28;
          transition: opacity 400ms ease, transform 400ms ease;
        }
        .pontos span[data-ativo="true"] { opacity: 0.85; transform: scale(1.3); }

        @media (prefers-reduced-motion: reduce) {
          .janela :global(img) { transform: none !important; filter: none !important; }
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
