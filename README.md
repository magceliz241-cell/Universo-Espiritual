# Astarot

Área de membros de espiritualidade/esoterismo: mapa astral, amor e mapa do casal, Tarot, numerologia, Lua, sonhos e
o Seu Guia (IA). **O software calcula; a IA interpreta.**

- Plano, decisões e benchmark: [`docs/PLANO_TECNICO.md`](docs/PLANO_TECNICO.md), [`docs/DECISIONS.md`](docs/DECISIONS.md),
  [`docs/BENCHMARK.md`](docs/BENCHMARK.md)
- Design: [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) · Configuração (Supabase, Vercel, Cakto): [`docs/SETUP.md`](docs/SETUP.md)
- Licenças de terceiros: [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)
- Landing de vendas (estática, projeto separado na Vercel): [`landing/`](landing/README.md)

## Stack
Next.js 16 (App Router) · TypeScript · Tailwind 4 · Supabase (Auth + Postgres + RLS) · Groq `openai/gpt-oss-120b` ·
XALEN Ephemeris (Rust → WebAssembly, via wrapper próprio `engine/`) · Vercel.

## Desenvolvimento
```bash
npm install
cp .env.example .env.local   # preencha (nunca commite)
npm run dev                  # http://localhost:3000
```

| Comando | O que faz |
|---|---|
| `npm test` | testes unitários (motor, tempo/fuso, aspectos, KB, IA, webhook, numerologia, Tarot, Lua) |
| `npm run test:db` | migrations + RLS + regras de acesso num Postgres local (porta 55432) |
| `npm run test:e2e` | roteiro Playwright contra o ambiente local (`tests/e2e/harness/start.sh`) |
| `npm run test:landing` | landing no Chromium (celular e desktop, teste de interesses, checkout com UTMs) |
| `npm run build:landing-assets` | regenera `landing/assets.js` (céu ao vivo e mapa de exemplo, com o XALEN) |
| `npm run benchmark` | benchmark de precisão → `docs/BENCHMARK.md` |
| `npm run benchmark:fetch-jpl` | busca as referências do JPL Horizons (precisa de rede) |
| `npm run build:knowledge` | regenera o índice da KB depois de editar `knowledge/` |
| `npm run build:xalen` | recompila o motor (Rust + `wasm-bindgen-cli 0.2.129`) |
| `npm run lint` / `npm run typecheck` | qualidade |

Construído com XALEN Ephemeris (Apache-2.0); ver `vendor/su-ephem/XALEN-LICENSE` e `XALEN-NOTICE`.
