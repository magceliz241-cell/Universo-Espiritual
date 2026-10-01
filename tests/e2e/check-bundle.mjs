// Confere que o bundle do cliente (.next/static) não contém segredos nem a KB/engine.
// Uso (depois de `next build` com o .env de teste): node tests/e2e/check-bundle.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const secrets = ["SUPABASE_SERVICE_ROLE_KEY", "GROQ_API_KEY", "CAKTO_WEBHOOK_SECRET"]
  .map((k) => [k, process.env[k]])
  .filter(([, v]) => v && v.length > 8);
const forbidden = [
  ["KB embutida", "Consultar a KB do número"],
  ["prompt do sistema", "Regras inegociáveis"],
  ["nome de variável secreta", "SUPABASE_SERVICE_ROLE_KEY"],
  ["motor WASM", "su_ephem_bg"],
];

const files = [];
const walk = (d) =>
  readdirSync(d).forEach((f) => {
    const p = path.join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else files.push(p);
  });
walk(".next/static");
let failed = 0;
for (const f of files.filter((f) => /\.(js|css|json|txt)$/.test(f))) {
  const s = readFileSync(f, "utf8");
  for (const [name, value] of secrets) if (s.includes(value)) { console.log(`✗ segredo ${name} em ${f}`); failed++; }
  for (const [name, needle] of forbidden) if (s.includes(needle)) { console.log(`✗ ${name} em ${f}`); failed++; }
}
console.log(failed ? `${failed} problema(s)` : `✓ bundle do cliente limpo (${files.length} arquivos, ${secrets.length} segredos verificados)`);
process.exit(failed ? 1 : 0);
