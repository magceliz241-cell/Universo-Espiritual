# Astarot: passagem para o Claude Cowork

> Para: Claude Cowork, operando o Chrome do Guilherme.
> De: a sessão do Claude Code que construiu o app (30/09 a 01/10/2026).
> **Arquivos que o Guilherme envia, nesta ordem:** `1-HANDOFF_COWORK.md` (este, o principal), `2-SETUP.md` (detalhe
> técnico: templates de e-mail, tabela de variáveis), `3-LANDING_README.md` (como a landing funciona) e
> `4-PLANO_LOGIN_GOOGLE.md` (etapa opcional). No repositório eles ficam em `docs/HANDOFF_COWORK.md`, `docs/SETUP.md`,
> `landing/README.md` e `docs/PLANO_LOGIN_GOOGLE.md`.
> Ao terminar, a **Etapa 8** devolve o trabalho ao Claude Code, que segue `docs/RETORNO_CLAUDE_CODE.md`.

---

## 0. Como trabalhar com o Guilherme (leia primeiro)

- **Responda sempre em português do Brasil**, em linguagem simples. Ele está aprendendo programação. Diga onde clicar
  e, ao fim de cada etapa, explique em uma ou duas frases o que aconteceu por baixo.
- **Senhas, chaves e segredos ele mesmo cola.** Você nunca digita: service role do Supabase, chave da Groq, segredo do
  webhook da Cakto, senha de app do Gmail. Também não leia arquivos `.env`.
- **Criar conta em qualquer serviço é ele quem faz** (Supabase, Vercel, Groq, Gmail, Cakto).
- **SQL que grava no banco de produção:** se o **conector Supabase** estiver ativo na conversa (projeto
  `vyynstiepcqvxitwsipx`), você pode executá-lo pelo conector, **mas só depois de pedir permissão ao Guilherme para
  aquele comando específico**, explicando em linguagem simples o que ele faz e por que é necessário (veja
  "Conector Supabase" abaixo). Sem o conector, deixe o SQL pronto, explique e diga "cola e clica em Run".
- **Peça OK antes de:** fazer merge, salvar configurações importantes, criar o webhook ou apagar qualquer coisa.
- Antes de dizer que algo está pronto, **mostre a evidência** (print, resposta de uma URL de diagnóstico).
- **Conector Supabase:** consultas que só leem (listar tabelas, conferir regras de segurança, contar cidades, ver
  logs) podem ser feitas sem pedir. Tudo o que **altera** algo (migrations, `insert`/`update`/`delete`, criar ou apagar
  tabela, função, branch ou Edge Function, mudar configuração) exige, antes de cada execução: (1) o comando ou o
  resumo do que será feito, (2) por que é necessário, (3) o que muda e se dá para desfazer, e (4) o "pode" do
  Guilherme. Uma permissão vale para aquele comando, não para os próximos. Nunca rode nada contra outro projeto.
- Se a skill **"área de membros Cakto" (modelo Shape 28°)** estiver disponível, use-a como referência de jeito de
  operar o Chrome. **Este app, porém, segue a própria estrutura**, descrita abaixo, e não é cópia do Shape 28°.

---

## 1. O que é o produto

**Astarot** é uma área de membros de espiritualidade, um "observatório pessoal". Tem mapa astral, Lua, Tarot,
numerologia, sonhos, amor/mapa do casal e o **Seu Guia** (IA). A regra central: **o software calcula, a IA só
interpreta.**

**Modelo de venda (decidido pelo Guilherme):**
- Produto principal **Astarot** (R$ 19,90, pagamento único; o acesso não expira).
- Produto **Astarot Love** (R$ 29,90, checkout próprio): tudo do Astarot + Amor, Mapa do casal e Tarot do amor.
- No checkout do Astarot existe o **order bump Astarot Love** (+ R$ 10,00), para quem quiser levar o Love ali mesmo.
- "Vitalício" é característica, não nome de plano: nos produtos da Cakto use os nomes **Astarot** e **Astarot Love**.
- O Love **também é vendido dentro do app** como upgrade (+ R$ 10,00). Quem tem só o Astarot vê a oferta, e o checkout abre com o e-mail da
  conta preenchido.
- Login pelo Supabase com **confirmação de e-mail obrigatória**. A compra só se liga à conta depois que o e-mail é
  confirmado.

---

## 2. O que já está pronto (não refaça)

**Código:** repositório `magceliz241-cell/Universo-Espiritual`, já na branch **`main`** (o Guilherme fez o merge
dos Pull Requests). O Claude Code trabalha na branch `claude/clever-bell-8ngyya` e abre um PR a cada rodada de
mudanças; o Guilherme faz o merge.

| Parte | Situação |
|---|---|
| App Next.js 16 com todas as telas (Início, Mapa, Amor, Mapa do casal, Tarot, Numerologia, Lua, Sonhos, Seu Guia, Perfil, login/cadastro/recuperação) | ✅ pronto |
| Motor astronômico XALEN (WebAssembly já compilado em `vendor/su-ephem/`, **não precisa de Rust na Vercel**) | ✅ pronto |
| Banco: 3 migrations (`core`, `memberships`, `cities`) | ✅ **aplicadas em produção** em 01/10/2026 pelo Claude Code, pelo conector: 12 tabelas, todas com RLS, 14 políticas, 10 funções, 2 gatilhos em `auth.users` |
| Webhook da Cakto em `/api/webhooks/cakto` (compra, bump, reembolso, chargeback) | ✅ pronto |
| IA (Groq, modelo `openai/gpt-oss-120b`) | ✅ pronta, **falta a chave** |
| Testes: 132 unitários, 18 de banco, 65/65 de ponta a ponta no navegador | ✅ passando |
| Base de cidades (GeoNames) | ⚠️ tabela criada e vazia; script pronto, **dados não importados** (Etapa 4) |
| Landing page de vendas em `landing/` (Astarot R$ 19,90 e Astarot Love R$ 29,90, cada um com checkout próprio, teste de interesses, garantia de 7 dias, termos e privacidade) | ✅ **publicada** em https://universo-espiritual-landing.vercel.app (projeto próprio na Vercel, Root Directory `landing`); **falta preencher `landing/config.js`** |

Prévia visual com todas as telas (privada, do Guilherme): https://claude.ai/artifact/1kUWoqfgZtixUL9ufH5qw9

---

## 3. Sua missão: colocar no ar, nesta ordem

A ordem importa: com a Vercel no ar, o Guilherme já consegue testar o app antes da Cakto existir.

### Etapa 1: Merge do código na `main`
O código já está na `main`. **Antes de seguir, abra
https://github.com/magceliz241-cell/Universo-Espiritual/pulls**: se houver Pull Request aberto do Claude Code
(por exemplo o #8, com o visual novo do app), mostre ao Guilherme e, com o OK dele, faça o merge. Assim o app já sobe
na Vercel com a versão mais recente.

### Etapa 2: Supabase (Auth e e-mails; o banco já está pronto)
Siga `docs/SETUP.md` §1. Em resumo:
1. ✅ O projeto já existe: ref **`vyynstiepcqvxitwsipx`**. Não crie outro.
2. ✅ As 3 migrations já foram aplicadas. **Não rode de novo.** Para conferir (só leitura, pelo conector ou no SQL
   Editor): `list_tables` deve mostrar 12 tabelas com RLS. No verificador de segurança (*Advisors → Security*),
   **dois avisos são esperados; não "conserte":**
   - "RLS Enabled No Policy" em `cakto_webhook_events`: sem política de propósito, só o servidor acessa;
   - "Signed-In Users Can Execute SECURITY DEFINER Function" em `my_access()`: de propósito, a função devolve só o
     acesso de quem está logado.
3. **Authentication → Email**: **Confirm email LIGADO**. Nunca desligue para "facilitar".
4. **Templates de e-mail**: use os textos simples do SETUP §1.6. Os links usam `token_hash` e funcionam em qualquer
   aparelho.
5. **SMTP**: Gmail do produto com senha de app (ele cria e cola).
6. As chaves para a Vercel ficam em *Project Settings → API Keys* (ou *Data API*): a URL do projeto e a chave
   **anon** são públicas (você pode copiar); a **service_role** é secreta (só o Guilherme copia, na Etapa 3).

### Etapa 3: Projeto do app na Vercel
> Se o Guilherme já tiver criado o projeto do app, **não crie outro**: abra o projeto e confira cada item abaixo,
> completando o que faltar. O projeto `universo-espiritual-landing` é só da landing; **não mexa nele**.

**3.1 Criar o projeto** (você faz):
1. https://vercel.com → **Add New → Project** → importar `magceliz241-cell/Universo-Espiritual` (o mesmo repositório
   da landing).
2. Nome sugerido: `astarot-app`. **Root Directory: deixe na raiz** (não escolha `landing`). Framework: **Next.js**
   (detectado sozinho). Não mude o comando de build. Node.js 22 (*Settings → General*, se perguntar).

**3.2 Variáveis de ambiente** (em *Environment Variables*, antes do primeiro deploy; marque Production, Preview e
Development):

| Nome | Valor | Quem preenche |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vyynstiepcqvxitwsipx.supabase.co` | você |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave **anon** do Supabase (*Project Settings → API Keys → anon / Legacy anon*). É pública | você |
| `SUPABASE_SERVICE_ROLE_KEY` | chave **service_role** (mesma página, botão *Reveal*) | **o Guilherme copia e cola**. Você não lê, não copia e não digita |
| `GROQ_MODEL` | `openai/gpt-oss-120b` | você |
| `GROQ_API_KEY` | chave da Groq (Etapa 3.4) | **o Guilherme cola** |

Para a service_role, diga exatamente: "Abra o Supabase em *Project Settings → API Keys*, clique em *Reveal* na
service_role, copie e cole no campo `SUPABASE_SERVICE_ROLE_KEY` da Vercel". Espere ele confirmar.

**3.3 Primeiro deploy e endereço do app** (você faz):
1. Clique em **Deploy** e espere terminar (alguns minutos).
2. Copie o endereço gerado (ex.: `https://astarot-app.vercel.app`). Esse é o **`<app>`** do resto deste documento.
3. Crie a variável `NEXT_PUBLIC_APP_URL` = `<app>` (sem barra no fim) e faça **Redeploy** (*Deployments → ⋯ →
   Redeploy*). Variáveis `NEXT_PUBLIC_*` só valem depois de um redeploy.
4. No Supabase, *Authentication → URL Configuration*:
   - **Site URL:** `<app>`
   - **Redirect URLs:** `<app>/**` e `https://*-<time-da-vercel>.vercel.app/**` (prévias) e `http://localhost:3000/**`

**3.4 Chave da Groq** (Seu Guia):
1. O Guilherme cria a conta em https://console.groq.com (ele mesmo) e gera uma chave em *API Keys*.
2. Ele cola em `GROQ_API_KEY` na Vercel. Depois, **Redeploy**.

**3.5 Conferência (mostre prints ao Guilherme):**
- `<app>/api/health/engine` → `"ok": true`
- `<app>/auth/login` abre a tela de login com o logo dourado
- `<app>/api/webhooks/cakto` → mostra `true` em `supabase_admin` (os itens da Cakto ficam `false` até a Etapa 6)

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
2. Para liberar o acesso dele sem a Cakto, prepare este SQL trocando o e-mail (**ele roda**, ou você roda pelo
   conector depois de pedir permissão):
   ```sql
   select public.cakto_apply_purchase('email-dele@exemplo.com', 'main', 'teste-manual-1');
   select public.cakto_apply_purchase('email-dele@exemplo.com', 'love', 'teste-manual-2'); -- Astarot Love
   ```
   Recarregue o app: ele entra no Início.
3. Roteiro: cadastrar nascimento com os dados de exemplo (nome **Luna**, nome completo de nascimento **Luna Souza**,
   **15/08/1990, 14h30, São Paulo**; assim as capturas da Etapa 8 já saem prontas) → Mapa → "Ver minha leitura"
   (IA real) → Tarot → Lua → Numerologia → Sonhos → Seu Guia → Amor → Mapa do casal (com a **Rafa**). No fim, se ele quiser, remova o acesso de teste:
   ```sql
   select public.cakto_apply_revocation('teste-manual-1', 'email-dele@exemplo.com', 'refunded');
   ```

### Etapa 6: Cakto
**6.0 Conferir os produtos que o Guilherme já criou (faça isto primeiro).** Ele criou na Cakto os produtos
**Astarot** e **Astarot Love**. Antes de qualquer outra coisa, abra cada um e confira com ele, mostrando prints:
- [ ] **Astarot:** nome "Astarot", preço **R$ 19,90**, pagamento único (sem recorrência), Pix e cartão.
- [ ] **Order bump** no checkout do Astarot: "Astarot Love", **+ R$ 10,00**, aparecendo no checkout do Astarot.
- [ ] **Astarot Love:** nome "Astarot Love", preço **R$ 29,90**, pagamento único, Pix e cartão, **sem** order bump.
- [ ] Os dois checkouts abrem e mostram o preço certo (abra os links).
- [ ] Entregável / "acesso por e-mail": o link é **`<app>/auth/sign-up`** (endereço do app criado na Etapa 3), nos dois
      produtos e na oferta de upgrade. Mostre ao Guilherme e, com o OK dele, preencha. Se a Etapa 3 ainda não tiver
      sido feita, deixe pendente; não invente um link provisório.
- [ ] Anote os IDs/códigos de produto e de oferta de cada um (vão para a Vercel no passo 4).
Se algo estiver diferente, mostre ao Guilherme e pergunte antes de alterar.

Depois, siga `docs/SETUP.md` §4:
1. Ele cria e confirma os produtos (pule o que já existe e foi conferido no 6.0):
   - **Astarot** (principal, sem expiração);
   - **order bump "Astarot Love"** (+ R$ 10,00) dentro do checkout do Astarot;
   - **Astarot Love** (R$ 29,90), produto próprio com checkout próprio, sem bump;
   - uma **oferta de upgrade do Astarot Love** (+ R$ 10,00) para vender dentro do app.
2. Em cada produto, "Acesso por e-mail" → `https://<app>/auth/sign-up`.
3. Webhook: URL `https://<app>/api/webhooks/cakto`, eventos **Compra aprovada + Reembolso + Chargeback**, **todos os
   produtos marcados**. O segredo vai para `CAKTO_WEBHOOK_SECRET` na Vercel (ele cola).
4. Na Vercel, preencha e faça **redeploy**:
   - `CAKTO_MAIN_IDS`: ids/códigos do produto e das ofertas do **principal**, separados por vírgula
   - `CAKTO_LOVE_IDS`: ids/códigos do **order bump** do Love e da **oferta de upgrade** dentro do app
   - `CAKTO_FULL_IDS`: ids/códigos do produto **Astarot Love** (R$ 29,90), que libera tudo
   - `NEXT_PUBLIC_CHECKOUT_LOVE_URL`: link de checkout da oferta de upgrade (dentro do app)
   - `NEXT_PUBLIC_LANDING_URL`: URL da landing (Etapa 7)

   **Um mesmo id nunca pode estar em duas listas.**
5. **Conferência:** `GET https://<app>/api/webhooks/cakto` → todos `true`. O botão "Testar" da Cakto usa ids falsos, então
   o resultado esperado no log (`cakto_webhook_events`) é `needs_review`.
6. **Compra real de teste** (ele faz) com um e-mail novo: comprar o Astarot sem o bump, criar a conta, confirmar,
   ver que entrou. Depois comprar o Love **pela oferta dentro do app** e ver que Amor libera sem sair. Se quiser,
   testar também o produto **Astarot Love** com outro e-mail: tudo deve liberar de uma vez. Reembolso pela
   Cakto, se quiser testar o bloqueio.

### Etapa 7: Juntar os dados da landing (você **não** edita a landing)
A landing já está no ar (https://universo-espiritual-landing.vercel.app, projeto `universo-espiritual-landing` na
Vercel; cada merge na `main` atualiza o site). Quem preenche a configuração e publica é o Claude Code, na Etapa 8.
Sua parte é **juntar estes dados com o Guilherme** (nenhum deles é segredo):
1. `APP_URL`: endereço do app na Vercel (Etapa 3), sem barra no fim.
2. `CHECKOUT_URL`: link do checkout da Cakto do **Astarot (R$ 19,90)** (Etapa 6). Abra e confirme que o order bump
   do Astarot Love (+ R$ 10,00) aparece.
   `CHECKOUT_LOVE_URL`: link do checkout do produto **Astarot Love (R$ 29,90)**. Abra e confirme o preço.
3. `CONTACT_EMAIL`: e-mail de suporte que vai aparecer no site, nos Termos e na Privacidade.
4. `META_PIXEL_ID`: ID do pixel na UTMify **da conta do Astarot** (ou "sem pixel").
5. `UTMIFY_SCRIPT`: o script de captura de UTMs que a UTMify mostra para essa conta (copie inteiro).
6. Confirme na Cakto os preços: Astarot 19,90 · Astarot Love 29,90 · bump e upgrade do Love 10,00.
7. No projeto do **app** na Vercel, preencha `NEXT_PUBLIC_LANDING_URL` com o endereço da landing e faça redeploy.

### Etapa 8: Capturar as telas e devolver ao Claude Code
**8.1 Capturas das telas do app** (vão substituir as telas de teste na landing):
1. Use a conta de teste do Guilherme com acesso ao Astarot e ao Astarot Love (Etapa 5). Para nenhuma tela mostrar
   dado real, o nome de exibição deve ser **"Luna"** (nome completo de nascimento **"Luna Souza"**), com o
   nascimento de exemplo **15/08/1990, 14h30, São Paulo** e uma pessoa no mapa do casal chamada **"Rafa"**. Se a conta estiver com dados reais, peça para trocar antes.
2. No Chrome: DevTools → modo dispositivo → **iPhone 12 Pro (390 × 844)**, zoom 100%.
3. Capture a área visível (⋮ → *Capture screenshot*) destas 9 telas, nesta ordem:
   `/` (Início) · `/mapa` · `/lua` · `/tarot` (depois de tirar as 3 cartas e abrir a leitura) · `/numerologia` ·
   `/guia` (depois de fazer uma pergunta e a resposta aparecer) · `/amor` (com o perfil amoroso aberto) ·
   `/amor/sinastria` (com a Rafa) · `/sonhos`.
4. Confira que nenhuma captura mostra e-mail ou nome real.

**8.2 Mensagem de volta.** Monte esta mensagem com os dados reais e entregue ao Guilherme para ele colar numa sessão
do Claude Code neste repositório, com as 9 imagens anexadas:
```
Voltei do Cowork. Siga docs/RETORNO_CLAUDE_CODE.md.

APP_URL: https://...
LANDING_URL: https://universo-espiritual-landing.vercel.app
CHECKOUT_URL: https://pay.cakto.com.br/...        (Astarot, com o bump do Love)
CHECKOUT_LOVE_URL: https://pay.cakto.com.br/...   (Astarot Love, checkout próprio)
CONTACT_EMAIL: ...
META_PIXEL_ID: ...            (ou "sem pixel")
UTMIFY_SCRIPT:
<script da UTMify, inteiro>
PRECOS NA CAKTO: Astarot 19,90 · Astarot Love 29,90 · bump/upgrade do Love 10,00
TELAS: 9 capturas do app em anexo
LOGIN GOOGLE: provedor ligado no Supabase? sim / não
LINKS DE ENTREGA NA CAKTO: preenchidos com <app>/auth/sign-up? sim / não
O QUE O COWORK NÃO CONSEGUIU FAZER: ...   (ou "nada")
```
**Nunca** inclua service role, chave da Groq, segredo do webhook ou senhas: não são necessários lá.

A partir daí o Claude Code faz o resto sozinho: diagnóstico de produção pelo conector e pelas URLs, preenchimento da
landing, troca das telas, enriquecimento do Tarot, ajuste de tom do app, testes e o Pull Request para o Guilherme
fazer o merge.

### Etapa extra (opcional, antes da Etapa 8): login com Google
Pergunte ao Guilherme se ele quer fazer agora. Plano completo em `4-PLANO_LOGIN_GOOGLE.md` (`docs/PLANO_LOGIN_GOOGLE.md`).
Sua parte é a 3.1 de lá (Google Cloud Console + provedor Google no Supabase), com o Guilherme colando o segredo do
cliente. O código fica com o Claude Code. Na mensagem da Etapa 8, informe se o provedor ficou ligado.

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

Estão detalhadas em `docs/RETORNO_CLAUDE_CODE.md`: preencher e publicar a landing, trocar as telas, enriquecer as 78
cartas do Tarot, alinhar o tom do app com a landing, benchmark contra o JPL (se a rede permitir) e, depois do
lançamento, as funcionalidades de jornadas e manifestação.

Se aparecer algo que exija mexer no código, anote e peça ao Guilherme para levar ao Claude Code. Não edite o código
pelo GitHub.

---

## 6. Checklist final (mostre ao Guilherme)

Estado em 03/10/2026, conferido pelo Claude Code na volta do Cowork:

- [x] Merge na `main` feito
- [x] Supabase: 3 migrations aplicadas e conferidas (12 tabelas com RLS)
- [x] Supabase Auth: Confirm email ligado, templates (roxo) e SMTP configurados, Site URL e Redirect URLs corretas
- [x] PRs abertos do Claude Code mergeados (Etapa 1)
- [x] Projeto do app na Vercel com as variáveis e redeploy; `/api/health/engine` → `ok: true`
- [x] Cidades importadas (237.613; busca por "sao paulo" funciona)
- [x] Teste com acesso manual: telas abrem e a IA real responde (acesso de teste mantido de propósito)
- [x] Cakto: Astarot (com bump), Astarot Love e complemento criados; webhook "Astarot - Entrega" testado (`needs_review`)
- [x] `/api/webhooks/cakto` (GET) → tudo `true`
- [ ] Compra real: Astarot libera; upgrade dentro do app libera Amor na hora; Astarot Love libera tudo; reembolso bloqueia
- [x] Landing publicada (`astarot.vercel.app`)
- [x] Dados da landing juntados (Etapa 7) e `NEXT_PUBLIC_LANDING_URL` preenchida no app
- [x] 9 capturas feitas e mensagem de volta entregue (Etapa 8)
- [x] Login com Google: provedor ligado no Supabase (o botão depende de `NEXT_PUBLIC_GOOGLE_AUTH=1`)
