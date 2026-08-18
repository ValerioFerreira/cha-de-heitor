"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArtDefs, PAPER_GRAIN_URL } from "@/components/art/filters";
import { Baby, type BabyPose } from "@/components/art/baby";
import { Girafa, Passarinho, Elefante } from "@/components/art/animals";
import {
  Balao,
  Folha,
  Faisca,
  Coracao,
  Pegadas,
  Envelope,
  Caixa,
  Nuvem,
  ArcoMask,
} from "@/components/art/motifs";
import { Assinatura, Rubrica } from "@/components/art/signature";
import { Cerimonia } from "@/components/art/ceremony";

/* ────────────────────────────────────────────────────────────
   /lab — a prova de tudo que será desenhado e animado.
   Não é o site: é a mesa do ateliê, para aprovar peça por peça.
   ──────────────────────────────────────────────────────────── */

export default function Lab() {
  return (
    <main style={{ background: "var(--color-linho)" }}>
      <ArtDefs />
      <ArcoMask id="arco" />

      <Cabecalho />
      <SecaoAssinatura />
      <SecaoPaleta />
      <SecaoTipografia />
      <SecaoPersonagens />
      <SecaoMotivos />
      <SecaoFotografia />
      <SecaoPresente />
      <SecaoContagem />
      <SecaoCerimonia />

      <footer className="rodape">
        <Rubrica className="w-40 text-[var(--color-taupe)]" />
        <p>Ateliê · Esperando Heitor</p>
      </footer>

      <style jsx global>{`
        .lab-secao {
          padding: clamp(3.5rem, 9vw, 7rem) clamp(1.25rem, 5vw, 4rem);
          max-width: 1180px;
          margin-inline: auto;
        }
        .lab-titulo {
          font-family: var(--font-editorial);
          font-size: clamp(1.6rem, 4.5vw, 2.4rem);
          line-height: 1.1;
          color: var(--color-navy);
          margin-bottom: 0.4rem;
        }
        .lab-nota {
          font-family: var(--font-ui);
          font-size: 0.875rem;
          line-height: 1.65;
          color: var(--color-grafite);
          max-width: 62ch;
          margin-bottom: 2.5rem;
        }
        .lab-rotulo {
          font-family: var(--font-editorial);
          font-style: italic;
          font-size: 0.9rem;
          color: var(--color-casca);
          margin-bottom: 1.25rem;
          display: block;
        }
        .grade {
          display: grid;
          gap: clamp(1rem, 3vw, 2rem);
        }
        .peca {
          background: var(--color-papel);
          border: 1px solid rgba(179, 146, 111, 0.28);
          border-radius: 2px;
          padding: 1.25rem 1rem 0.9rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          position: relative;
        }
        .peca > span {
          font-family: var(--font-ui);
          font-size: 0.72rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-casca);
        }
        .botao {
          font-family: var(--font-ui);
          font-size: 0.8rem;
          letter-spacing: 0.04em;
          padding: 0.7rem 1.4rem;
          border: 1px solid var(--color-navy);
          background: transparent;
          color: var(--color-navy);
          border-radius: 1px;
          cursor: pointer;
          transition: background 300ms ease, color 300ms ease;
        }
        .botao:hover {
          background: var(--color-navy);
          color: var(--color-linho);
        }
        .rodape {
          padding: 4rem 2rem 5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-ui);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-taupe);
        }
      `}</style>
    </main>
  );
}

/* ── cabeçalho ──────────────────────────────────────────── */

function Cabecalho() {
  return (
    <header
      style={{
        padding: "clamp(3rem,8vw,5rem) clamp(1.25rem,5vw,4rem) 0",
        maxWidth: 1180,
        margin: "0 auto",
      }}
    >
      <span className="lab-rotulo">ateliê · validação</span>
      <h1 className="lab-titulo" style={{ fontSize: "clamp(2rem,6vw,3.2rem)" }}>
        As peças do Heitor
      </h1>
      <p className="lab-nota">
        Tudo aqui é desenhado em SVG — nenhuma imagem gerada, nenhum banco de
        ilustração. Isso significa que cada peça pode ser animada traço a traço,
        recolorida e escalada sem perder nitidez, e o conjunto todo pesa menos que
        uma única foto. Aprove, corte ou peça ajuste peça por peça.
      </p>
    </header>
  );
}

/* ── 1. assinatura ──────────────────────────────────────── */

function SecaoAssinatura() {
  const [k, setK] = useState(0);
  return (
    <section className="lab-secao">
      <span className="lab-rotulo">01 · a assinatura</span>
      <h2 className="lab-titulo">Heitor, escrito à mão</h2>
      <p className="lab-nota">
        Na Autography. O nome não aparece: ele é escrito — a máscara abre da esquerda
        para a direita no ritmo de uma mão, com uma pequena hesitação no meio.
      </p>

      <div
        style={{
          background: "var(--color-papel)",
          padding: "clamp(1.5rem,5vw,3rem)",
          border: "1px solid rgba(179,146,111,.28)",
        }}
      >
        <p style={{ textAlign: "center", color: "var(--color-navy)", fontSize: "clamp(4rem,16vw,8rem)" }}>
          <Assinatura key={k} />
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
        <button className="botao" onClick={() => setK((n) => n + 1)}>
          Escrever de novo
        </button>
      </div>

      <div style={{ marginTop: "2.5rem" }}>
        <span className="lab-rotulo">o mesmo traço, como filete de seção</span>
        <Rubrica className="w-full max-w-[420px] text-[var(--color-taupe)]" />
      </div>
    </section>
  );
}

/* ── 2. paleta ──────────────────────────────────────────── */

const PALETA = [
  ["noite", "#04212f", "o fim do site"],
  ["navy", "#032a42", "títulos"],
  ["profundo", "#0b3c56", "meio-tom"],
  ["azul", "#7ba5c6", "detalhes"],
  ["céu", "#d1e2f3", "manhã"],
  ["linho", "#fbf7f0", "fundo"],
  ["papel", "#f5efe4", "cartões"],
  ["areia", "#f0d8b6", "calor"],
  ["taupe", "#b3926f", "filetes"],
  ["casca", "#8a6a4d", "rótulos"],
];

function SecaoPaleta() {
  return (
    <section className="lab-secao">
      <span className="lab-rotulo">02 · cor</span>
      <h2 className="lab-titulo">Do amanhecer ao anoitecer</h2>
      <p className="lab-nota">
        O site inteiro é um só campo de cor que atravessa o dia: a hero nasce em luz
        clara, a história e os presentes acontecem na areia quente, e a mensagem final
        fecha em azul-noite. As fotos de vocês são quentes — madeira, creme, marrom — e
        vivem na metade clara. O azul profundo fica sendo a cor do Heitor.
      </p>

      <div className="grade" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(96px,1fr))" }}>
        {PALETA.map(([nome, hex, uso]) => (
          <div key={hex}>
            <div
              style={{
                background: hex,
                aspectRatio: "1",
                border: "1px solid rgba(179,146,111,.3)",
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "0.7rem",
                marginTop: "0.5rem",
                color: "var(--color-tinta)",
              }}
            >
              {nome}
              <br />
              <span style={{ color: "var(--color-casca)" }}>{hex}</span>
              <br />
              <span style={{ color: "var(--color-taupe)", fontStyle: "italic" }}>{uso}</span>
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "2.5rem",
          height: 120,
          background:
            "linear-gradient(100deg,#e8f0f8 0%,#fbf7f0 26%,#f5efe4 48%,#f0d8b6 66%,#b3926f 80%,#0b3c56 92%,#04212f 100%)",
          border: "1px solid rgba(179,146,111,.3)",
        }}
      />
      <p className="lab-nota" style={{ marginTop: "0.75rem" }}>
        ↑ a passagem de cor da primeira à última seção, do jeito que o visitante vai
        sentir enquanto rola.
      </p>
    </section>
  );
}

/* ── 3. tipografia ──────────────────────────────────────── */

const MAOS = [
  ["--font-mao", "Petit Formal Script", "formal, de carta guardada"],
  ["--font-mao-b", "Caveat", "letra de gente, informal"],
  ["--font-mao-c", "Cormorant Garamond itálico", "não é manuscrita, mas é a mais elegante"],
];

function SecaoTipografia() {
  return (
    <section className="lab-secao">
      <span className="lab-rotulo">03 · tipografia</span>
      <h2 className="lab-titulo">Um livro, não um convite</h2>
      <p className="lab-nota">
        Newsreader é uma fonte desenhada para leitura de livro — combina com “o primeiro
        capítulo” e não tem o ar de convite de casamento. Instrument Sans cuida de
        botões, rótulos e números. Os rótulos de seção vão em serifa itálica minúscula,
        não no maiúsculo espaçado que todo site usa.
      </p>

      <div style={{ borderTop: "1px solid rgba(179,146,111,.3)", paddingTop: "1.75rem" }}>
        <p style={{ fontFamily: "var(--font-editorial)", fontSize: "clamp(2rem,6vw,3.5rem)", lineHeight: 1.05, color: "var(--color-navy)" }}>
          Nós já escutamos teus sinais…
        </p>
        <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: "clamp(1.1rem,3vw,1.5rem)", lineHeight: 1.6, color: "var(--color-grafite)", marginTop: "1.25rem", maxWidth: "34ch" }}>
          Um novo capítulo está começando. E ele tem nome.
        </p>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.95rem", letterSpacing: "0.02em", color: "var(--color-tinta)", marginTop: "1.5rem" }}>
          Instrument Sans · 20 de agosto de 2026 · 19h30 · Pizzaria Atlântico, Olinda
        </p>
      </div>

      <div style={{ marginTop: "3rem" }}>
        <span className="lab-rotulo">
          a letra da carta — qual delas escreve a mensagem do convidado?
        </span>
        <div className="grade" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
          {MAOS.map(([varname, nome, nota]) => (
            <div key={varname} className="peca" style={{ alignItems: "flex-start", textAlign: "left" }}>
              <p
                style={{
                  fontFamily: `var(${varname})`,
                  fontSize: "1.15rem",
                  lineHeight: 1.9,
                  color: "#3a2f26",
                }}
              >
                Que você chegue com saúde e cheio de coração, Heitor. A gente já te ama.
                <br />
                <span style={{ fontSize: "1.35rem", color: "#1f3b52" }}>
                  Com carinho, Família Gonçalves
                </span>
              </p>
              <span>{nome}</span>
              <span style={{ textTransform: "none", fontStyle: "italic", letterSpacing: 0 }}>{nota}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 4. personagens ─────────────────────────────────────── */

const POSES: [BabyPose, string][] = [
  ["sentado", "sentado ao lado do produto"],
  ["espiando", "espiando por cima da borda do card"],
  ["acenando", "aceno — perto de um CTA"],
  ["placa", "segurando a etiqueta de preço"],
  ["dormindo", "no fim do site, dormindo"],
  ["alcancando", "guardando o presente na caixa"],
];

function SecaoPersonagens() {
  const [roupa, setRoupa] = useState("#d1e2f3");
  return (
    <section className="lab-secao">
      <span className="lab-rotulo">04 · personagens</span>
      <h2 className="lab-titulo">Três moradores, não sete</h2>
      <p className="lab-nota">
        O encanto vem de reencontrar o mesmo bicho, não de conhecer um novo a cada
        seção. A girafa é a companheira do Heitor e aparece em três ou quatro momentos;
        o passarinho é só um detalhe de canto. O elefante está aqui para você escolher —
        se entrar, um dos outros sai.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.75rem", flexWrap: "wrap", alignItems: "center" }}>
        <span className="lab-rotulo" style={{ margin: 0 }}>cor do macacão:</span>
        {["#d1e2f3", "#f0d8b6", "#e8f0f8", "#c9d9c4"].map((c) => (
          <button
            key={c}
            onClick={() => setRoupa(c)}
            aria-label={`macacão ${c}`}
            style={{
              width: 28,
              height: 28,
              background: c,
              border: roupa === c ? "2px solid var(--color-navy)" : "1px solid rgba(179,146,111,.5)",
              cursor: "pointer",
              borderRadius: 1,
            }}
          />
        ))}
      </div>

      <div className="grade" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))" }}>
        {POSES.map(([pose, nota]) => (
          <div key={pose} className="peca">
            <Baby pose={pose} roupa={roupa} className="w-[110px] h-auto" title={`Heitor ${pose}`} />
            <span>{pose}</span>
            <span style={{ textTransform: "none", letterSpacing: 0, fontStyle: "italic", textAlign: "center" }}>
              {nota}
            </span>
          </div>
        ))}
      </div>

      <div
        className="grade"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", marginTop: "1.5rem" }}
      >
        <div className="peca">
          <Girafa className="w-[130px] h-auto" title="Girafa" />
          <span>girafa</span>
        </div>
        <div className="peca">
          <Girafa variant="espiando" className="w-[150px] h-auto" title="Girafa espiando" />
          <span>girafa espiando</span>
        </div>
        <div className="peca">
          <Passarinho className="w-[110px] h-auto" title="Passarinho" />
          <span>passarinho</span>
        </div>
        <div className="peca">
          <Elefante className="w-[150px] h-auto" title="Elefante" />
          <span>elefante · opcional</span>
        </div>
      </div>
    </section>
  );
}

/* ── 5. motivos ─────────────────────────────────────────── */

function SecaoMotivos() {
  return (
    <section className="lab-secao">
      <span className="lab-rotulo">05 · miudezas</span>
      <h2 className="lab-titulo">O que aparece de canto de olho</h2>
      <p className="lab-nota">
        Poucas, pequenas e espalhadas com parcimônia. As pegadas atravessam uma seção
        inteira devagar; o balão sobe uma vez só; a faísca só existe no instante em que o
        presente é enviado.
      </p>
      <div className="grade" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))" }}>
        <div className="peca"><Balao className="w-[54px] h-auto" /><span>balão</span></div>
        <div className="peca"><Balao cor="#f0d8b6" className="w-[54px] h-auto" /><span>balão areia</span></div>
        <div className="peca"><Folha className="w-[38px] h-auto" /><span>folha</span></div>
        <div className="peca"><Faisca className="w-[34px] h-auto text-[var(--color-taupe)]" /><span>faísca</span></div>
        <div className="peca"><Coracao className="w-[36px] h-auto text-[#b04a4a]" /><span>coração</span></div>
        <div className="peca"><Pegadas className="w-[120px] h-auto" /><span>pegadas</span></div>
        <div className="peca"><Nuvem className="w-[130px] h-auto" /><span>nuvem</span></div>
        <div className="peca"><Envelope className="w-[110px] h-auto" /><span>envelope</span></div>
        <div className="peca"><Envelope aberto className="w-[110px] h-auto" /><span>envelope aberto</span></div>
        <div className="peca"><Caixa className="w-[110px] h-auto" /><span>caixa fechada</span></div>
        <div className="peca"><Caixa tampa="aberta" className="w-[110px] h-auto" /><span>caixa aberta</span></div>
      </div>
    </section>
  );
}

/* ── 6. fotografia ──────────────────────────────────────── */

const FOTOS = [
  { src: "/images/casal-1.jpg", alt: "Valério e Nathalie sentados no chão" },
  { src: "/images/ultrassom-perfil.jpeg", alt: "Ultrassom de perfil do Heitor" },
  { src: "/images/casal-2.jpg", alt: "Valério beijando a testa de Nathalie" },
];

function SecaoFotografia() {
  const [i, setI] = useState(0);
  const [rodando, setRodando] = useState(true);

  useEffect(() => {
    if (!rodando) return;
    const t = setInterval(() => setI((n) => (n + 1) % FOTOS.length), 4200);
    return () => clearInterval(t);
  }, [rodando]);

  return (
    <section className="lab-secao">
      <span className="lab-rotulo">06 · fotografia</span>
      <h2 className="lab-titulo">Sem carrossel</h2>
      <p className="lab-nota">
        As imagens não deslizam: elas se dissolvem uma na outra enquanto uma escala
        lentíssima continua rodando por baixo — o mesmo movimento nunca recomeça, então a
        sequência parece um plano só. A máscara em arco é a janela do quarto, e é a mesma
        forma que volta na moldura dos presentes. No site real isso será conduzido pelo
        scroll, não por tempo.
      </p>

      <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}>
        <div>
          <span className="lab-rotulo">arco + dissolução + zoom lento</span>
          <div
            style={{
              position: "relative",
              aspectRatio: "3/4",
              clipPath: "url(#arco)",
              background: "var(--color-bruma)",
              overflow: "hidden",
            }}
          >
            {FOTOS.map((f, n) => (
              <Image
                key={f.src}
                src={f.src}
                alt={f.alt}
                fill
                sizes="(max-width: 640px) 90vw, 380px"
                style={{
                  objectFit: "cover",
                  opacity: i === n ? 1 : 0,
                  transform: i === n ? "scale(1.08)" : "scale(1)",
                  transition: "opacity 1600ms ease, transform 6000ms linear",
                  filter: i === n ? "blur(0px)" : "blur(6px)",
                }}
                priority={n === 0}
              />
            ))}
          </div>
        </div>

        <div>
          <span className="lab-rotulo">o ultrassom recortado e tratado</span>
          <div
            style={{
              position: "relative",
              aspectRatio: "3/4",
              overflow: "hidden",
              background: "var(--color-noite)",
            }}
          >
            <Image
              src="/images/ultrassom-perfil.jpeg"
              alt="Ultrassom do Heitor, 22 semanas"
              fill
              sizes="380px"
              style={{
                objectFit: "cover",
                // a foto tem a mesma proporção do quadro, então o enquadramento
                // vem do transform: aproxima e traz o perfil do Heitor ao centro
                transform: "translate(30%, 2%) scale(1.75)",
                mixBlendMode: "screen",
                filter: "contrast(1.2) brightness(1.08)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(120% 90% at 50% 40%, transparent 30%, rgba(4,33,47,.85) 100%)",
              }}
            />
            <p
              style={{
                position: "absolute",
                bottom: "1.25rem",
                left: "1.25rem",
                fontFamily: "var(--font-editorial)",
                fontStyle: "italic",
                color: "var(--color-ceu)",
                fontSize: "0.95rem",
              }}
            >
              22 semanas
            </p>
          </div>
        </div>

        <div>
          <span className="lab-rotulo">retrato em campo de areia, borda sangrada</span>
          <div
            style={{
              position: "relative",
              aspectRatio: "3/4",
              background: "var(--color-areia)",
              display: "grid",
              placeItems: "center",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "relative", width: "78%", aspectRatio: "3/4.2" }}>
              <Image
                src="/images/casal-2.jpg"
                alt="Valério e Nathalie"
                fill
                sizes="300px"
                style={{ objectFit: "cover" }}
              />
              <div style={{ position: "absolute", right: "-16%", bottom: "-6%", width: "44%" }}>
                <Girafa variant="espiando" className="w-full h-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button className="botao" style={{ marginTop: "1.5rem" }} onClick={() => setRodando((r) => !r)}>
        {rodando ? "Pausar a sequência" : "Retomar"}
      </button>
    </section>
  );
}

/* ── 7. card de presente ────────────────────────────────── */

const AMOSTRA = [
  { src: "/images/fralda-p-46.jpg", nome: "Huggies P · 46 fraldas", preco: "R$ 50,00", pose: "sentado" as BabyPose },
  { src: "/images/bepantol.webp", nome: "Bepantol Baby 120g", preco: "R$ 30,00", pose: "acenando" as BabyPose },
  { src: "/images/lenco-umedecido.webp", nome: "Lenços umedecidos", preco: "R$ 15,00", pose: "placa" as BabyPose },
];

function SecaoPresente() {
  return (
    <section className="lab-secao">
      <span className="lab-rotulo">07 · o catálogo</span>
      <h2 className="lab-titulo">O produto vira natureza-morta</h2>
      <p className="lab-nota">
        As fotos dos produtos são de e-commerce, fundo branco. Em vez de brigar com isso,
        elas ganham um campo de areia, uma sombra macia e a mesma moldura em arco das
        fotografias — o pacote de fralda passa a parecer um objeto fotografado para um
        catálogo, não um item de mercado. O Heitor entra no card: no computador, ao passar
        o mouse; no celular, quando o card aparece na tela.
      </p>
      <div className="grade" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))" }}>
        {AMOSTRA.map((p) => (
          <CardPresente key={p.src} {...p} />
        ))}
      </div>
    </section>
  );
}

function CardPresente({
  src,
  nome,
  preco,
  pose,
}: {
  src: string;
  nome: string;
  preco: string;
  pose: BabyPose;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setVisivel(e.isIntersecting),
      { threshold: 0.55 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <article ref={ref} className="card" data-visivel={visivel}>
      <div className="moldura">
        <div className="fundo" style={{ backgroundImage: PAPER_GRAIN_URL }} />
        <Image src={src} alt={nome} width={300} height={300} className="produto" />
        <div className="heitor">
          <Baby pose={pose} roupa="#d1e2f3" />
        </div>
      </div>
      <div className="ficha">
        <h3>{nome}</h3>
        <p className="preco">{preco}</p>
        <button className="escolher">Escolher presente</button>
      </div>

      <style jsx>{`
        .card {
          background: var(--color-linho);
          border: 1px solid rgba(179, 146, 111, 0.3);
          overflow: hidden;
        }
        .moldura {
          position: relative;
          aspect-ratio: 4 / 5;
          background: linear-gradient(170deg, #f7ecd9, #f0d8b6);
          display: grid;
          place-items: center;
          overflow: hidden;
          clip-path: url(#arco);
        }
        .fundo {
          position: absolute;
          inset: 0;
          opacity: 0.3;
          mix-blend-mode: multiply;
          background-size: 180px;
        }
        .card :global(.produto) {
          position: relative;
          width: 62%;
          height: auto;
          object-fit: contain;
          mix-blend-mode: multiply;
          filter: drop-shadow(0 16px 22px rgba(90, 66, 44, 0.22));
          transform: translateY(-4%) scale(1);
          transition: transform 900ms cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 1;
        }
        .card:hover :global(.produto) {
          transform: translateY(-7%) scale(1.04);
        }
        .heitor {
          position: absolute;
          right: 4%;
          bottom: -2%;
          width: 36%;
          transform: translateY(46%);
          opacity: 0;
          transition: transform 800ms cubic-bezier(0.34, 1.35, 0.64, 1), opacity 400ms ease;
          z-index: 2;
        }
        .card:hover .heitor,
        .card[data-visivel="true"] .heitor {
          transform: translateY(0);
          opacity: 1;
        }
        .ficha {
          padding: 1.1rem 1.1rem 1.25rem;
        }
        h3 {
          font-family: var(--font-editorial);
          font-size: 1.05rem;
          color: var(--color-navy);
          line-height: 1.25;
        }
        .preco {
          font-family: var(--font-ui);
          font-variant-numeric: tabular-nums;
          font-size: 0.95rem;
          color: var(--color-casca);
          margin: 0.35rem 0 0.9rem;
        }
        .escolher {
          font-family: var(--font-ui);
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          width: 100%;
          padding: 0.8rem;
          background: transparent;
          border: 1px solid var(--color-navy);
          color: var(--color-navy);
          cursor: pointer;
          border-radius: 1px;
          transition: background 320ms ease, color 320ms ease;
        }
        .escolher:hover {
          background: var(--color-navy);
          color: var(--color-linho);
        }
        @media (hover: none) {
          .heitor {
            transition-duration: 700ms;
          }
        }
      `}</style>
    </article>
  );
}

/* ── 8. contagem ────────────────────────────────────────── */

const EVENTO = new Date("2026-08-20T19:30:00-03:00");

function SecaoContagem() {
  const [agora, setAgora] = useState<Date | null>(null);
  useEffect(() => {
    setAgora(new Date());
    const t = setInterval(() => setAgora(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const ms = agora ? EVENTO.getTime() - agora.getTime() : 0;
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);

  return (
    <section className="lab-secao">
      <span className="lab-rotulo">08 · a espera</span>
      <h2 className="lab-titulo">A contagem, em voz baixa</h2>
      <p className="lab-nota">
        Sem números gigantes e sem estética de réveillon: uma linha de texto que respira,
        com os segundos quase imperceptíveis. Quando a data chegar, ela vira uma frase.
      </p>
      <div
        style={{
          background: "var(--color-navy)",
          padding: "clamp(2rem,6vw,3.5rem)",
          textAlign: "center",
        }}
      >
        {agora === null ? (
          <p style={{ color: "var(--color-ceu)", opacity: 0.4 }}>—</p>
        ) : ms <= 0 ? (
          <p style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", fontSize: "clamp(1.2rem,4vw,1.8rem)", color: "var(--color-ceu)" }}>
            É hoje. Estamos esperando você.
          </p>
        ) : (
          <p
            className="numeros"
            style={{
              color: "var(--color-ceu)",
              fontSize: "clamp(0.95rem,3.4vw,1.35rem)",
              letterSpacing: "0.14em",
            }}
          >
            {d} <em style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", letterSpacing: 0, opacity: 0.6 }}>dias</em>
            <span style={{ opacity: 0.35, margin: "0 .6em" }}>·</span>
            {String(h).padStart(2, "0")} <em style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", letterSpacing: 0, opacity: 0.6 }}>horas</em>
            <span style={{ opacity: 0.35, margin: "0 .6em" }}>·</span>
            {String(m).padStart(2, "0")} <em style={{ fontFamily: "var(--font-editorial)", fontStyle: "italic", letterSpacing: 0, opacity: 0.6 }}>min</em>
            <span style={{ opacity: 0.2, margin: "0 .6em" }}>·</span>
            <span style={{ opacity: 0.45 }}>{String(s).padStart(2, "0")}</span>
          </p>
        )}
      </div>
    </section>
  );
}

/* ── 9. a cerimônia ─────────────────────────────────────── */

function SecaoCerimonia() {
  const [rodando, setRodando] = useState(false);
  const [nome, setNome] = useState("Família Gonçalves");
  const [msg, setMsg] = useState(
    "Que você chegue com saúde e cheio de coração, Heitor. A gente já te ama."
  );

  return (
    <section className="lab-secao" style={{ background: "var(--color-papel)", maxWidth: "none" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <span className="lab-rotulo">09 · o envio</span>
        <h2 className="lab-titulo">Mandar meu presente com minha mensagem</h2>
        <p className="lab-nota">
          A mensagem é escrita à mão no papel, o nome é assinado letra a letra, o papel é
          dobrado em três, entra no envelope e é lacrado com um coração. O Heitor guarda o
          envelope e o presente na caixa, a tampa desce e a caixa parte. Escreva outra
          coisa nos campos abaixo para ver com o seu texto.
        </p>

        <div style={{ display: "grid", gap: "2.5rem", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label style={{ display: "block" }}>
              <span className="lab-rotulo">seu nome ou família</span>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={campo}
              />
            </label>
            <label style={{ display: "block" }}>
              <span className="lab-rotulo">mensagem para o Heitor</span>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={4}
                style={{ ...campo, resize: "vertical" }}
              />
            </label>
            <button className="botao" onClick={() => setRodando(false)} style={{ display: rodando ? "block" : "none" }}>
              Recomeçar
            </button>
            <button className="botao" onClick={() => setRodando(true)} style={{ display: rodando ? "none" : "block" }}>
              Mandar meu presente com minha mensagem
            </button>
          </div>

          <Cerimonia
            nome={nome}
            mensagem={msg}
            presenteSrc="/images/fralda-p-46.jpg"
            presenteNome="Huggies P 46 fraldas"
            rodando={rodando}
          />
        </div>
      </div>
    </section>
  );
}

const campo: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.9rem",
  border: "1px solid rgba(179,146,111,.5)",
  background: "var(--color-linho)",
  fontFamily: "var(--font-ui)",
  fontSize: "0.95rem",
  color: "var(--color-tinta)",
  borderRadius: 1,
};
