import { describe, expect, it } from "vitest";
import { CARD_BY_ID } from "@/lib/tarot/deck";
import { drawSpread, SPREADS } from "@/lib/tarot/draw";

describe("sorteio do Tarot", () => {
  it("cartas distintas, posições da tiragem, ids válidos", () => {
    for (let i = 0; i < 300; i++) {
      const d = drawSpread("open-question");
      expect(d.map((c) => c.position)).toEqual(SPREADS["open-question"].positions);
      expect(new Set(d.map((c) => c.cardId)).size).toBe(3);
      for (const c of d) expect(CARD_BY_ID.has(c.cardId)).toBe(true);
    }
  });

  it("orientação desligada nunca inverte", () => {
    for (let i = 0; i < 50; i++) expect(drawSpread("daily-card", { reversals: false })[0].reversed).toBe(false);
  });

  it("RNG injetado é reproduzível (Fisher–Yates)", () => {
    const zero = () => 0;
    const a = drawSpread("love-3-cards", { rng: zero });
    expect(a).toEqual(drawSpread("love-3-cards", { rng: zero }));
    expect(a.every((c) => c.reversed === false)).toBe(true);
  });

  it("distribuição plausível: todas as cartas aparecem e ~50% invertidas", () => {
    const seen = new Set<string>();
    let reversed = 0;
    const N = 4000;
    for (let i = 0; i < N; i++) {
      const [c] = drawSpread("daily-card");
      seen.add(c.cardId);
      if (c.reversed) reversed++;
    }
    expect(seen.size).toBe(78);
    expect(reversed / N).toBeGreaterThan(0.45);
    expect(reversed / N).toBeLessThan(0.55);
  });

  it("tarot do amor exige o bump", () => {
    expect(SPREADS["love-3-cards"].love).toBe(true);
    expect(SPREADS["daily-card"].love).toBe(false);
  });
});
