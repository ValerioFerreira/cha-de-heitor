/**
 * PIX Copia e Cola — o "BR Code" do Banco Central (padrão EMV®QRCPS-MPM).
 *
 * A string é uma sequência de campos `ID + tamanho + valor`, alguns com
 * campos aninhados dentro. Termina no CRC16, calculado sobre tudo, inclusive
 * sobre o próprio "6304" que o antecede.
 *
 * O QR Code é gerado a partir desta string — não existe imagem de QR guardada
 * em lugar nenhum. Mudou o preço, muda o código e muda o QR.
 */

const CHAVE = process.env.PIX_CHAVE ?? "";
const NOME = process.env.PIX_NOME ?? "";
const CIDADE = process.env.PIX_CIDADE ?? "";

/** `26` → tamanho de 2 dígitos, sempre. */
function campo(id: string, valor: string): string {
  return id + String(valor.length).padStart(2, "0") + valor;
}

/**
 * O padrão só aceita ASCII imprimível. Acento vira letra sem acento, o resto
 * cai fora — senão o app do banco recusa o código.
 */
function limpar(texto: string, max: number): string {
  return texto
    .normalize("NFD")
    // tira os acentos combinantes que a decomposição separou
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9 .-]/g, "")
    .trim()
    .slice(0, max)
    .toUpperCase();
}

function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export type DadosPix = {
  /** em centavos */
  valorCentavos: number;
  /** identificador da transação; até 25 caracteres, sem acento */
  referencia?: string;
};

export function pixConfigurado(): boolean {
  return Boolean(CHAVE && NOME && CIDADE);
}

export function gerarPixCopiaECola({ valorCentavos, referencia }: DadosPix): string {
  if (!pixConfigurado()) {
    throw new Error(
      "PIX não configurado: defina PIX_CHAVE, PIX_NOME e PIX_CIDADE nas variáveis de ambiente."
    );
  }

  const valor = (valorCentavos / 100).toFixed(2);
  const txid = limpar(referencia ?? "", 25).replace(/[ .-]/g, "") || "***";

  const conta =
    campo("00", "br.gov.bcb.pix") + campo("01", CHAVE);

  const payload =
    campo("00", "01") + // versão do payload
    campo("01", "11") + // 11 = estático reutilizável: o mesmo código serve a vários convidados
    campo("26", conta) +
    campo("52", "0000") + // categoria do estabelecimento: não informada
    campo("53", "986") + // BRL
    campo("54", valor) +
    campo("58", "BR") +
    campo("59", limpar(NOME, 25)) +
    campo("60", limpar(CIDADE, 15)) +
    campo("62", campo("05", txid)) +
    "6304";

  return payload + crc16(payload);
}
