import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GIFTS, acharPresente, emReais } from "@/data/gifts";
import { gerarPixCopiaECola, pixConfigurado } from "@/lib/pix";
import { ArtDefs } from "@/components/art/filters";
import { ArcoMask } from "@/components/art/motifs";
import { Fluxo } from "@/components/presente/fluxo";

export function generateStaticParams() {
  return GIFTS.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const gift = acharPresente(slug);
  if (!gift) return {};
  return {
    title: `${gift.nome} · presente para o Heitor`,
    description: `${gift.detalhe} — ${emReais(gift.precoCentavos)}`,
  };
}

export default async function PaginaPresente({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gift = acharPresente(slug);
  if (!gift) notFound();

  /**
   * Um código PIX por quantidade possível, gerado aqui no servidor. O
   * navegador escolhe qual mostrar, mas não consegue inventar nenhum: o valor
   * está assinado dentro do próprio código.
   */
  const maximo = gift.quantidadeAberta ? (gift.quantidadeMaxima ?? 10) : 1;
  const codigos = pixConfigurado()
    ? Array.from({ length: maximo }, (_, i) =>
        gerarPixCopiaECola({
          valorCentavos: gift.precoCentavos * (i + 1),
          referencia: gift.slug,
        })
      )
    : [];

  return (
    <>
      <ArtDefs seed={13} />
      <ArcoMask id="arco" />
      <Fluxo gift={gift} codigos={codigos} />
    </>
  );
}
