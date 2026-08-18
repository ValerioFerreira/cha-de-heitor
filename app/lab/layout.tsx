import type { Metadata } from "next";

/** O ateliê é ferramenta de trabalho, não página do site. Fora do Google. */
export const metadata: Metadata = {
  title: "Ateliê",
  robots: { index: false, follow: false },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
