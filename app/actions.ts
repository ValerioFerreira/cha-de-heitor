"use server";

import { z } from "zod";
import { randomUUID } from "crypto";
import { acharPresente, emReais } from "@/data/gifts";
import { sql, prepararBanco } from "@/lib/db";
import { avisarEscolha, avisarRsvp } from "@/lib/email";

/**
 * Tudo que vem do navegador passa por aqui antes de existir.
 *
 * O preço nunca chega do cliente: chega o `slug`, e o valor é lido do
 * catálogo no servidor. Assim ninguém consegue "pagar" R$ 1 editando a página.
 */

const texto = (max: number) => z.string().trim().min(1).max(max);

const EscolhaSchema = z.object({
  slug: z.string().trim().min(1).max(60),
  quantidade: z.coerce.number().int().min(1).max(10).default(1),
  nome: texto(80),
  mensagem: z.string().trim().max(600).optional(),
  // campo isca: humano nunca preenche, robô quase sempre preenche
  site: z.string().max(0).optional(),
});

const RsvpSchema = z.object({
  nome: texto(80),
  pessoas: z.coerce.number().int().min(1).max(20).default(1),
  presenca: z.coerce.boolean().default(true),
  mensagem: z.string().trim().max(600).optional(),
  site: z.string().max(0).optional(),
});

export type Resultado =
  | { ok: true; id: string }
  | { ok: false; erro: string };

export async function registrarEscolha(dados: unknown): Promise<Resultado> {
  const lido = EscolhaSchema.safeParse(dados);
  if (!lido.success) {
    return { ok: false, erro: "Confira o nome e tente de novo." };
  }
  if (lido.data.site) return { ok: true, id: "ignorado" }; // isca

  const presente = acharPresente(lido.data.slug);
  if (!presente) return { ok: false, erro: "Presente não encontrado." };

  const quantidade = presente.quantidadeAberta
    ? Math.min(lido.data.quantidade, presente.quantidadeMaxima ?? 10)
    : 1;

  const valorCentavos = presente.precoCentavos * quantidade;
  const id = randomUUID();
  const agora = new Date();
  const nomeCompleto = `${presente.nome} · ${presente.detalhe}`;

  try {
    if (sql) {
      await prepararBanco();
      await sql`
        insert into escolhas
          (id, presente_slug, presente_nome, quantidade, valor_centavos, nome, mensagem, criado_em)
        values
          (${id}, ${presente.slug}, ${nomeCompleto}, ${quantidade},
           ${valorCentavos}, ${lido.data.nome}, ${lido.data.mensagem ?? null}, ${agora.toISOString()})
      `;
    }
  } catch (e) {
    console.error("[escolha] não gravou no banco:", e);
  }

  try {
    const aviso = await avisarEscolha({
      id,
      nome: lido.data.nome,
      presente: nomeCompleto,
      quantidade,
      valor: emReais(valorCentavos),
      mensagem: lido.data.mensagem,
      quando: agora,
    });
    if (!aviso.enviado) console.warn("[escolha] e-mail não saiu:", aviso.motivo);
  } catch (e) {
    console.error("[escolha] e-mail falhou:", e);
  }

  return { ok: true, id };
}

export async function registrarRsvp(dados: unknown): Promise<Resultado> {
  const lido = RsvpSchema.safeParse(dados);
  if (!lido.success) {
    return { ok: false, erro: "Confira o nome e o número de pessoas." };
  }
  if (lido.data.site) return { ok: true, id: "ignorado" };

  const id = randomUUID();
  const agora = new Date();

  try {
    if (sql) {
      await prepararBanco();
      await sql`
        insert into rsvps (id, nome, pessoas, presenca, mensagem, criado_em)
        values (${id}, ${lido.data.nome}, ${lido.data.pessoas},
                ${lido.data.presenca}, ${lido.data.mensagem ?? null}, ${agora.toISOString()})
      `;
    }
  } catch (e) {
    console.error("[rsvp] não gravou no banco:", e);
  }

  try {
    const aviso = await avisarRsvp({
      id,
      nome: lido.data.nome,
      pessoas: lido.data.pessoas,
      presenca: lido.data.presenca,
      mensagem: lido.data.mensagem,
      quando: agora,
    });
    if (!aviso.enviado) console.warn("[rsvp] e-mail não saiu:", aviso.motivo);
  } catch (e) {
    console.error("[rsvp] e-mail falhou:", e);
  }

  return { ok: true, id };
}
