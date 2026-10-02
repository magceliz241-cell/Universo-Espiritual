# Configuração — Supabase, Vercel e Cakto

Guia para colocar o Astarot no ar. Os passos que envolvem senhas, chaves e SQL de produção são feitos por
você. O Claude deixa tudo pronto e explica cada passo.

## 1. Supabase (projeto novo)

1. Projeto do Supabase: ✅ já criado (ref `vyynstiepcqvxitwsipx`). Guarde a senha do banco num gerenciador de senhas.
   Se o **conector Supabase** estiver ligado na sua conta do Claude (claude.ai → Configurações → Conectores), o
   Claude/Cowork pode rodar os passos de banco abaixo por ele, sempre pedindo sua permissão antes de cada alteração.
2. ✅ **Já feito em 01/10/2026** (pelo conector, com permissão do Guilherme): as 3 migrations abaixo foram aplicadas e
   conferidas. Não rode de novo. Fica registrado como seria pelo **SQL Editor** (cole e clique em *Run*, nesta ordem):
   1. `supabase/migrations/20260930000100_core.sql`: tabelas do app + RLS
   2. `supabase/migrations/20260930000200_memberships.sql`: acesso via Cakto
   3. `supabase/migrations/20260930000300_cities.sql`: base de cidades

   Os arquivos são idempotentes, então rodar de novo não quebra nada. O Supabase pode avisar sobre "destructive
   operations" por causa dos `drop policy if exists`/`drop trigger if exists`. É seguro: eles só recriam as
   regras com o mesmo nome.
3. **Authentication → Sign In / Providers → Email**: deixe **Confirm email LIGADO**. É isso que impede alguém de
   criar conta com o e-mail de outro comprador e ficar com o acesso dele.
4. **Authentication → URL Configuration**
   - Site URL: a URL de produção, sem barra no final (ex.: `https://seuuniverso-app.vercel.app`)
   - Redirect URLs: a mesma URL + `https://*-<time>.vercel.app/**` (prévias) + `http://localhost:3000/**`
5. **Authentication → Emails → SMTP** (recomendado): Gmail do produto com senha de app
   (`smtp.gmail.com`, porta 465). Limite de ~500 e-mails/dia.
6. **Authentication → Emails → Templates**: use texto simples, porque templates cheios de HTML caem no spam.
   - *Confirm signup* — assunto `Confirme seu cadastro no Astarot`:
     ```html
     <p>Oi!</p>
     <p>Recebemos seu cadastro no Astarot. Para ativar sua conta, clique no link abaixo:</p>
     <p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/">Confirmar meu e-mail</a></p>
     <p>Se não foi você que criou essa conta, é só ignorar este e-mail.</p>
     <p>Astarot</p>
     ```
   - *Reset password* — assunto `Crie uma nova senha no Astarot`:
     ```html
     <p>Oi!</p>
     <p>Para criar uma nova senha, clique no link abaixo:</p>
     <p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/auth/update-password">Criar nova senha</a></p>
     <p>Se você não pediu isso, ignore este e-mail.</p>
     ```
   Os links usam `token_hash` e funcionam em qualquer aparelho (o `{{ .ConfirmationURL }}` só funciona no mesmo navegador).

## 2. Base de cidades (GeoNames, CC-BY 4.0)

1. Baixe de https://download.geonames.org/export/dump/: `cities1000.zip`, `BR.zip` e `admin1CodesASCII.txt`.
   Descompacte.
2. Gere e importe:
   ```bash
   node scripts/import-cities.ts --cities cities1000.txt --cities BR.txt \
     --admin1 admin1CodesASCII.txt --dump-date AAAA-MM-DD --upsert
   ```
   O comando precisa de `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` definidos **no seu terminal**
   (você cola a chave; ela não vai para o repositório).
   **Sem chave nenhuma (recomendado):** troque `--upsert` por `--out cidades.csv --chunk 20000`. São gerados
   `cidades-001.csv`, `cidades-002.csv`… (cada um com cabeçalho). Importe um por vez em
   *Table Editor → cities → Insert → Import data from CSV*.
3. Atribuição obrigatória: "Dados de cidades: GeoNames (geonames.org), CC-BY 4.0". Ela já está prevista na tela "Sobre".

## 3. Vercel

Importe o repositório. Variáveis de ambiente (Settings → Environment Variables):

| Variável | Tipo | Valor |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | pública | Project URL do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | pública | chave `anon`/publishable |
| `SUPABASE_SERVICE_ROLE_KEY` | **secreta** | chave service_role (você cola) |
| `GROQ_API_KEY` | **secreta** | chave da Groq (você cola) |
| `GROQ_MODEL` | config | `openai/gpt-oss-120b` |
| `NEXT_PUBLIC_APP_URL` | pública | URL de produção |
| `NEXT_PUBLIC_LANDING_URL` | pública | URL da landing |
| `NEXT_PUBLIC_CHECKOUT_LOVE_URL` | pública | checkout Cakto da **oferta de upgrade** do Astarot Love vendida dentro do app (+ R$ 10,00, para quem já tem o Astarot) |
| `CAKTO_WEBHOOK_SECRET` | **secreta** | segredo do webhook na Cakto (você cola) |
| `CAKTO_MAIN_IDS` | config | ids/códigos do produto e das ofertas do plano principal, separados por vírgula |
| `CAKTO_LOVE_IDS` | config | ids/códigos do Astarot Love **como complemento**: order bump no checkout do Astarot **e** oferta de upgrade dentro do app (liberam só o Love) |
| `CAKTO_FULL_IDS` | config | ids/códigos do produto **Astarot Love vendido sozinho** (R$ 29,90, checkout próprio; libera o Astarot **e** o Love) |

Variáveis `NEXT_PUBLIC_*` entram no build, então depois de mudar alguma é preciso fazer **redeploy**.
Um id nunca pode estar em duas listas.

Conferência: `GET /api/health/engine` → `ok: true`; `GET /api/webhooks/cakto` → tudo `true`.

## 4. Cakto

1. Três vendas na Cakto, todas sem expiração:
   - produto **Astarot** (R$ 19,90), com **order bump "Astarot Love"** (+ R$ 10,00) no próprio checkout;
   - produto **Astarot Love** (R$ 29,90), com **checkout próprio**, que já inclui tudo do Astarot (sem bump);
   - **oferta de upgrade do Astarot Love** (+ R$ 10,00) para vender dentro do app a quem já tem o Astarot (o link recebe
     `?email=` preenchido).
2. "Acesso por e-mail" de cada produto → `https://<app>/auth/sign-up`.
3. Integrações → Webhooks → URL `https://<app>/api/webhooks/cakto`, eventos **Compra aprovada**, **Reembolso** e
   **Chargeback**, com **todos os produtos marcados**. Copie o segredo para `CAKTO_WEBHOOK_SECRET`.
4. Copie os ids de produto/oferta: Astarot → `CAKTO_MAIN_IDS`; order bump e oferta de upgrade → `CAKTO_LOVE_IDS`;
   produto Astarot Love → `CAKTO_FULL_IDS`.
5. O botão "Testar" da Cakto usa ids falsos, então o resultado esperado é `needs_review` no log
   (`cakto_webhook_events`).

## 5. Landing (`landing/`)

Página estática, publicada como um **segundo projeto na Vercel** com o mesmo repositório e **Root Directory =
`landing`** (preset *Other*, sem build). Antes de publicar, preencha `landing/config.js` (checkout, app, e-mail,
pixel) e cole o script da UTMify no `<head>` do `index.html`. Detalhes em `landing/README.md`.
Teste: `npm run test:landing`.

## 6. Testes locais do banco

```bash
# Postgres 16 local na porta 55432 (socket em /tmp), depois:
npm run test:db
```
O stub `tests/db/supabase-stub.sql` imita papéis, `auth.users`, `auth.uid()` e os privilégios padrão do Supabase.
