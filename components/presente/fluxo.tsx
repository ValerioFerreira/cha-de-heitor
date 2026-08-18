"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import { emReais, type Gift } from "@/data/gifts";
import { registrarEscolha } from "@/app/actions";
import { Cerimonia } from "@/components/art/ceremony";
import { PAPER_GRAIN_URL } from "@/components/art/filters";

/**
 * A escolha de um presente, do começo ao fim, numa página só.
 *
 * O convidado está no celular — provavelmente o mesmo aparelho onde vai abrir
 * o banco. Por isso o "Copiar código PIX" vem primeiro e maior: apontar a
 * câmera para a própria tela não funciona. O QR fica logo abaixo, para quem
 * estiver no computador ou quiser pagar de outro aparelho.
 */
export function Fluxo({ gift, codigos }: { gift: Gift; codigos: string[] }) {
  const maximo = gift.quantidadeAberta ? (gift.quantidadeMaxima ?? 10) : 1;
  const [quantidade, setQuantidade] = useState(1);
  const [copiado, setCopiado] = useState(false);
  const [pago, setPago] = useState(false);
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [cerimonia, setCerimonia] = useState(false);

  const codigo = codigos[quantidade - 1] ?? "";
  const total = gift.precoCentavos * quantidade;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2600);
    } catch {
      setErro("Não deu para copiar. Selecione o código abaixo e copie à mão.");
    }
  }

  async function mandar() {
    if (!nome.trim()) {
      setErro("Escreva seu nome ou o da família para o Heitor saber de quem é.");
      return;
    }
    setErro(null);
    setEnviando(true);
    setCerimonia(true); // a cena começa na hora; o servidor responde por trás

    const r = await registrarEscolha({
      slug: gift.slug,
      quantidade,
      nome: nome.trim(),
      mensagem: mensagem.trim() || undefined,
    });

    setEnviando(false);
    if (!r.ok) {
      setCerimonia(false);
      setErro(r.erro);
    }
  }

  if (cerimonia) {
    return (
      <main className="cerimonia-tela">
        <Cerimonia
          nome={nome}
          mensagem={mensagem}
          presenteSrc={gift.imagem}
          presenteNome={gift.nome}
          rodando
        />
        <Link href="/" className="voltar-inicio">
          Voltar ao início
        </Link>
        <style jsx>{`
          .cerimonia-tela {
            min-height: 100svh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            padding: clamp(2rem, 6vh, 4rem) clamp(1.25rem, 5vw, 3rem);
            background: linear-gradient(172deg, #fbf7f0, #f3e8d6);
          }
          .voltar-inicio {
            font-family: var(--font-ui);
            font-size: 0.74rem;
            letter-spacing: 0.09em;
            text-transform: uppercase;
            color: var(--color-casca);
            text-decoration: none;
            border-bottom: 1px solid rgba(179, 146, 111, 0.4);
            padding-bottom: 2px;
            animation: surgir 1s ease 19s both;
          }
          @keyframes surgir { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
      </main>
    );
  }

  return (
    <main className="pagina">
      <Link href="/#presentes" className="voltar">
        ← todos os presentes
      </Link>

      <div className="colunas">
        {/* ── o item ─────────────────────────────────────── */}
        <div className="item">
          <div className="moldura">
            <span className="grao" style={{ backgroundImage: PAPER_GRAIN_URL }} />
            <Image
              src={gift.imagem}
              alt={`${gift.nome}, ${gift.detalhe}`}
              width={520}
              height={520}
              priority
              className="produto"
            />
          </div>
          <h1>{gift.nome}</h1>
          <p className="detalhe">{gift.detalhe}</p>

          {gift.quantidadeAberta && (
            <div className="quantidade">
              <span>Quantos pacotes?</span>
              <div className="contador">
                <button
                  type="button"
                  onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                  disabled={quantidade <= 1}
                  aria-label="Tirar um"
                >
                  −
                </button>
                <b>{quantidade}</b>
                <button
                  type="button"
                  onClick={() => setQuantidade((q) => Math.min(maximo, q + 1))}
                  disabled={quantidade >= maximo}
                  aria-label="Somar um"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <p className="total">{emReais(total)}</p>
        </div>

        {/* ── o pagamento ────────────────────────────────── */}
        <div className="pagamento">
          {codigo ? (
            <>
              <p className="passo">Faça seu PIX</p>

              <button type="button" className="copiar" onClick={copiar}>
                {copiado ? "Código copiado ✓" : "Copiar código PIX"}
              </button>
              <p className="dica">
                Cole no app do seu banco. Se estiver no computador, use o QR Code.
              </p>

              <Qr valor={codigo} />

              <details className="cru">
                <summary>Ver o código escrito</summary>
                <p>{codigo}</p>
              </details>

              <button
                type="button"
                className={`ja-paguei ${pago ? "feito" : ""}`}
                onClick={() => setPago(true)}
                aria-pressed={pago}
              >
                {pago ? "Anotado ✓" : "Tá pago!"}
              </button>
            </>
          ) : (
            <p className="sem-pix">
              O PIX ainda não foi configurado neste ambiente. Defina{" "}
              <code>PIX_CHAVE</code>, <code>PIX_NOME</code> e <code>PIX_CIDADE</code>.
            </p>
          )}

          {/* ── a identificação e o recado ───────────────── */}
          <div className="recado" data-liberado={pago}>
            <p className="passo">Quem está mandando?</p>

            <label>
              <span>Seu nome ou família</span>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                maxLength={80}
                placeholder="Família Silva"
                autoComplete="name"
              />
            </label>

            <label>
              <span>Uma mensagem para o Heitor <i>opcional</i></span>
              <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                rows={4}
                maxLength={600}
                placeholder="Escreva o que quiser — ele vai guardar."
              />
            </label>

            <button type="button" className="mandar" onClick={mandar} disabled={enviando}>
              {enviando ? "Mandando…" : "Mandar meu presente com minha mensagem!"}
            </button>

            {erro && <p className="erro">{erro}</p>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .pagina {
          min-height: 100svh;
          padding: clamp(1.5rem, 5vh, 3rem) clamp(1.25rem, 5vw, 4rem) clamp(4rem, 10vh, 6rem);
          background: linear-gradient(178deg, #fbf7f0 0%, #f7f0e3 60%, #f2e5cf 100%);
        }
        .voltar {
          display: inline-block;
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 0.92rem;
          color: var(--color-casca);
          text-decoration: none;
          margin-bottom: clamp(1.5rem, 5vw, 2.5rem);
        }
        .voltar:hover { color: var(--color-navy); }

        .colunas {
          max-width: 1080px;
          margin-inline: auto;
          display: grid;
          gap: clamp(2rem, 6vw, 4rem);
        }
        @media (min-width: 860px) {
          .colunas { grid-template-columns: 1fr 1fr; align-items: start; }
          .item { position: sticky; top: clamp(1.5rem, 5vh, 3rem); }
        }

        /* ── item ─────────────────────────────────────────── */
        .moldura {
          position: relative;
          aspect-ratio: 4 / 5;
          background: linear-gradient(168deg, #f8eeda, #efd6b2);
          display: grid;
          place-items: center;
          overflow: hidden;
          clip-path: url(#arco);
        }
        .grao { position: absolute; inset: 0; opacity: 0.28; mix-blend-mode: multiply; background-size: 180px; }
        /* imagens já recortadas em scripts/recortar-produtos.mjs */
        .item :global(.produto) {
          position: relative;
          z-index: 1;
          width: 74%;
          height: auto;
          max-height: 74%;
          object-fit: contain;
          filter: drop-shadow(0 18px 24px rgba(90, 66, 44, 0.28));
          transform: translateY(-3%);
        }
        h1 {
          margin-top: clamp(1.25rem, 4vw, 1.75rem);
          font-family: var(--font-editorial);
          font-weight: 400;
          font-size: clamp(1.6rem, 6.4vw, 2.2rem);
          line-height: 1.14;
          color: var(--color-navy);
        }
        .detalhe {
          font-family: var(--font-editorial);
          font-style: italic;
          color: var(--color-casca);
          margin-top: 0.25rem;
        }
        .quantidade {
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border-top: 1px solid rgba(179, 146, 111, 0.3);
          border-bottom: 1px solid rgba(179, 146, 111, 0.3);
          padding: 1rem 0;
        }
        .quantidade span {
          font-family: var(--font-editorial);
          font-style: italic;
          color: var(--color-casca);
        }
        .contador { display: flex; align-items: center; gap: 0.35rem; }
        .contador button {
          width: 42px;
          height: 42px;
          font-size: 1.2rem;
          background: transparent;
          border: 1px solid rgba(179, 146, 111, 0.5);
          color: var(--color-navy);
          cursor: pointer;
          border-radius: 1px;
        }
        .contador button:disabled { opacity: 0.3; cursor: not-allowed; }
        .contador b {
          font-family: var(--font-ui);
          font-variant-numeric: tabular-nums;
          min-width: 2.2rem;
          text-align: center;
          font-size: 1.1rem;
        }
        .total {
          margin-top: 1.25rem;
          font-family: var(--font-ui);
          font-variant-numeric: tabular-nums;
          font-size: clamp(1.5rem, 6vw, 1.9rem);
          color: var(--color-navy);
        }

        /* ── pagamento ────────────────────────────────────── */
        .passo {
          font-family: var(--font-editorial);
          font-size: clamp(1.25rem, 5vw, 1.6rem);
          color: var(--color-navy);
          margin-bottom: 1rem;
        }
        .copiar {
          width: 100%;
          font-family: var(--font-ui);
          font-size: 0.82rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 1.15rem;
          background: var(--color-navy);
          color: var(--color-linho);
          border: 1px solid var(--color-navy);
          cursor: pointer;
          border-radius: 1px;
          transition: opacity 250ms ease;
        }
        .copiar:hover { opacity: 0.88; }
        .dica {
          margin-top: 0.7rem;
          font-size: 0.9rem;
          line-height: 1.55;
          color: var(--color-grafite);
        }
        .cru {
          margin-top: 1rem;
          font-size: 0.85rem;
          color: var(--color-casca);
        }
        .cru summary {
          cursor: pointer;
          font-family: var(--font-editorial);
          font-style: italic;
        }
        .cru p {
          margin-top: 0.6rem;
          word-break: break-all;
          font-family: var(--font-ui);
          font-size: 0.72rem;
          line-height: 1.6;
          color: var(--color-grafite);
          background: rgba(251, 247, 240, 0.8);
          border: 1px solid rgba(179, 146, 111, 0.3);
          padding: 0.75rem;
          user-select: all;
        }
        .ja-paguei {
          width: 100%;
          margin-top: 1.75rem;
          font-family: var(--font-ui);
          font-size: 0.82rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 1.05rem;
          background: transparent;
          border: 1px solid var(--color-taupe);
          color: var(--color-casca);
          cursor: pointer;
          border-radius: 1px;
          transition: border-color 300ms ease, color 300ms ease, background 300ms ease;
        }
        .ja-paguei:hover { border-color: var(--color-navy); color: var(--color-navy); }
        .ja-paguei.feito {
          background: rgba(179, 146, 111, 0.16);
          border-color: var(--color-taupe);
          color: var(--color-casca);
        }
        .sem-pix {
          padding: 1.25rem;
          border: 1px dashed rgba(179, 146, 111, 0.6);
          color: var(--color-grafite);
          line-height: 1.6;
          font-size: 0.92rem;
        }
        .sem-pix code { font-family: var(--font-ui); font-size: 0.85em; }

        /* ── recado ───────────────────────────────────────── */
        .recado {
          margin-top: clamp(2.5rem, 7vw, 3.5rem);
          padding-top: clamp(2rem, 6vw, 2.75rem);
          border-top: 1px solid rgba(179, 146, 111, 0.35);
          display: grid;
          gap: 1.15rem;
          opacity: 0.45;
          transition: opacity 600ms ease;
        }
        .recado[data-liberado="true"] { opacity: 1; }
        label { display: grid; gap: 0.45rem; }
        label span {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 0.92rem;
          color: var(--color-casca);
        }
        label i { opacity: 0.65; }
        input, textarea {
          font-family: var(--font-ui);
          font-size: 1rem;
          padding: 0.85rem 0.9rem;
          border: 1px solid rgba(179, 146, 111, 0.5);
          background: rgba(251, 247, 240, 0.75);
          color: var(--color-tinta);
          border-radius: 1px;
          width: 100%;
        }
        input:focus, textarea:focus { border-color: var(--color-taupe); background: var(--color-linho); }
        textarea { resize: vertical; line-height: 1.55; }
        .mandar {
          margin-top: 0.5rem;
          font-family: var(--font-ui);
          font-size: 0.82rem;
          letter-spacing: 0.06em;
          padding: 1.15rem 1rem;
          background: var(--color-navy);
          color: var(--color-linho);
          border: 1px solid var(--color-navy);
          cursor: pointer;
          border-radius: 1px;
          transition: opacity 250ms ease;
        }
        .mandar:disabled { opacity: 0.5; cursor: wait; }
        .erro { color: #9a3d3d; font-size: 0.92rem; line-height: 1.5; }
      `}</style>
    </main>
  );
}

/** O QR sai do próprio código PIX — não existe imagem guardada em lugar nenhum. */
function Qr({ valor }: { valor: string }) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let vivo = true;
    QRCode.toString(valor, {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#032a42", light: "#0000" },
    })
      .then((s) => vivo && setSvg(s))
      .catch(() => vivo && setSvg(""));
    return () => {
      vivo = false;
    };
  }, [valor]);

  const conteudo = useMemo(() => ({ __html: svg }), [svg]);

  return (
    <figure className="qr">
      <div className="quadro" dangerouslySetInnerHTML={conteudo} />
      <figcaption>ou aponte a câmera de outro aparelho</figcaption>
      <style jsx>{`
        .qr {
          margin-top: 1.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        .quadro {
          width: min(230px, 62vw);
          aspect-ratio: 1;
          padding: 14px;
          background: var(--color-linho);
          border: 1px solid rgba(179, 146, 111, 0.4);
        }
        .quadro :global(svg) { width: 100%; height: 100%; display: block; }
        figcaption {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 0.85rem;
          color: var(--color-casca);
        }
      `}</style>
    </figure>
  );
}
