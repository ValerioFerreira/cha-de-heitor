"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Baby } from "./baby";
import { CaixaFundo, CaixaFrente, CaixaTampa, Coracao, Faisca } from "./motifs";

/**
 * A cerimônia do envio.
 *
 * A mensagem do convidado é escrita à mão num papel, o papel é dobrado em
 * três, entra num envelope lacrado com um coração, o Heitor guarda o
 * envelope e o presente dentro da caixa, a tampa desce e a caixa parte.
 *
 * A caixa é montada em três camadas — fundo, carga, frente — para que o
 * envelope e o presente realmente desapareçam *dentro* dela.
 */

const ETAPAS = [
  "papel",
  "texto",
  "assinatura",
  "dobra",
  "envelope",
  "lacre",
  "caixa",
  "guardar",
  "presente",
  "fechar",
  "enviar",
  "obrigado",
] as const;

type Etapa = (typeof ETAPAS)[number];

const DURACAO: Record<Etapa, number> = {
  papel: 800,
  texto: 1700,
  assinatura: 1900,
  dobra: 1200,
  envelope: 1100,
  lacre: 900,
  caixa: 900,
  guardar: 1400,
  presente: 1200,
  fechar: 900,
  enviar: 1500,
  obrigado: 0,
};

export function Cerimonia({
  nome,
  mensagem,
  presenteSrc,
  presenteNome,
  rodando,
  onFim,
}: {
  nome: string;
  mensagem: string;
  presenteSrc: string;
  presenteNome: string;
  rodando: boolean;
  onFim?: () => void;
}) {
  const [i, setI] = useState(0);
  const etapa = ETAPAS[i];

  useEffect(() => {
    if (!rodando) {
      setI(0);
      return;
    }
    if (i >= ETAPAS.length - 1) {
      onFim?.();
      return;
    }
    const t = setTimeout(() => setI((n) => n + 1), DURACAO[ETAPAS[i]]);
    return () => clearTimeout(t);
  }, [rodando, i, onFim]);

  const passou = useMemo(
    () => (e: Etapa) => ETAPAS.indexOf(etapa) >= ETAPAS.indexOf(e),
    [etapa]
  );

  const dobrado = passou("dobra");
  const noEnvelope = passou("envelope");
  const lacrado = passou("lacre");
  const temCaixa = passou("caixa");
  const guardado = passou("guardar");
  const comPresente = passou("presente");
  const fechada = passou("fechar");
  const enviada = passou("enviar");
  const fim = etapa === "obrigado";

  return (
    <div className="cena" aria-live="polite">
      {/* ── o papel ─────────────────────────────────────────── */}
      <div className="ator papel-palco" data-dobrado={dobrado} data-guardado={noEnvelope} data-on={rodando}>
        <div className="papel">
          {[0, 1, 2].map((p) => (
            <div className="painel" key={p} data-p={p}>
              {/* a altura do conteúdo é 300% do painel, então cada terço
                  é 33,33% da própria altura — não 100% */}
              <div className="conteudo" style={{ transform: `translateY(-${p * 33.3333}%)` }}>
                <p className="corpo" data-escrito={passou("texto")}>
                  {mensagem || "…"}
                </p>
                <div className="assina">
                  <span className="nome" data-escrito={passou("assinatura")}>
                    {nome || "sua família"}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <span className="vinco v1" />
          <span className="vinco v2" />
        </div>
      </div>

      {/* ── a caixa, em camadas ─────────────────────────────── */}
      <div className="ator caixa-palco" data-on={temCaixa} data-enviada={enviada}>
        <div className="caixa">
          <CaixaFundo className="camada" />

          <div className="carga">
            {/* o envelope desce para dentro */}
            <div className="envelope" data-on={noEnvelope} data-dentro={guardado}>
              <svg viewBox="0 0 220 150" aria-hidden>
                <rect x={4} y={16} width={212} height={128} rx={3} fill="#fdfaf4" stroke="#b3926f" strokeWidth={1.6} />
                <path d="M 4 144 L 84 74 M 216 144 L 136 74" stroke="#b3926f" strokeWidth={1.1} opacity={0.4} />
                <path
                  className="aba"
                  data-fechada={lacrado}
                  d="M 4 16 L 110 88 L 216 16"
                  fill="#f0d8b6"
                  fillOpacity={0.45}
                  stroke="#b3926f"
                  strokeWidth={1.6}
                  strokeLinejoin="round"
                />
              </svg>
              <span className="lacre" data-on={lacrado}>
                <Coracao />
              </span>
            </div>

            {/* e o presente atrás dele */}
            <div className="produto" data-dentro={comPresente}>
              <Image src={presenteSrc} alt={presenteNome} width={260} height={260} />
            </div>
          </div>

          <CaixaFrente className="camada frente" />
          <CaixaTampa className="camada tampa" data-fechada={fechada} />
        </div>
      </div>

      {/* ── o Heitor ────────────────────────────────────────── */}
      <div className="ator bebe-palco" data-on={temCaixa && !enviada} data-guardando={guardado && !fechada}>
        <Baby pose="alcancando" roupa="#d1e2f3" />
      </div>

      {/* ── as faíscas do envio ─────────────────────────────── */}
      <div className="ator faiscas" data-on={enviada}>
        {[0, 1, 2, 3, 4].map((n) => (
          <Faisca key={n} className={`f f${n}`} />
        ))}
      </div>

      {/* ── o agradecimento ─────────────────────────────────── */}
      <div className="ator obrigado" data-on={fim}>
        <p className="l1">Chegou.</p>
        <p className="l2">
          Obrigado por fazer parte desse momento tão especial. Heitor já tem mais um
          pouquinho de carinho esperando por ele.
        </p>
      </div>

      <style jsx>{`
        .cena {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          max-width: 460px;
          margin-inline: auto;
          perspective: 1400px;
          isolation: isolate;
        }
        .ator {
          position: absolute;
          inset: 0;
        }

        /* ── papel ─────────────────────────────────────────── */
        .papel-palco {
          display: grid;
          place-items: center;
          z-index: 4;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 600ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .papel-palco[data-on="true"] {
          opacity: 1;
          transform: none;
        }
        .papel {
          position: relative;
          width: 60%;
          aspect-ratio: 3 / 4.2;
          transform-style: preserve-3d;
          transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease;
          filter: drop-shadow(0 16px 30px rgba(43, 33, 25, 0.22));
        }
        .papel-palco[data-dobrado="true"] .papel {
          transform: translateY(8%) scale(0.9);
        }
        .papel-palco[data-guardado="true"] .papel {
          transform: translateY(26%) scale(0.5);
          opacity: 0;
          transition-delay: 200ms;
        }
        .painel {
          position: absolute;
          left: 0;
          width: 100%;
          height: 33.34%;
          overflow: hidden;
          background: #fdfaf4;
          backface-visibility: hidden;
          transition: transform 900ms cubic-bezier(0.65, 0, 0.35, 1), background 900ms ease;
        }
        .painel[data-p="0"] { top: 0; transform-origin: bottom center; }
        .painel[data-p="1"] { top: 33.33%; }
        .painel[data-p="2"] { top: 66.66%; transform-origin: top center; }
        .papel-palco[data-dobrado="true"] .painel[data-p="0"] {
          transform: rotateX(-176deg) translateZ(1px);
          background: #f7f1e6;
        }
        .papel-palco[data-dobrado="true"] .painel[data-p="2"] {
          transform: rotateX(176deg) translateZ(2px);
          background: #f3ece0;
          transition-delay: 200ms;
        }
        .conteudo {
          position: absolute;
          inset: 0;
          height: 300%;
          padding: 9% 11%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .corpo {
          font-family: var(--font-mao);
          font-size: clamp(0.7rem, 2.5vw, 0.92rem);
          line-height: 1.95;
          color: #3a2f26;
          clip-path: inset(0 100% 0 0);
        }
        .corpo[data-escrito="true"] {
          animation: escrever 1.6s cubic-bezier(0.5, 0, 0.4, 1) forwards;
        }
        .assina { align-self: flex-end; padding-right: 3%; }
        .nome {
          font-family: var(--font-mao);
          font-size: clamp(0.95rem, 3.4vw, 1.28rem);
          color: #1f3b52;
          display: inline-block;
          clip-path: inset(0 100% 0 0);
        }
        .nome[data-escrito="true"] {
          animation: escrever 1.5s cubic-bezier(0.45, 0, 0.35, 1) forwards;
        }
        @keyframes escrever {
          to { clip-path: inset(0 -3% 0 0); }
        }
        .vinco {
          position: absolute;
          left: 0;
          width: 100%;
          height: 1px;
          background: rgba(179, 146, 111, 0.4);
          opacity: 0;
          transition: opacity 400ms ease;
        }
        .v1 { top: 33.33%; }
        .v2 { top: 66.66%; }
        .papel-palco[data-dobrado="true"] .vinco { opacity: 1; }

        /* ── caixa ─────────────────────────────────────────── */
        .caixa-palco {
          display: grid;
          place-items: end center;
          padding-bottom: 8%;
          z-index: 3;
          opacity: 0;
          transform: translateY(16%);
          transition: opacity 600ms ease, transform 1000ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .caixa-palco[data-on="true"] { opacity: 1; transform: none; }
        .caixa-palco[data-enviada="true"] {
          transform: translateY(-120%) rotate(-7deg) scale(0.66);
          opacity: 0;
          transition: transform 1400ms cubic-bezier(0.5, 0, 0.2, 1), opacity 500ms ease 950ms;
        }
        .caixa {
          position: relative;
          width: 68%;
          aspect-ratio: 260 / 220;
        }
        .caixa :global(.camada) {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
        .caixa :global(.frente) { z-index: 3; }
        .caixa :global(.tampa) {
          z-index: 4;
          transform: translate(10%, -13%) rotate(-7deg);
          transition: transform 800ms cubic-bezier(0.5, 0, 0.3, 1);
        }
        .caixa :global(.tampa[data-fechada="true"]) {
          transform: none;
        }
        .carga {
          position: absolute;
          inset: 0;
          z-index: 2;
        }

        .envelope {
          position: absolute;
          left: 22%;
          width: 56%;
          top: -46%;
          opacity: 0;
          transform: rotate(-4deg);
          transition: opacity 400ms ease, top 900ms cubic-bezier(0.5, 0, 0.4, 1),
            transform 900ms ease;
        }
        .envelope[data-on="true"] { opacity: 1; }
        .envelope[data-dentro="true"] {
          top: 26%;
          transform: rotate(2deg) scale(0.86);
        }
        .envelope :global(svg) { width: 100%; height: auto; display: block; }
        .aba {
          transform-origin: center 16px;
          transform: rotateX(180deg);
          transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .aba[data-fechada="true"] { transform: rotateX(0deg); }
        .lacre {
          position: absolute;
          left: 47%;
          top: 52%;
          width: 11%;
          color: #b04a4a;
          opacity: 0;
          transform: scale(0.3);
          transition: opacity 300ms ease, transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .lacre[data-on="true"] { opacity: 1; transform: scale(1); transition-delay: 400ms; }
        .lacre :global(svg) { width: 100%; height: auto; }

        .produto {
          position: absolute;
          left: 30%;
          width: 40%;
          top: -52%;
          opacity: 0;
          transition: opacity 300ms ease, top 850ms cubic-bezier(0.5, 0, 0.4, 1);
        }
        .produto[data-dentro="true"] { opacity: 1; top: 20%; }
        .produto :global(img) {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 8px 12px rgba(43, 33, 25, 0.2));
        }

        /* ── bebê ──────────────────────────────────────────── */
        .bebe-palco {
          display: grid;
          place-items: end start;
          padding-left: 6%;
          padding-bottom: 6%;
          z-index: 5;
          opacity: 0;
          transform: translateX(-14%);
          transition: opacity 500ms ease, transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: none;
        }
        .bebe-palco[data-on="true"] { opacity: 1; transform: none; }
        .bebe-palco :global(svg) {
          width: 30%;
          min-width: 96px;
          height: auto;
          transition: transform 700ms cubic-bezier(0.34, 1.4, 0.64, 1);
        }
        .bebe-palco[data-guardando="true"] :global(svg) {
          transform: translate(16%, -10%) rotate(6deg);
        }

        /* ── faíscas ───────────────────────────────────────── */
        .faiscas { z-index: 6; pointer-events: none; opacity: 0; }
        .faiscas[data-on="true"] { opacity: 1; }
        .faiscas :global(.f) { position: absolute; width: 14px; color: #d8b877; opacity: 0; }
        .faiscas[data-on="true"] :global(.f) { animation: brilha 1.5s ease-out forwards; }
        .faiscas :global(.f0) { left: 30%; top: 48%; animation-delay: 0.1s; }
        .faiscas :global(.f1) { left: 62%; top: 40%; animation-delay: 0.28s; width: 10px; }
        .faiscas :global(.f2) { left: 44%; top: 62%; animation-delay: 0.42s; width: 18px; }
        .faiscas :global(.f3) { left: 70%; top: 60%; animation-delay: 0.16s; width: 9px; }
        .faiscas :global(.f4) { left: 24%; top: 64%; animation-delay: 0.52s; width: 12px; }
        @keyframes brilha {
          0% { opacity: 0; transform: scale(0.2); }
          35% { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.5) translateY(-26px); }
        }

        /* ── agradecimento ─────────────────────────────────── */
        .obrigado {
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          padding-inline: 8%;
          z-index: 7;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 800ms ease 200ms, transform 900ms cubic-bezier(0.22, 1, 0.36, 1) 200ms;
          pointer-events: none;
        }
        .obrigado[data-on="true"] { opacity: 1; transform: none; }
        .l1 {
          font-family: var(--font-mao);
          font-size: clamp(1.7rem, 7vw, 2.5rem);
          color: #032a42;
          margin-bottom: 0.5em;
        }
        .l2 {
          font-size: clamp(0.9rem, 3.6vw, 1.02rem);
          line-height: 1.75;
          color: #5c5347;
          max-width: 30ch;
          margin-inline: auto;
        }

        @media (prefers-reduced-motion: reduce) {
          .cena :global(*) {
            transition-duration: 1ms !important;
            animation-duration: 1ms !important;
          }
        }
      `}</style>
    </div>
  );
}
