@AGENTS.md

# Seu Universo — regras do projeto

Leia antes de qualquer mudança:
- `docs/MASTER_PROMPT.md` — instrução mestre do produto.
- `docs/PLANO_TECNICO.md` — auditoria, arquitetura, decisões e política de validação.
- `docs/DECISIONS.md` — registro de decisões por fase.
- `docs/DESIGN_SYSTEM.md` — especificação visual obrigatória.
- `knowledge/README.md` e regras em `knowledge/` — base editorial.

Regras inegociáveis:
- O software calcula (astronomia, numerologia, fases, sorteios); a IA só interpreta.
- Motor astronômico: XALEN via `vendor/xalen-wasm` (commit fixado, `--no-default-features`).
  Só `src/lib/astro/xalen-engine.ts` e `xalen-loader.ts` conhecem o XALEN.
- Swiss Ephemeris: nunca no código, dependências, build ou runtime.
- IA: Groq, modelo `openai/gpt-oss-120b`, chamadas centralizadas em `src/lib/ai/`.
- Segredos só no servidor. RLS em todas as tabelas.
- Responder ao usuário em português do Brasil.

Comandos: `npm test`, `npm run typecheck`, `npm run lint`, `npx next build`,
`npm run build:xalen` (reproduz o artefato do XALEN; requer Rust + wasm-bindgen-cli 0.2.129).
