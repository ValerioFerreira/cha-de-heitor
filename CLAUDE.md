# Esperando Heitor

Landing page do chá de fraldas do Heitor, filho de **Valério e Nathalie**.
Evento: **20 de agosto de 2026, 19h30, Pizzaria Atlântico, Olinda (PE)**.

O convidado entra, conhece o Heitor, confirma presença, escolhe **um** presente,
paga por PIX, deixa uma mensagem, e vê essa mensagem virar carta, envelope e
caixa numa animação. Os pais recebem tudo por e-mail.

O site é acessado **quase inteiramente por celular**, por familiares de todas as
idades. Mobile-first não é preferência, é o caso de uso.

---

## Regras de negócio — não altere sozinho

Estas vieram do responsável. Se uma ideia sua mexe em qualquer uma delas,
**pare e pergunte antes de implementar**.

1. **Cada convidado escolhe um item.** Não existe carrinho e não existe seleção
   múltipla. Ao clicar num presente, a pessoa vai direto para a página daquele
   item. Um mesmo item pode ser escolhido por várias pessoas.
2. **Não há limite de estoque.** Nenhum item esgota, nada de "restam 3",
   porcentagem, barra de progresso ou "5 pessoas já escolheram".
3. **Não há bloqueio de segunda escolha.** Sem login, sem cadastro, sem cookie
   de identificação. Ficou decidido que o site é aberto — o desenho do fluxo é
   que desencoraja escolher mais de um.
4. **RSVP e presente são independentes.** Quem confirma presença não precisa dar
   presente, e vice-versa. O RSVP existe só para fechar o número de mesas com o
   restaurante.
5. **PIX estático, sem gateway.** Nada de Mercado Pago, Stripe ou intermediador.
   O código é gerado no servidor a partir da chave do responsável.
6. **O preço nunca vem do cliente.** O navegador manda o `slug`; o servidor lê o
   valor de `data/gifts.ts`. Isso é o que impede alguém de editar a URL e
   "pagar" R$ 1.
7. **Sem painel administrativo.** Os dados são consultados por e-mail e pelo
   banco. Não crie tela de login nem área restrita.
8. **Não invente conteúdo.** Nomes, textos, produtos, preços, fotos e dados do
   evento vêm do responsável. Placeholder é aceitável; invenção não.

---

## Comandos

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # produção — checa tipos também
npm run recortar # refaz os recortes das imagens (ver "Recorte de fundo")
npx tsc --noEmit # só a checagem de tipos
```

**Nunca rode `npm run build` com o `npm run dev` ligado.** Os dois escrevem no
mesmo `.next` e o resultado é imprevisível. Pare o dev antes.

---

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 (só tokens) ·
styled-jsx (todo o CSS de componente) · Neon/Postgres · Resend · `qrcode`.

`motion`, `gsap` e `lenis` estão instalados mas **não estão em uso**. As
animações são CSS + IntersectionObserver + um listener de scroll com
`requestAnimationFrame`. Isso foi escolha: o site é leve e as animações são
sutis o bastante para não justificarem uma biblioteca. Se for usar uma delas,
tenha um motivo concreto.

### Onde ficam as coisas

```
app/
  page.tsx                 monta a home a partir das seções
  layout.tsx               fontes, metadata, Open Graph
  globals.css              tokens (@theme do Tailwind) e base
  actions.ts               server actions: registrarEscolha, registrarRsvp
  presente/[slug]/page.tsx página do presente (server) — gera os códigos PIX
  lab/page.tsx             ateliê: todas as peças e animações, para validação
  opengraph-image.tsx      cartão do WhatsApp
  icon.tsx                 favicon

components/
  art/        as ilustrações e a cerimônia (tudo SVG autoral)
  sections/   as seções da home
  presente/   o fluxo de escolha + PIX + mensagem
  shared/     atmosfera (fundo), música, reveal, bichos
  ui/         card-fan-carousel — o leque de fotos, do 21st.dev

lib/
  pix.ts      BR Code EMV + CRC16
  db.ts       conexão Neon e schema
  email.ts    avisos por Resend

data/
  gifts.ts    o catálogo — fonte única de verdade dos preços
  content.ts  todo o texto do site

scripts/
  recortar-produtos.mjs  tira o fundo branco das fotos de produto
  recortar-bichos.mjs    tira o fundo pintado das ilustrações dos bichos
```

### `images/` e `audio/` aparecem duas vezes

Na raiz estão os **originais** que o responsável entregou. Em `public/` está a
cópia servida pelo Next. **Ao adicionar uma imagem nova, copie para `public/`** —
o site só enxerga o que está lá. O `ambiente.mp3` em `public/audio/` é o mesmo
arquivo do original, renomeado (o nome de origem tem espaços, acentos e emoji).

Duas pastas dentro de `public/images/` são **geradas**, não entregues:

| pasta | vem de | gerada por |
|---|---|---|
| `public/images/produtos/` | `images/<produto>.*` | `scripts/recortar-produtos.mjs` |
| `public/images/bichos/` | `images/{girafa,leao,passaro,urso}.png` | `scripts/recortar-bichos.mjs` |

Não edite nada nessas duas pastas à mão: troque o original e rode
`npm run recortar`.

### Recorte de fundo

As fotos de produto vieram de e-commerce, sobre branco. As ilustrações dos
bichos vieram sobre um cinza quente com horizonte e sombra no chão. **Nenhum
truque de CSS resolve isso** — foram tentados e falharam:

- `mix-blend-mode: multiply` apaga o branco, mas também come os produtos
  claros: o pacote de lenços sumia inteiro;
- deixar a moldura clara faz o mesmo estrago, pelo mesmo motivo;
- máscara radial não serve para os bichos, porque o fundo deles é mais
  escuro que a página — sobra sempre um retângulo cinza.

A saída é tirar o fundo de verdade, uma vez, com os scripts. Ambos fazem
preenchimento a partir das bordas: o de produtos só se espalha por pixels
quase brancos, e o de bichos compara cada pixel com o vizinho de onde veio
(o fundo é um degradê, então comparar com uma cor fixa não funcionaria). Os
dois param no contorno de tinta do desenho, e por isso o branco *de dentro*
da embalagem continua lá.

---

## Design

### O conceito: do amanhecer ao anoitecer

O site inteiro é **um só campo de cor** que atravessa o dia conforme a página
rola — luz fria na hero, areia quente no meio, azul-noite no fecho. Vive em
`components/shared/atmosfera.tsx`, uma camada `position: fixed` com três
gradientes empilhados cuja opacidade é função do progresso do scroll.

É isso que faz as seções parecerem uma experiência contínua em vez de blocos.
**Não coloque `background` opaco numa seção** — você fura o efeito. Se precisar
de contraste, use `rgba()` com alfa baixo.

A leitura de cor tem uma razão: as fotos do casal são quentes (madeira, creme,
marrom), então elas vivem na metade clara do arco. O azul profundo fica sendo a
cor do Heitor e do fim.

### Paleta

Definida em `app/globals.css` no bloco `@theme`, disponível como
`var(--color-*)`:

| token | hex | uso |
|---|---|---|
| `noite` | `#04212f` | o fim do site |
| `navy` | `#032a42` | títulos, botões |
| `profundo` | `#0b3c56` | meio-tom |
| `azul` | `#7ba5c6` | detalhes, fitas |
| `ceu` | `#d1e2f3` | manhã, texto sobre o navy |
| `bruma` | `#e8f0f8` | fundos frios |
| `linho` | `#fbf7f0` | fundo padrão |
| `papel` | `#f5efe4` | cartões |
| `areia` | `#f0d8b6` | calor |
| `taupe` | `#b3926f` | filetes, bordas |
| `casca` | `#8a6a4d` | rótulos |
| `tinta` | `#2b2119` | texto |
| `grafite` | `#5c5347` | texto secundário |

### Tipografia

| papel | fonte | variável |
|---|---|---|
| o nome "Heitor" | **Autography** (arquivo local, `public/fonts/`) | `--font-heitor` |
| editorial, títulos | **Newsreader** | `--font-editorial` |
| interface, números, botões | **Instrument Sans** | `--font-ui` |
| assinatura da carta | **Petit Formal Script** | `--font-mao` |
| mensagem manuscrita | **Caveat** | `--font-mao-b` |
| (comparação em /lab) | Cormorant Garamond | `--font-mao-c` |

Detalhe deliberado: **os rótulos de seção vão em serifa itálica minúscula**, não
no maiúsculo espaçado que todo site usa. Botões e números vão em sans.

A Autography é uma fonte comercial; a licença do responsável está em
`fonts/HPF_Agreement.pdf`.

### Motivos recorrentes

- **O arco** — `ArcoMask` em `components/art/motifs.tsx` define um `clipPath`
  com `id="arco"`. Molda as fotografias, os cards do catálogo e a galeria. É a
  janela do quarto. **Precisa estar renderizado na página** para o
  `clip-path: url(#arco)` funcionar.
- **A rubrica** — o filete manuscrito entre seções.
- **Os bichos** — girafa, leão, urso e passarinho, em `components/shared/bicho.tsx`.
  São ilustrações entregues pelo responsável, não SVG. Aparecem uma vez cada:
  girafa na hero, passarinho na história e no RSVP, urso no catálogo, leão no
  evento. A girafa e o passarinho fazem um balanço/voo lentíssimo; os outros
  ficam parados.
- O bebê (Heitor) continua sendo SVG autoral, em `components/art/baby.tsx` — é
  ele que interage com os produtos e guarda o presente na caixa. Os animais em
  `components/art/animals.tsx` (girafa, passarinho, elefante desenhados à mão)
  ficaram fora do site depois que as ilustrações chegaram; seguem em `/lab`.

### Ilustração

Tudo é **SVG autoral**, escrito à mão nos componentes de `components/art/`.
Nenhuma imagem gerada, nenhum banco de ilustração.

Três filtros em `filters.tsx` fazem a aquarela: `aq-wash` (borda deslocada por
ruído), `aq-bleed` (o sangramento) e `aq-linha` (a mesma distorção, fraca, para
o traço). **`<ArtDefs />` precisa estar na página** ou os filtros não existem.

Toda forma leva **contorno de tinta por baixo do preenchimento**. Sem isso a
pele do bebê some contra os fundos claros — foi corrigido uma vez, não repita.

Se um dia as ilustrações forem substituídas por imagens geradas, os prompts
estão em `PROMPTS-ILUSTRACAO.md`, já com nomes de arquivo combinados.

### Hierarquia de movimento

`components/shared/reveal.tsx` tem três forças: `sutil` (8px, 700ms) para a
maioria, `normal` (18px, 1s), `destaque` (34px, 1,4s) para os poucos momentos
que merecem ser notados. **Não anime tudo.** `prefers-reduced-motion` é
respeitado em todo componente que anima — mantenha assim.

---

## A galeria

Um **leque de cartas**: `components/ui/card-fan-carousel.tsx`, componente do
21st.dev, montado por `Galeria` em `components/sections/fecho.tsx`.

Do original ficaram intactos a matemática do leque (`FAN_POSITIONS`), os
multiplicadores, a entrada elástica com GSAP, o empurra-empurra no hover e a
paginação circular. Três coisas mudaram:

- `.fan-layout` e `.fan-card` **não vinham no snippet** — foram escritas aqui.
  As alturas do `.fan-layout` têm que bater com os pontos de quebra de
  `getHeightMultiplier()`, senão a conta do deslocamento vertical erra.
- **Nenhuma imagem é recortada:** cada carta é uma lâmina de papel e a foto
  entra com `object-fit: contain`. O ultrassom de perfil é largo, os retratos
  são altos, e cortar qualquer um tira o que importa. Já houve reclamação.
- `limiteDoContainer()` foi acrescentado. O leque original abre até ±30rem,
  medida para um contêiner de 1280px com cartas menores; com as nossas, as
  pontas saíam da tela. A conta precisa levar em conta que a carta das pontas
  está **girada 21°** — a caixa dela é bem mais larga que a largura própria.

**Use um número ímpar de cartas.** `getSlotConfig` calcula o centro com
`totalCards >> 1`, então com número par o leque fica torto para um lado.

**O leque gira com qualquer quantidade.** No original, `needsPagination`
(mais de 7 cartas) fazia dois trabalhos: decidir se algumas ficam fora de
cena *e* liberar o giro. Com 5 fotos ninguém saía do lugar e as de trás
nunca chegavam à frente. Hoje são duas coisas separadas: `janelaLimitada`
(> 7) e `podeGirar` (> 1). Quando cabem todas, o mapa de lugares gira e a
carta escolhida vai para o meio.

Uma carta anda um lugar por vez. Quando o lugar novo está a mais de um de
distância, ela deu a volta de uma ponta à outra — `deuAVolta()` detecta isso
e troca o deslize por sumir e reaparecer do outro lado. Sem isso a carta
atravessa o leque inteiro por cima, e fica horrível.

Formas de mudar a carta da frente: arrastar o dedo (limiar de 52px, com o
eixo decidido nos primeiros 10px para não roubar a rolagem vertical da
página), tocar numa carta de trás, as setas, ou as flechas do teclado.
`touch-action: pan-y` no `.fan-layout` é o que mantém a página rolando.

A altura do `.fan-layout` e o `idealPx` de `getHeightMultiplier()` **têm que
andar juntos**. E lembre que a carta das pontas gira 21°: a caixa dela é
bem mais larga que a largura própria, e é isso que decide se cabe na tela.

## A cerimônia do envio

`components/art/ceremony.tsx`. É a peça mais delicada do projeto e a mais fácil
de quebrar.

### A ordem, definida pelo responsável

```
papel em branco → mensagem se escreve → nome se assina → carta parada
  → dobra em três (o papel CONTINUA na tela)
  → envelope aberto aparece
  → a carta dobrada entra no envelope
  → a aba fecha e o coração lacra (o envelope CONTINUA na tela)
  → a caixa aberta chega; o envelope sobe para dar lugar
  → o Heitor guarda o envelope
  → e guarda o presente
  → a tampa desce
  → a caixa parte
  → agradecimento
```

Duração total ≈ 19,5s. As durações estão em `DURACAO`, uma entrada por etapa.

### Como uma coisa entra dentro da outra

**Todas as peças vivem no mesmo plano, empilhadas por z-index.** Nada é
aninhado. É isso que permite algo entrar de verdade:

```
z1  fundo da caixa (a boca escura)
z2  fundo do envelope
z3  carta · presente
z4  frente do envelope   ← engole a carta
z5  aba · lacre
z7  frente da caixa      ← engole o envelope e o presente
z8  tampa
z9  Heitor
```

A carta some porque **passa por trás** do bolso do envelope; o envelope some
porque passa por trás da frente da caixa. Nada desaparece por opacidade. Se você
aninhar as peças ou mexer nos z-index, o efeito morre.

A caixa vem em três componentes separados por causa disso: `CaixaFundo`,
`CaixaFrente`, `CaixaTampa`, todos com o mesmo `viewBox` para empilharem
exatamente.

### Posições — duas regras que não podem ser quebradas

**1. A posição da carta é derivada da do envelope.** Depois que ela entra,
`dentroDoEnvelope(env)` calcula onde ela fica. Se as duas forem escritas à
mão, o envelope sobe para dar lugar à caixa e a carta fica para trás,
boiando sozinha no meio da tela.

**2. Tudo que parte junto mora dentro de `.conjunto`, e é o `.conjunto` que
voa.** Animar peça por peça não funciona: `translateY` em porcentagem é
relativo à altura de *cada* elemento, então o envelope percorre uns 23% do
palco enquanto a caixa percorre 65% — e elas se separam no ar. Já aconteceu.

`posicao()` devolve **só** `left`/`width`/`top` em porcentagem. A opacidade fica
no CSS de propósito: estilo inline venceria a regra do voo final e a caixa
partiria sem sumir.

### A aba do envelope

O bolso é desenhado **antes** da aba no SVG. Invertendo a ordem, a aba
fechada fica atrás do bolso e o envelope parece que nunca fecha.

A dobra usa `transform-box: view-box` com origem na dobradiça (`110px 10px`,
a borda de cima) e `perspective(560px)` no próprio `transform`. Sem a
perspectiva, `rotateX` vira um espelhamento chapado em vez de uma aba
tombando.

### O fim da cena

O "Voltar ao início" na página do presente aparece por **estado**, via o
callback `onFim` da cerimônia — não por um atraso fixo no CSS. O callback tem
que ser estável (`useCallback`): se a identidade mudar a cada render, o efeito
da cerimônia reinicia o cronômetro da etapa em curso.

### Como conferir a cena sem olhar

O painel de preview às vezes compõe em escala errada e não dá para confiar
no olho. Medir é mais seguro: a faixa realmente pintada da frente da caixa
vai de `104/220` a `198/220` da altura do elemento. Ao fim da cena, a carta,
o envelope e o presente têm que estar todos dentro dessa faixa. Os valores
bons hoje são carta `[80.8, 88.7]`, envelope `[73, 90.4]`, presente
`[74, 89]`, faixa `[72.4, 90.8]`.

---

## PIX

`lib/pix.ts` monta o BR Code do Banco Central (EMV®QRCPS-MPM): campos
`ID + tamanho + valor`, terminando no CRC16 calculado sobre tudo, **inclusive
sobre o próprio `6304`** que o antecede.

Campo `01` é `11` (estático reutilizável) — o mesmo código serve a vários
convidados. O padrão só aceita ASCII imprimível, então `limpar()` tira acentos e
corta nos limites (nome 25, cidade 15).

O QR é gerado no navegador a partir da string, com `qrcode` em modo SVG. **Não
existe imagem de QR guardada em lugar nenhum** — mudou o preço, muda o código e
muda o QR.

Os códigos são gerados no **servidor**, em `app/presente/[slug]/page.tsx`: um
por quantidade possível (1 para a maioria, 10 para os lenços). O cliente escolhe
qual mostrar mas não consegue inventar nenhum.

### Conferir um código

Cole no console do navegador, na página de um presente:

```js
const c = document.querySelector('.cru p').textContent.trim();
const crc = s => { let x=0xffff; for (const ch of s) { x^=ch.charCodeAt(0)<<8;
  for (let b=0;b<8;b++) x = x&0x8000 ? ((x<<1)^0x1021)&0xffff : (x<<1)&0xffff; }
  return x.toString(16).toUpperCase().padStart(4,'0'); };
crc(c.slice(0,-4)) === c.slice(-4);
```

**Estrutura válida não é o mesmo que chave válida.** Só o app do banco confirma
que o dinheiro chega. Teste um pagamento real antes de divulgar o site.

---

## Dados

### Catálogo

`data/gifts.ts` é a **fonte única de verdade**. Preços em **centavos**, para não
depender de ponto flutuante. Nove itens; os lenços têm `quantidadeAberta` com
máximo 10 — o valor do PIX multiplica.

Para mudar nome, preço, foto, detalhe ou ordem, mexa só neste arquivo. Trocar a
imagem exige copiar o arquivo para `public/images/`.

### Banco

Duas tabelas, criadas sob demanda por `prepararBanco()` (idempotente):
`escolhas` e `rsvps`. Se `DATABASE_URL` não existir, `sql` é `null` e o fluxo
segue sem gravar — nunca derrube a experiência do convidado por causa de
infraestrutura.

### E-mail

`lib/email.ts`, via Resend. Mesma regra: se falhar, loga e segue. A escolha já
está gravada no banco.

### Variáveis de ambiente

Modelo completo em `.env.example`. Nenhuma vai para o navegador.

| variável | o que é |
|---|---|
| `PIX_CHAVE` | chave de celular no formato `+5581997489729` |
| `PIX_NOME` | até 25 caracteres, sem acento |
| `PIX_CIDADE` | até 15 caracteres, sem acento |
| `DATABASE_URL` | Neon / Vercel Postgres |
| `RESEND_API_KEY` | Resend |
| `EMAIL_DESTINO` | para onde vão os avisos |
| `EMAIL_REMETENTE` | `onboarding@resend.dev` enquanto não houver domínio |
| `NEXT_PUBLIC_SITE_URL` | usada pelo `metadataBase` do Open Graph |

---

## Armadilhas já encontradas

Cada uma destas custou tempo. Não repita.

**Nomes de `@keyframes` colidem entre componentes.** styled-jsx escopa os
seletores mas **não** os nomes de keyframes, e um `<style>` global dentro de um
SVG vaza para o documento inteiro. A assinatura e a carta usavam ambas
`escrever`, e a carta ficava em branco porque recebia a animação de traço de
caneta. Hoje são `escrever-traco` e `escrever-carta`. **Prefixe sempre.**

**`translateY` em porcentagem usa a altura do próprio elemento.** No papel
dobrado em três, o `.conteudo` tem `height: 300%` do painel, então cada terço é
`33,3333%` da altura dele — não `100%`. Com `100%` o texto some da folha.

**Máscara de revelação precisa de estado base visível.** A `Assinatura` tinha
`clip-path: inset(0 100% ...)` na regra base, então com `animate={false}` ela
ficava invisível. O recorte só pode existir dentro de `.escrevendo`.

**As fotos de produto têm fundos quase-brancos diferentes** (239, 214, 254, e
duas com borda amarela). `mix-blend-mode: multiply` deixava um retângulo pálido
em cada card. A solução foi apoiar cada produto numa **lâmina de papel** com
sombra: o retângulo vira intencional e as nove ficam uniformes. Não volte para o
blend.

**`ImageResponse` só tem as fontes que você embarca.** Em `opengraph-image.tsx`
e `icon.tsx` só a Autography é carregada, então `fontFamily: "serif"` não cai em
serifa nenhuma — cai na Autography. O cartão foi desenhado assumindo isso.

**styled-jsx injeta o CSS na hidratação.** Medir `getComputedStyle` logo depois
de carregar dá resultado errado (`display: inline` onde deveria ser `grid`).
Espere a página assentar antes de concluir que uma regra não está aplicando.

**Estilo inline vence regra de classe.** Foi por isso que `posicao()` na
cerimônia devolve só posição e deixa a opacidade no CSS.

**O `sharp` devolve o blur de um buffer de 1 canal em 3 canais.** Em
`recortar-bichos.mjs`, ler o alfa suavizado de 1 em 1 byte produzia a imagem
listrada. Use `info.channels` como passo, nunca assuma 1.

**Variável de ambiente criada e deixada em branco chega como `""`, não como
`undefined`.** O `??` não cai no valor padrão, e um `new URL("")` no
`metadataBase` derrubou o build inteiro na Vercel — no `/_not-found`, de todos
os lugares. Trate ausência por conteúdo (`if (!valor?.trim())`), nunca por
nulidade.

**Padrão de `.vercelignore` sem barra inicial casa em qualquer nível.** É a
sintaxe do `.gitignore`: `images/` leva junto `public/images/`. Ancore sempre
com `/images/`. Isso já apagou o `public/` inteiro de um deploy.

**SVG com animação SMIL tem que entrar como `<img>`, não como `<Image>`.** A
cegonha em `public/images/bebe-cegonha.svg` traz o próprio movimento (asas e
balanço, em `animate`/`animateTransform`). O otimizador do Next não serve SVG
sem `dangerouslyAllowSVG`, e passar por ele mataria a animação.

**O GSAP anda pelo `requestAnimationFrame`.** Quando o painel de preview
não está pintando quadros, os tweens congelam no meio — as cartas do leque
ficam em opacidade 0 e parece que a entrada quebrou. Não quebrou: tire um
screenshot (que força a composição) antes de investigar.

**O Next guarda as imagens otimizadas em `.next/cache/images`.** Se você
regerar um arquivo mantendo o mesmo nome, o navegador continua recebendo a
versão velha e você vai debugar CSS à toa. `rm -rf .next/cache/images` depois
de rodar `npm run recortar`.

---

## Estado atual

**Pronto e verificado:** todas as seções da home, as nove páginas de presente,
geração e validação estrutural do PIX, QR dinâmico, formulários de RSVP e de
presente com validação server-side, cerimônia completa na ordem pedida, música
ambiente, Open Graph, favicon, sem transbordo horizontal no mobile, `npm run
build` limpo.

**Depende do responsável:**

- `DATABASE_URL` e `RESEND_API_KEY` — sem elas, escolhas e RSVPs não são
  gravados nem enviados (o site funciona, mas os dados se perdem)
- teste de um pagamento PIX real
- enquadramento do ultrassom em `components/sections/fecho.tsx` (`enquadre`) —
  a foto é de uma folha impressa e o recorte foi estimado
- `fralda-g-92` (346×181) e `lenco-umedecido` (545×312) são pequenas demais e
  saem borradas; vale pedir versões maiores
- a música é um cover de "Anunciação" baixado do YouTube — material de terceiros
  num site público, decisão do responsável
- `t.js` na raiz não faz parte do projeto; confirmar se pode ser removido
- `images/ultrassom-frente.jpeg` mostra o nome da mãe e o número do exame no
  cabeçalho impresso. Está na galeria sem recorte, a pedido do responsável

**Fora de escopo por decisão:** painel administrativo, login, gateway de
pagamento, controle de estoque.

---

## Como trabalhar aqui

- Escreva em **português**, inclusive nomes de variáveis, componentes e
  comentários. O código já é assim.
- Comentário explica **por que**, não o que. Os que existem hoje marcam decisões
  que não são óbvias no código.
- `/lab` é a mesa de validação: toda peça nova de ilustração ou animação deveria
  aparecer lá antes de entrar no site.
- Rode `npx tsc --noEmit` antes de commitar.
- Antes de dizer que algo funciona, **verifique no navegador**. Duas vezes um
  bug real passou porque o código parecia certo.
