# Seu Universo — Fase 0: Auditoria e Plano Técnico

> Data: 2026-09-30 · Status: **aguardando autorização para a Fase 1**
> Fontes: `SEU_UNIVERSO_CLAUDE_CODE_CONTEXT_v2.zip` (master prompt + Knowledge Base v2.0) e `docs/DESIGN_SYSTEM.md`

---

## 1. O produto (entendimento)

Plataforma de espiritualidade/esoterismo com acesso imediato e área de membros,
que funciona como uma **caixa de ferramentas personalizada** e não como uma biblioteca de ebooks.
Os módulos são: perfil pessoal, mapa astral, perfil amoroso, sinastria, Tarot,
numerologia, Lua, sonhos, manifestação/gratidão/intenção, jornadas e assistente de IA.

Princípio central, a hierarquia de confiança:

1. **Software calcula** posições, casas, aspectos, números, fases e sorteios, de forma determinística.
2. **Metodologia versionada** define como cada cálculo é feito.
3. **Knowledge Base** fornece o conteúdo interpretativo (síntese própria, não cópia).
4. **IA (Groq / `openai/gpt-oss-120b`)** apenas interpreta, sintetiza e conversa. Nunca calcula nem sorteia.

Tom editorial: sistemas simbólicos, nunca ciência causal, sem diagnóstico e sem promessas
(cura, dinheiro, reconciliação etc.).

### Knowledge Base recebida (199 arquivos, ~150 KB)

| Domínio | Conteúdo |
|---|---|
| Astrologia | metodologia, 12 signos, 10 planetas, 12 casas, 5 aspectos, sinastria |
| Tarot | metodologia, 22 Maiores, 56 Menores, 3 tiragens (carta do dia, pergunta aberta, amor 3 cartas) |
| Numerologia | metodologia, números 1–9 + 11/22/33, 5 cálculos |
| Lua | metodologia, 8 fases |
| Sonhos | metodologia, 20 símbolos |
| Regras | AI_CONTEXT_RULES, LEGAL_AND_EDITORIAL_NOTES, SOURCES, XALEN_INTEGRATION |

Observações sobre a KB:
- Os arquivos dos símbolos de sonho estão em inglês (títulos e slugs, ex.: `# Snake`). O restante está em PT-BR.
- As cartas dos Menores são **templates** (texto genérico por naipe/posição). Servem como estrutura, mas
  o conteúdo interpretativo é raso. Vale uma revisão editorial antes do lançamento.
- Não existe KB para **manifestação, gratidão/intenção e jornadas**. Esse conteúdo ainda precisa ser escrito.
- Não há imagens de Tarot. Pela regra legal, não podemos baixar imagens de terceiros, então precisamos de arte própria ou licenciada.

---

## 2. Arquitetura atual

O repositório `Universo-Espiritual` está **vazio**: só tem `README.md` e um commit inicial.
Não existe Next.js, Supabase, `package.json` nem código. O master prompt diz que a stack é
"já existente/preferencial", mas ela não está neste repositório. Decisão: começar do zero (§9).

Ambiente verificado: Node 22.22, cargo/rustc 1.97 e alvo `wasm32-unknown-unknown` instalável.

---

## 3. Auditoria XALEN (verificada no código-fonte, não só no README)

**Commit auditado:** `cc6edbec1f748ebdc4950ae6198f575c5ada73fa` (2026-07-03), workspace `0.6.0`, sem tags.

### 3.1 Publicação
- **Nada está publicado** em npm/PyPI/crates.io para a linha 0.6. No crates.io só existe a 0.3.1.
- `npm install xalen` / `npm install xalen-ephemeris` **não devem ser usados**: os nomes ainda não foram
  publicados pelo projeto e podem vir a ser ocupados por terceiros.
- Conclusão: **build a partir do fonte, fixado no commit acima**.

### 3.2 Licença (resultado)
| Item | Licença | Uso comercial |
|---|---|---|
| Código XALEN (todos os crates de engine) | Apache-2.0 | ✅ permitido, inclusive fechado |
| `xalen-coords` (porte de ERFA) | Apache-2.0 **AND** BSD-3-Clause | ✅ preservar aviso BSD |
| `xalen-stars-hip-data` (catálogo Hipparcos) | **CC-BY-NC-3.0-IGO** | ❌ **proibido** |
| VSOP87 / ELP2000 / DE440 / IAU | créditos no NOTICE | ✅ com atribuição |

⚠️ **Ponto crítico:** a feature `hip-catalog` é **ligada por padrão** no `xalen-wasm`/`xalen-node`.
**Toda build do Seu Universo deve usar `--no-default-features`.** Isso já foi testado e compila
(ver 3.4). Estrelas fixas não fazem parte do MVP, então não perdemos nada.

Outros pontos de licença:
- O `COMMERCIAL_LICENSE.md` confirma que Apache-2.0 basta para uso comercial. A licença paga só remove
  a obrigação de NOTICE e acrescenta garantia/suporte. **Não precisamos dela.**
- **Marca (`TRADEMARK.md`):** não podemos usar "XALEN" no nome de produto, pacote ou domínio, nem dizer
  "XALEN Validated/Certified". Dizer "construído com XALEN Ephemeris" é permitido.
  Nosso wrapper interno não deve se chamar `xalen-*`.
- Obrigação: manter `LICENSE` + `NOTICE` do XALEN junto do artefato distribuído. Como o WASM roda só no
  servidor, não há distribuição ao cliente, mas vamos manter os arquivos em `vendor/` do mesmo jeito.

**Nenhum bloqueio de licença** desde que `--no-default-features` seja respeitado.

### 3.3 API realmente disponível no binding WASM (`crates/xalen-wasm`)
| Necessidade do MVP | Disponível? | Observação |
|---|---|---|
| Longitude tropical dos 10 planetas | ✅ `tropicalLongitude(jd, id)` | ids 0–8, Plutão = 11 |
| Velocidade / retrógrado | ✅ `planetPositionJson(jd, id, false, 0)` | `lon_speed`, `is_retrograde` |
| Mean / True Node, Chiron | ✅ ids 9, 10, 12 | |
| ASC, MC, cúspides, Placidus | ✅ `housesJson(jd, lat, lon, 2)` | **retorna em RADIANOS** |
| Fallback polar | ✅ `fallback_used: true` (Porphyry) | o campo `system` **continua "Placidus"** |
| Aspectos | ❌ não exposto no WASM | existe em `xalen-western`, sem binding |
| Black Moon Lilith | ❌ não exposto no WASM | existe no core |
| Fase / iluminação lunar | ❌ não exposto | derivável da elongação Sol–Lua |
| Julian Day | ✅ `julianDay(y, m, d, h)` | espera **UT** |

Detalhe de precisão: `housesJson` usa **obliquidade média** (sem nutação). O efeito no ASC/MC é da
ordem de segundos de arco, irrelevante para astrologia, mas o benchmark precisa registrar isso.

### 3.4 Prova de viabilidade (feita na auditoria, fora do repositório)
- `cargo build -p xalen-wasm --release --target wasm32-unknown-unknown --no-default-features`
  compila em **~23 s** e gera um **`.wasm` de 1,25 MB** (antes do wasm-bindgen/wasm-opt).
- Sanidade em J2000.0 (build nativa do mesmo código): Sol 280,369°, Lua 223,3235° (o relatório do
  XALEN dá 223,3235 vs DE440 223,3238, diferença de 0,95″), Marte 327,963°. Placidus em São Paulo ok;
  Tromsø (69,65° N) aciona o fallback corretamente.
- `wasm-bindgen` travado em **0.2.129** no `Cargo.lock`. O `wasm-bindgen-cli`/`wasm-pack` precisa ser dessa versão.

---

## 4. Arquitetura proposta

Monólito Next.js (App Router), sem microserviço.

```text
Next.js (App Router, TS) ── Vercel
│
├─ app/(marketing)            landing
├─ app/(app)/...              área de membros (dashboard, mapa, amor, tarot, …)
├─ app/api/... / Server Actions   validação zod no servidor
│
├─ src/lib/astro/
│   ├─ engine.ts              interface EphemerisEngine + tipos BirthData/BirthChart
│   ├─ xalen-engine.ts        XalenEphemerisEngine (único arquivo que conhece o XALEN)
│   ├─ time.ts                local + IANA tz → UTC → JD (DST, gaps/overlaps explícitos)
│   ├─ zodiac.ts              longitude → signo/grau/min/seg
│   ├─ aspects.ts             detector + orbs em config
│   ├─ synastry.ts            aspectos cruzados A→B, planetas nas casas do outro
│   ├─ moon.ts                fase/iluminação/instantes (a partir de longitudes XALEN)
│   └─ config.ts              orbs, house_system padrão, versões de metodologia
├─ src/lib/numerology/        pitagórico, versionado, tabela letra→número explícita
├─ src/lib/tarot/             78 cartas RWS + crypto.getRandomValues / randomInt
├─ src/lib/knowledge/         índice gerado da KB (id, caminho, tags) + retrieval por tarefa
├─ src/lib/ai/                groq.ts, prompts.ts, context-builder.ts, response-parser.ts, cache.ts, usage.ts
├─ src/lib/supabase/          clients server/browser, tipos gerados
│
├─ knowledge/                 a KB (markdown), versionada no git
├─ vendor/xalen-wasm/         artefato WASM pré-compilado + LICENSE + NOTICE + BUILD_INFO (commit)
└─ scripts/build-xalen.sh     reproduz o artefato a partir do commit fixado
```

### 4.1 Método de integração XALEN → Next.js (recomendado)
1. Compilar **`xalen-wasm` sem modificações**, com `--no-default-features`, via
   `wasm-bindgen --target nodejs` (+ `wasm-opt` se disponível), a partir do commit fixado.
2. **Versionar o artefato pronto** em `vendor/xalen-wasm/` com `BUILD_INFO.json`
   (commit, flags, versão do wasm-bindgen, sha256 do .wasm). A Vercel **não precisa de Rust** no build,
   o que evita um "hack frágil".
3. Carregar só em rotas `runtime = "nodejs"` (nunca no Edge nem no cliente) e instanciar uma única vez por
   processo. O custo de cold start precisa ser medido na Fase 1.
4. **Motor analítico apenas** (VSOP87/ELP2000). Sem DE440 e sem download de 32 MB. A precisão publicada
   (Lua RMS ~2,8″, planetas < 3″) sobra para astrologia, onde a resolução exibida é de 1′.
5. O que o WASM não expõe (aspectos, fase lunar) é calculado **em TypeScript determinístico** sobre as
   longitudes do XALEN. É geometria simples, testável e com orbs configuráveis, e não precisa de
   um fork em Rust. Lilith fica fora do MVP (é opcional no prompt).

   *Alternativa* se no futuro precisarmos de Lilith ou de aspectos via `xalen-western`: um crate wrapper
   **nosso** (nome sem "xalen") dependendo dos crates por git+rev. Não recomendo agora, porque aumenta a
   manutenção em Rust.

6. O restante do app só conhece `EphemerisEngine`. `XalenEphemerisEngine` converte radianos → graus,
   registra o `house_system` **efetivo** (ex.: `placidus→porphyry (polar fallback)`), a versão (commit)
   e `method: "analytical"`.

### 4.2 Tempo e fuso
- Input: `{date, time, timezone(IANA), latitude, longitude}`, validado com zod no servidor.
- Conversão com a base IANA via `Intl` (ICU do Node 22). Horários **inexistentes** (gap de DST) e
  **ambíguos** (overlap) retornam erro/pergunta explícita e nunca são resolvidos em silêncio.
  O Brasil teve horário de verão com regras variáveis até 2019, e esse é um caso de teste obrigatório.
- UTC → JD. O XALEN pede UT1; a diferença UT1−UTC (< 0,9 s) é desprezível e será documentada.
- Horário desconhecido: mapa sem casas/ASC/MC (flag `time_known: false`) e Lua com aviso de faixa possível.

### 4.3 Dados (Supabase, todas com RLS `user_id = auth.uid()`)
`profiles`, `birth_profiles`, `birth_charts` (input normalizado, tz, coords, engine, engine_version,
method, zodiac, house_system, chart_json, `input_hash` único), `numerology_profiles`, `tarot_readings`,
`moon_journeys`, `dream_entries`, `ai_generations` (task, model, prompt_version, knowledge_version,
tokens, latency_ms, cache_hit, erro), `usage_events`.

- Cache de mapa: `sha256(data|hora|tz|lat|lon|zodiac|house_system|engine_version|method)`.
- Cache de IA **separado**: `sha256(task|input|prompt_version|knowledge_version|model)`.
- `service_role` só no servidor, e `GROQ_API_KEY` só no servidor.

### 4.4 Knowledge retrieval
Sem pgvector no MVP. A KB é pequena e bem estruturada, então um **índice gerado no build**
(`id → caminho, domínio, tags`) resolve com retrieval determinístico por tarefa. Exemplo:
`love_profile` → signos de Sol/Lua/Vênus/Marte + planetas Vênus/Marte/Lua + casas 5/7 + aspectos envolvidos.
Sonhos: extração de símbolos por dicionário de sinônimos PT-BR→slug; a IA só entra como extrator
opcional, com saída validada contra a lista de símbolos existentes.
pgvector só entra se o retrieval por regras se mostrar insuficiente.

---

## 5. Dependências novas (propostas, cada uma a confirmar versão/licença na instalação)

| Pacote | Motivo | Licença esperada |
|---|---|---|
| `next`, `react`, `react-dom`, `typescript` | stack definida | MIT |
| `@supabase/supabase-js`, `@supabase/ssr` | auth + db | MIT |
| `zod` | validação no servidor | MIT |
| `groq-sdk` | cliente oficial Groq (ou `fetch` direto, a decidir) | Apache-2.0 |
| `vitest` | testes | MIT |
| `tailwindcss` | UI | MIT |
| XALEN (vendorizado, não é pacote npm) | motor astronômico | Apache-2.0 (+BSD-3 ERFA) |
| **dev/CI**: `wasm-bindgen-cli 0.2.129`, `binaryen` (wasm-opt, opcional) | build do artefato | MIT/Apache-2.0 |

Sem Luxon/date-fns-tz a princípio (`Intl` resolve). Só adicionamos se os testes de DST mostrarem necessidade.

---

## 6. Riscos

| # | Risco | Mitigação |
|---|---|---|
| R1 | XALEN é **alpha**, sem release/tag e com mudanças frequentes | fixar commit, vendorizar artefato, testes de regressão com fixtures |
| R2 | Build padrão inclui dado **não comercial** | `--no-default-features` obrigatório e um teste que falha se o símbolo do catálogo HIP existir |
| R3 | Unidades inconsistentes (casas em rad, planetas em graus) e `system` não reflete o fallback | adapter único + testes específicos |
| R4 | Obliquidade média nas casas | medir no benchmark e documentar a tolerância |
| R5 | Cold start do WASM na Vercel | medir na Fase 1, instância única por processo |
| R6 | Fuso/DST históricos errados geram mapa errado | testes de borda Brasil (DST pré-2019), gaps/overlaps explícitos |
| R7 | Geocodificação (cidade → lat/lon/tz) | base própria GeoNames (§10) |
| R8 | JPL não fornece casas/ASC/MC | referência independente das fórmulas + tempo sideral do Horizons, com Swiss só como comparação externa manual (§11) |
| R9 | KB incompleta (manifestação/jornadas) e Menores genéricos | trilha editorial paralela |
| R10 | IA gerar linguagem causal/promessas | system prompt com regras editoriais + checagem pós-geração de termos proibidos |
| R11 | Marca XALEN | não usar o nome em produto/pacote, apenas "construído com XALEN Ephemeris" |

---

## 7. Plano de fases

Cada fase termina com testes + build + registro de decisões/riscos em `docs/DECISIONS.md` e só avança depois disso.

| Fase | Entrega | Critério de pronto |
|---|---|---|
| **0 — Auditoria** | este documento | ✅ concluída |
| **1 — XALEN POC** | scaffold Next.js+TS mínimo, `scripts/build-xalen.sh`, `vendor/xalen-wasm/` (commit fixado, sem HIP), teste Node chamando `tropicalLongitude` | posição do Sol/Lua em J2000 dentro de 1″ do valor publicado; medir tempo de init e tamanho |
| **2 — Chart engine** | `EphemerisEngine`, `XalenEphemerisEngine`, `time.ts`, `zodiac.ts`; 10 planetas + nós + Chiron, retrógrado, ASC/MC, 12 cúspides Placidus, fallback registrado | JSON do mapa no formato do §10 do master prompt; determinismo (mesmo input → mesmo hash/JSON) |
| **3 — Aspectos** | `aspects.ts` com orbs em config (5 maiores), `synastry.ts` | testes de fronteira de orbe, 0°/360°, aspecto aplicativo/separativo |
| **4 — Supabase** | migrations + RLS + tipos, persistência de `birth_charts` com `input_hash`, auth | RLS testada (usuário A não lê B), cache hit comprovado |
| **5 — Knowledge** | KB em `knowledge/`, índice gerado, retrieval por tarefa (`natal_summary`, `love_profile`, `synastry`, `tarot_reading`, `numerology`, `moon_today`, `dream_analysis`) | snapshot tests do contexto montado por tarefa (nunca a KB inteira) |
| **6 — IA** | `src/lib/ai/*` com Groq `openai/gpt-oss-120b`, prompts versionados, cache separado, `usage` + `ai_generations` | chamada real com logs de tokens/latência; secrets fora do bundle do cliente |
| **7 — Features** | numerologia (pitagórico versionado), Tarot (RNG cripto, 78 cartas, 3 tiragens), Lua (fase/iluminação/instantes), sonhos, mapa (roda SVG), amor/sinastria, dashboard | testes unitários de cada cálculo; fluxos ponta a ponta |
| **8 — Benchmark** | 50+ fixtures (DST, altas latitudes, cúspides de signo, 00:00/23:59, bissextos, polares, inválidos) vs JPL Horizons/DE440 | tolerâncias aprovadas (ver §11), com máx/média/RMS/p95/p99 por grandeza |
| **9 — Polimento** | UX, performance, segurança (headers, rate-limit da IA), deploy Vercel, `THIRD_PARTY_NOTICES.md` | checklist da "Definição de pronto" do master prompt |

Trilhas paralelas (não bloqueiam as fases): conteúdo de manifestação/gratidão/jornadas, revisão dos
Menores, arte própria do Tarot e identidade visual.

---

## 8. Arquivos a criar/alterar (visão geral)

- **Fase 1:** `package.json`, `tsconfig.json`, `next.config.ts`, `app/` mínimo, `scripts/build-xalen.sh`,
  `vendor/xalen-wasm/{xalen_wasm.js,xalen_wasm_bg.wasm,xalen_wasm.d.ts,LICENSE,NOTICE,BUILD_INFO.json}`,
  `tests/xalen-poc.test.ts`, `docs/DECISIONS.md`, `.env.example`, `.gitignore`.
- **Fases 2–3:** `src/lib/astro/*`, `tests/astro/*`.
- **Fase 4:** `supabase/migrations/*.sql`, `src/lib/supabase/*`, `middleware.ts`.
- **Fase 5:** `knowledge/**` (da KB recebida), `scripts/build-knowledge-index.ts`, `src/lib/knowledge/*`.
- **Fase 6:** `src/lib/ai/*`.
- **Fase 7:** `src/lib/{numerology,tarot}/*`, `app/(app)/**`, `components/**`.
- **Fase 8:** `tests/fixtures/charts/*.json`, `tests/benchmark/*`, `docs/BENCHMARK.md`.
- **Fase 9:** `THIRD_PARTY_NOTICES.md`, `README.md`.

---

## 9. Decisões registradas (respostas de 2026-09-30)

| # | Pergunta | Decisão |
|---|---|---|
| Q1 | Código/Supabase existentes? | **Nada criado.** Começamos do zero neste repositório, com projeto Supabase novo. |
| Q2 | Acesso/pagamento | **Plano único** na landing + **order bump** que libera as **áreas de relacionamento**. Checkout Cakto (produto ainda não criado). Login e liberação seguem o modelo da skill *área de membros Cakto*: Supabase Auth com **confirmação de e-mail obrigatória**, webhook Cakto → `memberships`, vínculo da compra só após o e-mail ser confirmado. |
| Q3 | Geocodificação | **Base própria de cidades** (ver §10). |
| Q4 | Sistema de casas | **Placidus** pré-selecionado; **Whole Sign** e **Equal** como opções avançadas discretas (DESIGN_SYSTEM §14). |
| Q5 | Swiss Ephemeris | Só como **comparação secundária externa** durante o desenvolvimento (ver §11). |
| Q6 | Tolerâncias | Aprovadas com ajustes (ver §11). |

Design: `docs/DESIGN_SYSTEM.md` é a especificação visual obrigatória (paleta, tipografia, componentes,
motion, acessibilidade). Nenhuma tela é criada sem segui-lo.

### 9.1 Impacto de Q2 no desenho de acesso
- Níveis: `base` (plano principal) e `love` (bump de relacionamento: perfil amoroso, sinastria, Tarot do amor).
  Os níveis são liberados por **ID de produto/oferta Cakto**, nunca por valor.
- O servidor decide o acesso (middleware + headers internos, como na skill). Páginas de amor sem o bump
  mostram a oferta, e o conteúdo exclusivo nunca vai para o bundle do cliente.
- Reembolso/chargeback de cada pedido é tratado separadamente (reembolso só do bump remove só `love`).
- Pendente (perguntar na Fase 4): duração do acesso do plano principal (tempo limitado ou vitalício?), e se
  existe upgrade dentro do app para quem comprou sem o bump.

## 10. Base própria de cidades (proposta)

- Fonte: **GeoNames** (`cities1000` + todos os lugares povoados do Brasil), licença **CC-BY 4.0**
  (exige atribuição em `THIRD_PARTY_NOTICES.md` e na tela "sobre"). Já traz lat/lon e **timezone IANA** por cidade.
  A licença e o formato serão reconfirmados no momento da importação.
- Armazenamento: tabela `cities` no Supabase (nome, nome sem acento, estado/região, país, lat, lon, timezone,
  população) com busca por prefixo/trigram (`pg_trgm`). Leitura pública, escrita só via script de importação.
- Script de importação versionado (`scripts/import-cities.ts`), com a data do dump registrada.
- O fuso sempre vem da cidade escolhida (e não do navegador), e o usuário vê "Horário local de <cidade>".

## 11. Política de validação astronômica (aprovada)

```
XALEN                → produção (único motor no runtime)
JPL Horizons/DE440   → oracle astronômico principal
Swiss Ephemeris      → comparação secundária externa, só durante o desenvolvimento
```

**Regras da Swiss Ephemeris:**
- Nada de código, pacote, binário, arquivo de dados ou saída bruta dela no repositório, nas dependências,
  no build, no runtime ou na distribuição. Isso vale inclusive para dependências de dev.
- Uso permitido: consulta **externa e manual** de casos pontuais (ex.: quando XALEN e JPL divergem, ou para
  casas, que o JPL não fornece). O benchmark registra a fonte de cada valor.
- **Instalar `pyswisseph`/`swetest` localmente, mesmo fora do repositório, fica suspenso**: rodar o software
  pode configurar uso sob a licença dele (AGPL/profissional). Se isso for necessário, paro e te consulto antes.
  Consultas automatizadas em massa a serviços web de terceiros também exigem checar os termos antes.

**Regras do JPL Horizons:** cada fixture registra os parâmetros da consulta, e só comparamos valores com
parâmetros equivalentes:
- corpo alvo e **observador geocêntrico** (`500@399`);
- escala de tempo de entrada (**UT**), com o ΔT aplicado pelo próprio Horizons e registrado;
- grandeza: **longitude/latitude eclíptica aparente do observador** (quantidade 31), referida ao equinócio e
  eclíptica **de data**, que é o mesmo referencial da longitude tropical do XALEN. A definição exata de cada
  quantidade será conferida na documentação do Horizons antes de gerar as fixtures;
- efemérides usadas (DE440/DE441, conforme o Horizons informar) e data da consulta.

As respostas do Horizons ficam salvas em `tests/fixtures/jpl/*.json` com os parâmetros, e os testes rodam offline.

**Casas/ASC/MC:** o JPL não calcula casas. A referência principal passa a ser uma **implementação independente
das fórmulas padrão** (ASC/MC a partir do tempo sideral aparente local e da obliquidade verdadeira, e Placidus
por iteração), escrita só para os testes e alimentada com o tempo sideral do Horizons (quantidade 7).
A Swiss Ephemeris entra apenas como conferência secundária manual, se houver divergência.

**Tolerâncias de aceitação** (limites do nosso benchmark, não uma afirmação de precisão absoluta do XALEN):

| Grandeza | Modo | Limite |
|---|---|---|
| Sol, Mercúrio–Netuno | analítico | ≤ 5″ |
| Plutão | analítico | registrar (sem limite de 5″); **≤ 5″ só com DE440** |
| Lua | analítico | ≤ 15″ |
| Lua | DE440 | teste separado, com limite mais apertado a definir após a primeira medição |
| Ascendente | — | ≤ 0,01° |
| MC | — | ≤ 0,01° |
| Cúspides | — | ≤ 0,02° |

- Relatório com **erro máximo, média, RMS, p95 e p99** por grandeza, e não só PASS/FAIL.
- Casas/ASC/MC medidos **separadamente** em latitudes normais (|lat| ≤ 60°) e altas (60°–66°), com as
  condições polares (> 66,5°) validando o fallback documentado.
- **Nunca aumentar uma tolerância para um teste passar.** Divergência é investigada primeiro e a causa fica registrada.
- O DE440 entra só no benchmark (kernel baixado uma vez no ambiente de dev e fora do repositório), e nunca no runtime da Vercel.
