/**
 * Gera as referências astronômicas do benchmark consultando o JPL Horizons (oráculo principal).
 * Requer acesso a ssd.jpl.nasa.gov. As respostas ficam em tests/fixtures/jpl/ e os testes rodam offline.
 *
 * Parâmetros (todos explícitos e registrados no arquivo gerado):
 *   EPHEM_TYPE = OBSERVER
 *   CENTER     = 500@399            (geocêntrico) — planetas
 *              = coord@399 + SITE_COORD (geodético, altitude 0) — tempo sideral local
 *   TIME_TYPE  = UT                 (o Horizons converte UT→TT com o próprio ΔT)
 *   TLIST      = JD (UT) de cada caso de tests/benchmark/cases.ts
 *   QUANTITIES = 31  → longitude/latitude eclíptica do observador, posição aparente, referida ao equinócio e
 *                      eclíptica DE DATA (mesmo referencial da longitude tropical do XALEN; ver
 *                      docs/ACCURACY.md do XALEN, que compara exatamente com a quantidade 31)
 *              = 7   → tempo sideral local aparente (LAST), para o oráculo de casas
 *   ANG_FORMAT = DEG, EXTRA_PREC = YES, CSV_FORMAT = YES
 * Antes de confiar nos números, conferir na documentação do Horizons a definição exata das quantidades 7 e 31
 * (https://ssd.jpl.nasa.gov/horizons/manual.html).
 *
 * Uso: node scripts/fetch-jpl-fixtures.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { CASES } from "../tests/benchmark/cases.ts";
import { jdOfCase } from "../tests/benchmark/jd.ts";

const API = "https://ssd.jpl.nasa.gov/api/horizons.api";
const BODIES: Record<string, string> = {
  sun: "10", moon: "301", mercury: "199", venus: "299", mars: "499",
  jupiter: "599", saturn: "699", uranus: "799", neptune: "899", pluto: "999",
};

const q = (v: string) => `'${v}'`;

async function horizons(params: Record<string, string>): Promise<{ result: string; signature?: unknown }> {
  const url = new URL(API);
  url.searchParams.set("format", "json");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  for (let attempt = 0; attempt < 4; attempt++) {
    const r = await fetch(url);
    if (r.ok) return (await r.json()) as { result: string; signature?: unknown };
    await new Promise((res) => setTimeout(res, 2000 * 2 ** attempt));
  }
  throw new Error(`Horizons falhou: ${url}`);
}

/** Linhas entre $$SOE e $$EOE, divididas por vírgula. */
export function ephemerisRows(result: string): string[][] {
  const start = result.indexOf("$$SOE");
  const end = result.indexOf("$$EOE");
  if (start < 0 || end < 0) throw new Error(`resposta sem efemérides:\n${result.slice(0, 800)}`);
  return result
    .slice(start + 5, end)
    .trim()
    .split("\n")
    .map((l) => l.split(",").map((c) => c.trim()));
}

/** "HH MM SS.fff" ou horas decimais → horas. */
export function parseHours(s: string): number {
  const m = /^(\d+)\s+(\d+)\s+([\d.]+)$/.exec(s.trim());
  if (m) return Number(m[1]) + Number(m[2]) / 60 + Number(m[3]) / 3600;
  const x = Number(s);
  if (!Number.isFinite(x)) throw new Error(`tempo sideral ilegível: ${s}`);
  return x;
}

async function main() {
  const jds = CASES.map((c) => ({ id: c.id, jd: jdOfCase(c), lat: c.lat, lon: c.lon }));
  const common = {
    OBJ_DATA: "NO", MAKE_EPHEM: "YES", EPHEM_TYPE: "OBSERVER", TIME_TYPE: "UT",
    TLIST_TYPE: "JD", ANG_FORMAT: "DEG", EXTRA_PREC: "YES", CSV_FORMAT: "YES",
  };

  // Planetas: uma consulta por corpo com todos os instantes.
  const planets: Record<string, Record<string, { lon: number; lat: number }>> = {};
  let signature: unknown = null;
  for (const [body, command] of Object.entries(BODIES)) {
    const res = await horizons({
      ...common,
      COMMAND: q(command),
      CENTER: q("500@399"),
      QUANTITIES: q("31"),
      TLIST: q(jds.map((j) => j.jd.toFixed(9)).join(" ")),
    });
    signature = res.signature ?? signature;
    const rows = ephemerisRows(res.result);
    if (rows.length !== jds.length) throw new Error(`${body}: ${rows.length} linhas para ${jds.length} instantes`);
    rows.forEach((row, i) => {
      const nums = row.map(Number).filter((x, k) => k > 0 && row[k] !== "" && Number.isFinite(x));
      const [lon, lat] = nums.slice(-2);
      (planets[jds[i].id] ??= {})[body] = { lon, lat };
    });
    process.stdout.write(`${body} ok\n`);
  }

  // Tempo sideral local aparente em cada local.
  const sidereal: Record<string, number> = {};
  for (const j of jds) {
    const res = await horizons({
      ...common,
      COMMAND: q("10"),
      CENTER: q("coord@399"),
      COORD_TYPE: q("GEODETIC"),
      SITE_COORD: q(`${j.lon},${j.lat},0`),
      QUANTITIES: q("7"),
      TLIST: q(j.jd.toFixed(9)),
    });
    const row = ephemerisRows(res.result)[0];
    const cell = row.slice(1).find((c) => /\d/.test(c) && !/^\d{7}\.\d+$/.test(c)) ?? "";
    sidereal[j.id] = parseHours(cell);
  }

  mkdirSync("tests/fixtures/jpl", { recursive: true });
  const meta = {
    source: "NASA/JPL Horizons API (https://ssd.jpl.nasa.gov/api/horizons.api)",
    queried_at: new Date().toISOString(),
    signature,
    parameters: { ...common, CENTER_planets: "500@399", QUANTITIES_planets: "31", CENTER_sidereal: "coord@399 (GEODETIC, alt 0)", QUANTITIES_sidereal: "7" },
  };
  writeFileSync("tests/fixtures/jpl/planets.json", `${JSON.stringify({ ...meta, cases: jds.map((j) => ({ id: j.id, jd_ut: j.jd, bodies: planets[j.id] })) }, null, 1)}\n`);
  writeFileSync("tests/fixtures/jpl/sidereal.json", `${JSON.stringify({ ...meta, cases: jds.map((j) => ({ id: j.id, jd_ut: j.jd, lat: j.lat, lon: j.lon, last_hours: sidereal[j.id] })) }, null, 1)}\n`);
  console.log("fixtures gravadas em tests/fixtures/jpl/");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
