"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Baby } from "./baby";
import { CaixaFundo, CaixaFrente, CaixaTampa, Coracao, Faisca } from "./motifs";

/**
 * A cerimônia do envio.
 *
 * ── Como uma coisa entra dentro da outra ────────────────────────────────
 *
 * As peças vivem no mesmo plano, empilhadas por z-index. A carta some porque
 * desce por trás do bolso do envelope; o envelope some porque desce por trás
 * da frente da caixa. Nada desaparece por opacidade.
 *
 *   z1  fundo da caixa (a boca escura)
 *   z2  fundo do envelope
 *   z3  carta · presente
 *   z4  frente do envelope   ← engole a carta
 *   z5  aba · lacre
 *   z7  frente da caixa      ← engole o envelope e o presente
 *   z8  tampa
 *
 * ── Duas regras que não podem ser quebradas ─────────────────────────────
 *
 * 1. A posição da carta é DERIVADA da posição do envelope depois que ela
 *    entra (`dentroDoEnvelope`). Se as duas forem escritas à mão, o envelope
 *    sobe para dar lugar à caixa e a carta fica para trás, boiando sozinha.
 *
 * 2. Tudo que precisa partir junto mora dentro de `.conjunto`, e é o
 *    `.conjunto` que voa. Animar peça por peça não funciona: `translateY`
 *    em porcentagem é relativo à altura de cada elemento, então cada uma
 *    percorre uma distância diferente e elas se separam no ar.
 */

const ETAPAS = [
  "papel",
  "texto",
  "assinatura",
  "ler",
  "dobra",
  "envelope",
  "carta-entra",
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
  papel: 900,
  texto: 2400,
  assinatura: 2000,
  ler: 1500,
  dobra: 1400,
  envelope: 1100,
  "carta-entra": 1300,
  lacre: 1400,
  caixa: 1200,
  guardar: 1500,
  presente: 1300,
  fechar: 1000,
  enviar: 1700,
  obrigado: 0,
};

/** left e width em % da largura do palco; top em % da altura. */
type Caixa = { left: number; width: number; top: number };

/**
 * Onde a carta fica quando já está dentro do envelope.
 *
 * O papel é três painéis dobrados: só o terço do meio aparece, entre 33% e
 * 67% da altura do elemento. Alinhar o topo do papel com o topo do envelope
 * deixa esse terço exatamente dentro do bolso, que começa a 36% da altura
 * do envelope.
 */
function dentroDoEnvelope(env: Caixa): Caixa {
  return {
    left: env.left + env.width * 0.17,
    width: env.width * 0.66,
    top: env.top,
  };
}

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

  /* ── onde cada peça está, em cada momento ─────────────────────────────
     A caixa ocupa 52%→95% da altura. A frente dela começa a 72% e termina
     a 91%: é essa faixa que engole o envelope e o presente. */

  const envelope: Caixa = envelopeGuardado
    ? { left: 33, width: 34, top: 73 } // dentro da caixa, atrás da frente
    : temCaixa
      ? { left: 27, width: 46, top: 10 } // subiu para a caixa caber embaixo
      : temEnvelope
        ? { left: 20, width: 60, top: 48 } // aberto, no meio da cena
        : { left: 20, width: 60, top: 66 }; // ainda fora

  const papel: Caixa = cartaDentro
    ? dentroDoEnvelope(envelope) // daqui em diante ela viaja com o envelope
    : temEnvelope
      ? { left: 30, width: 40, top: 6 } // dobrada, esperando acima
      : dobrado
        ? { left: 26, width: 48, top: 30 } // acabou de dobrar
        : { left: 19, width: 62, top: 6 }; // aberta

  return (
    <div className="cena" aria-live="polite">
      {/* tudo aqui dentro parte junto no fim */}
      <div className="conjunto" data-enviada={enviada}>
        <div className="caixa-peca fundo" data-on={temCaixa}>
          <CaixaFundo />
        </div>

        <div className="env-peca env-fundo" style={posicao(envelope)} data-on={temEnvelope}>
          <svg viewBox="0 0 220 150" aria-hidden>
            <rect x={4} y={10} width={212} height={134} rx={3} fill="#f2e9d8" stroke="#b3926f" strokeWidth={1.6} />
          </svg>
        </div>

        <div className="papel-palco" style={posicao(papel)} data-on={rodando} data-dobrado={dobrado}>
          <div className="papel">
            {[0, 1, 2].map((p) => (
              <div className="painel" key={p} data-p={p}>
                {/* a altura do conteúdo é 300% do painel, então cada terço
                    é 33,33% da própria altura — não 100% */}
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

        <div className="produto" data-dentro={presenteGuardado}>
          <Image src={presenteSrc} alt={presenteNome} width={280} height={280} />
        </div>

        {/* o bolso é desenhado ANTES da aba: fechada, a aba precisa cobrir
            o bolso, senão o envelope parece que nunca fecha */}
        <div className="env-peca env-frente" style={posicao(envelope)} data-on={temEnvelope}>
          <svg viewBox="0 0 220 150" aria-hidden>
            <path d="M 4 54 L 216 54 L 216 144 L 4 144 Z" fill="#fdfaf4" stroke="#b3926f" strokeWidth={1.6} />
            <path d="M 4 144 L 90 78 M 216 144 L 130 78" stroke="#b3926f" strokeWidth={1} opacity={0.3} />
            <path
              className="aba"
              data-fechada={lacrado}
              d="M 3 10 L 110 84 L 217 10 Z"
              fill="#f0d8b6"
              stroke="#b3926f"
              strokeWidth={1.6}
              strokeLinejoin="round"
            />
          </svg>
          <span className="lacre" data-on={lacrado}>
            <Coracao />
          </span>
        </div>

        <div className="caixa-peca frente" data-on={temCaixa}>
          <CaixaFrente />
        </div>
        <div className="caixa-peca tampa" data-on={temCaixa} data-fechada={fechada}>
          <CaixaTampa />
        </div>
      </div>

      {/* o Heitor fica: quem parte é a caixa */}
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
          --calmo: cubic-bezier(0.22, 1, 0.36, 1);
        }
        .cena :global(svg) { width: 100%; height: auto; display: block; }

        /* ── o conjunto: é ele que parte, com tudo dentro ──── */
        .conjunto {
          position: absolute;
          inset: 0;
          transform-origin: 50% 60%;
        }
        .conjunto[data-enviada="true"] {
          transform: translateY(-128%) rotate(-6deg) scale(0.62);
          opacity: 0;
          transition: transform 1600ms cubic-bezier(0.5, 0, 0.15, 1),
            opacity 600ms ease 1050ms;
        }

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
          filter: drop-shadow(0 12px 22px rgba(43, 33, 25, 0.22));
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
          aspect-ratio: 220 / 150;
          opacity: 0;
          transition: left 900ms var(--calmo), top 900ms var(--calmo),
            width 900ms var(--calmo), opacity 600ms ease;
        }
        .env-peca[data-on="true"] { opacity: 1; }
        .env-fundo { z-index: 2; }
        .env-frente { z-index: 4; filter: drop-shadow(0 10px 18px rgba(43, 33, 25, 0.18)); }

        /* a dobradiça é a borda de cima; a perspectiva é o que faz a aba
           parecer que tomba, em vez de só espelhar */
        .aba {
          transform-box: view-box;
          transform-origin: 110px 10px;
          transform: perspective(560px) rotateX(-168deg);
          transition: transform 900ms cubic-bezier(0.34, 1.12, 0.64, 1),
            fill 900ms ease;
          fill: #e7d3b0;
        }
        .aba[data-fechada="true"] {
          transform: perspective(560px) rotateX(0deg);
          fill: #f4e2c4;
        }
        .lacre {
          position: absolute;
          left: 44.5%;
          top: 48%;
          width: 11%;
          color: #b04a4a;
          opacity: 0;
          transform: scale(0.3);
          transition: opacity 300ms ease, transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 5;
        }
        .lacre[data-on="true"] { opacity: 1; transform: scale(1); transition-delay: 620ms; }

        /* ── presente ──────────────────────────────────────── */
        /* altura fixa: assim todo produto se comporta igual, seja a foto
           quadrada, larga ou alta */
        .produto {
          position: absolute;
          left: 35%;
          width: 30%;
          height: 15%;
          top: 20%;
          opacity: 0;
          z-index: 3;
          transition: opacity 350ms ease, top 950ms cubic-bezier(0.5, 0, 0.3, 1);
        }
        .produto[data-dentro="true"] { opacity: 1; top: 74%; }
        .produto :global(img) {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

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
        .faiscas[data-on="true"] :global(.f) { animation: brilha 1.6s ease-out forwards; }
        .faiscas :global(.f0) { left: 30%; top: 46%; animation-delay: 0.15s; }
        .faiscas :global(.f1) { left: 62%; top: 36%; animation-delay: 0.33s; width: 10px; }
        .faiscas :global(.f2) { left: 44%; top: 58%; animation-delay: 0.47s; width: 18px; }
        .faiscas :global(.f3) { left: 70%; top: 56%; animation-delay: 0.21s; width: 9px; }
        .faiscas :global(.f4) { left: 24%; top: 62%; animation-delay: 0.57s; width: 12px; }
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
function posicao(p: Caixa) {
  return {
    left: `${p.left}%`,
    width: `${p.width}%`,
    top: `${p.top}%`,
  } satisfies React.CSSProperties;
}
