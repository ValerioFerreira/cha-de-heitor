import type { Metadata, Viewport } from "next";
import {
  Newsreader,
  Instrument_Sans,
  Petit_Formal_Script,
  Caveat,
  Cormorant_Garamond,
} from "next/font/google";
import "./globals.css";

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
  title: "Nós já escutamos teus sinais…",
  description: "Chá de fraldas do Heitor — 20 de agosto de 2026, Olinda.",
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
      className={`${newsreader.variable} ${instrument.variable} ${mao.variable} ${caveat.variable} ${cormorant.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
