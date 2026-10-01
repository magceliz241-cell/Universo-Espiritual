import type { AngleId, AspectType, PlanetId, PointId, SignId } from "./types";

/** Rótulos e glifos para a interface (o cálculo usa só os ids). */
export const VS15 = "︎"; // força apresentação de texto (não emoji)

export const SIGN_GLYPHS: Record<SignId, string> = {
  aries: "♈", taurus: "♉", gemini: "♊", cancer: "♋", leo: "♌", virgo: "♍",
  libra: "♎", scorpio: "♏", sagittarius: "♐", capricorn: "♑", aquarius: "♒", pisces: "♓",
};

export const SIGN_NAMES: Record<SignId, string> = {
  aries: "Áries", taurus: "Touro", gemini: "Gêmeos", cancer: "Câncer", leo: "Leão", virgo: "Virgem",
  libra: "Libra", scorpio: "Escorpião", sagittarius: "Sagitário", capricorn: "Capricórnio", aquarius: "Aquário", pisces: "Peixes",
};

export const SIGN_ELEMENT: Record<SignId, "fire" | "earth" | "air" | "water"> = {
  aries: "fire", leo: "fire", sagittarius: "fire",
  taurus: "earth", virgo: "earth", capricorn: "earth",
  gemini: "air", libra: "air", aquarius: "air",
  cancer: "water", scorpio: "water", pisces: "water",
};

export const ELEMENT_NAMES = { fire: "Fogo", earth: "Terra", air: "Ar", water: "Água" } as const;

export const BODY_GLYPHS: Record<PlanetId | PointId, string> = {
  sun: "☉", moon: "☽", mercury: "☿", venus: "♀", mars: "♂", jupiter: "♃", saturn: "♄",
  uranus: "♅", neptune: "♆", pluto: "♇", mean_node: "☊", true_node: "☊", chiron: "⚷", mean_lilith: "⚸",
};

export const BODY_NAMES: Record<PlanetId | PointId, string> = {
  sun: "Sol", moon: "Lua", mercury: "Mercúrio", venus: "Vênus", mars: "Marte", jupiter: "Júpiter",
  saturn: "Saturno", uranus: "Urano", neptune: "Netuno", pluto: "Plutão",
  mean_node: "Nodo Norte (médio)", true_node: "Nodo Norte", chiron: "Quíron", mean_lilith: "Lilith",
};

export const ANGLE_NAMES: Record<AngleId, string> = {
  ascendant: "Ascendente", mc: "Meio do Céu", descendant: "Descendente", ic: "Fundo do Céu",
};
export const ANGLE_SHORT: Record<AngleId, string> = { ascendant: "ASC", mc: "MC", descendant: "DSC", ic: "IC" };

export const ASPECT_NAMES: Record<AspectType, string> = {
  conjunction: "Conjunção", sextile: "Sextil", square: "Quadratura", trine: "Trígono", opposition: "Oposição",
};
export const ASPECT_GLYPHS: Record<AspectType, string> = {
  conjunction: "☌", sextile: "⚹", square: "□", trine: "△", opposition: "☍",
};

export function keyName(k: string): string {
  if (k in BODY_NAMES) return BODY_NAMES[k as PlanetId];
  if (k in ANGLE_NAMES) return ANGLE_NAMES[k as AngleId];
  return k;
}
export function keyGlyph(k: string): string {
  if (k in BODY_GLYPHS) return BODY_GLYPHS[k as PlanetId] + VS15;
  if (k in ANGLE_SHORT) return ANGLE_SHORT[k as AngleId];
  return "";
}
