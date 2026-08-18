"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";

/**
 * Leque de cartas — componente do 21st.dev, adaptado.
 *
 * O que veio do original, intacto: a matemática do leque (`FAN_POSITIONS`),
 * os multiplicadores de largura e altura, a entrada elástica, o empurra-
 * empurra no hover e a paginação circular.
 *
 * O que mudou:
 *   · `.fan-layout` e `.fan-card` não vinham no anexo — estão aqui embaixo;
 *   · as fotos entram com `object-fit: contain` sobre uma lâmina de papel,
 *     porque cortar o ultrassom já foi motivo de reclamação uma vez;
 *   · as setas e os pontinhos usam a paleta do site, não o cinza genérico
 *     com variante dark.
 */

export interface CardItem {
  imgUrl: string;
  alt?: string;
  largura: number;
  altura: number;
}

const MAX_VISIBLE = 7;
const HALF = 3;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 7.3, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 4.0, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 1.3, zIndex: 3 },
  { rot: 0, scale: 1.0, x: 0, y: 0.0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 1.3, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 4.0, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 7.3, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.28;
  if (width < 640) return 0.38;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1.0;
}

/**
 * O leque original abre até ±30rem, medida pensada para um contêiner de
 * 1280px com cartas menores. Com as nossas, as pontas saíam da tela.
 * Isto limita a abertura ao que realmente cabe, medindo o contêiner em vez
 * de confiar só na largura da janela.
 */
function limiteDoContainer(container: HTMLElement, carta: HTMLElement | undefined) {
  const l = carta?.offsetWidth ?? 0;
  const a = carta?.offsetHeight ?? 0;
  // a carta das pontas está girada 21°: a caixa dela fica bem mais larga
  // que a largura própria, e ignorar isso deixava as bordas cortadas
  const rad = (21 * Math.PI) / 180;
  const meiaCarta = ((l * Math.cos(rad) + a * Math.sin(rad)) / 2) * 0.7756;
  const raizPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const folga = 10;
  return Math.max(0.2, (container.clientWidth / 2 - meiaCarta - folga) / (30 * raizPx));
}

/** Encolhe os deslocamentos verticais quando a janela é baixa demais. */
function getHeightMultiplier(width: number) {
  let idealPx: number;
  if (width < 480) idealPx = 22 * 16;
  else if (width < 640) idealPx = 26 * 16;
  else if (width < 768) idealPx = 28 * 16;
  else if (width < 1024) idealPx = 34 * 16;
  else idealPx = 38 * 16;

  const available = window.innerHeight * 0.7;
  if (available >= idealPx) return 1;
  return available / idealPx;
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1.0 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 7.3,
    zIndex: 10 - Math.abs(slot - center),
  };
}

export default function CardFanCarousel({ cards }: { cards: CardItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const hasEntered = useRef(false);
  const directionRef = useRef<"left" | "right" | null>(null);
  const prevVisible = useRef<Set<number>>(new Set());

  const totalCards = cards.length;
  const needsPagination = totalCards > MAX_VISIBLE;
  const [centerIndex, setCenterIndex] = useState(needsPagination ? HALF : totalCards >> 1);

  const getVisibleMap = useCallback(
    (center: number) => {
      const map = new Map<number, number>();
      if (!needsPagination) {
        cards.forEach((_, i) => map.set(i, i));
        return map;
      }
      for (let slot = 0; slot < MAX_VISIBLE; slot++) {
        map.set((((center + slot - HALF) % totalCards) + totalCards) % totalCards, slot);
      }
      return map;
    },
    [totalCards, needsPagination, cards]
  );

  const cycle = useCallback(
    (direction: "left" | "right") => {
      if (isAnimating.current || !needsPagination) return;
      isAnimating.current = true;
      directionRef.current = direction;
      setCenterIndex((prev) =>
        direction === "right" ? (prev + 1) % totalCards : (prev - 1 + totalCards) % totalCards
      );
    },
    [totalCards, needsPagination]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !totalCards) return;

    const cardElements = Array.from(container.querySelectorAll<HTMLElement>(".fan-card"));
    if (!cardElements.length) return;

    const visibleMap = getVisibleMap(centerIndex);
    const previouslyVisible = prevVisible.current;
    const direction = directionRef.current;
    const isFirstMount = !hasEntered.current;
    const multiplier = Math.min(
      getResponsiveMultiplier(window.innerWidth),
      limiteDoContainer(container, cardElements[0])
    );
    const hMult = getHeightMultiplier(window.innerWidth);
    const slotCount = needsPagination ? MAX_VISIBLE : totalCards;
    const config = (slot: number) => getSlotConfig(slotCount, slot);

    if (isFirstMount) isAnimating.current = true;

    let completedCount = 0;
    const visibleCount = visibleMap.size;
    const onCardDone = () => {
      if (++completedCount >= visibleCount) {
        isAnimating.current = false;
        if (isFirstMount) hasEntered.current = true;
      }
    };

    cardElements.forEach((card, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previouslyVisible.has(cardIndex);

      if (slot !== undefined) {
        const { x, y, rot, scale, zIndex } = config(slot);
        const target = {
          x: `${x * multiplier}rem`,
          y: `${y * hMult}rem`,
          rotation: rot,
          scale,
          opacity: 1,
          zIndex,
        };

        if (isFirstMount) {
          gsap.set(card, { x: 0, y: `${12 * hMult}rem`, rotation: 0, scale: 0.5, opacity: 0 });
          gsap.to(card, {
            ...target,
            duration: 1.2,
            ease: "elastic.out(1.05,.78)",
            delay: 0.2 + slot * 0.06,
            onComplete: onCardDone,
          });
        } else if (!wasVisible) {
          const enterX = direction === "right" ? 40 : -40;
          gsap.set(card, {
            x: `${enterX}rem`,
            y: `${y * hMult}rem`,
            rotation: direction === "right" ? 30 : -30,
            scale: 0.5,
            opacity: 0,
          });
          gsap.to(card, { ...target, duration: 0.6, ease: "power2.out", onComplete: onCardDone });
        } else {
          gsap.to(card, { ...target, duration: 0.5, ease: "power2.out", onComplete: onCardDone });
        }
      } else if (wasVisible) {
        const exitX = direction === "right" ? -40 : 40;
        gsap.to(card, {
          x: `${exitX}rem`,
          opacity: 0,
          scale: 0.5,
          rotation: direction === "right" ? -30 : 30,
          duration: 0.4,
          ease: "power2.in",
          zIndex: 0,
        });
      } else if (isFirstMount) {
        gsap.set(card, { opacity: 0, scale: 0.3, x: 0, y: 0, zIndex: 0 });
      }
    });

    prevVisible.current = new Set(visibleMap.keys());

    const visibleEntries: { el: HTMLElement; slot: number }[] = [];
    cardElements.forEach((el, i) => {
      const slot = visibleMap.get(i);
      if (slot !== undefined) visibleEntries.push({ el, slot });
    });
    visibleEntries.sort((a, b) => a.slot - b.slot);

    let activeSlot: number | null = null;
    let leaveTimer: ReturnType<typeof setTimeout> | null = null;
    const centerSlot = visibleEntries.length >> 1;

    const updateHoverLayout = (hoveredSlot: number | null) => {
      const mult = Math.min(
        getResponsiveMultiplier(window.innerWidth),
        limiteDoContainer(container, cardElements[0])
      );
      const hM = getHeightMultiplier(window.innerWidth);

      visibleEntries.forEach(({ el, slot }) => {
        const base = config(slot);
        let targetX = base.x * mult;
        let targetY = base.y * hM;
        let targetRot = base.rot;
        let targetScale = base.scale;
        let delay = 0;

        if (hoveredSlot !== null) {
          const distance = Math.abs(slot - hoveredSlot);
          delay = distance * 0.02;

          if (slot === hoveredSlot) {
            targetY -= 2.5 * hM;
            targetScale *= 1.08;
          } else {
            const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
            const pushStrength =
              8 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance));

            if (slot < hoveredSlot) {
              targetX -= pushStrength * mult;
              targetRot -= 3 / (distance + 1);
            } else {
              targetX += pushStrength * mult;
              targetRot += 3 / (distance + 1);
            }

            if (slot === visibleEntries.length - 1 && hoveredSlot < centerSlot) targetY -= 1 * hM;
            if (slot === 0 && hoveredSlot > centerSlot) targetY -= 1 * hM;
          }
        } else {
          delay = Math.abs(slot - centerSlot) * 0.02;
        }

        gsap.to(el, {
          x: `${targetX}rem`,
          y: `${targetY}rem`,
          rotation: targetRot,
          scale: targetScale,
          duration: 0.5,
          delay,
          ease: "elastic.out(1,.75)",
          overwrite: "auto",
        });
        gsap.set(el, { zIndex: base.zIndex });
      });
    };

    const enterHandlers = visibleEntries.map(({ el, slot }) => {
      const handler = () => {
        if (isAnimating.current) return;
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }
        if (activeSlot !== slot) {
          activeSlot = slot;
          updateHoverLayout(slot);
        }
      };
      el.addEventListener("mouseenter", handler);
      return { el, handler };
    });

    const onMouseLeave = () => {
      if (isAnimating.current) return;
      if (leaveTimer) clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        activeSlot = null;
        updateHoverLayout(null);
      }, 50);
    };
    container.addEventListener("mouseleave", onMouseLeave);

    const onResize = () => {
      if (!isAnimating.current) updateHoverLayout(activeSlot);
    };
    window.addEventListener("resize", onResize);

    return () => {
      enterHandlers.forEach(({ el, handler }) => el.removeEventListener("mouseenter", handler));
      container.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", onResize);
      if (leaveTimer) clearTimeout(leaveTimer);
    };
  }, [centerIndex, totalCards, getVisibleMap, needsPagination]);

  if (!totalCards) return null;

  const chevron = (direction: "left" | "right") => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={direction === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );

  return (
    <section className="leque">
      <div ref={containerRef} className="fan-layout">
        {cards.map((card, index) => (
          <div key={index} className="fan-card">
            <Image
              src={card.imgUrl}
              alt={card.alt ?? ""}
              width={card.largura}
              height={card.altura}
              sizes="(max-width: 640px) 60vw, 340px"
            />
          </div>
        ))}
      </div>

      {needsPagination && (
        <div className="controles">
          <button type="button" onClick={() => cycle("left")} aria-label="Foto anterior">
            {chevron("left")}
          </button>
          <div className="pontos" aria-hidden>
            {cards.map((_, i) => (
              <span key={i} data-ativo={i === centerIndex} />
            ))}
          </div>
          <button type="button" onClick={() => cycle("right")} aria-label="Próxima foto">
            {chevron("right")}
          </button>
        </div>
      )}

      <style jsx>{`
        .leque {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding: 1rem 0;
        }

        /* as alturas batem com os pontos de quebra de getHeightMultiplier() */
        .fan-layout {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 22rem;
        }
        @media (min-width: 480px) { .fan-layout { height: 26rem; } }
        @media (min-width: 640px) { .fan-layout { height: 28rem; } }
        @media (min-width: 768px) { .fan-layout { height: 34rem; } }
        @media (min-width: 1024px) { .fan-layout { height: 38rem; } }

        .fan-card {
          position: absolute;
          height: 100%;
          aspect-ratio: 5 / 7;
          padding: 0.55rem 0.55rem 1.6rem;
          background: #fdfaf4;
          border: 1px solid rgba(179, 146, 111, 0.35);
          box-shadow: 0 24px 44px -26px rgba(43, 33, 25, 0.6);
          will-change: transform;
          opacity: 0;
        }
        /* nada é cortado: a foto entra inteira e o papel faz a moldura */
        .fan-card :global(img) {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #f1ece2;
        }

        .controles {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: clamp(1.25rem, 4vw, 2rem);
        }
        .controles button {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(179, 146, 111, 0.5);
          background: rgba(251, 247, 240, 0.6);
          color: var(--color-casca);
          cursor: pointer;
          transition: border-color 300ms ease, color 300ms ease, background 300ms ease;
        }
        .controles button:hover {
          border-color: var(--color-taupe);
          color: var(--color-navy);
          background: var(--color-linho);
        }
        .controles button :global(svg) { width: 18px; height: 18px; }
        .pontos { display: flex; gap: 0.45rem; }
        .pontos span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--color-taupe);
          opacity: 0.28;
          transition: opacity 300ms ease, transform 300ms ease;
        }
        .pontos span[data-ativo="true"] { opacity: 0.85; transform: scale(1.35); }
      `}</style>
    </section>
  );
}
