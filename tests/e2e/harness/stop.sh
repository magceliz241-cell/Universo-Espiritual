#!/usr/bin/env bash
H="$(cd "$(dirname "$0")" && pwd)"
for f in postgrest gateway fake-groq; do
  [ -f "$H/$f.pid" ] && kill "$(cat "$H/$f.pid")" 2>/dev/null; rm -f "$H/$f.pid"
done
echo "harness parado"
