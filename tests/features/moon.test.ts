import { describe, expect, it } from "vitest";
import { illuminationFromGeometry, moonState, nextElongation, phaseFromElongation } from "@/lib/astro/moon";
import { jdFromUtcMs } from "@/lib/astro/time";

const minutesBetween = (jd: number, iso: string) => Math.abs(jd - jdFromUtcMs(Date.parse(iso))) * 1440;

describe("fase pela elongação", () => {
  it("setores de 45°", () => {
    expect(phaseFromElongation(0).id).toBe("new_moon");
    expect(phaseFromElongation(22.49).id).toBe("new_moon");
    expect(phaseFromElongation(22.5).id).toBe("waxing_crescent");
    expect(phaseFromElongation(90).id).toBe("first_quarter");
    expect(phaseFromElongation(180).id).toBe("full_moon");
    expect(phaseFromElongation(270).id).toBe("last_quarter");
    expect(phaseFromElongation(359).id).toBe("new_moon");
    expect(phaseFromElongation(-10).id).toBe("new_moon");
  });

  it("iluminação", () => {
    expect(illuminationFromGeometry(0, 0)).toBeCloseTo(0, 9);
    expect(illuminationFromGeometry(180, 0)).toBeCloseTo(1, 9);
    expect(illuminationFromGeometry(90, 0)).toBeCloseTo(0.5, 9);
  });
});

/**
 * Referência: instantes das fases de janeiro/2024 publicados pelo U.S. Naval Observatory
 * (Lua Nova 11/01 11:57 UTC, Quarto Crescente 18/01 03:52 UTC, Lua Cheia 25/01 17:54 UTC).
 * Tolerância: 3 minutos (os valores publicados têm resolução de 1 minuto).
 */
describe("instantes das fases (XALEN)", () => {
  const from = jdFromUtcMs(Date.parse("2024-01-05T00:00:00Z"));
  it("Lua Nova, Quarto Crescente e Lua Cheia de jan/2024", () => {
    expect(minutesBetween(nextElongation(from, 0), "2024-01-11T11:57:00Z")).toBeLessThan(3);
    expect(minutesBetween(nextElongation(from, 90), "2024-01-18T03:52:00Z")).toBeLessThan(3);
    expect(minutesBetween(nextElongation(from, 180), "2024-01-25T17:54:00Z")).toBeLessThan(3);
  });

  it("estado da Lua na Lua Cheia", () => {
    const s = moonState(new Date("2024-01-25T17:54:00Z"));
    expect(s.phase).toBe("full_moon");
    expect(s.illumination).toBeGreaterThan(0.99);
    expect(s.moonSign).toBe("leo");
    expect(s.next).toHaveLength(4);
    expect(Date.parse(s.next[0].instant)).toBeGreaterThan(Date.parse(s.instant));
  });
});
