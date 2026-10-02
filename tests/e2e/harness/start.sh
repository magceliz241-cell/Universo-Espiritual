#!/usr/bin/env bash
# Sobe o ambiente local de testes ponta a ponta (NUNCA produção):
#   Postgres (já rodando na porta 55432) → banco su_e2e (stub + migrations)
#   PostgREST (porta 3001) → gateway Supabase simulado (porta 54321)
# Gera tests/e2e/harness/.env.e2e com as variáveis para o Next.
#
# Requisitos: psql, binário do PostgREST em $POSTGREST_BIN, Node 22.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
H="$ROOT/tests/e2e/harness"
PGHOST="${PGHOST:-/tmp}"; PGPORT="${PGPORT:-55432}"; DB=su_e2e
export PGOPTIONS="-c client_min_messages=warning"
: "${POSTGREST_BIN:?defina POSTGREST_BIN com o caminho do binário do PostgREST}"
JWT_SECRET="${JWT_SECRET:-e2e-secret-e2e-secret-e2e-secret-0123456789}"

psql -h "$PGHOST" -p "$PGPORT" -U postgres -q -c "drop database if exists $DB with (force)" -c "create database $DB"
psql -h "$PGHOST" -p "$PGPORT" -U postgres -d "$DB" -q -v ON_ERROR_STOP=1 -f "$ROOT/tests/db/supabase-stub.sql"
for f in "$ROOT"/supabase/migrations/*.sql; do
  psql -h "$PGHOST" -p "$PGPORT" -U postgres -d "$DB" -q -v ON_ERROR_STOP=1 -f "$f"
done
psql -h "$PGHOST" -p "$PGPORT" -U postgres -d "$DB" -q -v ON_ERROR_STOP=1 <<'SQL'
do $$ begin
  if not exists (select from pg_roles where rolname = 'authenticator') then
    create role authenticator noinherit login;
  end if;
end $$;
grant anon, authenticated, service_role to authenticator;
-- Cidades de exemplo para a busca.
insert into public.cities (id, name, ascii_name, search_name, admin1_code, admin1_name, country_code, latitude, longitude, timezone, population, feature_code, source_dump) values
 (3448439, 'São Paulo', 'Sao Paulo', 'sao paulo', '27', 'São Paulo', 'BR', -23.5475, -46.63611, 'America/Sao_Paulo', 10021295, 'PPLA', '2026-09-30'),
 (3390760, 'Recife', 'Recife', 'recife', '30', 'Pernambuco', 'BR', -8.05389, -34.88111, 'America/Recife', 1478098, 'PPLA', '2026-09-30'),
 (3451190, 'Rio de Janeiro', 'Rio de Janeiro', 'rio de janeiro', '21', 'Rio de Janeiro', 'BR', -22.90642, -43.18223, 'America/Sao_Paulo', 6023699, 'PPLA', '2026-09-30'),
 (3405870, 'Belém', 'Belem', 'belem', '16', 'Pará', 'BR', -1.45583, -48.50444, 'America/Belem', 1407737, 'PPLA', '2026-09-30'),
 (2643743, 'London', 'London', 'london', 'ENG', 'England', 'GB', 51.50853, -0.12574, 'Europe/London', 8961989, 'PPLC', '2026-09-30')
on conflict (id) do nothing;
SQL

cat > "$H/pgrst.conf" <<EOF
db-uri = "postgres://authenticator@localhost/$DB?host=$PGHOST&port=$PGPORT"
db-schemas = "public"
db-anon-role = "anon"
jwt-secret = "$JWT_SECRET"
server-port = 3001
server-host = "127.0.0.1"
EOF

sign() { node -e "
const c=require('node:crypto');const b=s=>Buffer.from(s).toString('base64url');
const h=b(JSON.stringify({alg:'HS256',typ:'JWT'})),p=b(JSON.stringify({role:'$1',iss:'e2e',iat:1700000000,exp:2000000000}));
console.log(h+'.'+p+'.'+c.createHmac('sha256','$JWT_SECRET').update(h+'.'+p).digest('base64url'))"; }
ANON=$(sign anon); SERVICE=$(sign service_role)

cat > "$H/.env.e2e" <<EOF
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON
SUPABASE_SERVICE_ROLE_KEY=$SERVICE
NEXT_PUBLIC_APP_URL=http://localhost:3140
NEXT_PUBLIC_CHECKOUT_LOVE_URL=https://pay.exemplo.test/love
NEXT_PUBLIC_LANDING_URL=https://landing.exemplo.test
CAKTO_WEBHOOK_SECRET=e2e-webhook-secret
CAKTO_MAIN_IDS=prod-main-e2e,offer-main-e2e
CAKTO_LOVE_IDS=prod-love-e2e,offer-love-app-e2e
CAKTO_FULL_IDS=prod-full-e2e
GROQ_API_KEY=gsk_e2e_fake
GROQ_BASE_URL=http://127.0.0.1:54399
AI_RETRY_DELAY_MS=0
E2E_DATABASE_URL="postgres://postgres@localhost/$DB?host=$PGHOST&port=$PGPORT"
EOF

"$POSTGREST_BIN" "$H/pgrst.conf" > "$H/postgrest.log" 2>&1 &
echo $! > "$H/postgrest.pid"
JWT_SECRET="$JWT_SECRET" DATABASE_URL="postgres://postgres@localhost/$DB?host=$PGHOST&port=$PGPORT" \
  node "$H/gateway.mjs" > "$H/gateway.log" 2>&1 &
echo $! > "$H/gateway.pid"
node "$H/fake-groq.mjs" > "$H/fake-groq.log" 2>&1 &
echo $! > "$H/fake-groq.pid"
sleep 1.5
curl -sf -o /dev/null "http://127.0.0.1:54321/rest/v1/cities?select=id&limit=1" -H "apikey: $ANON" && echo "harness OK"
