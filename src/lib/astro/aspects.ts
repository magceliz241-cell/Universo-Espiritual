import type { AngleId, Aspect, AspectType, BirthChart, BodyId, PlanetId, PointId } from "./types";
import { normalize, separation } from "./zodiac";

/**
 * Detector de aspectos maiores. Toda regra de orbe está em ASPECT_CONFIG /
 * SYNASTRY_CONFIG (versionadas); nada de orbe espalhado pelo código.
 */
export const ASPECTS_VERSION = "aspects-1.0.0";

export const ASPECT_ANGLES: Record<AspectType, number> = {
  conjunction: 0,
  sextile: 60,
  square: 90,
  trine: 120,
  opposition: 180,
};

export interface OrbConfig {
  /** Orbe máximo por aspecto, em graus. */
  orbs: Record<AspectType, number>;
  /** Graus extras quando o Sol ou a Lua participam. */
  luminaryBonus: number;
  /** Teto de orbe quando um ponto secundário (nó, Quíron, Lilith) participa. */
  pointCap: number;
  /** Teto de orbe quando um ângulo (ASC/MC) participa. */
  angleCap: number;
}

export const ASPECT_CONFIG: OrbConfig = {
  orbs: { conjunction: 8, opposition: 8, trine: 7, square: 7, sextile: 5 },
  luminaryBonus: 2,
  pointCap: 3,
  angleCap: 5,
};

/** Sinastria usa orbes mais apertados (contatos entre mapas). */
export const SYNASTRY_CONFIG: OrbConfig = {
  orbs: { conjunction: 6, opposition: 6, trine: 5, square: 5, sextile: 4 },
  luminaryBonus: 1,
  pointCap: 2,
  angleCap: 4,
};

export const ASPECT_PLANETS: readonly PlanetId[] = [
  "sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto",
];
/** Pontos secundários considerados (o nó médio fica fora para não duplicar o verdadeiro). */
export const ASPECT_POINTS: readonly PointId[] = ["true_node", "chiron", "mean_lilith"];
export const ASPECT_ANGLE_IDS: readonly AngleId[] = ["ascendant", "mc"];

type Key = BodyId | AngleId;

export interface AspectBody {
  key: Key;
  longitude: number;
  /** graus/dia; null para ângulos (tratados como fixos). */
  speed: number | null;
}

const LUMINARIES = new Set<Key>(["sun", "moon"]);
const POINTS = new Set<Key>(ASPECT_POINTS);
const ANGLES = new Set<Key>(ASPECT_ANGLE_IDS);

export function maxOrb(type: AspectType, a: Key, b: Key, cfg: OrbConfig): number {
  let orb = cfg.orbs[type];
  if (LUMINARIES.has(a) || LUMINARIES.has(b)) orb += cfg.luminaryBonus;
  if (POINTS.has(a) || POINTS.has(b)) orb = Math.min(orb, cfg.pointCap);
  if (ANGLES.has(a) || ANGLES.has(b)) orb = Math.min(orb, cfg.angleCap);
  return orb;
}

/** Aspecto (se houver) entre duas longitudes; escolhe o de menor orbe. */
export function findAspect(a: AspectBody, b: AspectBody, cfg: OrbConfig): Aspect | null {
  const sep = separation(a.longitude, b.longitude);
  let best: Aspect | null = null;
  for (const [type, angle] of Object.entries(ASPECT_ANGLES) as [AspectType, number][]) {
    const orb = Math.abs(sep - angle);
    if (orb <= maxOrb(type, a.key, b.key, cfg) && (!best || orb < best.orb)) {
      best = { a: a.key, b: b.key, type, angle, separation: sep, orb, applying: applying(a, b, angle, orb) };
    }
  }
  return best;
}

/**
 * Aplicativo = o orbe diminui com o movimento atual dos corpos.
 * null quando algum dos lados é ângulo (sem velocidade) ou sem movimento relativo.
 */
function applying(a: AspectBody, b: AspectBody, angle: number, orb: number): boolean | null {
  if (a.speed === null || b.speed === null) return null;
  if (a.speed === b.speed) return null;
  const dt = 1 / 24; // 1 hora
  const future = Math.abs(
    separation(normalize(a.longitude + a.speed * dt), normalize(b.longitude + b.speed * dt)) - angle,
  );
  return future < orb;
}

function sortAspects(list: Aspect[]): Aspect[] {
  return list.sort((x, y) => x.orb - y.orb || `${x.a}${x.b}`.localeCompare(`${y.a}${y.b}`));
}

export function chartBodies(chart: Pick<BirthChart, "planets" | "points" | "angles">): AspectBody[] {
  const out: AspectBody[] = [
    ...ASPECT_PLANETS.map((k) => ({ key: k, longitude: chart.planets[k].longitude, speed: chart.planets[k].speed })),
    ...ASPECT_POINTS.map((k) => ({ key: k, longitude: chart.points[k].longitude, speed: chart.points[k].speed })),
  ];
  if (chart.angles) {
    for (const k of ASPECT_ANGLE_IDS) out.push({ key: k, longitude: chart.angles[k].longitude, speed: null });
  }
  return out;
}

/** Aspectos natais entre todos os pares (sem ângulo×ângulo e sem ponto×ponto). */
export function natalAspects(bodies: AspectBody[], cfg: OrbConfig = ASPECT_CONFIG): Aspect[] {
  const out: Aspect[] = [];
  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];
      if (ANGLES.has(a.key) && ANGLES.has(b.key)) continue;
      if (POINTS.has(a.key) && POINTS.has(b.key)) continue;
      const asp = findAspect(a, b, cfg);
      if (asp) out.push(asp);
    }
  }
  return sortAspects(out);
}

/** Aspectos cruzados A→B (a = corpo do mapa A, b = corpo do mapa B). */
export function crossAspects(a: AspectBody[], b: AspectBody[], cfg: OrbConfig = SYNASTRY_CONFIG): Aspect[] {
  const out: Aspect[] = [];
  for (const x of a) {
    for (const y of b) {
      if (ANGLES.has(x.key) && ANGLES.has(y.key)) continue;
      if (POINTS.has(x.key) && POINTS.has(y.key)) continue;
      const asp = findAspect({ ...x, speed: null }, { ...y, speed: null }, cfg);
      if (asp) out.push(asp);
    }
  }
  return sortAspects(out);
}
