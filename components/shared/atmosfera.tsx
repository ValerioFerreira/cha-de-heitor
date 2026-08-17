"use client";

import { useEffect, useRef, useState } from "react";

/**
 * O campo de cor do site inteiro.
 *
 * Uma camada fixa atrás de tudo que atravessa o dia conforme a página rola:
 * luz fria de manhã no topo, areia quente no meio, azul-noite no fim. É isso
 * que faz as seções parecerem uma coisa só em vez de blocos empilhados.
 */
export function Atmosfera() {
  const [t, setT] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const medir = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setT(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0);
      raf.current = 0;
    };
    const aoRolar = () => {
      if (!raf.current) raf.current = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div aria-hidden className="atmosfera" style={{ ["--t" as string]: t }}>
      <div className="dia" style={{ opacity: 1 - suave(t, 0.5, 0.82) }} />
      <div className="tarde" style={{ opacity: suave(t, 0.42, 0.72) * (1 - suave(t, 0.74, 0.94)) }} />
      <div className="noite" style={{ opacity: suave(t, 0.76, 0.97) }} />
      <style jsx>{`
        .atmosfera {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
        }
        .atmosfera > div {
          position: absolute;
          inset: 0;
          transition: opacity 260ms linear;
        }
        .dia {
          background: linear-gradient(
            172deg,
            #e8f0f8 0%,
            #f7f4ec 34%,
            #fbf7f0 62%,
            #f5efe4 100%
          );
        }
        .tarde {
          background: linear-gradient(
            170deg,
            #f5efe4 0%,
            #f2e3cc 40%,
            #ecd6b4 78%,
            #d9b78c 100%
          );
        }
        .noite {
          background: linear-gradient(
            168deg,
            #b3926f 0%,
            #6d7f8c 22%,
            #17475f 58%,
            #04212f 100%
          );
        }
      `}</style>
    </div>
  );
}

/** 0 antes de `a`, 1 depois de `b`, e uma curva suave no meio. */
function suave(t: number, a: number, b: number) {
  const x = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
}
