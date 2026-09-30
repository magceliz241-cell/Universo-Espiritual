import type { AspectType, PlanetId, SignId } from "@/lib/astro/types";

/** Ligação entre resultados calculados e documentos da KB. */
export const kb = {
  sign: (s: SignId) => `astrology/signs/${s}`,
  planet: (p: PlanetId) => `astrology/planets/${p}`,
  house: (n: number) => `astrology/houses/house-${n}`,
  aspect: (a: AspectType) => `astrology/aspects/${a}`,
  astrologyMethod: "astrology/methodology",
  synastry: "astrology/synastry",
  number: (n: number) => `numerology/numbers/${n}`,
  numerologyCalc: (c: "life-path" | "expression" | "soul-urge" | "personality" | "personal-year") =>
    `numerology/calculations/${c}`,
  numerologyMethod: "numerology/methodology",
  moonPhase: (slug: string) => `moon/phases/${slug}`,
  moonMethod: "moon/methodology",
  tarotMethod: "tarot/methodology",
  tarotSpread: (s: "daily-card" | "open-question" | "love-3-cards") => `tarot/spreads/${s}`,
  dreamSymbol: (slug: string) => `dreams/symbols/${slug}`,
  dreamMethod: "dreams/methodology",
} as const;
