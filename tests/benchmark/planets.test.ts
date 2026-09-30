import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { XalenEphemerisEngine } from "@/lib/astro/xalen-engine";
import { oracleHouses } from "./oracle/houses";
import { angDiff, type ErrorStats, stats } from "./stats";

/**
 * Benchmark de posições planetárias. Oráculo principal: JPL Horizons (quantidade 31, geocêntrico,
 * aparente, eclíptica/equinócio de data), fixtures em tests/fixtures/jpl/ geradas por
 * scripts/fetch-jpl-fixtures.ts. Sem as fixtures, usa os valores "JPL" CITADOS em docs/ACCURACY.md do XALEN
 * (fonte de segunda mão, 4 casas decimais), e o relatório registra isso.
 * Tolerâncias (limites de aceitação do nosso benchmark, não precisão absoluta do XALEN):
 *   Sol–Netuno ≤ 5″ · Lua ≤ 15″ (analítico) · Plutão: registrado (≤ 5″ só com DE440).
 */
const engine = new XalenEphemerisEngine();
const BODIES = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"] as const;
const LIMIT_ARCSEC: Record<string, number | null> = {
  sun: 5, mercury: 5, venus: 5, mars: 5, jupiter: 5, saturn: 5, uranus: 5, neptune: 5, moon: 15, pluto: null,
};

interface RefCase {
  id: string;
  jd_ut: number;
  bodies: Partial<Record<(typeof BODIES)[number], { lon: number; lat?: number }>>;
}

const FIXTURE = "tests/fixtures/jpl/planets.json";
const SIDEREAL = "tests/fixtures/jpl/sidereal.json";
const hasJpl = existsSync(FIXTURE);

/** Citação de segunda mão (XALEN docs/ACCURACY.md, commit cc6edbe): 2000-01-01 12:00 UT e 2024-01-01 12:00 UT. */
const QUOTED: RefCase[] = [
  {
    id: "j2000",
    jd_ut: 2451545.0,
    bodies: {
      sun: { lon: 280.3689 }, moon: { lon: 223.3238 }, mercury: { lon: 271.8893 }, venus: { lon: 241.5658 },
      mars: { lon: 327.9633 }, jupiter: { lon: 25.2531 }, saturn: { lon: 40.3956 }, uranus: { lon: 314.8092 }, neptune: { lon: 303.193 },
    },
  },
  {
    id: "2024-01-01",
    jd_ut: 2460311.0,
    bodies: { sun: { lon: 280.5485 }, moon: { lon: 161.907 }, mars: { lon: 267.6791 }, jupiter: { lon: 35.5844 } },
  },
];

const refs: RefCase[] = hasJpl ? (JSON.parse(readFileSync(FIXTURE, "utf8")).cases as RefCase[]) : QUOTED;
const source = hasJpl
  ? `JPL Horizons (fixtures ${FIXTURE})`
  : "valores JPL citados em docs/ACCURACY.md do XALEN (segunda mão; fixtures JPL ainda não geradas)";

const results: Record<string, { lon: ErrorStats; lat: ErrorStats | null; limit: number | null }> = {};

describe(`benchmark de planetas — referência: ${source}`, { timeout: 120_000 }, () => {
  for (const body of BODIES) {
    it(`${body}`, () => {
      const lon: number[] = [];
      const lat: number[] = [];
      for (const c of refs) {
        const ref = c.bodies[body];
        if (!ref) continue;
        const x = engine.bodyPositionsSync(c.jd_ut, [body])[body];
        lon.push(angDiff(x.longitude, ref.lon) * 3600);
        if (ref.lat !== undefined) lat.push((x.latitude - ref.lat) * 3600);
      }
      if (lon.length === 0) return;
      const s = stats(lon);
      results[body] = { lon: s, lat: lat.length ? stats(lat) : null, limit: LIMIT_ARCSEC[body] };
      const limit = LIMIT_ARCSEC[body];
      if (limit !== null) expect(s.max, `${body}: máx ${s.max.toFixed(2)}″`).toBeLessThanOrEqual(limit);
    });
  }

  it.skipIf(!existsSync(SIDEREAL))("casas com o tempo sideral do JPL", () => {
    const data = JSON.parse(readFileSync(SIDEREAL, "utf8")) as { cases: { id: string; jd_ut: number; lat: number; lon: number; last_hours: number }[] };
    const asc: number[] = [];
    const mc: number[] = [];
    for (const c of data.cases) {
      const x = engine.housesAtSync(c.jd_ut, c.lat, c.lon, "placidus");
      const o = oracleHouses(c.jd_ut, c.lat, c.lon, c.last_hours * 15 - c.lon);
      asc.push(angDiff(x.ascendant, o.asc));
      mc.push(angDiff(x.mc, o.mc));
    }
    const sa = stats(asc);
    const sm = stats(mc);
    results.houses_jpl_last = { lon: sa, lat: sm, limit: 0.01 };
    expect(sa.max).toBeLessThanOrEqual(0.01);
    expect(sm.max).toBeLessThanOrEqual(0.01);
  });

  it("gera relatório (BENCHMARK_REPORT=1)", () => {
    if (!process.env.BENCHMARK_REPORT) return;
    mkdirSync("tests/benchmark/results", { recursive: true });
    writeFileSync(
      "tests/benchmark/results/planets.json",
      `${JSON.stringify({ generated_at: new Date().toISOString(), source, jpl_fixtures: hasJpl, n_instants: refs.length, results }, null, 2)}\n`,
    );
  });
});
