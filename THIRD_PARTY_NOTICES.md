# Avisos de terceiros — Astarot

## Motor astronômico: XALEN Ephemeris
- Projeto: https://github.com/vedika-io/xalen-ephemeris · commit `cc6edbec1f748ebdc4950ae6198f575c5ada73fa` (0.6.0)
- Licença: **Apache License 2.0**. Texto integral e NOTICE em `vendor/su-ephem/XALEN-LICENSE` e `vendor/su-ephem/XALEN-NOTICE`.
- `xalen-coords` inclui um porte do ERFA, distribuído também sob **BSD 3-Clause** (aviso no XALEN-NOTICE).
- Compilado **sem** o catálogo Hipparcos (`xalen-stars-hip-data`, CC BY-NC 3.0 IGO, proibido para uso comercial).
  O `scripts/build-xalen.sh` falha se esse crate entrar na árvore de dependências.
- Teorias e dados creditados pelo XALEN: VSOP87 (Bretagnon & Francou), ELP2000-82 (Chapront-Touzé & Chapront), Plutão
  analítico (Meeus), precessão IAU 2006, nutação IAU 2000B, ΔT Stephenson–Morrison–Hohenkerk 2016.
- "XALEN" é marca de XALEN Technology Pvt Ltd. O Astarot é *construído com XALEN Ephemeris*, sem endosso ou
  certificação.

## Dados de cidades
- GeoNames (https://www.geonames.org), licença **Creative Commons Attribution 4.0**. Atribuição exibida em Perfil → Sobre.

## Fontes tipográficas (via next/font, auto-hospedadas)
- Instrument Serif, Inter e Noto Sans Symbols: **SIL Open Font License 1.1**.

## Dependências JavaScript diretas (produção)
| Pacote | Versão | Licença |
|---|---|---|
| `next` | 16.3.8 | MIT |
| `react` / `react-dom` | 19.2.8 | MIT |
| `@supabase/supabase-js` | 2.117.2 | MIT |
| `@supabase/ssr` | 0.12.7 | MIT |
| `zod` | 4.6.5 | MIT |
| `lucide-react` | 1.49.0 | ISC |
| `server-only` | 0.0.1 | MIT |

## Dependências Rust do wrapper `engine/` (compiladas no .wasm)
`xalen-*` (Apache-2.0; `xalen-coords` Apache-2.0 AND BSD-3-Clause), `serde`, `serde_json`, `wasm-bindgen`, `thiserror`,
`once_cell`, `cfg-if`, `itoa`, `bumpalo`, `vsop87` (MIT OR Apache-2.0), `memchr` (Unlicense OR MIT), `zmij` (MIT),
`unicode-ident` ((MIT OR Apache-2.0) AND Unicode-3.0). Lista completa com versões: `engine/Cargo.lock`.

## Conteúdo
- A base editorial (`knowledge/`) é síntese própria, com referências listadas em `knowledge/SOURCES.md`.
- As cartas de Tarot são arte tipográfica própria. Nenhuma imagem de terceiros é usada.
- **Swiss Ephemeris não é usada** no código, nas dependências, no build ou no runtime.
