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
