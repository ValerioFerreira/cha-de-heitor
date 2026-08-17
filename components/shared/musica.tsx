"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A música ambiente.
 *
 * Começa desligada e só toca depois que a pessoa pede — navegador nenhum
 * deixa tocar sozinho, e forçar isso seria briga perdida e desrespeitosa.
 * O estado fica guardado, então quem ligou uma vez continua com som ao voltar.
 */
export function Musica({ src = "/audio/ambiente.mp3" }: { src?: string }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [tocando, setTocando] = useState(false);
  const [pronto, setPronto] = useState(false);

  useEffect(() => setPronto(true), []);

  useEffect(() => {
    const el = audio.current;
    if (!el || !pronto) return;
    el.volume = 0;
    if (tocando) {
      el.play().catch(() => setTocando(false));
      subir(el, 0.32);
      localStorage.setItem("heitor-musica", "1");
    } else {
      descer(el, () => el.pause());
      localStorage.removeItem("heitor-musica");
    }
  }, [tocando, pronto]);

  return (
    <>
      <audio ref={audio} src={src} loop preload="none" />
      <button
        type="button"
        className="botao-musica"
        onClick={() => setTocando((v) => !v)}
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

function subir(el: HTMLAudioElement, alvo: number) {
  const passo = () => {
    el.volume = Math.min(alvo, el.volume + 0.015);
    if (el.volume < alvo) requestAnimationFrame(passo);
  };
  passo();
}

function descer(el: HTMLAudioElement, fim: () => void) {
  const passo = () => {
    el.volume = Math.max(0, el.volume - 0.02);
    if (el.volume > 0) requestAnimationFrame(passo);
    else fim();
  };
  passo();
}
