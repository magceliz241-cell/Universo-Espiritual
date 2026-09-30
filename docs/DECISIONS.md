# Registro de decisões

## Fase 1 — POC do XALEN (2026-09-30)

**Feito**
- Scaffold Next.js 16.3.8 (App Router, React 19, TS, Tailwind 4, ESLint) + Vitest 5.
- `scripts/build-xalen.sh`: clona o XALEN no commit `cc6edbec1f748ebdc4950ae6198f575c5ada73fa`, verifica que o
  crate não comercial `xalen-stars-hip-data` **não** está na árvore, compila `xalen-wasm` com
  `--no-default-features` e gera o glue com `wasm-bindgen 0.2.129 --target web`.
- Artefato versionado em `vendor/xalen-wasm/` (substituído na Fase 2 por `vendor/su-ephem/`, ver abaixo) (+ LICENSE, NOTICE, BUILD_INFO.json com sha256), consumido como
  dependência local `xalen-wasm` (`file:vendor/xalen-wasm`). A Vercel não precisa de Rust.
- `src/lib/astro/xalen-loader.ts`: lê o `.wasm` do disco e chama `initSync` uma vez por processo.
- Rota de smoke test `GET /api/health/engine`.

**Decisões**
- *Glue `--target web` em vez de `--target nodejs`:* o glue nodejs usa `__dirname` + `readFileSync`, e o Turbopack
  (padrão no Next 16) reescreve `__dirname` (`/ROOT/...`, ENOENT no build). Com `initSync` + bytes lidos por
  `process.cwd()` e `outputFileTracingIncludes`, o carregamento fica explícito e independe do bundler.
- *Build reprodutível:* duas execuções geraram o mesmo sha256
  (`86e9fa9f8fd539d08655872756ce3f0fcac3cd98aa68cbc1ba8e53b40e28056b`).
- *Referência do POC:* valores "J2000 JPL" citados em `docs/ACCURACY.md` do XALEN (segunda mão, 4 casas decimais).
  O benchmark da Fase 8 exige consultas próprias ao JPL Horizons.

**Medições (next start local, Node 22)**
- `.wasm`: 1,16 MB. Init (leitura + compilação + instância): ~4,3 ms. Cálculo de uma longitude: ~0,2 ms (quente).
- J2000: Sol 280,36903° (JPL citado 280,3689°, ~0,5″); Lua 223,32353° (JPL citado 223,3238°, ~1″).

**Riscos / pendências**
- A rede deste ambiente bloqueia `ssd.jpl.nasa.gov` e `download.geonames.org`: as fixtures JPL (Fase 8) e a
  importação de cidades dependem de liberar esses domínios.

## Fase 2 — Motor do mapa (2026-09-30)

**Achado que mudou a integração.** `xalen_houses::compute_houses` (usado pelo `housesJson` do binding oficial) calcula
o RAMC com tempo sideral **médio** (GMST) e o binding passa a obliquidade **média**, enquanto os planetas do XALEN são
**aparentes** (equinócio verdadeiro de data). Medição com 20 000 mapas por faixa (1900–2100), comparando com RAMC por
GAST + obliquidade verdadeira:

| |lat| | máx ASC | máx MC | máx cúspides Placidus |
|---|---|---|---|
| 0°–60° | 0,019° | 0,005° | 0,019° |
| 60°–66° | 0,135° | 0,005° | 0,135° |

Com o binding oficial, o ASC **estouraria a tolerância aprovada (0,01°)**. Correção, seguindo a recomendação da própria
documentação de `compute_houses`: RAMC a partir de `xalen_coords::gast_rad` + obliquidade verdadeira
(`mean_obliquity + nutation_2000b.delta_epsilon`) e `compute_houses_from_ramc`.

**Decisão: wrapper próprio `engine/` (crate `su-ephem`).**
- Crate Rust fino que depende dos crates do XALEN por git + commit fixado (`cc6edbe`), todos com
  `default-features = false` (o script falha se `xalen-stars-hip-data` entrar na árvore).
- Não reimplementa astronomia: posições via `Almanac::geocentric_ecliptic/geocentric_speed` e casas via
  `compute_houses_from_ramc`, tudo do XALEN. Acrescenta apenas a escolha do referencial das casas e um JSON único.
- Expõe `chartJson`, `bodyJson`, `engineInfoJson`. Casas em **graus** (o binding oficial devolvia radianos) e
  `effective_system = "porphyry"` quando o fallback polar do XALEN é usado (o oficial continuava dizendo "Placidus").
- Inclui Black Moon Lilith média (`Body::MeanApogee`), que o binding oficial não expunha.
- Nome sem "XALEN" (TRADEMARK.md). Artefato em `vendor/su-ephem/` com XALEN-LICENSE e XALEN-NOTICE.
- `vendor/xalen-wasm/` removido.

**TypeScript (`src/lib/astro/`)**
- `types.ts`, `engine.ts` (interface `EphemerisEngine`), `xalen-engine.ts` (única implementação), `ephem-loader.ts`.
- `time.ts`: local + fuso IANA → UTC com a base do Node (Intl/ICU). Horário inexistente → `nonexistent_local_time`;
  ambíguo → `ambiguous_local_time` com as duas opções, resolvido por `fold`. Anos 1800–2100.
- `zodiac.ts`: signo/grau/min/seg por **truncamento** (nunca 30°00′00″), longitude completa preservada.
- Horário desconhecido: cálculo ao meio-dia local, sem casas/ângulos, `house: null` nos corpos e
  `moon_sign_range` (signos da Lua nas 24 h em torno do meio-dia).
- `input_hash` = sha256(data, hora, fuso, lat, lon, instante UTC, zodíaco, sistema de casas, commit XALEN,
  versão do wrapper, método, `CHART_METHODOLOGY_VERSION`).
- `validation.ts`: schema zod para input do cliente.

**Testes:** 41 (Vitest) + 4 (cargo test no wrapper): DST BR histórico, lacuna/ambiguidade BR e EUA, fusos de meia
hora, 00:00/23:59, bissextos, anos fora do intervalo, fuso inválido, 0°/29°59′59″/30°, casa atravessando 0°,
Placidus/Equal/Whole Sign, 65° N sem fallback, 78° N com fallback, determinismo/hash, coordenadas inválidas.

**Medições:** init do WASM ~3 ms; mapa completo (14 corpos + casas) ~11 ms quente no `next start` local.

**Riscos:** ΔT do modelo SMH2016 embutido no XALEN; UT1 aproximado por UTC (< 0,9 s, desprezível). Benchmark
contra JPL (Fase 8) ainda depende de liberar `ssd.jpl.nasa.gov` na rede do ambiente.

## Fase 3 — Aspectos e sinastria (2026-09-30)

- `src/lib/astro/aspects.ts` (`aspects-1.0.0`): 5 aspectos maiores. Orbes só em configuração:
  natal conj/opos 8°, trígono/quadratura 7°, sextil 5°, +2° com Sol/Lua, teto 3° para pontos (nó verdadeiro,
  Quíron, Lilith) e 5° para ASC/MC. Sinastria: 6/6/5/5/4, +1° luminares, tetos 2° e 4°.
- Corpos: 10 planetas + nó verdadeiro, Quíron, Lilith média + ASC/MC (se houver horário). O nó médio fica fora para
  não duplicar o verdadeiro. Não há aspectos ângulo×ângulo nem ponto×ponto.
- Aplicativo/separativo pela velocidade do XALEN (orbe em +1 h); `null` quando há ângulo envolvido.
  Na sinastria é sempre `null` (não se aplica entre mapas fixos).
- Ordem determinística: orbe crescente e, no empate, pelo par.
- `src/lib/astro/synastry.ts`: aspectos cruzados A→B, sobreposição de casas nos dois sentidos (null se o mapa de
  destino não tem horário) e marcação `key_contact` pelos contatos de `knowledge/astrology/synastry.md`.
  **Sem score de compatibilidade.**
- `ASPECTS_VERSION` entra no `input_hash` do mapa.
- Testes: 53 no total (12 novos), incluindo fronteira de orbe, cruzamento de 0°, aplicativo/separativo, exclusões e
  sinastria com horário desconhecido.

## Fase 4 — Supabase, acesso e cidades (2026-09-30)

**Modelo de acesso (decisão do produto):** plano único **vitalício** + order bump de relacionamento **vitalício**,
também vendido dentro do app. Login por Supabase Auth com **confirmação de e-mail obrigatória** (modelo da skill
área de membros Cakto).

**Migrations** (`supabase/migrations/`, idempotentes):
1. `…0100_core.sql`: `profiles` (criado por trigger), `birth_profiles` (1 `self` por pessoa + parceiros),
   `birth_charts` (input normalizado, engine/commit/wrapper/método/zodíaco/casas/versão, JSON completo,
   `unique(user_id, input_hash)`, FK composta impedindo apontar para perfil de outra pessoa), `numerology_profiles`,
   `ai_generations` (tarefa, modelo, versões de prompt/KB, cache_key, tokens, latência, cache hit, erro),
   `tarot_readings`, `moon_journeys`, `dream_entries`, `usage_events`. RLS em todas, e `anon` sem acesso.
2. `…0200_memberships.sql`: `memberships` (`base`, `love`, pedidos, `revoked_order_ids`), `cakto_webhook_events`
   (sem segredo), funções `cakto_apply_purchase` / `cakto_apply_revocation` (só service_role), `my_access()`
   (só a própria pessoa), trigger que liga a compra à conta **só quando o e-mail é confirmado**.
   Regras: bump antes do principal não libera nada; reembolso do principal remove tudo; reembolso do bump remove
   só `love`; pedido revogado não reativa; reembolso antes da compra bloqueia aquele pedido.
3. `…0300_cities.sql`: `cities` (GeoNames) com `pg_trgm`, `search_cities()` (prefixo por população e depois similaridade),
   leitura pública.

**App**
- `src/proxy.ts` (o antigo middleware, renomeado no Next 16) → `lib/supabase/proxy.ts`: renova a sessão, valida o JWT
  (`getClaims`), consulta `my_access()` e define os cabeçalhos internos `x-su-access/x-su-tier/x-su-user` (os que vêm do
  navegador são apagados). Sem login → `/auth/login?next=`; sem compra → `/acesso`; sem Supabase configurado →
  bloqueia (falha fechada). `SU_DEV_FAKE_ACCESS` só vale em `next dev`.
- Auth: `/auth/sign-up`, `/auth/login` (com "reenviar confirmação"), `/auth/forgot-password`,
  `/auth/update-password`, `/auth/confirm` (`verifyOtp` com `token_hash`), `/auth/callback`, `/auth/logout`,
  `/auth/error`, `/acesso`. `safeNext` bloqueia redirecionamento externo.
- Webhook Cakto `/api/webhooks/cakto`: segredo no corpo ou header, comparação em tempo constante, classificação **por
  ID** (`CAKTO_MAIN_IDS` / `CAKTO_LOVE_IDS`), plano + bump no mesmo evento ou separados, idempotente por `event_key`,
  500 em erro de banco (a Cakto tenta de novo). `GET` mostra só true/false.
- `lib/charts/service.ts`: `getOrCreateChart` procura pelo `input_hash` antes de calcular.
- Cidades: `/api/cities?q=`, `scripts/import-cities.ts` (CSV ou upsert via REST) com fixture de teste.
- Design tokens do `DESIGN_SYSTEM.md` em `globals.css` (Tailwind 4 `@theme`), Instrument Serif + Inter, componentes
  base (`Button`, `Card`, `Field`, `Notice`, `Wordmark`, `OrbitalDecoration`).

**Testes:** 18 de banco (Postgres 16 local + stub do Supabase) e 22 novos unitários (webhook, rotas, cidades).
Smoke no `next start` sem Supabase: rotas protegidas redirecionam para `/auth/error?reason=config`, e o webhook
responde 500 sem segredo configurado.

**Pendências:** e2e do fluxo de login com Auth real/simulado (Playwright), a planejar no polimento; e importar as
cidades de verdade (a rede daqui bloqueia `download.geonames.org`). O guia completo está em `docs/SETUP.md`.

## Fase 5 — Knowledge Base e recuperação por tarefa (2026-09-30)

- KB copiada para `knowledge/` (fonte editorial versionada no git).
- `scripts/build-knowledge.ts` gera `src/lib/knowledge/generated.ts` (181 documentos, ~160 KB) com o conteúdo embutido
  no código, o que dispensa leitura de arquivos em runtime na Vercel. As seções e linhas de fonte ("## Fonte…",
  "Referência…:") saem do texto enviado à IA e ficam em `sources`. `XALEN_INTEGRATION.md`, `SOURCES.md` e o README
  raiz não vão para a IA.
- `KNOWLEDGE_VERSION` = versão do `INDEX.json` + sha256 do conteúdo (ex.: `2.0+5486ad3b182f`). Qualquer edição na KB
  muda a versão e invalida o cache de IA. Um teste falha se `generated.ts` estiver fora de sincronia.
- `src/lib/knowledge/retrieve.ts`: recuperação **determinística** por tarefa (`natal_summary`, `love_profile`,
  `synastry`, `tarot_reading`, `numerology`, `moon_today`, `dream_analysis`), com orçamento de 14 000 caracteres e
  ordem de prioridade. Trabalha com ids de documento, e nunca envia a KB inteira. Sem pgvector: a KB é pequena e
  estruturada.
- `src/lib/tarot/deck.ts`: 78 cartas RWS (nomes PT-BR/EN, id da KB). `src/lib/dreams/`: 20 símbolos da KB com termos
  em português e extração por dicionário (limites de palavra: "mar" ≠ "marido", "casa" ≠ "casamento").
- Regras editoriais (`AI_CONTEXT_RULES` + `LEGAL_AND_EDITORIAL_NOTES`) expostas para o system prompt da Fase 6.
- Testes: 16 (sincronia, ausência de URLs no conteúdo, todos os mapeamentos resolvem, baralho completo, contexto
  por tarefa, orçamento, extração de símbolos).

## Fase 6 — Camada de IA (2026-09-30)

- Provedor único **Groq**, modelo `openai/gpt-oss-120b` (`GROQ_MODEL`), chamado via `fetch` na API compatível com
  OpenAI (`/chat/completions`), com `response_format: json_object` e `max_completion_tokens`. **Sem SDK**: uma
  requisição simples não justifica uma dependência nova. Nenhum parâmetro não confirmado (ex.: reasoning) é enviado.
- `src/lib/ai/`: `groq.ts` (timeout de 45 s e uma nova tentativa em 429/5xx), `prompts.ts` (system prompt com as regras
  inegociáveis + notas editoriais da KB, instruções e **versão por tarefa**), `context-builder.ts` (só dados
  calculados relevantes: **sem nome, e-mail, coordenadas, fuso, cidade ou data de nascimento**; na sinastria, "você"
  e "a outra pessoa"), `response-parser.ts` (JSON validado com zod + checagem editorial), `cache.ts`, `usage.ts`,
  `generate.ts` (orquestrador) e `server.ts` (sessão do usuário).
- Cache da IA **separado** do astronômico: chave = sha256(tarefa, hash do payload, versão do prompt, versão da KB,
  modelo). Tarot, sonhos e conversa não usam cache.
- Checagem editorial pós-geração (garantias, diagnósticos, previsões de morte/doença/dinheiro, porcentagem de
  compatibilidade): uma correção automática. Se falhar de novo, erro amigável e registro com `error`.
- Limite diário por pessoa (`AI_DAILY_LIMIT`, padrão 40 gerações reais em 24 h) para controle de custo.
- Observabilidade: `ai_generations` (tarefa, modelo, versões de prompt/KB, tokens, latência, erro) +
  `usage_events` com cache hit/miss. Nenhum segredo é registrado.
- Testes: 19 com Groq simulada (a rede daqui bloqueia `api.groq.com`), cobrindo formato da requisição, novas
  tentativas, ausência de PII no payload, cache, limite, correção editorial e erro registrado.

## Fase 7 — Funcionalidades e telas (2026-09-30)

**Cálculos (determinísticos, testados)**
- Numerologia pitagórica `numerology-pyth-1.0.0`: tabela explícita, acentos removidos de forma uniforme, Y como
  consoante, Caminho de Vida em 3 ciclos com mestres 11/22/33, Aniversário com 11/22, Ano Pessoal sem mestres
  (ciclo 1–9). O nome **não** é enviado à IA.
- Tarot `tarot-1.0.0`: Fisher–Yates com `node:crypto.randomInt`, orientação 50/50, sorteio no servidor e gravado em
  `tarot_readings` antes de qualquer IA. Tarot do amor exige o bump.
- Lua `moon-1.0.0`: fase pela elongação Sol–Lua (setores de 45°), iluminação por `(1 − cos β·cos Δλ)/2`, instantes das
  próximas fases por iteração sobre as posições XALEN. Validado contra o USNO (jan/2024, < 3 min).

**Telas** (design system aplicado: fundo escuro, serif para astrologia, sans para interface, dourado como acento,
violeta para interação, ícones de linha, glifos em Noto Sans Symbols com `U+FE0E` para não virarem emoji):
Início (observatório pessoal), Mapa (roda SVG gerada no servidor, seletor discreto Placidus/Whole Sign/Equal,
posições, aspectos, casas), Amor (planetas do encontro, perfil amoroso), Mapa do casal (outras pessoas, conexões
sem score), Tarot (cartas tipográficas próprias, animação de virar, `prefers-reduced-motion`), Numerologia (número
principal dominante, palavras-chave da KB), Lua (lua desenhada pela iluminação real e pelo hemisfério, intenção e
diário), Sonhos (relato, emoções, símbolos da KB, histórico), Seu Guia (consulta, não chat genérico), Perfil
(nascimento, pessoas, acesso, créditos XALEN/GeoNames e avisos). Oferta do bump dentro do app com checkout e
`?email=` preenchido. Estados vazios, de carregamento e de erro com a voz do produto.

**Segurança:** toda ação de servidor chama `requireMember()`; as de amor conferem `tier === "love"`. As
interpretações recalculam/releem os dados no servidor (o navegador só informa *qual* leitura). Os dados vêm do banco
com RLS.

**Ambiente de ponta a ponta** (`tests/e2e/harness/`): Postgres + PostgREST 12.2.3 + gateway que imita a API de Auth
do Supabase (cadastro, login, confirmação por `token_hash`, recuperação, caixa de saída de e-mails) + Groq simulada.
`tests/e2e/flow.mjs` (Playwright, Chromium): **65/65 verificações**, cobrindo cadastro → confirmação → sem
compra `/acesso` → webhook libera → nascimento com busca de cidade → mapa → Guia → Whole Sign → oferta do bump →
bump libera sem sair → Tarot → Numerologia → Lua (persistência) → Sonhos (símbolos + leitura salva) → Guia →
Sinastria com pessoa sem horário → Perfil → 13 páginas × 390/1280 px sem erro, sem `undefined/NaN` e sem rolagem
lateral → reembolso bloqueia. Zero erros de JavaScript no navegador.

Achados corrigidos pelo e2e: arquivo `"use server"` exportando constante (quebrava `/sonhos`), grade sem colunas
definidas estourando a largura no celular (Sinastria/Aspectos).
