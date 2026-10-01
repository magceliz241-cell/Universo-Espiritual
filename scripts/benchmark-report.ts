/** Gera docs/BENCHMARK.md a partir de tests/benchmark/results/*.json. Uso: npm run benchmark */
import { existsSync, readFileSync, writeFileSync } from "node:fs";

type S = { n: number; max: number; mean: number; rms: number; p95: number; p99: number };
const read = (p: string) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : null);
const houses = read("tests/benchmark/results/houses.json");
const planets = read("tests/benchmark/results/planets.json");
const info = read("vendor/su-ephem/BUILD_INFO.json");

const sec = (x: number) => `${x.toFixed(2)}″`;
const deg = (x: number) => `${x.toFixed(5)}°`;
const row = (label: string, s: S, f: (x: number) => string, limit: string, ok: boolean | null) =>
  `| ${label} | ${s.n} | ${f(s.max)} | ${f(s.mean)} | ${f(s.rms)} | ${f(s.p95)} | ${f(s.p99)} | ${limit} | ${ok === null ? "registrado" : ok ? "✅" : "❌"} |`;

const lines: string[] = [];
lines.push("# Benchmark de precisão — Astarot", "");
lines.push(`> Gerado por \`npm run benchmark\`. Motor: XALEN commit \`${info?.xalen_commit ?? "?"}\` via ${info?.wrapper ?? "su-ephem"}, modo analítico.`);
lines.push("> As margens abaixo são **limites de aceitação do nosso benchmark**, não uma afirmação de precisão absoluta do XALEN.", "");
lines.push("## Política de fontes", "");
lines.push("| Camada | Fonte |", "|---|---|");
lines.push("| Produção | XALEN (único motor no runtime) |");
lines.push("| Oráculo astronômico principal | JPL Horizons / DE440 (`scripts/fetch-jpl-fixtures.ts`, parâmetros registrados nas fixtures) |");
lines.push("| Casas/ASC/MC | Oráculo independente de fórmulas (`tests/benchmark/oracle/houses.ts`), com o tempo sideral do JPL quando as fixtures existem |");
lines.push("| Comparação secundária | Swiss Ephemeris: **não usada** neste relatório (só consulta externa manual, se necessário) |", "");

if (planets) {
  lines.push("## Planetas (longitude eclíptica aparente, de data)", "");
  lines.push(`Referência: **${planets.source}** · instantes: ${planets.n_instants}`, "");
  if (!planets.jpl_fixtures) {
    lines.push("> ⚠️ As fixtures próprias do JPL ainda não foram geradas (o ambiente de desenvolvimento bloqueou `ssd.jpl.nasa.gov`). Estes números usam valores citados pelo XALEN e **não** substituem o benchmark oficial.", "");
  }
  lines.push("| Corpo | n | máx | média | RMS | p95 | p99 | limite | resultado |", "|---|---|---|---|---|---|---|---|---|");
  for (const [body, r] of Object.entries(planets.results as Record<string, { lon: S; limit: number | null }>)) {
    if (body === "houses_jpl_last") continue;
    lines.push(row(body, r.lon, sec, r.limit === null ? "— (DE440 p/ ≤ 5″)" : `≤ ${r.limit}″`, r.limit === null ? null : r.lon.max <= r.limit));
  }
  lines.push("");
}

if (houses) {
  lines.push("## Casas, Ascendente e Meio do Céu (Placidus)", "");
  lines.push(`Referência: ${houses.reference}`, "");
  lines.push("| Conjunto | Grandeza | n | máx | média | RMS | p95 | p99 | limite | resultado |", "|---|---|---|---|---|---|---|---|---|---|");
  const names: Record<string, string> = {
    cases_normal: "60 casos · lat ≤ 60° (abs.)",
    cases_high: "60 casos · 60°–66°",
    grid_normal: "grade 3000 · lat ≤ 60° (abs.)",
    grid_high: "grade 3000 · 60°–66°",
    polar: "polares (> 66,5°, fallback)",
  };
  for (const [k, r] of Object.entries(houses.results as Record<string, { asc: S; mc: S; cusp: S; fallback: number }>)) {
    for (const [q, s, lim] of [["ASC", r.asc, 0.01], ["MC", r.mc, 0.01], ["cúspides", r.cusp, 0.02]] as const) {
      if (s.n === 0) continue;
      lines.push(`| ${names[k] ?? k} ${row(q, s, deg, `≤ ${lim}°`, s.max <= lim)}`);
    }
  }
  lines.push("");
}

lines.push("## Pendências", "");
lines.push("- Gerar as fixtures do JPL Horizons (`node scripts/fetch-jpl-fixtures.ts`) num ambiente com acesso a `ssd.jpl.nasa.gov` e rodar `npm run benchmark` de novo.");
lines.push("- Plutão ≤ 5″ e teste apertado da Lua exigem o modo DE440 (kernel `de440s.bsp` só no ambiente de benchmark, nunca no runtime da Vercel).");
lines.push("- Antes de usar as fixtures, conferir na documentação do Horizons a definição exata das quantidades 7 e 31.");
writeFileSync("docs/BENCHMARK.md", `${lines.join("\n")}\n`);
console.log("docs/BENCHMARK.md atualizado");
