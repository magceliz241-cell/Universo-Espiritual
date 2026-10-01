import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { XalenEphemerisEngine } from "@/lib/astro/xalen-engine";
import { separation } from "@/lib/astro/zodiac";

/**
 * Sanidade contra os valores "J2000 JPL" citados em docs/ACCURACY.md do XALEN
 * (commit cc6edbe; 4 casas decimais, ±0,18″). Fonte de SEGUNDA MÃO: o benchmark
 * oficial (Fase 8) usa consultas próprias ao JPL Horizons.
 * Época 2000-01-01 12:00 UT, longitude eclíptica aparente geocêntrica de data.
 */
const QUOTED = {
  sun: 280.3689, moon: 223.3238, mercury: 271.8893, venus: 241.5658, mars: 327.9633,
  jupiter: 25.2531, saturn: 40.3956, uranus: 314.8092, neptune: 303.193,
} as const;

describe("J2000 vs valores JPL citados pelo XALEN", () => {
  const c = new XalenEphemerisEngine().calculateChartSync(
    { date: "2000-01-01", time: "12:00", timezone: "UTC", latitude: 0, longitude: 0 },
    { houseSystem: "placidus" },
  );
  for (const [body, ref] of Object.entries(QUOTED)) {
    const limit = body === "moon" ? 15 : 5;
    it(`${body} ≤ ${limit}″`, () => {
      const lon = c.planets[body as keyof typeof QUOTED].longitude;
      expect(separation(lon, ref) * 3600).toBeLessThan(limit);
    });
  }

  it("artefato comercial (sem Hipparcos), XALEN fixado", () => {
    const info = JSON.parse(readFileSync("vendor/su-ephem/BUILD_INFO.json", "utf8"));
    expect(info.hip_catalog_linked).toBe(false);
    expect(info.xalen_commit).toBe("cc6edbec1f748ebdc4950ae6198f575c5ada73fa");
  });
});
