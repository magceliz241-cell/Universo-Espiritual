import type { SignId, ZodiacPosition } from "./types";

export const SIGNS: readonly SignId[] = [
  "aries", "taurus", "gemini", "cancer", "leo", "virgo",
  "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
];

export const SIGN_LABELS_PT: Record<SignId, string> = {
  aries: "Áries",
  taurus: "Touro",
  gemini: "Gêmeos",
  cancer: "Câncer",
  leo: "Leão",
  virgo: "Virgem",
  libra: "Libra",
  scorpio: "Escorpião",
  sagittarius: "Sagitário",
  capricorn: "Capricórnio",
  aquarius: "Aquário",
  pisces: "Peixes",
};

/** Normaliza para [0, 360). */
export function normalize(deg: number): number {
  const x = deg % 360;
  return x < 0 ? x + 360 : x === 360 ? 0 : x;
}

/** Separação angular mínima entre duas longitudes, em [0, 180]. */
export function separation(a: number, b: number): number {
  const d = Math.abs(normalize(a) - normalize(b));
  return d > 180 ? 360 - d : d;
}

/**
 * Longitude → signo + grau/minuto/segundo dentro do signo.
 * Truncamento (não arredondamento): 29°59′59,9″ continua no mesmo signo, como
 * nas efemérides astrológicas. A longitude completa é mantida para cálculos.
 */
export function toZodiac(longitude: number): ZodiacPosition {
  const lon = normalize(longitude);
  // Arcossegundos inteiros com tolerância a ruído de ponto flutuante (1e-7″).
  const totalSec = Math.floor(lon * 3600 + 1e-7);
  const signIndex = Math.floor(totalSec / 108_000) % 12;
  const inSign = totalSec - signIndex * 108_000;
  return {
    longitude: lon,
    sign: SIGNS[signIndex],
    degree: Math.floor(inSign / 3600),
    minute: Math.floor((inSign % 3600) / 60),
    second: inSign % 60,
  };
}

/** Formato "22°30′44″". */
export function formatDms(p: Pick<ZodiacPosition, "degree" | "minute" | "second">): string {
  return `${p.degree}°${String(p.minute).padStart(2, "0")}′${String(p.second).padStart(2, "0")}″`;
}
