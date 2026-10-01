# Seu Universo: passagem para o Claude Cowork

> Para: Claude Cowork, operando o Chrome do Guilherme.
> De: a sessão do Claude Code que construiu o app (30/09 a 01/10/2026).
> Envie este arquivo junto com `docs/SETUP.md`. Este arquivo diz **o que já existe e em que ordem terminar**; o SETUP
> tem o detalhe técnico de cada passo (SQL, templates de e-mail, tabela de variáveis).

---

## 0. Como trabalhar com o Guilherme (leia primeiro)

- **Responda sempre em português do Brasil**, em linguagem simples. Ele está aprendendo programação. Diga onde clicar
  e, ao fim de cada etapa, explique em uma ou duas frases o que aconteceu por baixo.
- **Senhas, chaves e segredos ele mesmo cola.** Você nunca digita: service role do Supabase, chave da Groq, segredo do
  webhook da Cakto, senha de app do Gmail. Também não leia arquivos `.env`.
- **Criar conta em qualquer serviço é ele quem faz** (Supabase, Vercel, Groq, Gmail, Cakto).
- **SQL que grava no banco de produção é ele quem roda.** Deixe pronto, explique o que faz e diga "cola e clica em Run".
- **Peça OK antes de:** fazer merge, salvar configurações importantes, criar o webhook ou apagar qualquer coisa.
- Antes de dizer que algo está pronto, **mostre a evidência** (print, resposta de uma URL de diagnóstico).
- Se a skill **"área de membros Cakto" (modelo Shape 28°)** estiver disponível, use-a como referência de jeito de
  operar o Chrome. **Este app, porém, segue a própria estrutura**, descrita abaixo, e não é cópia do Shape 28°.

---

## 1. O que é o produto

**Seu Universo** é uma área de membros de espiritualidade, um "observatório pessoal". Tem mapa astral, Lua, Tarot,
numerologia, sonhos, amor/mapa do casal e o **Seu Guia** (IA). A regra central: **o software calcula, a IA só
interpreta.**

**Modelo de venda (decidido pelo Guilherme):**
- **Plano único**, acesso **vitalício**.
- **Order bump "Relacionamentos"**, também **vitalício**: libera Amor, Mapa do casal e Tarot do amor.
- O bump **também é vendido dentro do app**. Quem comprou sem ele vê a oferta, e o checkout abre com o e-mail da
  conta preenchido.
- Login pelo Supabase com **confirmação de e-mail obrigatória**. A compra só se liga à conta depois que o e-mail é
  confirmado.

---

## 2. O que já está pronto (não refaça)

**Código:** repositório `magceliz241-cell/Universo-Espiritual`, branch **`claude/clever-bell-8ngyya`**
(ainda **não** foi feito merge na `main`).

| Parte | Situação |
|---|---|
| App Next.js 16 com todas as telas (Início, Mapa, Amor, Mapa do casal, Tarot, Numerologia, Lua, Sonhos, Seu Guia, Perfil, login/cadastro/recuperação) | ✅ pronto |
| Motor astronômico XALEN (WebAssembly já compilado em `vendor/su-ephem/`, **não precisa de Rust na Vercel**) | ✅ pronto |
| Banco: 3 migrations em `supabase/migrations/` (tabelas, regras de segurança, acesso Cakto, cidades) | ✅ prontas, **não rodadas** em produção |
| Webhook da Cakto em `/api/webhooks/cakto` (compra, bump, reembolso, chargeback) | ✅ pronto |
| IA (Groq, modelo `openai/gpt-oss-120b`) | ✅ pronta, **falta a chave** |
| Testes: 129 unitários, 18 de banco, 65/65 de ponta a ponta no navegador | ✅ passando |
| Base de cidades (GeoNames) | ⚠️ script pronto, **dados não importados** |
| Landing page de vendas em `landing/` (R$ 19,90 + bump R$ 9,90, teste de interesses, garantia de 7 dias, termos e privacidade) | ✅ pronta, **falta preencher `landing/config.js` e publicar** |

Prévia visual com todas as telas (privada, do Guilherme): https://claude.ai/artifact/1kUWoqfgZtixUL9ufH5qw9

---

## 3. Sua missão: colocar no ar, nesta ordem

A ordem importa: com a Vercel no ar, o Guilherme já consegue testar o app antes da Cakto existir.

### Etapa 1: Merge do código na `main`
1. No GitHub, abra um Pull Request de `claude/clever-bell-8ngyya` → `main` (título: "Seu Universo: MVP").
2. **Peça OK ao Guilherme** e faça o merge.
   - Se ele preferir não fazer merge ainda, a Vercel pode publicar direto da branch.

### Etapa 2: Supabase (projeto novo)
Siga `docs/SETUP.md` §1. Em resumo:
1. Ele cria um projeto **novo** no Supabase.
2. **SQL Editor**: ele roda os 3 arquivos de `supabase/migrations/` **na ordem do nome** (0100, 0200, 0300). Abra cada
   um no GitHub, copie o conteúdo e diga "cola e clica em Run".
   - Aviso de "destructive operation" é esperado (são `drop ... if exists` que recriam regras). É seguro.
3. **Authentication → Email**: **Confirm email LIGADO**. Nunca desligue para "facilitar".
4. **Templates de e-mail**: use os textos simples do SETUP §1.6. Os links usam `token_hash` e funcionam em qualquer
   aparelho.
5. **SMTP**: Gmail do produto com senha de app (ele cria e cola).
6. Anote para a Vercel: *Project URL* e chave *anon/publishable* (públicas) e *service_role* (secreta, ele cola).

### Etapa 3: Vercel
1. Ele importa o repositório na Vercel (framework Next.js detectado sozinho, Node 22). Não mude o comando de build.
2. Variáveis de ambiente: tabela completa em `docs/SETUP.md` §3. Nesta etapa bastam:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (ele cola)
   - `NEXT_PUBLIC_APP_URL` (a URL final da Vercel, sem barra no fim)
   - `GROQ_API_KEY` (ele cria em console.groq.com e cola) e `GROQ_MODEL=openai/gpt-oss-120b`
3. Faça o deploy. Depois **volte no Supabase** → *Authentication → URL Configuration* e coloque a URL da Vercel como
   **Site URL** e nas **Redirect URLs** (+ `https://*-<time>.vercel.app/**` para prévias).
4. **Conferência (mostre ao Guilherme):**
   - `https://<app>/api/health/engine` → `"ok": true`
   - `https://<app>/auth/login` abre a tela de login

### Etapa 4: Base de cidades (obrigatória: sem ela ninguém cadastra o nascimento)
Arquivos em https://download.geonames.org/export/dump/: `cities1000.zip`, `BR.zip` e `admin1CodesASCII.txt`.

**Caminho recomendado (sem chave nenhuma):**
1. No seu ambiente de código (sandbox), clone o repositório, `npm install`, baixe e descompacte os 3 arquivos e rode:
   ```bash
   node scripts/import-cities.ts --cities cities1000.txt --cities BR.txt \
     --admin1 admin1CodesASCII.txt --dump-date AAAA-MM-DD --out cidades.csv --chunk 20000
   ```
   Isso gera `cidades-001.csv`, `cidades-002.csv`, …, cada um com cabeçalho.
2. No Supabase: *Table Editor → tabela `cities` → Insert → Import data from CSV*, um arquivo por vez.
3. Conferência: no SQL Editor (só leitura), `select count(*) from cities;` deve dar mais de 150 mil, e
   `select name, timezone from search_cities('sao paulo');` deve trazer São Paulo / America/Sao_Paulo.

**Alternativa:** o modo `--upsert` envia direto para o banco, mas precisa da service role no terminal (ele cola). Prefira
o CSV.

### Etapa 5: Testar o app de verdade (antes da Cakto)
1. Peça ao Guilherme para criar uma conta no app com um e-mail dele e confirmar pelo e-mail.
   - Ele vai cair em **"Ainda não encontramos sua compra"**, o que é o certo, porque ainda não há compra.
2. Para liberar o acesso dele sem a Cakto, prepare este SQL (**ele roda**), trocando o e-mail:
   ```sql
   select public.cakto_apply_purchase('email-dele@exemplo.com', 'main', 'teste-manual-1');
   select public.cakto_apply_purchase('email-dele@exemplo.com', 'love', 'teste-manual-2'); -- relacionamentos
   ```
   Recarregue o app: ele entra no Início.
3. Roteiro: cadastrar nascimento → Mapa → "Ver minha leitura" (IA real) → Tarot → Lua → Numerologia → Sonhos → Seu Guia →
   Amor → Mapa do casal. No fim, se ele quiser, remova o acesso de teste:
   ```sql
   select public.cakto_apply_revocation('teste-manual-1', 'email-dele@exemplo.com', 'refunded');
   ```

### Etapa 6: Cakto
Siga `docs/SETUP.md` §4:
1. Ele cria e confirma os produtos:
   - **principal** (vitalício);
   - **order bump "Relacionamentos"** (vitalício);
   - uma **oferta avulsa do bump** para vender dentro do app.
2. Em cada produto, "Acesso por e-mail" → `https://<app>/auth/sign-up`.
3. Webhook: URL `https://<app>/api/webhooks/cakto`, eventos **Compra aprovada + Reembolso + Chargeback**, **todos os
   produtos marcados**. O segredo vai para `CAKTO_WEBHOOK_SECRET` na Vercel (ele cola).
4. Na Vercel, preencha e faça **redeploy**:
   - `CAKTO_MAIN_IDS`: ids/códigos do produto e das ofertas do **principal**, separados por vírgula
   - `CAKTO_LOVE_IDS`: ids/códigos do **bump**, tanto o do checkout da landing quanto o da oferta avulsa
   - `NEXT_PUBLIC_CHECKOUT_LOVE_URL`: link de checkout da oferta avulsa do bump
   - `NEXT_PUBLIC_LANDING_URL`: URL da landing (Etapa 7)

   **Um mesmo id nunca pode estar nas duas listas.**
5. **Conferência:** `GET https://<app>/api/webhooks/cakto` → todos `true`. O botão "Testar" da Cakto usa ids falsos, então
   o resultado esperado no log (`cakto_webhook_events`) é `needs_review`.
6. **Compra real de teste** (ele faz) com um e-mail novo: comprar o principal sem o bump, criar a conta, confirmar,
   ver que entrou. Depois comprar o bump **pela oferta dentro do app** e ver que Amor libera sem sair. Reembolso pela
   Cakto, se quiser testar o bloqueio.

### Etapa 7: Publicar a landing (já está pronta em `landing/`)
Guia completo em `landing/README.md`. Em resumo:
1. Em `landing/config.js` (é o **único** arquivo a editar), com o Guilherme:
   - `CHECKOUT_URL`: checkout da Cakto do **principal (R$ 19,90)**, com o bump **Relacionamentos (R$ 9,90)** dentro
     desse mesmo checkout;
   - `APP_URL`: URL do app, sem barra no fim;
   - `CONTACT_EMAIL`: e-mail de suporte;
   - `META_PIXEL_ID`: pixel via UTMify **da conta do Seu Universo** (vazio = sem pixel).
2. Script de captura de UTMs da UTMify: colar no `<head>` do `landing/index.html`, no comentário indicado.
3. Vercel: *Add New → Project* com o **mesmo repositório**, **Root Directory = `landing`**, preset **Other**, sem
   build e sem variáveis.
4. Depois do deploy: trocar o `og:image` do `index.html` pelo endereço completo da imagem
   (`https://<landing>/img/og.jpg`) e preencher `NEXT_PUBLIC_LANDING_URL` no projeto do app (redeploy).
5. **Conferência:** abrir a landing no celular e ver o cartão "O céu agora" e a seção dos planetas com a hora mudando a
   cada segundo (não precisam de configuração nem do app no ar); clicar em "Quero o meu acesso" e ver o checkout da
   Cakto abrir com o bump; fazer o teste "Descubra por onde começar" até o fim; abrir Termos e Privacidade e ver o e-mail certo.

Edições de texto da landing pelo GitHub são aceitáveis só em `config.js` e no script da UTMify. Mudanças de copy ou
layout: anote e leve ao Claude Code.

---

## 4. Coisas que podem confundir (e como estão resolvidas)

- **`proxy.ts` em vez de `middleware.ts`:** no Next.js 16 o middleware foi renomeado. A proteção das páginas está em
  `src/proxy.ts`.
- **Sem Supabase configurado, o app bloqueia tudo** e mostra "Estamos terminando de preparar tudo". É de propósito:
  falha fechada.
- **Variáveis `NEXT_PUBLIC_*`** só valem depois de um **redeploy**.
- **Datas aceitas: 02/01/1885 a 30/12/2099.** É o limite do cálculo de Plutão do motor, não é bug.
- **Horário que aconteceu duas vezes** (fim do horário de verão): o formulário pergunta qual das duas. Horário que
  não existiu (início do horário de verão): o formulário avisa.
- **Swiss Ephemeris não pode ser usada** no projeto, por decisão do Guilherme. O motor é só o XALEN.
- **Plano Hobby da Vercel é para uso não comercial.** Quando começar a vender, o certo é a Vercel Pro (e, de
  preferência, o Supabase Pro). Avise o Guilherme, sem decidir por ele.
- **Limite de IA:** 40 leituras por pessoa a cada 24 h (`AI_DAILY_LIMIT`, opcional na Vercel).

---

## 5. Pendências que NÃO são suas (ficam para o Claude Code)

- Benchmark dos planetas contra o JPL Horizons (precisa liberar `ssd.jpl.nasa.gov` na rede do Claude Code). Hoje o
  relatório `docs/BENCHMARK.md` usa valores de segunda mão.
- Modo DE440 (Plutão ≤ 5″ e teste mais rigoroso da Lua).
- Conteúdo editorial que faltou na base: manifestação, jornadas e revisão das 56 cartas menores.

Se aparecer algo que exija mexer no código, anote e peça ao Guilherme para levar ao Claude Code. Não edite o código
pelo GitHub.

---

## 6. Checklist final (mostre ao Guilherme)

- [ ] Merge na `main` feito
- [ ] Supabase: 3 migrations rodadas, Confirm email ligado, templates e SMTP configurados, Site URL correta
- [ ] Vercel no ar; `/api/health/engine` → `ok: true`
- [ ] Cidades importadas (mais de 150 mil; busca por "sao paulo" funciona)
- [ ] Teste com acesso manual: todas as telas abrem e a leitura do Guia funciona com a IA real
- [ ] Cakto: produtos, bump e oferta avulsa criados; webhook com os 3 eventos e todos os produtos marcados
- [ ] `/api/webhooks/cakto` (GET) → tudo `true`
- [ ] Compra real: principal libera; bump dentro do app libera Amor na hora; reembolso bloqueia
- [ ] Landing: `config.js` preenchido, UTMify colada, publicada (Root Directory `landing`), `og:image` com endereço completo, `NEXT_PUBLIC_LANDING_URL` preenchida
