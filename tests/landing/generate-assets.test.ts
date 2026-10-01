import { writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { ChartWheel } from "@/components/astrology/chart-wheel";
import { illuminationFromGeometry, nextElongation, PHASES, phaseFromElongation } from "@/lib/astro/moon";
import { jdFromUtcMs } from "@/lib/astro/time";
import { XalenEphemerisEngine } from "@/lib/astro/xalen-engine";
import { normalize, toZodiac } from "@/lib/astro/zodiac";

/**
 * Gera landing/assets.js: a roda do mapa de exemplo (mesmo componente do app) e a tabela da Lua
 * calculada com o XALEN. Rode com: npm run build:landing-assets
 */
describe.skipIf(!process.env.LANDING_ASSETS)("assets da landing", () => {
  it("gera landing/assets.js", () => {
    const engine = new XalenEphemerisEngine();
    const chart = engine.calculateChartSync(
      { date: "1990-08-15", time: "14:30", timezone: "America/Sao_Paulo", latitude: -23.5475, longitude: -46.6361 },
      { houseSystem: "placidus" },
    );
    const wheel = renderToStaticMarkup(createElement(ChartWheel, { chart, className: "wheel-svg" }));

    // Tabela diária (12:00 no horário de Brasília = 15:00 UTC) de set/2026 a dez/2030.
    const days: [string, number, number, string][] = [];
    for (let t = Date.UTC(2026, 8, 1, 15); t <= Date.UTC(2030, 11, 31, 15); t += 86_400_000) {
      const jd = jdFromUtcMs(t);
      const p = engine.bodyPositionsSync(jd, ["sun", "moon"]);
      const e = normalize(p.moon.longitude - p.sun.longitude);
      const phase = phaseFromElongation(e);
      days.push([
        new Date(t).toISOString().slice(0, 10),
        PHASES.indexOf(phase),
        Math.round(illuminationFromGeometry(e, p.moon.latitude) * 1000) / 1000,
        toZodiac(p.moon.longitude).sign,
      ]);
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
      principal.push([new Date(Math.round((next.jd - 2440587.5) * 86_400_000)).toISOString(), [0, 2, 4, 6][targets.indexOf(next.target)]]);
      jd = next.jd + 0.5;
    }

    const out = `// ARQUIVO GERADO por tests/landing/generate-assets.test.ts (npm run build:landing-assets). Não edite à mão.
// Lua calculada com XALEN Ephemeris (modo analítico), 12:00 de Brasília. Mapa de exemplo: 15/08/1990 14:30, São Paulo.
window.SU_PHASES = ${JSON.stringify(PHASES.map((p) => p.label))};
window.SU_MOON_DAYS = ${JSON.stringify(days)};
window.SU_MOON_PRINCIPAL = ${JSON.stringify(principal)};
window.SU_WHEEL = ${JSON.stringify(wheel)};
`;
    writeFileSync("landing/assets.js", out);
    expect(days.length).toBeGreaterThan(800);
    expect(principal.length).toBeGreaterThan(100);
    expect(wheel).toContain("<svg");
  });
});
