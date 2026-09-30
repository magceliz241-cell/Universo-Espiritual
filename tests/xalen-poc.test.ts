import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { XalenWasm } from "xalen-wasm";

/**
 * Fase 1 — POC do XALEN.
 *
 * Referência: valores "J2000 JPL" citados em docs/ACCURACY.md do XALEN
 * (commit cc6edbe), arredondados a 4 casas (±0,18″). São valores de segunda
 * mão; o benchmark da Fase 8 usa consultas próprias ao JPL Horizons.
 * Época: 2000-01-01 12:00 UT; longitude eclíptica aparente geocêntrica, de data.
 */
const J2000_JPL_QUOTED: Record<number, [string, number]> = {
  0: ["Sun", 280.3689],
  1: ["Moon", 223.3238],
  2: ["Mercury", 271.8893],
  3: ["Venus", 241.5658],
  4: ["Mars", 327.9633],
  5: ["Jupiter", 25.2531],
  6: ["Saturn", 40.3956],
  7: ["Uranus", 314.8092],
  8: ["Neptune", 303.193],
};

const arcsec = (a: number, b: number) => {
  const d = Math.abs(((a - b + 540) % 360) - 180);
  return d * 3600;
};

describe("XALEN POC", () => {
  const w = new XalenWasm();
  const jd = XalenWasm.julianDay(2000, 1, 1, 12);

  it("julianDay(2000-01-01 12h) = 2451545.0", () => {
    expect(jd).toBe(2451545.0);
  });

  for (const [id, [name, ref]] of Object.entries(J2000_JPL_QUOTED)) {
    const limit = name === "Moon" ? 15 : 5;
    it(`${name} em J2000 dentro de ${limit}″ do valor JPL citado`, () => {
      const lon = w.tropicalLongitude(jd, Number(id));
      expect(arcsec(lon, ref)).toBeLessThan(limit);
    });
  }

  it("é determinístico", () => {
    const a = w.planetPositionJson(jd, 1, false, 0);
    const b = new XalenWasm().planetPositionJson(jd, 1, false, 0);
    expect(a).toBe(b);
  });

  it("build é comercial (sem catálogo Hipparcos não comercial)", () => {
    const info = JSON.parse(readFileSync("vendor/xalen-wasm/BUILD_INFO.json", "utf8"));
    expect(info.hip_catalog_linked).toBe(false);
    expect(info.cargo_flags).toContain("--no-default-features");
    expect(info.commit).toBe("cc6edbec1f748ebdc4950ae6198f575c5ada73fa");
  });
});
