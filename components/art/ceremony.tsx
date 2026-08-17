"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Baby } from "./baby";
import { CaixaFundo, CaixaFrente, CaixaTampa, Coracao, Faisca } from "./motifs";

/**
 * A cerimônia do envio.
 *
 * Todas as peças vivem no mesmo plano, empilhadas por z-index. É isso que
 * permite uma coisa entrar dentro da outra: a carta dobrada desce e passa por
 * trás da frente do envelope; o envelope desce e passa por trás da frente da
 * caixa. Nada é escondido por opacidade — some porque entrou.
 *
 *   z1 fundo da caixa
 *   z2 fundo do envelope
 *   z3 carta · presente
 *   z4 frente do envelope   ← engole a carta
 *   z5 aba · lacre
 *   z7 frente da caixa      ← engole o envelope e o presente
 *   z8 tampa
 *   z9 Heitor
 */

const ETAPAS = [
  "papel", // o papel em branco aparece
  "texto", // a mensagem se escreve
  "assinatura", // o nome se assina
  "ler", // a carta fica inteira, parada
  "dobra", // o papel é dobrado — e continua na tela
  "envelope", // o envelope aberto aparece embaixo
  "carta-entra", // a carta dobrada é colocada dentro
  "lacre", // a aba fecha e o coração sela
  "caixa", // a caixa aberta chega; o envelope sobe para dar lugar
  "guardar", // o Heitor guarda o envelope
  "presente", // e guarda o presente
  "fechar", // a tampa desce
  "enviar", // a caixa segue destino
  "obrigado",
] as const;

type Etapa = (typeof ETAPAS)[number];

const DURACAO: Record<Etapa, number> = {
  papel: 900,
  texto: 2400,
  assinatura: 2000,
  ler: 1500,
  dobra: 1400,
  envelope: 1100,
  "carta-entra": 1300,
  lacre: 1300,
  caixa: 1200,
  guardar: 1400,
  presente: 1300,
  fechar: 1000,
  enviar: 1600,
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

  const em = useMemo(
    () => (e: Etapa) => ETAPAS.indexOf(etapa) >= ETAPAS.indexOf(e),
    [etapa]
  );

  const dobrado = em("dobra");
  const temEnvelope = em("envelope");
  const cartaDentro = em("carta-entra");
  const lacrado = em("lacre");
  const temCaixa = em("caixa");
  const envelopeGuardado = em("guardar");
  const presenteGuardado = em("presente");
  const fechada = em("fechar");
  const enviada = em("enviar");
  const fim = etapa === "obrigado";

  /* ── onde cada peça está, em cada momento ─────────────────── */

  const papel = cartaDentro
    ? { left: 30, width: 40, top: 72 } // dentro do envelope, atrás do bolso
    : temEnvelope
      ? { left: 30, width: 40, top: 22 } // dobrado, esperando acima
      : dobrado
        ? { left: 26, width: 48, top: 32 } // acabou de dobrar
        : { left: 19, width: 62, top: 6 }; // aberto

  const envelope = envelopeGuardado
    ? { left: 27, width: 46, top: 74 } // dentro da caixa, atrás da frente
    : temCaixa
      ? { left: 27, width: 46, top: 12 } // subiu, dando lugar à caixa
      : temEnvelope
        ? { left: 20, width: 60, top: 50 } // aberto, em cena
        : { left: 20, width: 60, top: 64 }; // ainda fora

  return (
    <div className="cena" aria-live="polite">
      {/* ── z1 · fundo da caixa ───────────────────────────── */}
      <div className="caixa-peca fundo" data-on={temCaixa} data-enviada={enviada}>
        <CaixaFundo />
      </div>

      {/* ── z2 · fundo do envelope ────────────────────────── */}
      <div
        className="env-peca env-fundo"
        style={posicao(envelope)}
        data-on={temEnvelope}
        data-enviada={enviada}
      >
        <svg viewBox="0 0 220 150" aria-hidden>
          <rect x={4} y={10} width={212} height={134} rx={3} fill="#f6efe2" stroke="#b3926f" strokeWidth={1.6} />
        </svg>
      </div>

      {/* ── z3 · a carta ──────────────────────────────────── */}
      <div
        className="papel-palco"
        style={posicao(papel)}
        data-on={rodando}
        data-dobrado={dobrado}
        data-enviada={enviada}
      >
        <div className="papel">
          {[0, 1, 2].map((p) => (
            <div className="painel" key={p} data-p={p}>
              <div className="conteudo" style={{ transform: `translateY(-${p * 33.3333}%)` }}>
                <p className="corpo" data-escrito={em("texto")}>
                  {mensagem || "…"}
                </p>
                <div className="assina">
                  <span className="nome" data-escrito={em("assinatura")}>
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

      {/* ── z3 · o presente ───────────────────────────────── */}
      <div className="produto" data-dentro={presenteGuardado} data-enviada={enviada}>
        <Image src={presenteSrc} alt={presenteNome} width={280} height={280} />
      </div>

      {/* ── z4/z5 · frente do envelope, aba e lacre ───────── */}
      <div
        className="env-peca env-frente"
        style={posicao(envelope)}
        data-on={temEnvelope}
        data-enviada={enviada}
      >
        <svg viewBox="0 0 220 150" aria-hidden>
          {/* a aba: aberta aponta para cima, fechada desce sobre a boca */}
          <path
            className="aba"
            data-fechada={lacrado}
            d="M 4 10 L 110 82 L 216 10 Z"
            fill="#f0d8b6"
            fillOpacity={0.55}
            stroke="#b3926f"
            strokeWidth={1.6}
            strokeLinejoin="round"
          />
          {/* o bolso — é ele que engole a carta */}
          <path d="M 4 54 L 216 54 L 216 144 L 4 144 Z" fill="#fdfaf4" stroke="#b3926f" strokeWidth={1.6} />
          <path d="M 4 144 L 90 76 M 216 144 L 130 76" stroke="#b3926f" strokeWidth={1} opacity={0.35} />
        </svg>
        <span className="lacre" data-on={lacrado}>
          <Coracao />
        </span>
      </div>

      {/* ── z7/z8 · frente e tampa da caixa ───────────────── */}
      <div className="caixa-peca frente" data-on={temCaixa} data-enviada={enviada}>
        <CaixaFrente />
      </div>
      <div
        className="caixa-peca tampa"
        data-on={temCaixa}
        data-fechada={fechada}
        data-enviada={enviada}
      >
        <CaixaTampa />
      </div>

      {/* ── z9 · o Heitor ─────────────────────────────────── */}
      <div className="bebe" data-on={temCaixa && !enviada} data-guardando={envelopeGuardado && !fechada}>
        <Baby pose="alcancando" roupa="#d1e2f3" />
      </div>

      <div className="faiscas" data-on={enviada}>
        {[0, 1, 2, 3, 4].map((n) => (
          <Faisca key={n} className={`f f${n}`} />
        ))}
      </div>

      <div className="obrigado" data-on={fim}>
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
          --calmo: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cena :global(svg) { width: 100%; height: auto; display: block; }

        /* ── carta ─────────────────────────────────────────── */
        .papel-palco {
          position: absolute;
          z-index: 3;
          opacity: 0;
          transition: left 900ms var(--calmo), top 900ms var(--calmo),
            width 900ms var(--calmo), opacity 500ms ease;
        }
        .papel-palco[data-on="true"] { opacity: 1; }
        .papel {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4.2;
          transform-style: preserve-3d;
          filter: drop-shadow(0 14px 26px rgba(43, 33, 25, 0.2));
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
          font-family: var(--font-mao-b);
          font-size: clamp(0.95rem, 3.5vw, 1.2rem);
          line-height: 1.6;
          color: #35405c;
          clip-path: inset(0 100% 0 0);
        }
        .corpo[data-escrito="true"] {
          animation: escrever-carta 2.2s cubic-bezier(0.5, 0, 0.4, 1) forwards;
        }
        .assina { align-self: flex-end; padding-right: 3%; }
        .nome {
          font-family: var(--font-mao);
          font-size: clamp(1rem, 3.8vw, 1.4rem);
          color: #1f3b52;
          display: inline-block;
          clip-path: inset(0 100% 0 0);
        }
        .nome[data-escrito="true"] {
          animation: escrever-carta 1.8s cubic-bezier(0.45, 0, 0.35, 1) forwards;
        }
        @keyframes escrever-carta {
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

        /* ── envelope ──────────────────────────────────────── */
        .env-peca {
          position: absolute;
          opacity: 0;
          transition: left 900ms var(--calmo), top 900ms var(--calmo),
            width 900ms var(--calmo), opacity 600ms ease;
        }
        .env-peca[data-on="true"] { opacity: 1; }
        .env-fundo { z-index: 2; }
        .env-frente { z-index: 4; }
        .aba {
          transform-origin: center 10px;
          transform: rotateX(180deg);
          transition: transform 800ms cubic-bezier(0.34, 1.2, 0.64, 1);
        }
        .aba[data-fechada="true"] { transform: rotateX(0deg); }
        .lacre {
          position: absolute;
          left: 44%;
          top: 44%;
          width: 12%;
          color: #b04a4a;
          opacity: 0;
          transform: scale(0.3);
          transition: opacity 300ms ease, transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 5;
        }
        .lacre[data-on="true"] { opacity: 1; transform: scale(1); transition-delay: 500ms; }

        /* ── presente ──────────────────────────────────────── */
        .produto {
          position: absolute;
          left: 34%;
          width: 32%;
          top: 18%;
          opacity: 0;
          z-index: 3;
          transition: opacity 350ms ease, top 900ms cubic-bezier(0.5, 0, 0.35, 1);
        }
        .produto[data-dentro="true"] { opacity: 1; top: 74%; }
        .produto :global(img) { width: 100%; height: auto; }

        /* ── caixa ─────────────────────────────────────────── */
        .caixa-peca {
          position: absolute;
          left: 16%;
          width: 68%;
          top: 52%;
          opacity: 0;
          transform: translateY(14%);
          transition: opacity 600ms ease, transform 1000ms var(--calmo);
        }
        .caixa-peca[data-on="true"] { opacity: 1; transform: none; }
        .fundo { z-index: 1; }
        .frente { z-index: 7; }
        .tampa { z-index: 8; }
        .tampa[data-on="true"] { transform: translate(10%, -13%) rotate(-7deg); }
        .tampa[data-on="true"][data-fechada="true"] { transform: none; }

        /* tudo que está na caixa parte junto com ela */
        .caixa-peca[data-enviada="true"],
        .env-peca[data-enviada="true"],
        .papel-palco[data-enviada="true"],
        .produto[data-enviada="true"] {
          transform: translateY(-150%) rotate(-7deg) scale(0.62);
          opacity: 0;
          transition: transform 1500ms cubic-bezier(0.5, 0, 0.2, 1),
            opacity 500ms ease 1000ms;
        }

        /* ── Heitor ────────────────────────────────────────── */
        .bebe {
          position: absolute;
          left: 0;
          bottom: 2%;
          width: 26%;
          min-width: 88px;
          z-index: 9;
          opacity: 0;
          transform: translateX(-16%);
          transition: opacity 500ms ease, transform 800ms var(--calmo);
          pointer-events: none;
        }
        .bebe[data-on="true"] { opacity: 1; transform: none; }
        .bebe[data-guardando="true"] { transform: translate(14%, -8%) rotate(6deg); }

        /* ── faíscas ───────────────────────────────────────── */
        .faiscas { position: absolute; inset: 0; z-index: 10; pointer-events: none; opacity: 0; }
        .faiscas[data-on="true"] { opacity: 1; }
        .faiscas :global(.f) { position: absolute; width: 14px; color: #d8b877; opacity: 0; }
        .faiscas[data-on="true"] :global(.f) { animation: brilha 1.5s ease-out forwards; }
        .faiscas :global(.f0) { left: 30%; top: 46%; animation-delay: 0.1s; }
        .faiscas :global(.f1) { left: 62%; top: 36%; animation-delay: 0.28s; width: 10px; }
        .faiscas :global(.f2) { left: 44%; top: 58%; animation-delay: 0.42s; width: 18px; }
        .faiscas :global(.f3) { left: 70%; top: 56%; animation-delay: 0.16s; width: 9px; }
        .faiscas :global(.f4) { left: 24%; top: 62%; animation-delay: 0.52s; width: 12px; }
        @keyframes brilha {
          0% { opacity: 0; transform: scale(0.2); }
          35% { opacity: 0.9; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.5) translateY(-26px); }
        }

        /* ── agradecimento ─────────────────────────────────── */
        .obrigado {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
          padding-inline: 8%;
          z-index: 11;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 800ms ease 200ms, transform 900ms var(--calmo) 200ms;
          pointer-events: none;
        }
        .obrigado[data-on="true"] { opacity: 1; transform: none; }
        .l1 {
          font-family: var(--font-heitor);
          font-size: clamp(2.4rem, 10vw, 3.6rem);
          line-height: 1;
          color: #032a42;
          margin-bottom: 0.3em;
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

/** Só posição — a opacidade fica no CSS, senão o inline venceria o voo final. */
function posicao(p: { left: number; width: number; top: number }) {
  return {
    left: `${p.left}%`,
    width: `${p.width}%`,
    top: `${p.top}%`,
  } satisfies React.CSSProperties;
}
