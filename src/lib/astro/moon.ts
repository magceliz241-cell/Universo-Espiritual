import "server-only";
import type { SignId } from "./types";
import { jdFromUtcMs } from "./time";
import { XalenEphemerisEngine } from "./xalen-engine";
import { normalize, toZodiac } from "./zodiac";

/**
 * Lua calculada pelo software (posições XALEN). A KB fornece o simbolismo.
 * Fase pela elongação Sol–Lua (λ☾ − λ☉); iluminação pela fórmula k = (1 − cos ψ)/2,
 * com cos ψ = cos β☾ · cos(λ☾ − λ☉) (aproximação geocêntrica, erro < 1%).
 */
export const MOON_VERSION = "moon-1.0.0";

export type MoonPhaseId =
  | "new_moon" | "waxing_crescent" | "first_quarter" | "waxing_gibbous"
  | "full_moon" | "waning_gibbous" | "last_quarter" | "waning_crescent";

export const PHASES: { id: MoonPhaseId; slug: string; label: string; center: number }[] = [
  { id: "new_moon", slug: "new-moon", label: "Lua Nova", center: 0 },
  { id: "waxing_crescent", slug: "waxing-crescent", label: "Lua Crescente", center: 45 },
  { id: "first_quarter", slug: "first-quarter", label: "Quarto Crescente", center: 90 },
  { id: "waxing_gibbous", slug: "waxing-gibbous", label: "Gibosa Crescente", center: 135 },
  { id: "full_moon", slug: "full-moon", label: "Lua Cheia", center: 180 },
  { id: "waning_gibbous", slug: "waning-gibbous", label: "Gibosa Minguante", center: 225 },
  { id: "last_quarter", slug: "last-quarter", label: "Quarto Minguante", center: 270 },
  { id: "waning_crescent", slug: "waning-crescent", label: "Lua Minguante", center: 315 },
];

/** Fase pelo setor de 45° centrado em cada fase (Lua Nova = [−22,5°, 22,5°)). */
export function phaseFromElongation(elongation: number): (typeof PHASES)[number] {
  const e = normalize(elongation);
  return PHASES[Math.floor(normalize(e + 22.5) / 45) % 8];
}

export function illuminationFromGeometry(elongation: number, moonLatitude: number): number {
  const rad = Math.PI / 180;
  const cosPsi = Math.cos(moonLatitude * rad) * Math.cos(elongation * rad);
  return (1 - cosPsi) / 2;
}

export interface MoonState {
  version: string;
  instant: string;
  elongation: number;
  phase: MoonPhaseId;
  phaseSlug: string;
  phaseLabel: string;
  illumination: number; // 0..1
  waxing: boolean;
  moonLongitude: number;
  moonSign: SignId;
  next: { phase: MoonPhaseId; label: string; instant: string }[];
}

const engine = new XalenEphemerisEngine();

function elongationAt(jd: number): { e: number; beta: number; lon: number } {
  const p = engine.bodyPositionsSync(jd, ["sun", "moon"]);
  return { e: normalize(p.moon.longitude - p.sun.longitude), beta: p.moon.latitude, lon: p.moon.longitude };
}

const SYNODIC_RATE = 360 / 29.530588; // °/dia (média)

/** Instante (JD) em que a elongação atinge `target`, depois de `jd0`. */
export function nextElongation(jd0: number, target: number): number {
  const e0 = elongationAt(jd0).e;
  let jd = jd0 + normalize(target - e0) / SYNODIC_RATE;
  if (normalize(target - e0) < 1e-9) jd += 29.530588;
  for (let i = 0; i < 8; i++) {
    const diff = ((normalize(target - elongationAt(jd).e) + 180) % 360) - 180;
    if (Math.abs(diff) < 1e-6) break;
    jd += diff / SYNODIC_RATE;
  }
  return jd;
}

const jdToIso = (jd: number) => new Date(Math.round((jd - 2_440_587.5) * 86_400_000)).toISOString();

export function moonState(at: Date = new Date()): MoonState {
  const jd = jdFromUtcMs(at.getTime());
  const { e, beta, lon } = elongationAt(jd);
  const phase = phaseFromElongation(e);
  const principal = [
    { phase: "new_moon" as const, target: 0 },
    { phase: "first_quarter" as const, target: 90 },
    { phase: "full_moon" as const, target: 180 },
    { phase: "last_quarter" as const, target: 270 },
  ];
  const next = principal
    .map((p) => ({ phase: p.phase, jd: nextElongation(jd, p.target) }))
    .sort((a, b) => a.jd - b.jd)
    .map((p) => ({ phase: p.phase, label: PHASES.find((x) => x.id === p.phase)!.label, instant: jdToIso(p.jd) }));
  return {
    version: MOON_VERSION,
    instant: at.toISOString(),
    elongation: e,
    phase: phase.id,
    phaseSlug: phase.slug,
    phaseLabel: phase.label,
    illumination: illuminationFromGeometry(e, beta),
    waxing: e < 180,
    moonLongitude: lon,
    moonSign: toZodiac(lon).sign,
    next,
  };
}
