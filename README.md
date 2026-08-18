# Esperando Heitor

Site do chá de fraldas do Heitor — **20 de agosto de 2026, 19h30, Restaurante
Pizzaria Atlântico, Olinda (PE)**.

O convidado conhece o Heitor, confirma presença, escolhe um presente, paga por
PIX e deixa uma mensagem. A mensagem vira uma carta escrita à mão, que é
dobrada, guardada num envelope e enviada numa caixa. Os pais recebem tudo por
e-mail.

---

## Rodar em outra máquina

Precisa de **Node 20 ou superior** (foi desenvolvido no 22.19).

```bash
git clone https://github.com/ValerioFerreira/cha-de-heitor.git
cd cha-de-heitor
npm install
```

Copie o modelo de variáveis e preencha:

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Abre em `http://localhost:3000`. A página `/lab` mostra todas as ilustrações e
animações isoladas, para conferência.

### O que funciona sem configurar nada

Tudo o que é visual: home, catálogo, páginas de presente, animações, música.

**Sem `PIX_CHAVE`** a página do presente mostra um aviso no lugar do QR Code.
**Sem `DATABASE_URL` e `RESEND_API_KEY`** o convidado completa o fluxo
normalmente, mas a escolha não é gravada nem chega por e-mail — ou seja, o
presente e a mensagem se perdem. Configure as duas antes de divulgar o link.

---

## Variáveis de ambiente

| variável | onde conseguir |
|---|---|
| `PIX_CHAVE` | a chave PIX do recebedor. Celular vai no formato `+5581999999999` |
| `PIX_NOME` | nome do recebedor, até 25 caracteres, sem acento |
| `PIX_CIDADE` | cidade, até 15 caracteres, sem acento |
| `DATABASE_URL` | Neon ou Vercel Postgres (Storage → Create Database) |
| `RESEND_API_KEY` | [resend.com](https://resend.com) — o plano grátis basta |
| `EMAIL_DESTINO` | e-mail que recebe os avisos |
| `EMAIL_REMETENTE` | `Heitor <onboarding@resend.dev>` enquanto não houver domínio próprio |
| `NEXT_PUBLIC_SITE_URL` | a URL final do site, usada na prévia do WhatsApp |

As tabelas do banco são criadas sozinhas na primeira gravação. Não há migração
para rodar.

---

## Publicar na Vercel

1. Importe o repositório na Vercel — ela reconhece Next.js sozinha.
2. Em **Settings → Environment Variables**, coloque as variáveis acima.
3. Em **Storage**, crie um Postgres e conecte ao projeto; a `DATABASE_URL`
   aparece automaticamente.
4. Deploy.

Depois de publicar, cole o link num WhatsApp qualquer para conferir se a prévia
aparece com o nome e a data.

---

## Mudar o conteúdo

| o que | onde |
|---|---|
| presentes: nome, preço, foto, ordem | `data/gifts.ts` |
| todo o texto do site | `data/content.ts` |
| data, hora, local, link do mapa | `data/content.ts`, bloco `evento` |
| música ambiente | substitua `public/audio/ambiente.mp3` |

Preços ficam em **centavos** (`3000` = R$ 30,00). Imagens novas precisam ser
copiadas para `public/images/` — é de lá que o site lê.

### Trocar a foto de um produto ou um bicho

As fotos de produto vêm com fundo branco e as ilustrações dos bichos vêm com
fundo pintado. O site usa versões já recortadas, geradas por script:

```bash
npm run recortar
```

Coloque o arquivo novo em `images/` com o mesmo nome do antigo, rode o comando
acima e apague o cache de imagem do Next (`rm -rf .next/cache/images`) — sem
isso o navegador continua servindo a versão velha.

---

## Comandos

```bash
npm run dev      # desenvolvimento
npm run build    # produção (checa os tipos também)
npx tsc --noEmit # só a checagem de tipos
```

Não rode `build` com o `dev` ligado — os dois usam a mesma pasta `.next`.

---

## Antes de divulgar o link

- [ ] Fazer **um PIX de verdade** por uma das páginas de presente e confirmar
      que o valor e o recebedor estão certos
- [ ] Preencher `DATABASE_URL` e `RESEND_API_KEY` na Vercel
- [ ] Confirmar presença uma vez e ver se o e-mail chega
- [ ] Escolher um presente uma vez e ver se o e-mail chega
- [ ] Abrir o site num celular de verdade, não só no navegador redimensionado
- [ ] Conferir a prévia do link no WhatsApp

---

Detalhes de arquitetura, decisões de design e armadilhas conhecidas estão em
[CLAUDE.md](CLAUDE.md). Os prompts para gerar as ilustrações em outra ferramenta
estão em [PROMPTS-ILUSTRACAO.md](PROMPTS-ILUSTRACAO.md).
