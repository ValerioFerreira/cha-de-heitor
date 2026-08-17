"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CONTEUDO } from "@/data/content";
import { Assinatura } from "@/components/art/signature";
import { Baby } from "@/components/art/baby";
import { Faisca } from "@/components/art/motifs";
import { Reveal } from "@/components/shared/reveal";

/* ── 07 · a galeria ────────────────────────────────────────── */

const CENAS = [
  {
    src: "/images/casal-2.jpg",
    alt: "Valério beijando a testa de Nathalie, as mãos sobre a barriga",
    legenda: "esperando",
    ajuste: "50% 38%",
  },
  {
    src: "/images/ultrassom-perfil.jpeg",
    alt: "Ultrassom de perfil do Heitor, 22 semanas",
    legenda: "22 semanas",
    ajuste: "50% 50%",
    ultrassom: true,
    // a foto é de uma folha impressa: este enquadramento descarta o papel
    // em volta e traz o perfil dele para o centro do arco
    enquadre: { x: 24, y: -3, zoom: 1.7 },
  },
  {
    src: "/images/casal-1.jpg",
    alt: "Valério e Nathalie sentados no chão, sorrindo",
    legenda: "quase lá",
    ajuste: "50% 44%",
  },
];

/**
 * Sem carrossel: as imagens se dissolvem umas nas outras enquanto uma escala
 * lentíssima continua rodando por baixo. Quem conduz é o scroll — o palco fica
 * grudado na tela enquanto a página avança por trás dele.
 */
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
        <p className="rotulo">{CONTEUDO.galeria.rotulo}</p>

        <div className="janela">
          {CENAS.map((c, i) => {
            const d = Math.abs(atual - i);
            const peso = Math.max(0, 1 - d);
            const e = c.enquadre;
            const base = e ? `translate(${e.x}%, ${e.y}%) ` : "";
            const zoom = (e?.zoom ?? 1.04) + (1 - d) * 0.09;
            return (
              <figure key={c.src} style={{ opacity: peso, zIndex: Math.round(peso * 10) }}>
                <Image
                  src={c.src}
                  alt={c.alt}
                  fill
                  sizes="(max-width: 780px) 86vw, 46vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: c.ajuste,
                    // a câmera nunca pára: cada imagem continua se aproximando
                    transform: `${base}scale(${zoom})`,
                    filter: c.ultrassom
                      ? `contrast(1.28) brightness(1.12) saturate(0.2) blur(${d * 5}px)`
                      : `blur(${d * 5}px)`,
                  }}
                />
                {c.ultrassom && <span className="veu" />}
              </figure>
            );
          })}
        </div>

        <p className="legenda" key={Math.round(atual)}>
          {CENAS[Math.round(atual)].legenda}
        </p>
      </div>

      <style jsx>{`
        .trilho { height: 260svh; position: relative; }
        .palco {
          position: sticky;
          top: 0;
          height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: clamp(1rem, 3vw, 1.5rem);
          padding: clamp(3rem, 8vh, 5rem) clamp(1.5rem, 6vw, 4rem);
        }
        .rotulo {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 0.92rem;
          color: var(--color-casca);
        }
        .janela {
          position: relative;
          width: min(86vw, 46vh * 0.75 * 2);
          max-width: 460px;
          aspect-ratio: 3 / 4;
          max-height: 62svh;
          clip-path: url(#arco);
          background: var(--color-noite);
          overflow: hidden;
        }
        figure {
          position: absolute;
          inset: 0;
          transition: opacity 420ms linear;
        }
        .veu {
          position: absolute;
          inset: 0;
          background: radial-gradient(115% 85% at 50% 45%, transparent 26%, rgba(4, 33, 47, 0.9) 100%);
        }
        .legenda {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: clamp(1rem, 4vw, 1.2rem);
          color: var(--color-casca);
          animation: aparecer 700ms ease both;
        }
        @keyframes aparecer {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .legenda { animation: none; }
          figure :global(img) { transform: scale(1.04) !important; filter: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ── 08 · a última palavra ─────────────────────────────────── */

export function Final() {
  return (
    <section className="final">
      <span className="ceu" aria-hidden>
        {ESTRELAS.map((e, i) => (
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
        <Baby pose="dormindo" roupa="#1f4a63" className="bebe" />
        <p className="pais">{CONTEUDO.final.assinatura}</p>
      </Reveal>

      <style jsx>{`
        .final {
          position: relative;
          padding: clamp(5rem, 16vh, 9rem) clamp(1.5rem, 6vw, 4rem) clamp(3rem, 8vh, 5rem);
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
        .final :global(.bebe) {
          width: clamp(120px, 34vw, 170px);
          height: auto;
          margin: clamp(1.5rem, 5vw, 2.5rem) auto 0.75rem;
          opacity: 0.9;
        }
        .pais {
          font-family: var(--font-mao);
          font-size: 1.05rem;
          color: rgba(209, 226, 243, 0.7);
        }
        @media (prefers-reduced-motion: reduce) {
          .final :global(.estrela) { animation: none; opacity: 0.5; }
        }
      `}</style>
    </section>
  );
}

const ESTRELAS = [
  { x: 12, y: 18, t: 10, d: 0 },
  { x: 84, y: 12, t: 14, d: 1.4 },
  { x: 68, y: 34, t: 8, d: 2.6 },
  { x: 22, y: 46, t: 12, d: 3.4 },
  { x: 92, y: 58, t: 9, d: 1.9 },
  { x: 6, y: 66, t: 11, d: 4.2 },
];

/* ── 09 · rodapé ───────────────────────────────────────────── */

export function Rodape() {
  return (
    <footer className="rodape">
      <Compartilhar />
      <p>
        {CONTEUDO.evento.data} · {CONTEUDO.evento.local}, {CONTEUDO.evento.cidade}
      </p>
      <style jsx>{`
        .rodape {
          padding: 0 clamp(1.5rem, 6vw, 4rem) clamp(4rem, 10vh, 6rem);
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
