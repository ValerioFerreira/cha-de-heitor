"use client";

import { useActionState, useEffect, useState } from "react";
import { CONTEUDO } from "@/data/content";
import { registrarRsvp } from "@/app/actions";
import { Reveal } from "@/components/shared/reveal";
import { Balao } from "@/components/art/motifs";

/* ── 05 · o dia ────────────────────────────────────────────── */

export function Evento() {
  const { evento } = CONTEUDO;

  return (
    <section id="evento" className="evento">
      <Reveal as="p" className="rotulo">{evento.rotulo}</Reveal>

      <Reveal atraso={100} forca="destaque">
        <p className="data">{evento.data}</p>
        <p className="hora">
          {evento.diaSemana} · {evento.hora}
        </p>
      </Reveal>

      <Reveal atraso={220}>
        <p className="local">{evento.local}</p>
        <p className="cidade">{evento.cidade}</p>
      </Reveal>

      <Reveal atraso={320}>
        <Contagem />
      </Reveal>

      <Reveal atraso={420}>
        <a className="mapa" href={evento.mapa} target="_blank" rel="noopener noreferrer">
          Como chegar
        </a>
      </Reveal>

      <Balao className="balao" cor="#e6d3b4" />

      <style jsx>{`
        .evento {
          position: relative;
          padding: clamp(4rem, 12vh, 7rem) clamp(1.5rem, 6vw, 4rem);
          max-width: 900px;
          margin-inline: auto;
          text-align: center;
        }
        .evento :global(.rotulo) {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 0.92rem;
          color: var(--color-casca);
          margin-bottom: clamp(1.5rem, 5vw, 2.25rem);
        }
        .data {
          font-family: var(--font-editorial);
          font-size: clamp(1.9rem, 8vw, 3.1rem);
          line-height: 1.08;
          color: var(--color-navy);
          text-wrap: balance;
        }
        .hora {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: clamp(1rem, 4.2vw, 1.25rem);
          color: var(--color-casca);
          margin-top: 0.5rem;
        }
        .local {
          margin-top: clamp(1.75rem, 5vw, 2.5rem);
          font-size: clamp(1.05rem, 4.4vw, 1.2rem);
          color: var(--color-tinta);
        }
        .cidade {
          font-family: var(--font-editorial);
          font-style: italic;
          color: var(--color-casca);
          margin-top: 0.2rem;
        }
        .mapa {
          display: inline-block;
          margin-top: clamp(1.75rem, 5vw, 2.5rem);
          font-family: var(--font-ui);
          font-size: 0.78rem;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          padding: 0.95rem 2rem;
          border: 1px solid var(--color-navy);
          color: var(--color-navy);
          text-decoration: none;
          transition: background 320ms ease, color 320ms ease;
        }
        .mapa:hover { background: var(--color-navy); color: var(--color-linho); }

        .evento :global(.balao) {
          position: absolute;
          right: clamp(0.5rem, 4vw, 3rem);
          top: 12%;
          width: clamp(34px, 7vw, 52px);
          height: auto;
          opacity: 0.75;
          animation: flutuar 9s ease-in-out infinite;
        }
        @keyframes flutuar {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50% { transform: translateY(-16px) rotate(2deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .evento :global(.balao) { animation: none; }
        }
      `}</style>
    </section>
  );
}

function Contagem() {
  const alvo = new Date(CONTEUDO.evento.quando).getTime();
  const [agora, setAgora] = useState<number | null>(null);

  useEffect(() => {
    setAgora(Date.now());
    const t = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (agora === null) {
    return <p className="contagem placeholder">·</p>;
  }

  const ms = alvo - agora;

  if (ms <= 0) {
    return (
      <p className="chegou">
        É hoje. Estamos esperando você.
        <style jsx>{`
          .chegou {
            margin-top: clamp(1.75rem, 5vw, 2.5rem);
            font-family: var(--font-editorial);
            font-style: italic;
            font-size: clamp(1.1rem, 4.6vw, 1.4rem);
            color: var(--color-navy);
          }
        `}</style>
      </p>
    );
  }

  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);

  return (
    <p className="contagem">
      <Parte n={d} rotulo={d === 1 ? "dia" : "dias"} />
      <i>·</i>
      <Parte n={h} rotulo="horas" pad />
      <i>·</i>
      <Parte n={m} rotulo="min" pad />
      <span className="segundos">{String(s).padStart(2, "0")}</span>

      <style jsx>{`
        .contagem {
          margin-top: clamp(1.75rem, 5vw, 2.5rem);
          display: flex;
          align-items: baseline;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.35rem 0.5rem;
          color: var(--color-tinta);
        }
        .contagem i { color: var(--color-taupe); opacity: 0.5; font-style: normal; }
        .segundos {
          font-family: var(--font-ui);
          font-variant-numeric: tabular-nums;
          font-size: 0.8rem;
          color: var(--color-taupe);
          opacity: 0.55;
          margin-left: 0.2rem;
        }
        .placeholder { color: var(--color-taupe); opacity: 0.4; }
      `}</style>
    </p>
  );
}

function Parte({ n, rotulo, pad }: { n: number; rotulo: string; pad?: boolean }) {
  return (
    <span className="parte">
      <b>{pad ? String(n).padStart(2, "0") : n}</b>
      <em>{rotulo}</em>
      <style jsx>{`
        .parte { display: inline-flex; align-items: baseline; gap: 0.3rem; }
        b {
          font-family: var(--font-ui);
          font-variant-numeric: tabular-nums;
          font-weight: 500;
          font-size: clamp(1.05rem, 4.4vw, 1.3rem);
          letter-spacing: 0.02em;
        }
        em {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 0.88rem;
          color: var(--color-casca);
        }
      `}</style>
    </span>
  );
}

/* ── 06 · confirmação de presença ──────────────────────────── */

export function Rsvp() {
  const { rsvp } = CONTEUDO;
  type EstadoRsvp = { ok?: boolean; erro?: string };
  const [estado, enviar, pendente] = useActionState<EstadoRsvp, FormData>(
    async (_anterior, form) => {
      const r = await registrarRsvp({
        nome: form.get("nome"),
        pessoas: form.get("pessoas"),
        presenca: form.get("presenca") === "sim",
        mensagem: form.get("mensagem") || undefined,
        site: form.get("site") || undefined,
      });
      return r.ok ? { ok: true } : { erro: r.erro };
    },
    {}
  );

  return (
    <section id="rsvp" className="rsvp">
      <Reveal as="p" className="rotulo">{rsvp.rotulo}</Reveal>
      <Reveal atraso={100}>
        <h2 className="titulo">{rsvp.titulo}</h2>
        <p className="nota">{rsvp.nota}</p>
      </Reveal>

      {estado.ok ? (
        <p className="pronto">
          Anotado. Até dia 20 — vai ser bom demais ter você lá.
        </p>
      ) : (
        <Reveal atraso={200}>
          <form action={enviar}>
            <label>
              <span>Seu nome ou família</span>
              <input name="nome" required maxLength={80} autoComplete="name" placeholder="Família Silva" />
            </label>

            <div className="dupla">
              <label>
                <span>Quantas pessoas</span>
                <input name="pessoas" type="number" min={1} max={20} defaultValue={2} inputMode="numeric" />
              </label>
              <label>
                <span>Você vai?</span>
                <select name="presenca" defaultValue="sim">
                  <option value="sim">Vou sim</option>
                  <option value="nao">Não vou poder</option>
                </select>
              </label>
            </div>

            <label>
              <span>Quer deixar um recado? <i>opcional</i></span>
              <textarea name="mensagem" rows={3} maxLength={600} />
            </label>

            <input name="site" tabIndex={-1} autoComplete="off" className="isca" aria-hidden />

            <button type="submit" disabled={pendente}>
              {pendente ? "Confirmando…" : "Confirmar presença"}
            </button>

            {estado.erro && <p className="erro">{estado.erro}</p>}
          </form>
        </Reveal>
      )}

      <style jsx>{`
        .rsvp {
          padding: clamp(4rem, 12vh, 7rem) clamp(1.5rem, 6vw, 4rem);
          max-width: 620px;
          margin-inline: auto;
        }
        .rsvp :global(.rotulo) {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 0.92rem;
          color: var(--color-casca);
          margin-bottom: 0.75rem;
        }
        .titulo {
          font-family: var(--font-editorial);
          font-weight: 400;
          font-size: clamp(1.7rem, 6.6vw, 2.4rem);
          color: var(--color-navy);
          line-height: 1.14;
        }
        .nota {
          margin: 0.7rem 0 clamp(1.75rem, 5vw, 2.5rem);
          color: var(--color-grafite);
          line-height: 1.6;
        }
        form { display: grid; gap: 1.15rem; }
        .dupla { display: grid; gap: 1.15rem; grid-template-columns: 1fr 1fr; }
        label { display: grid; gap: 0.45rem; }
        label span {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 0.92rem;
          color: var(--color-casca);
        }
        label i { opacity: 0.65; }
        input, select, textarea {
          font-family: var(--font-ui);
          font-size: 1rem;
          padding: 0.85rem 0.9rem;
          border: 1px solid rgba(179, 146, 111, 0.5);
          background: rgba(251, 247, 240, 0.7);
          color: var(--color-tinta);
          border-radius: 1px;
          width: 100%;
          transition: border-color 250ms ease, background 250ms ease;
        }
        input:focus, select:focus, textarea:focus {
          border-color: var(--color-taupe);
          background: var(--color-linho);
        }
        textarea { resize: vertical; line-height: 1.55; }
        .isca { position: absolute; left: -9999px; width: 1px; height: 1px; }
        button {
          margin-top: 0.5rem;
          font-family: var(--font-ui);
          font-size: 0.78rem;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          padding: 1.05rem;
          background: var(--color-navy);
          color: var(--color-linho);
          border: 1px solid var(--color-navy);
          cursor: pointer;
          border-radius: 1px;
          transition: opacity 250ms ease;
        }
        button:disabled { opacity: 0.5; cursor: wait; }
        .erro { color: #9a3d3d; font-size: 0.92rem; }
        .pronto {
          font-family: var(--font-editorial);
          font-size: clamp(1.15rem, 4.8vw, 1.5rem);
          line-height: 1.5;
          color: var(--color-navy);
          padding: clamp(1.75rem, 5vw, 2.5rem) 0;
        }
      `}</style>
    </section>
  );
}
