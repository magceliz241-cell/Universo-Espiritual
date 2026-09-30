import { describe, expect, it } from "vitest";
import { XalenEphemerisEngine } from "@/lib/astro/xalen-engine";
import { type BirthData, ChartInputError } from "@/lib/astro/types";
import { separation } from "@/lib/astro/zodiac";

const engine = new XalenEphemerisEngine();
const SP: BirthData = { date: "1990-08-15", time: "14:30", timezone: "America/Sao_Paulo", latitude: -23.5505, longitude: -46.6333 };

describe("XalenEphemerisEngine", () => {
  it("J2000 em Greenwich: Sol em Capricórnio ~10°22′, Lua em Escorpião", () => {
    const c = engine.calculateChartSync(
      { date: "2000-01-01", time: "12:00", timezone: "UTC", latitude: 51.4779, longitude: 0 },
      { houseSystem: "placidus" },
    );
    expect(c.planets.sun.sign).toBe("capricorn");
    expect(c.planets.sun.degree).toBe(10);
    expect(c.planets.sun.minute).toBe(22);
    expect(c.planets.moon.sign).toBe("scorpio");
    expect(c.birth_data.jd_ut).toBe(2_451_545.0);
    expect(c.engine.version).toBe("cc6edbec1f748ebdc4950ae6198f575c5ada73fa");
  });

  it("gera todos os planetas, pontos, 12 casas e ângulos", () => {
    const c = engine.calculateChartSync(SP, { houseSystem: "placidus" });
    expect(Object.keys(c.planets)).toHaveLength(10);
    expect(Object.keys(c.points)).toEqual(["mean_node", "true_node", "chiron", "mean_lilith"]);
    expect(c.houses).toHaveLength(12);
    expect(c.angles).not.toBeNull();
    for (const p of Object.values(c.planets)) {
      expect(p.house).toBeGreaterThanOrEqual(1);
      expect(p.house).toBeLessThanOrEqual(12);
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
    }
    expect(c.birth_data.utc).toBe("1990-08-15T17:30:00.000Z");
  });

  it("Placidus: cúspide 1 = ASC e cúspide 10 = MC; ASC e DSC opostos", () => {
    const c = engine.calculateChartSync(SP, { houseSystem: "placidus" });
    expect(separation(c.houses[0].longitude, c.angles!.ascendant.longitude)).toBeLessThan(1e-9);
    expect(separation(c.houses[9].longitude, c.angles!.mc.longitude)).toBeLessThan(1e-9);
    expect(separation(c.angles!.ascendant.longitude, c.angles!.descendant.longitude)).toBeCloseTo(180, 9);
  });

  it("Equal: casas de 30° a partir do ASC", () => {
    const c = engine.calculateChartSync(SP, { houseSystem: "equal" });
    expect(separation(c.houses[0].longitude, c.angles!.ascendant.longitude)).toBeLessThan(1e-9);
    expect(separation(c.houses[1].longitude, c.houses[0].longitude)).toBeCloseTo(30, 9);
  });

  it("Whole Sign: casa 1 começa em 0° do signo do ASC; ASC real preservado", () => {
    const c = engine.calculateChartSync(SP, { houseSystem: "whole_sign" });
    expect(c.houses[0].sign).toBe(c.angles!.ascendant.sign);
    expect(c.houses[0].degree).toBe(0);
    expect(c.houses[0].minute).toBe(0);
    const p = engine.calculateChartSync(SP, { houseSystem: "placidus" });
    expect(separation(c.angles!.ascendant.longitude, p.angles!.ascendant.longitude)).toBeLessThan(1e-9);
  });

  it("é determinístico e o hash muda com sistema de casas", () => {
    const a = engine.calculateChartSync(SP, { houseSystem: "placidus" });
    const b = engine.calculateChartSync(SP, { houseSystem: "placidus" });
    const c = engine.calculateChartSync(SP, { houseSystem: "equal" });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.input_hash).toMatch(/^[0-9a-f]{64}$/);
    expect(a.input_hash).toBe(b.input_hash);
    expect(a.input_hash).not.toBe(c.input_hash);
  });

  it("horário desconhecido: sem casas/ângulos, com faixa de signos da Lua", () => {
    const c = engine.calculateChartSync({ ...SP, time: null }, { houseSystem: "placidus" });
    expect(c.birth_data.time_known).toBe(false);
    expect(c.angles).toBeNull();
    expect(c.houses).toEqual([]);
    expect(c.house_system_effective).toBeNull();
    expect(c.planets.sun.house).toBeNull();
    expect(c.moon_sign_range!.length).toBeGreaterThanOrEqual(1);
    expect(c.moon_sign_range).toContain(c.planets.moon.sign);
  });

  it("latitude alta (65°N) usa Placidus; polar (78°N) registra fallback Porphyry", () => {
    const high = engine.calculateChartSync(
      { date: "1985-03-10", time: "08:00", timezone: "Atlantic/Reykjavik", latitude: 65.68, longitude: -18.09 },
      { houseSystem: "placidus" },
    );
    expect(high.house_system_effective).toBe("placidus");
    const polar = engine.calculateChartSync(
      { date: "1985-03-10", time: "08:00", timezone: "Arctic/Longyearbyen", latitude: 78.22, longitude: 15.65 },
      { houseSystem: "placidus" },
    );
    expect(polar.house_system_effective).toBe("porphyry");
    expect(polar.house_system).toBe("placidus");
  });

  it("horário ambíguo exige fold; o fold muda o instante e o hash", () => {
    const amb: BirthData = { ...SP, date: "2019-02-16", time: "23:30" };
    expect(() => engine.calculateChartSync(amb, { houseSystem: "placidus" })).toThrow(ChartInputError);
    const f0 = engine.calculateChartSync({ ...amb, fold: 0 }, { houseSystem: "placidus" });
    const f1 = engine.calculateChartSync({ ...amb, fold: 1 }, { houseSystem: "placidus" });
    expect(f0.birth_data.utc).not.toBe(f1.birth_data.utc);
    expect(f0.input_hash).not.toBe(f1.input_hash);
  });

  it("rejeita coordenadas inválidas", () => {
    for (const bad of [{ latitude: 91 }, { longitude: -181 }, { latitude: Number.NaN }]) {
      expect(() => engine.calculateChartSync({ ...SP, ...bad }, { houseSystem: "placidus" })).toThrow(/Coordenadas/);
    }
  });

  it("retrógrado reflete a velocidade", () => {
    const c = engine.calculateChartSync(SP, { houseSystem: "placidus" });
    for (const p of Object.values(c.planets)) expect(p.retrograde).toBe(p.speed < 0);
    expect(c.planets.sun.retrograde).toBe(false);
    expect(c.planets.moon.retrograde).toBe(false);
  });
});
