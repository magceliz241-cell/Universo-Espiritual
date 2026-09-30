# Seu Universo

Área de membros de espiritualidade/esoterismo: mapa astral, amor/sinastria, Tarot, numerologia, Lua, sonhos e
um guia de IA. O software calcula; a IA interpreta.

- Plano e decisões: [`docs/PLANO_TECNICO.md`](docs/PLANO_TECNICO.md), [`docs/DECISIONS.md`](docs/DECISIONS.md)
- Design: [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)

## Desenvolvimento

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # Vitest
npm run typecheck
npm run lint
```

O motor astronômico é o [XALEN Ephemeris](https://github.com/vedika-io/xalen-ephemeris) (Apache-2.0), usado por um
wrapper Rust próprio (`engine/`), compilado para WebAssembly e versionado em `vendor/su-ephem/`. Para reproduzir o artefato:
`npm run build:xalen` (requer Rust e `wasm-bindgen-cli 0.2.129`).
Construído com XALEN Ephemeris; ver `vendor/su-ephem/XALEN-LICENSE` e `XALEN-NOTICE`.
