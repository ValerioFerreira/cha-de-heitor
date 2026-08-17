"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Revela um bloco quando ele entra na tela.
 *
 * Hierarquia de movimento: `sutil` é quase imperceptível e serve para a maior
 * parte do site; `normal` é o padrão; `destaque` é para os poucos momentos que
 * merecem ser notados. Com `prefers-reduced-motion` ligado, tudo vira só
 * opacidade.
 */
export function Reveal({
  children,
  atraso = 0,
  forca = "normal",
  as: Tag = "div",
  className,
}: {
  children: React.ReactNode;
  atraso?: number;
  forca?: "sutil" | "normal" | "destaque";
  as?: React.ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisivel(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const distancia = forca === "sutil" ? 8 : forca === "destaque" ? 34 : 18;
  const duracao = forca === "sutil" ? 700 : forca === "destaque" ? 1400 : 1000;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visivel ? 1 : 0,
        transform: visivel ? "none" : `translateY(${distancia}px)`,
        transition: `opacity ${duracao}ms ease ${atraso}ms, transform ${duracao}ms cubic-bezier(0.22,1,0.36,1) ${atraso}ms`,
        willChange: visivel ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
