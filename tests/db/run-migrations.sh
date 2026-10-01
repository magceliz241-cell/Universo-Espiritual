#!/usr/bin/env bash
# Recria o banco de teste local: stub do Supabase + todas as migrations em ordem.
# Uso: TEST_DATABASE_URL=postgres://postgres@/su_test?host=/tmp&port=55432 bash tests/db/run-migrations.sh
set -euo pipefail
export PGOPTIONS="-c client_min_messages=warning"
HOST="${PGHOST:-/tmp}"; PORT="${PGPORT:-55432}"; DB="${PGDATABASE_TEST:-su_test}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
psql -h "$HOST" -p "$PORT" -U postgres -q -c "drop database if exists $DB" -c "create database $DB"
psql -h "$HOST" -p "$PORT" -U postgres -d "$DB" -q -v ON_ERROR_STOP=1 -f "$ROOT/tests/db/supabase-stub.sql"
for f in "$ROOT"/supabase/migrations/*.sql; do
  psql -h "$HOST" -p "$PORT" -U postgres -d "$DB" -q -v ON_ERROR_STOP=1 -f "$f"
done
# Rodar de novo para provar idempotência.
for f in "$ROOT"/supabase/migrations/*.sql; do
  psql -h "$HOST" -p "$PORT" -U postgres -d "$DB" -q -v ON_ERROR_STOP=1 -f "$f"
done
echo "migrations OK em $DB"
