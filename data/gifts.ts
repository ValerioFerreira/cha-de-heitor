/**
 * O catálogo.
 *
 * Esta é a única fonte de verdade dos presentes. O preço usado na cobrança e
 * no e-mail vem daqui, no servidor — o navegador manda só o `slug`, nunca o
 * valor. Para mudar um item, mude aqui: nome, preço, foto e ordem.
 */

export type Gift = {
  slug: string;
  nome: string;
  /** aparece abaixo do nome, no card e na página do presente */
  detalhe: string;
  /** em centavos, para nunca depender de ponto flutuante */
  precoCentavos: number;
  imagem: string;
  /** quando true, o convidado escolhe quantas unidades quer */
  quantidadeAberta?: boolean;
  quantidadeMaxima?: number;
};

export const GIFTS: Gift[] = [
  {
    slug: "lencos-umedecidos",
    nome: "Lenços umedecidos",
    detalhe: "Huggies · pacote",
    precoCentavos: 1500,
    imagem: "/images/lenco-umedecido.webp",
    quantidadeAberta: true,
    quantidadeMaxima: 10,
  },
  {
    slug: "bepantol-baby",
    nome: "Bepantol Baby",
    detalhe: "Creme preventivo · 120g",
    precoCentavos: 3000,
    imagem: "/images/bepantol.webp",
  },
  {
    slug: "fralda-p-18",
    nome: "Fraldas Huggies P",
    detalhe: "18 fraldas",
    precoCentavos: 3000,
    imagem: "/images/fralda-p-18.png",
  },
  {
    slug: "fralda-g-30",
    nome: "Fraldas Huggies G",
    detalhe: "30 fraldas",
    precoCentavos: 4500,
    imagem: "/images/fralda-g-30.png",
  },
  {
    slug: "fralda-p-38",
    nome: "Fraldas Huggies P",
    detalhe: "38 fraldas",
    precoCentavos: 4500,
    imagem: "/images/fralda-p-38.png",
  },
  {
    slug: "fralda-g-36",
    nome: "Fraldas Huggies G",
    detalhe: "36 fraldas",
    precoCentavos: 5000,
    imagem: "/images/fralda-g-36.webp",
  },
  {
    slug: "fralda-p-46",
    nome: "Fraldas Huggies P",
    detalhe: "46 fraldas",
    precoCentavos: 5000,
    imagem: "/images/fralda-p-46.jpg",
  },
  {
    slug: "fralda-g-78",
    nome: "Fraldas Huggies G",
    detalhe: "78 fraldas",
    precoCentavos: 8000,
    imagem: "/images/fralda-g-78.png",
  },
  {
    slug: "fralda-g-92",
    nome: "Fraldas Huggies G",
    detalhe: "92 fraldas",
    precoCentavos: 10000,
    imagem: "/images/fralda-g-92.png",
  },
];

export function acharPresente(slug: string): Gift | undefined {
  return GIFTS.find((g) => g.slug === slug);
}

export function emReais(centavos: number): string {
  return (centavos / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
