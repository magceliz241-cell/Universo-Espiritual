import { describe, expect, it } from "vitest";
import { normalizeBirth } from "@/lib/astro/xalen-engine";
import { ephemerisRows, parseHours } from "../../scripts/fetch-jpl-fixtures";
import { CASES } from "./cases";
import { jdOfCase } from "./jd";

describe("script do JPL Horizons", () => {
  it("lê o bloco $$SOE…$$EOE (formato CSV do Horizons)", () => {
    const sample = "cabeçalho\n$$SOE\n 2451545.000000000, , , 280.3689000, -0.0002000,\n$$EOE\nrodapé";
    expect(ephemerisRows(sample)[0].slice(0, 5)).toEqual(["2451545.000000000", "", "", "280.3689000", "-0.0002000"]);
    expect(() => ephemerisRows("sem dados")).toThrow(/sem efemérides/);
  });

  it("lê tempo sideral em HH MM SS e em horas decimais", () => {
    expect(parseHours("18 41 50.5484")).toBeCloseTo(18 + 41 / 60 + 50.5484 / 3600, 10);
    expect(parseHours("18.697374")).toBeCloseTo(18.697374, 10);
  });

  it("o JD de cada caso (Intl, independente) é igual ao JD do app", () => {
    for (const c of CASES) {
      const app = normalizeBirth({ date: c.date, time: c.time, timezone: c.timezone, latitude: c.lat, longitude: c.lon, fold: c.fold }).birth.jd_ut;
      expect(Math.abs(jdOfCase(c) - app) * 86400, c.id).toBeLessThan(0.001);
    }
  });
});
