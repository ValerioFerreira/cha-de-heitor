/**
 * Aquarela em SVG.
 *
 * Três camadas fazem o efeito:
 *   1. `aq-wash`  — desloca a borda do preenchimento com ruído, para que
 *                   nenhuma curva termine exatamente onde foi desenhada.
 *   2. `aq-grao`  — granulação por dentro da mancha (o pigmento que
 *                   assenta no papel).
 *   3. `aq-linha` — a mesma distorção, bem mais fraca, para o traço de tinta.
 *
 * `seed` diferente por ilustração evita que duas manchas fiquem idênticas.
 */
export function ArtDefs({ seed = 7 }: { seed?: number }) {
  const s = seed;
  return (
    <svg width="0" height="0" aria-hidden focusable="false" style={{ position: "absolute" }}>
      <defs>
        <filter id="aq-wash" x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.024" numOctaves="4" seed={s} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="8" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="0.7" />
        </filter>

        <filter id="aq-bleed" x="-40%" y="-40%" width="180%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed={s + 3} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="14" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="5" />
        </filter>

        <filter id="aq-linha" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={s + 11} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="aq-grao" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed={s + 5} result="g" />
          <feColorMatrix in="g" type="saturate" values="0" result="gs" />
          <feComponentTransfer in="gs" result="ga">
            <feFuncA type="linear" slope="0.5" intercept="-0.08" />
          </feComponentTransfer>
          <feComposite in="ga" in2="SourceGraphic" operator="in" result="dentro" />
          <feBlend in="SourceGraphic" in2="dentro" mode="multiply" />
        </filter>

        {/* Grão de papel — vai por cima de superfícies claras */}
        <filter id="papel-grao">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
    </svg>
  );
}

/** Textura de papel como data-URI, para usar em `background-image`. */
export const PAPER_GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")";
