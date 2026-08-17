import { neon } from "@neondatabase/serverless";

/**
 * Três tabelas, nada além disso.
 *
 * O banco existe para que nada se perca: se o e-mail falhar, a escolha e a
 * mensagem continuam gravadas. O convidado nunca vê nada disso.
 */

const url = process.env.DATABASE_URL;

export const bancoConfigurado = Boolean(url);

export const sql = url ? neon(url) : null;

export const SCHEMA = `
create table if not exists rsvps (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  pessoas     integer not null default 1,
  presenca    boolean not null default true,
  mensagem    text,
  criado_em   timestamptz not null default now()
);

create table if not exists escolhas (
  id             uuid primary key default gen_random_uuid(),
  presente_slug  text not null,
  presente_nome  text not null,
  quantidade     integer not null default 1,
  valor_centavos integer not null,
  nome           text not null,
  mensagem       text,
  status         text not null default 'declarado_pago',
  criado_em      timestamptz not null default now()
);

create index if not exists escolhas_criado_em_idx on escolhas (criado_em desc);
`;

/** Cria as tabelas se ainda não existirem. Seguro de rodar quantas vezes for. */
export async function prepararBanco() {
  if (!sql) return false;
  await sql.query(SCHEMA);
  return true;
}
