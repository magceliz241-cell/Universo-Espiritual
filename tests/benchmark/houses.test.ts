import { mkdirSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { normalizeBirth, XalenEphemerisEngine } from "@/lib/astro/xalen-engine";
import { CASES } from "./cases";
import { oracleHouses } from "./oracle/houses";
import { angDiff, type ErrorStats, stats } from "./stats";

/**
 * Benchmark de casas/ASC/MC: XALEN (via su-ephem) × oráculo independente de fórmulas.
 * Tolerâncias aprovadas: ASC ≤ 0,01°, MC ≤ 0,01°, cúspides ≤ 0,02°. Latitudes normais e altas separadas.
 * Fonte da referência: tests/benchmark/oracle/houses.ts (tempo sideral IAU 1982 + nutação Meeus).
 */
const TOL = { asc: 0.01, mc: 0.01, cusp: 0.02 };
const engine = new XalenEphemerisEngine();

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

interface Sample {
  jd: number;
  lat: number;
  lon: number;
}

function compare(samples: Sample[]) {
  const asc: number[] = [];
  const mc: number[] = [];
  const cusp: number[] = [];
  let fallback = 0;
  let oracleUndefined = 0;
  for (const s of samples) {
    const x = engine.housesAtSync(s.jd, s.lat, s.lon, "placidus");
    const o = oracleHouses(s.jd, s.lat, s.lon);
    asc.push(angDiff(x.ascendant, o.asc));
    mc.push(angDiff(x.mc, o.mc));
    if (x.fallback_used) fallback++;
    if (!o.placidus) oracleUndefined++;
    if (!x.fallback_used && o.placidus) {
      for (let i = 0; i < 12; i++) cusp.push(angDiff(x.cusps[i], o.placidus[i]));
    }
  }
  return { asc: stats(asc), mc: stats(mc), cusp: stats(cusp), n: samples.length, fallback, oracleUndefined };
}

function grid(n: number, latMin: number, latMax: number, seed: number): Sample[] {
  const r = rng(seed);
  return Array.from({ length: n }, () => ({
    jd: 2415020.5 + r() * 73047, // 1900-01-01 a 2099-12-29
    lat: (latMin + r() * (latMax - latMin)) * (r() < 0.5 ? -1 : 1),
    lon: r() * 360 - 180,
  }));
}

const caseSamples = CASES.map((c) => {
  const { birth } = normalizeBirth({ date: c.date, time: c.time, timezone: c.timezone, latitude: c.lat, longitude: c.lon, fold: c.fold });
  return { jd: birth.jd_ut, lat: c.lat, lon: c.lon, id: c.id, tags: c.tags };
});

const results: Record<string, ReturnType<typeof compare>> = {};

describe("benchmark de casas (XALEN × oráculo independente)", { timeout: 180_000 }, () => {
  it("60 casos fixos — latitudes normais (|lat| ≤ 60°)", () => {
    const r = compare(caseSamples.filter((s) => Math.abs(s.lat) <= 60));
    results.cases_normal = r;
    expect(r.asc.max).toBeLessThanOrEqual(TOL.asc);
    expect(r.mc.max).toBeLessThanOrEqual(TOL.mc);
    expect(r.cusp.max).toBeLessThanOrEqual(TOL.cusp);
  });

  it("60 casos fixos — latitudes altas (60°–66°)", () => {
    const r = compare(caseSamples.filter((s) => Math.abs(s.lat) > 60 && Math.abs(s.lat) <= 66));
    results.cases_high = r;
    expect(r.n).toBeGreaterThan(0);
    expect(r.asc.max).toBeLessThanOrEqual(TOL.asc);
    expect(r.mc.max).toBeLessThanOrEqual(TOL.mc);
    expect(r.cusp.max).toBeLessThanOrEqual(TOL.cusp);
  });

  it("grade aleatória de 3000 mapas — |lat| ≤ 60°", () => {
    const r = compare(grid(3000, 0, 60, 42));
    results.grid_normal = r;
    expect(r.asc.max).toBeLessThanOrEqual(TOL.asc);
    expect(r.mc.max).toBeLessThanOrEqual(TOL.mc);
    expect(r.cusp.max).toBeLessThanOrEqual(TOL.cusp);
  });

  it("grade aleatória de 3000 mapas — 60°–66°", () => {
    const r = compare(grid(3000, 60, 66, 7));
    results.grid_high = r;
    expect(r.asc.max).toBeLessThanOrEqual(TOL.asc);
    expect(r.mc.max).toBeLessThanOrEqual(TOL.mc);
    expect(r.cusp.max).toBeLessThanOrEqual(TOL.cusp);
  });

  it("polares (> 66,5°): fallback registrado; ASC/MC continuam dentro da tolerância", () => {
    const polar = [...caseSamples.filter((s) => Math.abs(s.lat) > 66.5), ...grid(500, 67, 80, 99)];
    const r = compare(polar);
    results.polar = r;
    expect(r.asc.max).toBeLessThanOrEqual(TOL.asc);
    expect(r.mc.max).toBeLessThanOrEqual(TOL.mc);
    // O motor usa Porphyry quando Placidus não é definível; nunca devolve cúspides inválidas em silêncio.
    for (const s of caseSamples.filter((x) => Math.abs(x.lat) > 66.5)) {
      const x = engine.housesAtSync(s.jd, s.lat, s.lon, "placidus");
      const o = oracleHouses(s.jd, s.lat, s.lon);
      if (!o.placidus) expect(x.fallback_used).toBe(true);
    }
  });

  it("gera relatório (BENCHMARK_REPORT=1)", () => {
    if (!process.env.BENCHMARK_REPORT) return;
    mkdirSync("tests/benchmark/results", { recursive: true });
    const round = (s: ErrorStats) => Object.fromEntries(Object.entries(s).map(([k, v]) => [k, k === "n" ? v : Number(v.toPrecision(4))]));
    const out = Object.fromEntries(
      Object.entries(results).map(([k, v]) => [k, { n: v.n, fallback: v.fallback, oracle_undefined: v.oracleUndefined, asc: round(v.asc), mc: round(v.mc), cusp: round(v.cusp) }]),
    );
    writeFileSync("tests/benchmark/results/houses.json", `${JSON.stringify({ generated_at: new Date().toISOString(), tolerance_deg: TOL, reference: "oráculo independente (IAU 1982 GMST + nutação Meeus cap. 22 + obliquidade verdadeira; Placidus por semiarcos)", results: out }, null, 2)}\n`);
  });
});
