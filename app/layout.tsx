import type { Metadata, Viewport } from "next";
import {
  Newsreader,
  Instrument_Sans,
  Petit_Formal_Script,
  Caveat,
  Cormorant_Garamond,
} from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// A letra do nome do Heitor.
const autography = localFont({
  src: "../public/fonts/Autography.otf",
  variable: "--font-heitor",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-newsreader",
  display: "swap",
  axes: ["opsz"],
});

const instrument = Instrument_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-instrument",
  display: "swap",
});

const mao = Petit_Formal_Script({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  variable: "--font-mao",
  display: "swap",
});

// Alternativas de manuscrito para a carta — comparadas em /lab
const caveat = Caveat({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mao-b",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400"],
  style: ["italic", "normal"],
  variable: "--font-mao-c",
  display: "swap",
});

/**
 * O endereço público do site, usado pelo `metadataBase` para montar a
 * prévia do WhatsApp.
 *
 * Cuidado com o `??` aqui: uma variável de ambiente criada e deixada em
 * branco chega como string vazia, não como `undefined` — e `new URL("")`
 * derruba o build inteiro. Por isso a checagem é por conteúdo, e a Vercel
 * entra como plano B com o domínio que ela mesma publica.
 */
function enderecoDoSite(): URL {
  const candidatos = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const bruto of candidatos) {
    const limpo = bruto?.trim();
    if (!limpo) continue;
    try {
      return new URL(/^https?:\/\//.test(limpo) ? limpo : `https://${limpo}`);
    } catch {
      // valor torto: tenta o próximo em vez de quebrar o build
    }
  }

  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: enderecoDoSite(),
  title: {
    default: "Esperando Heitor",
    template: "%s · Esperando Heitor",
  },
  description:
    "Chá de fraldas do Heitor — 22 de agosto de 2026, 19h30, Pizzaria Atlântico, Olinda. Confirme sua presença e escolha um presente.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Esperando Heitor",
    title: "Esperando Heitor 💙",
    description:
      "22 de agosto de 2026 · 19h30 · Pizzaria Atlântico, Olinda. Confirme sua presença e escolha um presente.",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#fbf7f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${newsreader.variable} ${instrument.variable} ${mao.variable} ${caveat.variable} ${cormorant.variable} ${autography.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
