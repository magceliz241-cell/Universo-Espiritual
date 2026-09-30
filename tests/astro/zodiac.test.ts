import { describe, expect, it } from "vitest";
import { formatDms, houseOf, normalize, separation, toZodiac } from "@/lib/astro/zodiac";

describe("zodíaco", () => {
  it("0° = Áries 0°00′00″ e 360° volta para Áries", () => {
    expect(toZodiac(0)).toMatchObject({ sign: "aries", degree: 0, minute: 0, second: 0 });
    expect(toZodiac(360)).toMatchObject({ sign: "aries", degree: 0 });
  });

  it("29°59′59,9″ continua no signo (truncamento)", () => {
    const p = toZodiac(29 + 59 / 60 + 59.9 / 3600);
    expect(p).toMatchObject({ sign: "aries", degree: 29, minute: 59, second: 59 });
  });

  it("30° exato é Touro 0°", () => {
    expect(toZodiac(30)).toMatchObject({ sign: "taurus", degree: 0, minute: 0, second: 0 });
  });

  it("fim de Peixes e longitudes negativas", () => {
    expect(toZodiac(359.99999)).toMatchObject({ sign: "pisces", degree: 29, minute: 59 });
    expect(toZodiac(-30)).toMatchObject({ sign: "pisces", degree: 0 });
  });

  it("exemplo do master prompt: 142,51234° = Leão 22°30′44″", () => {
    const p = toZodiac(142.51234);
    expect(p.sign).toBe("leo");
    expect(formatDms(p)).toBe("22°30′44″");
  });

  it("normalize e separation", () => {
    expect(normalize(-1)).toBe(359);
    expect(separation(350, 10)).toBe(20);
    expect(separation(0, 180)).toBe(180);
  });
});

describe("casa de um ponto", () => {
  const cusps = [340, 10, 40, 70, 100, 130, 160, 190, 220, 250, 280, 310];
  it("atravessa 0°", () => {
    expect(houseOf(350, cusps)).toBe(1);
    expect(houseOf(5, cusps)).toBe(1);
    expect(houseOf(10, cusps)).toBe(2);
    expect(houseOf(339.9, cusps)).toBe(12);
  });
});
