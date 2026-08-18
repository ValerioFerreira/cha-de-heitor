"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A música ambiente.
 *
 * Ela tenta tocar sozinha assim que o site abre. Só que **navegador nenhum
 * deixa áudio com som começar antes de a pessoa interagir com a página** —
 * é política do Chrome, do Safari e do Firefox, e não existe truque honesto
 * que contorne isso. Às vezes a tentativa passa (quando a pessoa já visitou
 * o site antes, ou já estava numa aba do mesmo domínio); quase sempre ela é
 * recusada.
 *
 * Por isso são duas tentativas:
 *
 *   1. na abertura, direto — se o navegador deixar, entra na hora;
 *   2. se for recusada, fica armada para o **primeiro toque** da pessoa,
 *      seja qual for: tocar na tela, clicar, apertar uma tecla. Como o
 *      convidado sempre encosta em alguma coisa nos primeiros segundos, na
 *      prática a música entra sozinha.
 *
 * Rolagem não serve: rolar a página não conta como interação para liberar
 * o áudio.
 *
 * Quem desligar no botão fica desligado, inclusive nas próximas visitas.
 */

/** entre médio e baixo — presente, mas dá para conversar por cima */
const VOLUME = 0.3;
const LEMBRETE = "heitor-musica";

/** os gestos que o navegador aceita como permissão para tocar som */
const GESTOS = ["pointerdown", "touchstart", "keydown"] as const;

export function Musica({ src = "/audio/ambiente.mp3" }: { src?: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [tocando, setTocando] = useState(false);
  const [pronto, setPronto] = useState(false);
  const desligouDeProposito = useRef(false);

  /** tenta iniciar em silêncio; quem sobe o volume é o efeito de baixo */
  const tentarTocar = useCallback(async () => {
    const el = audio.current;
    if (!el || desligouDeProposito.current) return false;
    try {
      el.volume = 0;
      await el.play();
      return true;
    } catch {
      return false;
    }
  }, []);

  // ── abertura ───────────────────────────────────────────────
  useEffect(() => {
    setPronto(true);
    if (typeof window === "undefined") return;

    if (localStorage.getItem(LEMBRETE) === "0") {
      desligouDeProposito.current = true;
      return;
    }

    let vivo = true;
    let soltar = () => {};

    const noGesto = () => {
      tentarTocar().then((ok) => {
        if (ok && vivo) {
          soltar();
          setTocando(true);
        }
      });
    };

    soltar = () => GESTOS.forEach((g) => window.removeEventListener(g, noGesto));

    tentarTocar().then((ok) => {
      if (!vivo) return;
      if (ok) {
        setTocando(true);
        return;
      }
      // recusado: espera o primeiro gesto, qualquer que seja
      GESTOS.forEach((g) => window.addEventListener(g, noGesto, { passive: true }));
    });

    return () => {
      vivo = false;
      soltar();
    };
  }, [tentarTocar]);

  // ── ligar e desligar ───────────────────────────────────────
  useEffect(() => {
    const el = audio.current;
    if (!el || !pronto) return;
    if (tocando) {
      el.play().catch(() => setTocando(false));
      subir(el, VOLUME);
    } else {
      descer(el, () => el.pause());
    }
  }, [tocando, pronto]);

  function alternar() {
    const proximo = !tocando;
    desligouDeProposito.current = !proximo;
    localStorage.setItem(LEMBRETE, proximo ? "1" : "0");
    setTocando(proximo);
  }

  return (
    <>
      <audio ref={audio} src={src} loop preload="auto" />
      <button
        type="button"
        className="botao-musica"
        onClick={alternar}
        aria-pressed={tocando}
        aria-label={tocando ? "Desligar a música" : "Ligar a música"}
        title={tocando ? "Desligar a música" : "Ligar a música"}
      >
        <span className="ondas" data-tocando={tocando}>
          <i /><i /><i /><i />
        </span>
      </button>

      <style jsx>{`
        .botao-musica {
          position: fixed;
          right: max(1rem, env(safe-area-inset-right));
          bottom: max(1rem, env(safe-area-inset-bottom));
          z-index: 60;
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(179, 146, 111, 0.45);
          background: rgba(251, 247, 240, 0.72);
          backdrop-filter: blur(10px);
          cursor: pointer;
          transition: border-color 300ms ease, background 300ms ease;
        }
        .botao-musica:hover {
          border-color: var(--color-taupe);
          background: rgba(251, 247, 240, 0.92);
        }
        .ondas {
          display: flex;
          align-items: center;
          gap: 2.5px;
          height: 16px;
        }
        .ondas i {
          display: block;
          width: 2px;
          height: 4px;
          border-radius: 1px;
          background: var(--color-navy);
          opacity: 0.75;
          transition: height 300ms ease;
        }
        .ondas[data-tocando="true"] i {
          animation: onda 1.1s ease-in-out infinite;
        }
        .ondas[data-tocando="true"] i:nth-child(2) { animation-delay: 0.14s; }
        .ondas[data-tocando="true"] i:nth-child(3) { animation-delay: 0.28s; }
        .ondas[data-tocando="true"] i:nth-child(4) { animation-delay: 0.42s; }
        @keyframes onda {
          0%, 100% { height: 4px; }
          50% { height: 14px; }
        }
        /* desligada: as barras viram uma linha só, discreta */
        .ondas[data-tocando="false"] i:nth-child(1),
        .ondas[data-tocando="false"] i:nth-child(4) { height: 3px; }
        .ondas[data-tocando="false"] i:nth-child(2),
        .ondas[data-tocando="false"] i:nth-child(3) { height: 7px; }

        @media (prefers-reduced-motion: reduce) {
          .ondas[data-tocando="true"] i { animation: none; height: 9px; }
        }
      `}</style>
    </>
  );
}

/**
 * A rampa de volume anda por temporizador, não por `requestAnimationFrame`.
 * O rAF pára quando a aba não está pintando quadros — e aí o volume ficava
 * preso em zero, com a música tocando em silêncio para sempre.
 */
let rampa: ReturnType<typeof setInterval> | null = null;

function pararRampa() {
  if (rampa) clearInterval(rampa);
  rampa = null;
}

/** entra devagar: um som que aparece de repente assusta */
function subir(el: HTMLAudioElement, alvo: number) {
  pararRampa();
  rampa = setInterval(() => {
    el.volume = Math.min(alvo, el.volume + 0.012);
    if (el.volume >= alvo - 0.001) pararRampa();
  }, 40);
}

function descer(el: HTMLAudioElement, fim: () => void) {
  pararRampa();
  rampa = setInterval(() => {
    el.volume = Math.max(0, el.volume - 0.04);
    if (el.volume <= 0.001) {
      pararRampa();
      fim();
    }
  }, 40);
}
