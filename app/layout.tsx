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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://cha-de-heitor.vercel.app"),
  title: {
    default: "Esperando Heitor",
    template: "%s · Esperando Heitor",
  },
  description:
    "Chá de fraldas do Heitor — 20 de agosto de 2026, 19h30, Restaurante Boi e Brasa, Olinda. Confirme sua presença e escolha um presente.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Esperando Heitor",
    title: "Esperando Heitor 💙",
    description:
      "20 de agosto de 2026 · 19h30 · Boi e Brasa, Olinda. Confirme sua presença e escolha um presente.",
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
