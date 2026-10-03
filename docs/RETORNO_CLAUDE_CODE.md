# Astarot: volta ao Claude Code (etapa final)

> Para: a sessão do Claude Code que receber a mensagem **"Voltei do Cowork"**.
> Quando: depois que o Cowork terminar as Etapas 2 a 7 de `docs/HANDOFF_COWORK.md`, ou parte delas. O roteiro abaixo
> se adapta ao que estiver pronto.
> Regras do projeto: `CLAUDE.md` (inclui a regra do conector Supabase: leitura livre, escrita só com permissão).

---

## 1. A mensagem que o Guilherme cola aqui

O Cowork monta esta mensagem já preenchida no fim da Etapa 8 do HANDOFF. O Guilherme só copia e cola numa sessão do
Claude Code neste repositório, junto com as imagens.

```
Voltei do Cowork. Siga docs/RETORNO_CLAUDE_CODE.md.

APP_URL: https://...                      (endereço do app na Vercel, sem barra no fim)
LANDING_URL: https://universo-espiritual-landing.vercel.app   (ou o domínio próprio)
CHECKOUT_URL: https://pay.cakto.com.br/...        (Astarot, com o bump do Love)
CHECKOUT_LOVE_URL: https://pay.cakto.com.br/...   (Astarot Love, checkout próprio)
CONTACT_EMAIL: ...
META_PIXEL_ID: ...                        (ou "sem pixel")
UTMIFY_SCRIPT:
<cole aqui o script de captura de UTMs da UTMify, inteiro>
PRECOS NA CAKTO: Astarot 19,90 · Astarot Love 29,90 · bump/upgrade do Love 10,00
TELAS: 9 capturas do app em anexo          (ou "sem telas")
LOGIN GOOGLE: provedor ligado no Supabase? sim / não
LINKS DE ENTREGA NA CAKTO: preenchidos com <app>/auth/sign-up? sim / não
O QUE O COWORK NÃO CONSEGUIU FAZER: ...   (ou "nada")
```

**Nunca colar:** service role do Supabase, chave da Groq, segredo do webhook da Cakto, senhas. Nada disso é necessário
aqui. Se alguém colar, não use, não repita e avise para trocar a chave.

---

## 2. O que o Claude Code faz, nesta ordem

Ao fim de cada passo, mostre a evidência (saída de comando, tabela, captura). Responda em português, em linguagem
simples.

### Passo 0: preparar
1. `git fetch origin`. Se o último PR já foi mergeado, recomece a branch a partir da `main`
   (`git checkout -B claude/clever-bell-8ngyya origin/main`). Commits não mergeados nunca são descartados.
2. Confira se o conector Supabase está ativo (procure por ferramentas `mcp__Supabase__*`). Se não estiver, diga ao
   Guilherme para conectá-lo em https://claude.ai/customize/connectors e abrir uma sessão nova. Os Passos 2 a 5 não
   dependem dele.

### Passo 1: diagnóstico de produção (só leitura, não precisa pedir)
**Supabase**, pelo conector:
- `list_migrations`: devem existir `core`, `memberships` e `cities` (aplicadas em 01/10/2026).
- `list_tables` (public): 12 tabelas, todas com RLS.
- `select count(*) from public.cities;`: mais de 150 mil.
- `select name, timezone from public.search_cities('sao paulo') limit 1;`: São Paulo / America/Sao_Paulo.
- `select processing_status, count(*) from public.cakto_webhook_events group by 1;` e
  `select status, base, love, count(*) from public.memberships group by 1,2,3;`. Mostre só as contagens, nunca
  e-mails.
- `get_advisors` (security). **Dois avisos são esperados e não devem ser "consertados":**
  - `rls_enabled_no_policy` em `cakto_webhook_events`: sem política de propósito, só o servidor (service_role) acessa;
  - `authenticated_security_definer_function_executable` em `my_access()`: de propósito, devolve só o acesso de quem
    chama (usa `auth.uid()`).
  Qualquer outro aviso é novidade: explique e proponha a correção, sem aplicar sem permissão.

**App e landing**, com `curl`:
- `$APP_URL/api/health/engine` → `"ok": true`.
- `$APP_URL/api/webhooks/cakto` (GET) → todos os itens `true` (inclui `full_ids`).
- `$APP_URL/auth/login` → 200.
- `$LANDING_URL` → 200.
- Se a rede desta sessão bloquear algum endereço, diga qual e siga em frente. Para saber como liberar, consulte a
  documentação do ambiente (tópico de rede).

Entregue uma tabela ✅/❌. Para cada ❌ de configuração (painel da Vercel, Supabase Auth, Cakto), diga ao Guilherme
exatamente onde clicar. Não tente contornar.

### Passo 2: landing com os dados reais
1. `landing/config.js`: preencher `CHECKOUT_URL`, `CHECKOUT_LOVE_URL`, `APP_URL`, `CONTACT_EMAIL`, `META_PIXEL_ID`
   (vazio se "sem pixel"), `PRICE`, `LOVE_PRICE` e `BUMP_PRICE` conforme a mensagem.
2. `UTMIFY_SCRIPT`: colar no `<head>` de `landing/index.html`, no lugar do comentário
   `<!-- UTMify - Script de captura de UTMs ... -->`. Confira antes que o script carrega só de domínio da UTMify
   (`utmify.com.br`). Se trouxer qualquer outra coisa, pergunte antes de colar.
3. `og:image` em `landing/index.html`: trocar `img/og.jpg` por `<LANDING_URL>/img/og.jpg` (endereço completo).
4. Validar: `npm run test:landing` e uma conferência no Playwright de que o botão do Astarot leva ao `CHECKOUT_URL`
   e os do Love ao `CHECKOUT_LOVE_URL`, mantendo as UTMs. O checkout da Cakto em si não abre daqui: peça ao Guilherme um clique de conferência depois
   do merge.

### Passo 3: telas reais do app na landing
- Se vierem as 9 capturas: recorte cada uma mantendo o topo, em 780×1688 px (390 de largura em 2×), converta para
  WebP (qualidade ~74, com `sharp`) e substitua `landing/img/app-{inicio,mapa,lua,tarot,numerologia,guia,amor,casal,sonhos}.webp`.
- Antes de publicar, confira que nenhuma tela mostra e-mail, nome real ou dados pessoais do Guilherme (o Cowork usa
  a conta de teste com o nome "Luna"). Se aparecer algo pessoal, pergunte.
- Sem capturas: mantenha as atuais.

### Passo 4: base editorial do Tarot (78 cartas)
Hoje cada carta em `knowledge/tarot/` segue o mesmo modelo curto (palavras-chave, expressão reversa e perguntas
genéricas). Enriquecer **as 78** (22 maiores + 56 menores), no mesmo formato de arquivo, com:
- leitura geral específica da carta;
- amor, trabalho/propósito e autoconhecimento específicos (não perguntas genéricas);
- reversa com nuance própria;
- um exercício de ação/reflexão próprio.

Regras: ler antes `knowledge/README.md`, `knowledge/LEGAL_AND_EDITORIAL_NOTES.md`, `knowledge/AI_CONTEXT_RULES.md` e
`knowledge/tarot/methodology.md`. Sem copiar texto das fontes (escrever com voz própria, citar as fontes já listadas),
sem promessa de resultado, linguagem neutra em gênero. Depois: `npm run build:knowledge` e `npm test`. Faça em lotes
(maiores, depois cada naipe), com commit por lote.

### Passo 5: tom do app alinhado com a landing
Na landing, o Guilherme pediu menos avisos de "leitura simbólica" e o Seu Guia apresentado como quem traduz o mapa
para linguagem simples. Aplicar o mesmo tom aos **textos fixos das telas do app**:
- Guia, Tarot, Lua e Sonhos: trocar avisos repetidos de "simbólico/para refletir" por textos que expliquem o valor
  ("o Seu Guia traduz o seu mapa…").
- Manter: nenhuma promessa de resultado; sonhos como "leituras possíveis"; o aviso curto de que não substitui
  orientação profissional (perfil/rodapé); e, num lugar discreto (Perfil → Sobre), a informação de que as leituras
  são geradas com inteligência artificial, coerente com os Termos.
- **Não mexer** nas regras do prompt da IA nem em `knowledge/LEGAL_AND_EDITORIAL_NOTES.md`. Elas continuam valendo
  para o que a IA escreve.
- Atualizar `tests/e2e/flow.mjs` se algum texto checado mudar.

### Passo 5b: login com Google (se "LOGIN GOOGLE: sim")
Implementar a parte 3.2 de `docs/PLANO_LOGIN_GOOGLE.md` (botão atrás de `NEXT_PUBLIC_GOOGLE_AUTH`, textos do mesmo
e-mail, nome de exibição, Política de Privacidade, teste unitário). Depois, pedir ao Guilherme para criar
`NEXT_PUBLIC_GOOGLE_AUTH=1` na Vercel, fazer redeploy e seguir o teste manual da seção 4 do plano. Se for "não",
perguntar se ele quer agora ou depois.

### Passo 5c: conferências de lançamento
- Links de entrega da Cakto (se "não" na mensagem): lembrar o Guilherme de preencher `<app>/auth/sign-up`.
- Leitura do mapa em blocos: com a IA real, abrir o Mapa e conferir que a leitura vem com "Seus pontos fortes",
  "Seus desafios" e "No amor" (prompt `natal_summary@3`). Se o modelo não seguir o formato, ajustar o prompt.

### Passo 6: precisão (opcional, depende de rede)
- Se `ssd.jpl.nasa.gov` estiver liberado: `npm run benchmark:fetch-jpl`, `npm run benchmark` e atualizar
  `docs/BENCHMARK.md` (fonte de cada resultado documentada; tolerâncias aprovadas, nunca afrouxadas).
- Se estiver bloqueado: informe e pule. O modo DE440 só se o Guilherme pedir.

### Passo 7: validar e entregar
1. `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:landing`, e o e2e do app se o harness estiver
   disponível (`tests/e2e/harness/start.sh`).
2. Atualizar `docs/HANDOFF_COWORK.md` (status), `docs/DECISIONS.md` e este arquivo, se algo mudou.
3. Commit, push e um Pull Request por rodada. O Guilherme faz o merge.
4. **Mandar no chat os .md atualizados** (`HANDOFF_COWORK.md`, `SETUP.md`, `landing/README.md` e este), como o
   Guilherme pediu.
5. Depois do merge, conferir a landing no ar (`curl` do HTML: `og:image` completo, `config.js` com os dados reais).

### Passo 8: checklist de lançamento (mostrar ao Guilherme)
- [ ] Diagnóstico do Passo 1 todo ✅
- [ ] Landing com os dois checkouts, e-mail, pixel e UTMify; Astarot abre com o bump, Astarot Love abre o próprio (clique do Guilherme)
- [ ] Telas reais do app na landing
- [ ] Compra real feita: Astarot libera; upgrade dentro do app libera o Amor na hora; Astarot Love libera tudo; reembolso bloqueia
- [ ] Vercel Pro (o plano Hobby é para uso não comercial): decisão do Guilherme
- [ ] Nome Astarot conferido no INPI: decisão do Guilherme

---

## 3. Depois do lançamento: só quando o Guilherme pedir

São funcionalidades do roteiro original (`docs/MASTER_PROMPT.md`) que ficaram fora do MVP. Cada uma vira uma
rodada própria, com plano curto aprovado antes de começar:
- **Jornadas:** sequências guiadas de alguns dias (por exemplo, "conhecer meu mapa em 7 dias"), com progresso salvo.
- **Manifestação e gratidão:** registro de intenções e gratidão ligado às fases da Lua (hoje existe só a intenção
  do dia na tela da Lua).
- **Modo DE440:** Plutão ≤ 5″ e teste mais rigoroso da Lua.
