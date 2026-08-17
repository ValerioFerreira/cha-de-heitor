"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GIFTS, emReais, type Gift } from "@/data/gifts";
import { CONTEUDO } from "@/data/content";
import { Baby, type BabyPose } from "@/components/art/baby";
import { PAPER_GRAIN_URL } from "@/components/art/filters";
import { Reveal } from "@/components/shared/reveal";

/* ── 03 · o catálogo ───────────────────────────────────────── */

/** O Heitor não repete a mesma pose em cards vizinhos. */
const POSES: BabyPose[] = ["sentado", "espiando", "acenando", "placa"];

export function Presentes() {
  const { presentes } = CONTEUDO;

  return (
    <section id="presentes" className="presentes">
      <div className="cabeca">
        <Reveal as="p" className="rotulo">{presentes.rotulo}</Reveal>
        <Reveal atraso={100}>
          <h2 className="titulo">{presentes.titulo}</h2>
          <p className="nota">{presentes.nota}</p>
        </Reveal>
      </div>

      <ul className="grade">
        {GIFTS.map((g, i) => (
          <li key={g.slug}>
            <Reveal atraso={(i % 3) * 90} forca="sutil">
              <Card gift={g} pose={POSES[i % POSES.length]} />
            </Reveal>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .presentes {
          padding: clamp(3rem, 10vh, 6rem) clamp(1.25rem, 5vw, 4rem)
            clamp(4rem, 12vh, 7rem);
          max-width: 1180px;
          margin-inline: auto;
        }
        .cabeca {
          max-width: 34ch;
          margin-bottom: clamp(2rem, 6vw, 3.5rem);
        }
        .presentes :global(.rotulo) {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 0.92rem;
          color: var(--color-casca);
          margin-bottom: 0.75rem;
        }
        .titulo {
          font-family: var(--font-editorial);
          font-weight: 400;
          font-size: clamp(1.7rem, 6.6vw, 2.6rem);
          line-height: 1.14;
          color: var(--color-navy);
        }
        .nota {
          margin-top: 0.85rem;
          font-size: 0.98rem;
          line-height: 1.65;
          color: var(--color-grafite);
        }
        .grade {
          display: grid;
          gap: clamp(1rem, 3vw, 1.75rem);
          grid-template-columns: 1fr;
          list-style: none;
        }
        @media (min-width: 560px) {
          .grade { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 900px) {
          .grade { grid-template-columns: repeat(3, 1fr); }
          /* o ritmo do catálogo: a coluna do meio desce um pouco */
          .grade > :global(li:nth-child(3n + 2)) { transform: translateY(clamp(1rem, 3vw, 2.5rem)); }
        }
      `}</style>
    </section>
  );
}

function Card({ gift, pose }: { gift: Gift; pose: BabyPose }) {
  const ref = useRef<HTMLElement>(null);
  const [naTela, setNaTela] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setNaTela(e.isIntersecting), {
      threshold: 0.5,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <article ref={ref} className="card" data-na-tela={naTela}>
      <Link href={`/presente/${gift.slug}`} className="alvo">
        <div className="moldura">
          <span className="grao" style={{ backgroundImage: PAPER_GRAIN_URL }} />
          <span className="lamina">
            <Image
              src={gift.imagem}
              alt={`${gift.nome}, ${gift.detalhe}`}
              width={420}
              height={420}
              sizes="(max-width: 560px) 88vw, (max-width: 900px) 44vw, 30vw"
              className="produto"
            />
          </span>
          <span className="heitor">
            <Baby pose={pose} roupa="#d1e2f3" />
          </span>
        </div>

        <div className="ficha">
          <h3>{gift.nome}</h3>
          <p className="detalhe">{gift.detalhe}</p>
          <p className="preco">
            {emReais(gift.precoCentavos)}
            {gift.quantidadeAberta && <em> cada</em>}
          </p>
          <span className="cta">Escolher presente</span>
        </div>
      </Link>

      <style jsx>{`
        .card {
          background: rgba(251, 247, 240, 0.72);
          border: 1px solid rgba(179, 146, 111, 0.3);
          overflow: hidden;
          height: 100%;
          transition: border-color 400ms ease, background 400ms ease;
        }
        .card:hover { border-color: rgba(179, 146, 111, 0.65); background: rgba(251, 247, 240, 0.92); }
        .alvo { display: block; text-decoration: none; color: inherit; height: 100%; }
        .alvo:focus-visible { outline: 2px solid var(--color-taupe); outline-offset: -4px; }

        .moldura {
          position: relative;
          aspect-ratio: 4 / 5;
          background: linear-gradient(168deg, #f8eeda, #efd6b2);
          display: grid;
          place-items: center;
          overflow: hidden;
          clip-path: url(#arco);
        }
        .grao {
          position: absolute;
          inset: 0;
          opacity: 0.28;
          mix-blend-mode: multiply;
          background-size: 180px;
        }
        /* a lâmina de papel: as fotos vêm com fundos quase-brancos diferentes
           entre si, então em vez de tentar recortá-las, elas ficam apoiadas
           sobre papel — o retângulo passa a ser intencional */
        .lamina {
          position: relative;
          z-index: 1;
          display: grid;
          place-items: center;
          width: 74%;
          aspect-ratio: 1;
          background: #fdfaf4;
          border: 1px solid rgba(179, 146, 111, 0.3);
          box-shadow: 0 24px 34px -22px rgba(90, 66, 44, 0.55);
          transform: translateY(-4%);
          transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1),
            box-shadow 900ms ease;
        }
        .card:hover .lamina {
          transform: translateY(-7%);
          box-shadow: 0 30px 40px -22px rgba(90, 66, 44, 0.6);
        }
        .card :global(.produto) {
          width: 84%;
          height: auto;
          max-height: 84%;
          object-fit: contain;
        }

        .heitor {
          position: absolute;
          z-index: 2;
          right: 4%;
          bottom: -2%;
          width: 34%;
          opacity: 0;
          transform: translateY(48%);
          transition: transform 850ms cubic-bezier(0.34, 1.35, 0.64, 1),
            opacity 450ms ease;
        }
        .card[data-na-tela="true"] .heitor,
        .card:hover .heitor {
          opacity: 1;
          transform: translateY(0);
        }

        .ficha { padding: 1.1rem 1.15rem 1.35rem; }
        h3 {
          font-family: var(--font-editorial);
          font-weight: 400;
          font-size: 1.15rem;
          line-height: 1.2;
          color: var(--color-navy);
        }
        .detalhe {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 0.9rem;
          color: var(--color-casca);
          margin-top: 0.15rem;
        }
        .preco {
          font-family: var(--font-ui);
          font-variant-numeric: tabular-nums;
          font-size: 1.02rem;
          color: var(--color-tinta);
          margin: 0.7rem 0 1.1rem;
        }
        .preco em {
          font-family: var(--font-editorial);
          font-size: 0.85rem;
          color: var(--color-casca);
        }
        .cta {
          display: block;
          text-align: center;
          font-family: var(--font-ui);
          font-size: 0.76rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.85rem;
          border: 1px solid var(--color-navy);
          color: var(--color-navy);
          transition: background 320ms ease, color 320ms ease;
        }
        .card:hover .cta { background: var(--color-navy); color: var(--color-linho); }

        @media (prefers-reduced-motion: reduce) {
          .heitor, .card :global(.produto) { transition-duration: 1ms; }
        }
      `}</style>
    </article>
  );
}

/* ── 04 · como funciona ────────────────────────────────────── */

export function ComoFunciona() {
  return (
    <section className="como">
      <ol>
        {CONTEUDO.comoFunciona.map((passo, i) => (
          <Reveal as="li" key={passo} atraso={i * 120} forca="sutil">
            <span className="n">{i + 1}</span>
            <span className="t">{passo}</span>
          </Reveal>
        ))}
      </ol>
      <style jsx>{`
        .como {
          padding: 0 clamp(1.25rem, 5vw, 4rem) clamp(4rem, 12vh, 7rem);
          max-width: 1180px;
          margin-inline: auto;
        }
        ol {
          display: grid;
          gap: clamp(1.25rem, 4vw, 2.5rem);
          list-style: none;
          border-top: 1px solid rgba(179, 146, 111, 0.35);
          padding-top: clamp(1.75rem, 5vw, 2.75rem);
        }
        @media (min-width: 720px) { ol { grid-template-columns: repeat(3, 1fr); } }
        .como :global(li) { display: flex; gap: 0.9rem; align-items: baseline; }
        .n {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 1.1rem;
          color: var(--color-taupe);
        }
        .t {
          font-size: 1rem;
          line-height: 1.6;
          color: var(--color-tinta);
          max-width: 26ch;
        }
      `}</style>
    </section>
  );
}
