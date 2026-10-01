import { ASPECTS_VERSION, chartBodies, crossAspects, SYNASTRY_CONFIG } from "./aspects";
import type { Aspect, BirthChart, BodyId, PlanetId } from "./types";
import { houseOf } from "./zodiac";

/**
 * Sinastria: dois mapas calculados separadamente + comparação.
 * NÃO existe score de compatibilidade (knowledge/astrology/synastry.md).
 */
export const SYNASTRY_VERSION = `synastry-1.0.0+${ASPECTS_VERSION}`;

/** Contatos destacados pela metodologia (knowledge/astrology/synastry.md). */
const KEY_CONTACTS: [BodyId | "ascendant" | "mc", BodyId | "ascendant" | "mc"][] = [
  ["sun", "moon"], ["sun", "venus"], ["sun", "mars"], ["moon", "venus"], ["moon", "mars"],
  ["mercury", "mercury"], ["mercury", "venus"], ["mercury", "mars"], ["venus", "mars"],
  ["saturn", "sun"], ["saturn", "moon"], ["saturn", "venus"], ["saturn", "mars"],
  ["jupiter", "sun"], ["jupiter", "moon"], ["jupiter", "mercury"], ["jupiter", "venus"], ["jupiter", "mars"],
];

export function isKeyContact(a: string, b: string): boolean {
  if (a === "ascendant" || a === "mc" || b === "ascendant" || b === "mc") return true;
  return KEY_CONTACTS.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

export interface SynastryAspect extends Aspect {
  key_contact: boolean;
}

export interface SynastryResult {
  version: string;
  aspects: SynastryAspect[]; // a = mapa A, b = mapa B
  /** Em qual casa do outro mapa cada planeta cai (null se o outro mapa não tem horário). */
  overlays: {
    a_in_b: Record<PlanetId, number> | null;
    b_in_a: Record<PlanetId, number> | null;
  };
  time_known: { a: boolean; b: boolean };
}

const PLANETS: PlanetId[] = ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"];

function overlay(from: BirthChart, into: BirthChart): Record<PlanetId, number> | null {
  if (into.houses.length !== 12) return null;
  const cusps = into.houses.map((h) => h.longitude);
  return Object.fromEntries(PLANETS.map((p) => [p, houseOf(from.planets[p].longitude, cusps)])) as Record<
    PlanetId,
    number
  >;
}

export function synastry(a: BirthChart, b: BirthChart): SynastryResult {
  const aspects = crossAspects(chartBodies(a), chartBodies(b), SYNASTRY_CONFIG).map((x) => ({
    ...x,
    key_contact: isKeyContact(x.a, x.b),
  }));
  return {
    version: SYNASTRY_VERSION,
    aspects,
    overlays: { a_in_b: overlay(a, b), b_in_a: overlay(b, a) },
    time_known: { a: a.birth_data.time_known, b: b.birth_data.time_known },
  };
}
