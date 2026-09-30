# Registro de decisões

## Fase 1 — POC do XALEN (2026-09-30)

**Feito**
- Scaffold Next.js 16.3.8 (App Router, React 19, TS, Tailwind 4, ESLint) + Vitest 5.
- `scripts/build-xalen.sh`: clona o XALEN no commit `cc6edbec1f748ebdc4950ae6198f575c5ada73fa`, verifica que o
  crate não comercial `xalen-stars-hip-data` **não** está na árvore, compila `xalen-wasm` com
  `--no-default-features` e gera o glue com `wasm-bindgen 0.2.129 --target web`.
- Artefato versionado em `vendor/xalen-wasm/` (+ LICENSE, NOTICE, BUILD_INFO.json com sha256), consumido como
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
