import { Resend } from "resend";

/**
 * O aviso que chega para os pais.
 *
 * Nunca falha para cima: se o e-mail não sair, a escolha já está gravada no
 * banco, e o convidado não pode ser punido por um problema nosso.
 */

const chave = process.env.RESEND_API_KEY;
const destino = process.env.EMAIL_DESTINO ?? "valerioeducfin@gmail.com";
const remetente = process.env.EMAIL_REMETENTE ?? "Heitor <onboarding@resend.dev>";

const resend = chave ? new Resend(chave) : null;

function escapar(t: string) {
  return t
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function moldura(titulo: string, linhas: [string, string][], mensagem?: string) {
  const itens = linhas
    .map(
      ([rotulo, valor]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #eadfcd;color:#8a6a4d;font-size:13px;width:38%">${escapar(rotulo)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eadfcd;color:#2b2119;font-size:15px">${escapar(valor)}</td>
      </tr>`
    )
    .join("");

  const recado = mensagem
    ? `<div style="margin-top:28px;padding:20px 22px;background:#fdfaf4;border-left:2px solid #b3926f">
         <p style="margin:0 0 8px;color:#8a6a4d;font-size:12px;letter-spacing:.08em;text-transform:uppercase">mensagem deixada</p>
         <p style="margin:0;color:#2b2119;font-size:16px;line-height:1.65;font-style:italic">${escapar(mensagem)}</p>
       </div>`
    : "";

  return `<!doctype html><html lang="pt-BR"><body style="margin:0;background:#f5efe4;padding:32px 16px;font-family:Georgia,'Times New Roman',serif">
    <div style="max-width:560px;margin:0 auto;background:#fbf7f0;padding:36px 32px">
      <p style="margin:0 0 4px;color:#b3926f;font-size:12px;letter-spacing:.12em;text-transform:uppercase">esperando heitor</p>
      <h1 style="margin:0 0 28px;color:#032a42;font-size:26px;font-weight:400">${escapar(titulo)}</h1>
      <table style="width:100%;border-collapse:collapse">${itens}</table>
      ${recado}
    </div>
  </body></html>`;
}

export async function avisarEscolha(dados: {
  id: string;
  nome: string;
  presente: string;
  quantidade: number;
  valor: string;
  mensagem?: string;
  quando: Date;
}) {
  if (!resend) return { enviado: false, motivo: "RESEND_API_KEY ausente" };

  const quando = dados.quando.toLocaleString("pt-BR", { timeZone: "America/Recife" });

  const { error } = await resend.emails.send({
    from: remetente,
    to: destino,
    subject: `Presente do Heitor · ${dados.nome} — ${dados.presente}`,
    html: moldura(
      "Chegou um presente",
      [
        ["De", dados.nome],
        ["Presente", dados.presente],
        ["Quantidade", String(dados.quantidade)],
        ["Valor", dados.valor],
        ["Quando", quando],
        ["Identificador", dados.id],
        ["Status", "o convidado declarou que fez o PIX"],
      ],
      dados.mensagem
    ),
  });

  return error ? { enviado: false, motivo: error.message } : { enviado: true };
}

export async function avisarRsvp(dados: {
  id: string;
  nome: string;
  pessoas: number;
  presenca: boolean;
  mensagem?: string;
  quando: Date;
}) {
  if (!resend) return { enviado: false, motivo: "RESEND_API_KEY ausente" };

  const { error } = await resend.emails.send({
    from: remetente,
    to: destino,
    subject: `${dados.presenca ? "Confirmou" : "Não vai poder ir"} · ${dados.nome}`,
    html: moldura(
      dados.presenca ? "Mais gente na mesa" : "Não vai poder ir",
      [
        ["Quem", dados.nome],
        ["Pessoas", String(dados.pessoas)],
        ["Presença", dados.presenca ? "confirmada" : "não vai poder ir"],
        ["Quando", dados.quando.toLocaleString("pt-BR", { timeZone: "America/Recife" })],
        ["Identificador", dados.id],
      ],
      dados.mensagem
    ),
  });

  return error ? { enviado: false, motivo: error.message } : { enviado: true };
}
