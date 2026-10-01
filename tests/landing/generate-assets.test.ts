import { readFileSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { beforeAll, describe, expect, it } from "vitest";
import { ChartWheel } from "@/components/astrology/chart-wheel";
import { illuminationFromGeometry, nextElongation, PHASES, phaseFromElongation } from "@/lib/astro/moon";
import { jdFromUtcMs } from "@/lib/astro/time";
import type { PlanetId } from "@/lib/astro/types";
import { engineVersion, XalenEphemerisEngine } from "@/lib/astro/xalen-engine";
import { normalize } from "@/lib/astro/zodiac";

/**
 * landing/assets.js: a roda do mapa de exemplo (mesmo componente do app), as séries do céu ao vivo e os
 * instantes das fases principais da Lua, tudo calculado com o XALEN.
 *
 * - "gera landing/assets.js" só roda com `npm run build:landing-assets`.
 * - "céu ao vivo" roda sempre (npm test): confere, contra o motor, a interpolação que landing/sky.js faz no
 *   navegador com o assets.js que está no repositório.
 */
const DAY = 86_400_000;
const PLANETS: PlanetId[] = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];
// Passo das amostras (dias): Sol e Lua diários; planetas rápidos a cada 2 dias; lentos a cada 5.
const STEP: Record<string, number> = { sun: 1, moon: 1, moonLat: 1, mercury: 2, venus: 2, mars: 2, jupiter: 5, saturn: 5, uranus: 5, neptune: 5, pluto: 5 };
const T0 = Date.UTC(2026, 7, 15); // 17 dias antes do início útil (01/09/2026), para a janela de interpolação
const T_END = Date.UTC(2031, 0, 20); // 20 dias depois do fim útil (31/12/2030)
// Limites de aceitação da interpolação (segundos de arco), bem abaixo das tolerâncias do benchmark (5″/15″).
const MAX_ERR_ARCSEC = 2;

type SkyLib = {
  at: (sky: unknown, ms: number) => null | {
    bodies: Record<string, { lon: number; speed: number; retrograde: boolean; sign: string }>;
    moonLat: number; elongation: number; phaseIndex: number; illumination: number; waxing: boolean;
  };
  nextIngress: (sky: unknown, id: string, ms: number) => null | { ms: number; sign: string };
};

function loadLanding(): { sky: unknown; lib: SkyLib; principal: [string, number][] } {
  const win: Record<string, unknown> = {};
  new Function("window", readFileSync("landing/assets.js", "utf8"))(win);
  new Function("window", readFileSync("landing/sky.js", "utf8"))(win);
  return { sky: win.SU_SKY, lib: win.SU_SKY_LIB as SkyLib, principal: win.SU_MOON_PRINCIPAL as [string, number][] };
}

const arcsec = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180) * 3600;

describe.skipIf(!process.env.LANDING_ASSETS)("assets da landing", () => {
  it("gera landing/assets.js", () => {
    const engine = new XalenEphemerisEngine();
    const chart = engine.calculateChartSync(
      { date: "1990-08-15", time: "14:30", timezone: "America/Sao_Paulo", latitude: -23.5475, longitude: -46.6361 },
      { houseSystem: "placidus" },
    );
    const wheel = renderToStaticMarkup(createElement(ChartWheel, { chart, className: "wheel-svg" }));

    // Séries: longitudes "desenroladas" em segundos de arco inteiros, guardadas como diferenças.
    const series: Record<string, { step: number; d: number[] }> = {};
    for (const id of [...PLANETS, "moonLat"]) {
      const step = STEP[id];
      const d: number[] = [];
      let prevRaw: number | null = null;
      let unwrapped = 0;
      let prevRounded = 0;
      for (let t = T0; t <= T_END; t += step * DAY) {
        const body = id === "moonLat" ? "moon" : id;
        const p = engine.bodyPositionsSync(jdFromUtcMs(t), [body as PlanetId])[body];
        const raw = id === "moonLat" ? p.latitude : p.longitude;
        if (id === "moonLat") unwrapped = raw;
        else unwrapped = prevRaw === null ? raw : unwrapped + ((((raw - prevRaw + 540) % 360) - 180));
        prevRaw = raw;
        const rounded = Math.round(unwrapped * 3600);
        d.push(rounded - prevRounded);
        prevRounded = rounded;
      }
      series[id] = { step, d };
    }

    // Instantes das fases principais (UTC).
    const principal: [string, number][] = [];
    let jd = jdFromUtcMs(Date.UTC(2026, 8, 25));
    const end = jdFromUtcMs(Date.UTC(2031, 0, 10));
    const targets = [0, 90, 180, 270];
    while (jd < end) {
      const next = targets
        .map((target) => ({ target, jd: nextElongation(jd, target) }))
        .sort((a, b) => a.jd - b.jd)[0];
      principal.push([new Date(Math.round((next.jd - 2440587.5) * DAY)).toISOString(), [0, 2, 4, 6][targets.indexOf(next.target)]]);
      jd = next.jd + 0.5;
    }

    const sky = { v: 1, xalen: engineVersion().commit.slice(0, 12), t0: T0, series };
    const out = `// ARQUIVO GERADO por tests/landing/generate-assets.test.ts (npm run build:landing-assets). Não edite à mão.
// Céu calculado com XALEN Ephemeris (modo analítico): longitudes geocêntricas aparentes, tropicais, em segundos de arco
// (diferenças entre amostras). Válido de 01/09/2026 a 31/12/2030. Mapa de exemplo: 15/08/1990 14:30, São Paulo.
window.SU_PHASES = ${JSON.stringify(PHASES.map((p) => p.label))};
window.SU_SKY = ${JSON.stringify(sky)};
window.SU_MOON_PRINCIPAL = ${JSON.stringify(principal)};
window.SU_WHEEL = ${JSON.stringify(wheel)};
`;
    writeFileSync("landing/assets.js", out);
    expect(principal.length).toBeGreaterThan(100);
    expect(wheel).toContain("<svg");
  }, 300_000);
});

describe("céu ao vivo da landing (landing/sky.js + landing/assets.js)", () => {
  const engine = new XalenEphemerisEngine();
  let sky: unknown;
  let lib: SkyLib;
  beforeAll(() => ({ sky, lib } = loadLanding()));
  const start = Date.UTC(2026, 8, 1);
  const stop = Date.UTC(2030, 11, 31, 23, 59);

  it(`interpola posições com erro ≤ ${MAX_ERR_ARCSEC}″ em instantes aleatórios`, () => {
    let seed = 42;
    const rand = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
    const worst: Record<string, number> = {};
    let phaseOk = 0, phaseTotal = 0, illumMax = 0, retroChecked = 0;
    for (let n = 0; n < 1500; n++) {
      const ms = start + rand() * (stop - start);
      const s = lib.at(sky, ms)!;
      expect(s).not.toBeNull();
      const ref = engine.bodyPositionsSync(jdFromUtcMs(ms), PLANETS);
      for (const id of PLANETS) {
        worst[id] = Math.max(worst[id] ?? 0, arcsec(s.bodies[id].lon, ref[id].longitude));
        if (Math.abs(ref[id].speed) > 0.01) {
          expect(s.bodies[id].retrograde, `${id} retrógrado em ${new Date(ms).toISOString()}`).toBe(ref[id].retrograde);
          retroChecked++;
        }
      }
      worst.moonLat = Math.max(worst.moonLat ?? 0, Math.abs(s.moonLat - ref.moon.latitude) * 3600);
      const e = normalize(ref.moon.longitude - ref.sun.longitude);
      illumMax = Math.max(illumMax, Math.abs(s.illumination - illuminationFromGeometry(e, ref.moon.latitude)));
      // Fase: igual à do app, salvo a menos de 0,01° de uma fronteira de setor.
      if (Math.abs((((e + 22.5) % 45) + 45) % 45) > 0.01 && Math.abs((((e + 22.5) % 45) + 45) % 45 - 45) > 0.01) {
        phaseTotal++;
        if (PHASES[s.phaseIndex].id === phaseFromElongation(e).id) phaseOk++;
      }
    }
    console.log("Erro máximo da interpolação (″):", Object.fromEntries(Object.entries(worst).map(([k, v]) => [k, +v.toFixed(3)])),
      "| iluminação máx:", illumMax.toExponential(2), "| retrógrado conferido:", retroChecked);
    for (const [id, err] of Object.entries(worst)) expect(err, id).toBeLessThanOrEqual(MAX_ERR_ARCSEC);
    expect(illumMax).toBeLessThan(1e-4);
    expect(phaseOk).toBe(phaseTotal);
  }, 60_000);

  it("fora do período da tabela não inventa céu", () => {
    expect(lib.at(sky, Date.UTC(2026, 7, 1))).toBeNull();
    expect(lib.at(sky, Date.UTC(2031, 6, 1))).toBeNull();
  });

  it("próxima entrada da Lua num signo bate com o motor (±1 min)", () => {
    const ms = Date.UTC(2027, 2, 10, 12);
    const ing = lib.nextIngress(sky, "moon", ms)!;
    const lonAt = (t: number) => engine.bodyPositionsSync(jdFromUtcMs(t), ["moon"]).moon.longitude;
    const before = Math.floor(lonAt(ing.ms - 60_000) / 30), after = Math.floor(lonAt(ing.ms + 60_000) / 30);
    expect(after).toBe((before + 1) % 12);
    expect(ing.ms - ms).toBeLessThan(3 * DAY);
  });
});
