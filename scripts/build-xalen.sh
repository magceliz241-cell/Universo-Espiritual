#!/usr/bin/env bash
# Reproduz o artefato vendor/xalen-wasm/ a partir de um commit fixado do XALEN.
#
# Requisitos: git, cargo/rustc (>= 1.85) com alvo wasm32-unknown-unknown,
# wasm-bindgen-cli na MESMA versão travada no Cargo.lock do XALEN.
#
# IMPORTANTE: compila com --no-default-features para NÃO linkar o catálogo
# Hipparcos (crate xalen-stars-hip-data, licença CC-BY-NC — proibido para uso
# comercial). O script falha se esse crate aparecer na árvore de dependências.
set -euo pipefail

XALEN_REPO="https://github.com/vedika-io/xalen-ephemeris"
XALEN_COMMIT="cc6edbec1f748ebdc4950ae6198f575c5ada73fa"
WASM_BINDGEN_VERSION="0.2.129"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/vendor/xalen-wasm"
WORK="${XALEN_WORKDIR:-${TMPDIR:-/tmp}/xalen-build-$XALEN_COMMIT}"

if ! command -v wasm-bindgen >/dev/null; then
  echo "wasm-bindgen não encontrado. Instale: cargo install wasm-bindgen-cli --version $WASM_BINDGEN_VERSION --locked" >&2
  exit 1
fi
if [[ "$(wasm-bindgen --version | awk '{print $2}')" != "$WASM_BINDGEN_VERSION" ]]; then
  echo "wasm-bindgen precisa ser $WASM_BINDGEN_VERSION (encontrado: $(wasm-bindgen --version))" >&2
  exit 1
fi
rustup target add wasm32-unknown-unknown >/dev/null 2>&1 || true

if [[ ! -d "$WORK/.git" ]]; then
  git clone --filter=blob:none "$XALEN_REPO" "$WORK"
fi
git -C "$WORK" fetch --quiet origin "$XALEN_COMMIT" || true
git -C "$WORK" checkout --quiet --detach "$XALEN_COMMIT"
test "$(git -C "$WORK" rev-parse HEAD)" = "$XALEN_COMMIT"

cd "$WORK"
if cargo tree -p xalen-wasm --no-default-features --target wasm32-unknown-unknown -e normal \
  | grep -q "xalen-stars-hip-data"; then
  echo "ERRO: xalen-stars-hip-data (não comercial) está na árvore de dependências." >&2
  exit 1
fi

cargo build --locked -p xalen-wasm --release --target wasm32-unknown-unknown --no-default-features

rm -rf "$OUT"
mkdir -p "$OUT"
wasm-bindgen --target web --out-dir "$OUT" \
  "target/wasm32-unknown-unknown/release/xalen_wasm.wasm"

cp LICENSE "$OUT/LICENSE"
cp NOTICE "$OUT/NOTICE"

# package.json local (não publicado): permite a dependência `file:vendor/xalen-wasm`.
# O nome é o do crate upstream, sem alteração
# (uso nominativo permitido pelo TRADEMARK.md do XALEN).
cat > "$OUT/package.json" <<EOF
{
  "name": "xalen-wasm",
  "version": "0.6.0-${XALEN_COMMIT:0:7}",
  "private": true,
  "description": "Build local, não publicado, do crate xalen-wasm (commit $XALEN_COMMIT, --no-default-features)",
  "license": "Apache-2.0",
  "type": "module",
  "main": "xalen_wasm.js",
  "types": "xalen_wasm.d.ts"
}
EOF

SHA=$(sha256sum "$OUT/xalen_wasm_bg.wasm" | awk '{print $1}')
cat > "$OUT/BUILD_INFO.json" <<EOF
{
  "engine": "xalen",
  "source": "$XALEN_REPO",
  "commit": "$XALEN_COMMIT",
  "workspace_version": "$(grep -m1 '^version' Cargo.toml | cut -d'"' -f2)",
  "crate": "xalen-wasm",
  "cargo_flags": "--release --target wasm32-unknown-unknown --no-default-features",
  "hip_catalog_linked": false,
  "wasm_bindgen": "$WASM_BINDGEN_VERSION",
  "wasm_bindgen_target": "web (initSync com bytes lidos pelo app)",
  "rustc": "$(rustc --version)",
  "wasm_sha256": "$SHA",
  "license": "Apache-2.0 (+ BSD-3-Clause para o porte ERFA em xalen-coords); ver LICENSE e NOTICE"
}
EOF
echo "OK: $OUT (sha256 $SHA)"
