#!/usr/bin/env bash
# Reproduz vendor/su-ephem/: o wrapper Rust do Seu Universo (engine/) sobre o
# XALEN Ephemeris, compilado para WebAssembly.
#
# Requisitos: cargo/rustc (>= 1.85) com alvo wasm32-unknown-unknown e
# wasm-bindgen-cli na MESMA versão fixada em engine/Cargo.toml.
#
# O XALEN é fixado por commit em engine/Cargo.toml (+ engine/Cargo.lock).
# IMPORTANTE: todas as dependências XALEN usam default-features = false para NÃO
# linkar o catálogo Hipparcos (xalen-stars-hip-data, CC-BY-NC — proibido para uso
# comercial). O script falha se esse crate aparecer na árvore.
set -euo pipefail

WASM_BINDGEN_VERSION="0.2.129"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENGINE="$ROOT/engine"
OUT="$ROOT/vendor/su-ephem"

if ! command -v wasm-bindgen >/dev/null; then
  echo "wasm-bindgen não encontrado. Instale: cargo install wasm-bindgen-cli --version $WASM_BINDGEN_VERSION --locked" >&2
  exit 1
fi
if [[ "$(wasm-bindgen --version | awk '{print $2}')" != "$WASM_BINDGEN_VERSION" ]]; then
  echo "wasm-bindgen precisa ser $WASM_BINDGEN_VERSION (encontrado: $(wasm-bindgen --version))" >&2
  exit 1
fi
rustup target add wasm32-unknown-unknown >/dev/null 2>&1 || true

cd "$ENGINE"
if cargo tree --locked --target wasm32-unknown-unknown -e normal | grep -q "xalen-stars-hip-data"; then
  echo "ERRO: xalen-stars-hip-data (não comercial) está na árvore de dependências." >&2
  exit 1
fi

cargo test --locked --release --quiet
cargo build --locked --release --target wasm32-unknown-unknown

rm -rf "$OUT"
mkdir -p "$OUT"
wasm-bindgen --target web --out-dir "$OUT" \
  "target/wasm32-unknown-unknown/release/su_ephem.wasm"

# LICENSE/NOTICE do XALEN, direto do checkout fixado pelo cargo.
XALEN_SRC=$(cargo metadata --locked --format-version 1 \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const m=JSON.parse(s);const p=m.packages.find(p=>p.name==="xalen-ephem");console.log(require("path").resolve(p.manifest_path,"../../.."))})')
cp "$XALEN_SRC/LICENSE" "$OUT/XALEN-LICENSE"
cp "$XALEN_SRC/NOTICE" "$OUT/XALEN-NOTICE"
XALEN_COMMIT=$(grep -o 'rev = "[0-9a-f]*"' Cargo.toml | head -1 | cut -d'"' -f2)

cat > "$OUT/package.json" <<EOF
{
  "name": "su-ephem",
  "version": "0.1.0",
  "private": true,
  "description": "Wrapper WASM do Seu Universo sobre o XALEN Ephemeris (commit $XALEN_COMMIT). Gerado por scripts/build-xalen.sh.",
  "license": "Apache-2.0",
  "type": "module",
  "main": "su_ephem.js",
  "types": "su_ephem.d.ts"
}
EOF

SHA=$(sha256sum "$OUT/su_ephem_bg.wasm" | awk '{print $1}')
cat > "$OUT/BUILD_INFO.json" <<EOF
{
  "engine": "xalen",
  "xalen_source": "https://github.com/vedika-io/xalen-ephemeris",
  "xalen_commit": "$XALEN_COMMIT",
  "wrapper": "engine/ (su-ephem)",
  "cargo_flags": "--locked --release --target wasm32-unknown-unknown (xalen-* com default-features = false)",
  "hip_catalog_linked": false,
  "wasm_bindgen": "$WASM_BINDGEN_VERSION",
  "wasm_bindgen_target": "web (initSync com bytes lidos pelo app)",
  "rustc": "$(rustc --version)",
  "wasm_sha256": "$SHA",
  "license": "XALEN: Apache-2.0 (+ BSD-3-Clause no porte ERFA de xalen-coords); ver XALEN-LICENSE e XALEN-NOTICE"
}
EOF
echo "OK: $OUT (sha256 $SHA)"
