/**
 * Importa cidades do GeoNames (CC-BY 4.0) para public.cities.
 *
 * Arquivos (https://download.geonames.org/export/dump/):
 *   cities1000.txt (de cities1000.zip), BR.txt (de BR.zip, todos os lugares do Brasil),
 *   admin1CodesASCII.txt
 *
 * Uso:
 *   node scripts/import-cities.ts --cities cities1000.txt --cities BR.txt \
 *     --admin1 admin1CodesASCII.txt --dump-date 2026-10-01 --out cities.csv
 *   node scripts/import-cities.ts ... --out cidades.csv --chunk 20000   (gera cidades-001.csv, cidades-002.csv…,
 *     cada um com cabeçalho, para importar pela tela do Supabase em partes)
 *   node scripts/import-cities.ts ... --upsert   (usa NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { parseAdmin1, parseCities, toCsv, type CityRow } from "./lib/geonames.ts";

const args = process.argv.slice(2);
const all = (flag: string) => args.flatMap((a, i) => (a === flag && args[i + 1] ? [args[i + 1]] : []));
const one = (flag: string) => all(flag)[0];

const cityFiles = all("--cities");
const admin1File = one("--admin1");
const dumpDate = one("--dump-date");
if (!cityFiles.length || !admin1File || !dumpDate || !/^\d{4}-\d{2}-\d{2}$/.test(dumpDate)) {
  console.error("Uso: --cities <arquivo> [--cities <arquivo>] --admin1 <arquivo> --dump-date YYYY-MM-DD (--out <csv> | --upsert)");
  process.exit(1);
}

const admin1 = parseAdmin1(readFileSync(admin1File, "utf8"));
const rows = new Map<number, CityRow>();
for (const f of cityFiles) parseCities(readFileSync(f, "utf8"), admin1, dumpDate, rows);
console.log(`${rows.size} cidades`);

const out = one("--out");
const chunk = Number(one("--chunk") ?? 0);
if (out && chunk > 0) {
  const list = [...rows.values()];
  const base = out.replace(/\.csv$/i, "");
  for (let i = 0, n = 1; i < list.length; i += chunk, n++) {
    const file = `${base}-${String(n).padStart(3, "0")}.csv`;
    writeFileSync(file, toCsv(list.slice(i, i + chunk)));
    console.log(`CSV: ${file}`);
  }
} else if (out) {
  writeFileSync(out, toCsv(rows.values()));
  console.log(`CSV: ${out}`);
}

if (args.includes("--upsert")) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.");
    process.exit(1);
  }
  const list = [...rows.values()];
  for (let i = 0; i < list.length; i += 1000) {
    const res = await fetch(`${url}/rest/v1/cities?on_conflict=id`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(list.slice(i, i + 1000)),
    });
    if (!res.ok) {
      console.error(`Falha no lote ${i}: ${res.status} ${await res.text()}`);
      process.exit(1);
    }
    process.stdout.write(`\r${Math.min(i + 1000, list.length)}/${list.length}`);
  }
  console.log("\nImportação concluída.");
}
