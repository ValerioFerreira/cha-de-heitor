"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GIFTS, emReais, type Gift } from "@/data/gifts";
import { CONTEUDO } from "@/data/content";
import { Baby, type BabyPose } from "@/components/art/baby";
import { PAPER_GRAIN_URL } from "@/components/art/filters";
import { Bicho } from "@/components/shared/bicho";
import { Reveal } from "@/components/shared/reveal";

/* ── 03 · o catálogo ───────────────────────────────────────── */

/** O Heitor não repete a mesma pose em cards vizinhos. */
const POSES: BabyPose[] = ["sentado", "espiando", "acenando", "placa"];

export function Presentes() {
  const { presentes, comoFunciona } = CONTEUDO;

  return (
    <section id="presentes" className="presentes">
      <Bicho nome="urso" className="urso" />

      <div className="cabeca">
        <Reveal>
          <h2 className="titulo">{presentes.titulo}</h2>
        </Reveal>
      </div>

      {/* o passo a passo vem logo antes da lista, para a pessoa já saber o
          que vai acontecer quando clicar num item */}
      <ol className="passos">
        {comoFunciona.map((passo, i) => (
          <Reveal as="li" key={passo} atraso={i * 110} forca="sutil">
            <span className="n">{i + 1}</span>
            <span className="t">{passo}</span>
          </Reveal>
        ))}
      </ol>

      <ul className="grade">
        {GIFTS.map((g, i) => (
          <li key={g.slug}>
            <Reveal atraso={(i % 2) * 90} forca="sutil">
              <Card gift={g} pose={POSES[i % POSES.length]} />
            </Reveal>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .presentes {
          position: relative;
          padding: clamp(3rem, 10vh, 6rem) clamp(1rem, 5vw, 4rem) clamp(4rem, 12vh, 7rem);
          max-width: 1000px;
          margin-inline: auto;
        }
        .presentes :global(.urso) {
          position: absolute;
          top: clamp(0.5rem, 3vw, 2rem);
          right: clamp(-0.5rem, 1vw, 1rem);
          width: clamp(78px, 18vw, 120px);
        }
        .cabeca {
          max-width: 22ch;
          margin-bottom: clamp(1.5rem, 5vw, 2.25rem);
        }
        .titulo {
          font-family: var(--font-editorial);
          font-weight: 400;
          font-size: clamp(1.7rem, 6.6vw, 2.6rem);
          line-height: 1.14;
          color: var(--color-navy);
        }

        .passos {
          display: grid;
          gap: 0.85rem;
          list-style: none;
          border-top: 1px solid rgba(179, 146, 111, 0.35);
          border-bottom: 1px solid rgba(179, 146, 111, 0.35);
          padding: clamp(1.25rem, 4vw, 1.75rem) 0;
          margin-bottom: clamp(1.75rem, 5vw, 2.5rem);
        }
        @media (min-width: 720px) {
          .passos { grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        }
        .presentes :global(.passos li) {
          display: flex;
          gap: 0.75rem;
          align-items: baseline;
        }
        .n {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 1.05rem;
          color: var(--color-taupe);
        }
        .t {
          font-size: 0.95rem;
          line-height: 1.55;
          color: var(--color-tinta);
          max-width: 28ch;
        }

        /* dois por linha em qualquer tela — e baixos o bastante para caberem
           quatro na altura de um celular */
        .grade {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(0.75rem, 2.5vw, 1.5rem);
          list-style: none;
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
      threshold: 0.45,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <article ref={ref} className="card" data-na-tela={naTela}>
      <Link href={`/presente/${gift.slug}`} className="alvo">
        <div className="moldura">
          <span className="grao" style={{ backgroundImage: PAPER_GRAIN_URL }} />
          <Image
            src={gift.imagem}
            alt={`${gift.nome}, ${gift.detalhe}`}
            width={420}
            height={420}
            sizes="(max-width: 720px) 46vw, 300px"
            className="produto"
          />
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
          <span className="cta">Escolher</span>
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
        .card:hover {
          border-color: rgba(179, 146, 111, 0.65);
          background: rgba(251, 247, 240, 0.92);
        }
        .alvo { display: block; text-decoration: none; color: inherit; height: 100%; }
        .alvo:focus-visible { outline: 2px solid var(--color-taupe); outline-offset: -4px; }

        .moldura {
          position: relative;
          aspect-ratio: 1;
          background: linear-gradient(168deg, #f8eeda, #efd6b2);
          display: grid;
          place-items: center;
          overflow: hidden;
          clip-path: url(#arco);
        }
        .grao {
          position: absolute;
          inset: 0;
          opacity: 0.26;
          mix-blend-mode: multiply;
          background-size: 180px;
        }
        /* as imagens em /images/produtos já vêm sem fundo, recortadas por
           scripts/recortar-produtos.mjs — nada de blend aqui */
        .card :global(.produto) {
          position: relative;
          z-index: 1;
          width: 82%;
          height: auto;
          max-height: 78%;
          object-fit: contain;
          filter: drop-shadow(0 16px 20px rgba(90, 66, 44, 0.28));
          transform: translateY(-4%);
          transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .card:hover :global(.produto) { transform: translateY(-7%) scale(1.03); }

        .heitor {
          position: absolute;
          z-index: 2;
          right: 2%;
          bottom: -3%;
          width: 32%;
          opacity: 0;
          transform: translateY(52%);
          transition: transform 850ms cubic-bezier(0.34, 1.35, 0.64, 1), opacity 450ms ease;
        }
        .card[data-na-tela="true"] .heitor,
        .card:hover .heitor { opacity: 1; transform: translateY(0); }

        .ficha { padding: 0.8rem 0.85rem 0.95rem; }
        h3 {
          font-family: var(--font-editorial);
          font-weight: 400;
          font-size: clamp(0.95rem, 3.6vw, 1.05rem);
          line-height: 1.2;
          color: var(--color-navy);
        }
        .detalhe {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: clamp(0.78rem, 3vw, 0.85rem);
          color: var(--color-casca);
          margin-top: 0.1rem;
        }
        .preco {
          font-family: var(--font-ui);
          font-variant-numeric: tabular-nums;
          font-size: clamp(0.9rem, 3.4vw, 0.98rem);
          color: var(--color-tinta);
          margin: 0.45rem 0 0.7rem;
        }
        .preco em {
          font-family: var(--font-editorial);
          font-size: 0.78rem;
          color: var(--color-casca);
        }
        .cta {
          display: block;
          text-align: center;
          font-family: var(--font-ui);
          font-size: 0.68rem;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          padding: 0.62rem;
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
