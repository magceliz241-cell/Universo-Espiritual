/**
 * ORÁCULO INDEPENDENTE de casas/ASC/MC — só para testes. Não usa nada do XALEN.
 *
 * Fórmulas padrão (Meeus, "Astronomical Algorithms", 2ª ed.):
 * - GMST: IAU 1982 (eq. 12.4).
 * - Nutação: série de baixa precisão do cap. 22 (Δψ ±0,5″, Δε ±0,1″).
 * - Obliquidade média: eq. 22.2; verdadeira = média + Δε.
 * - GAST = GMST + Δψ·cos ε (equação dos equinócios).
 * - MC:  tan λ = tan RAMC / cos ε.
 * - ASC: λ = atan2(cos RAMC, −(sin RAMC·cos ε + tan φ·sin ε)).
 * - Placidus: cúspide com ângulo horário = fração do semiarco diurno/noturno do próprio ponto, por iteração.
 *
 * O erro das séries de baixa precisão no RAMC é < 0,0002°, muito abaixo das tolerâncias (0,01°/0,02°).
 * Quando houver acesso ao JPL Horizons, o tempo sideral local aparente (quantidade 7) substitui o GAST calculado
 * aqui (ver scripts/fetch-jpl-fixtures.ts).
 */
const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const norm = (x: number) => ((x % 360) + 360) % 360;
const sind = (x: number) => Math.sin(x * D2R);
const cosd = (x: number) => Math.cos(x * D2R);
const tand = (x: number) => Math.tan(x * D2R);

/** Aproximação de ΔT (s). O resultado é praticamente insensível a ele (só entra na nutação). */
const DELTA_T_APPROX = 69;

export function gmstDeg(jdUt: number): number {
  const T = (jdUt - 2451545.0) / 36525;
  return norm(280.46061837 + 360.98564736629 * (jdUt - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000);
}

export function nutation(jdUt: number): { dpsiDeg: number; depsDeg: number; epsMeanDeg: number } {
  const T = (jdUt + DELTA_T_APPROX / 86400 - 2451545.0) / 36525;
  const omega = norm(125.04452 - 1934.136261 * T);
  const L = norm(280.4665 + 36000.7698 * T);
  const Lp = norm(218.3165 + 481267.8813 * T);
  const dpsi = -17.2 * sind(omega) - 1.32 * sind(2 * L) - 0.23 * sind(2 * Lp) + 0.21 * sind(2 * omega);
  const deps = 9.2 * cosd(omega) + 0.57 * cosd(2 * L) + 0.1 * cosd(2 * Lp) - 0.09 * cosd(2 * omega);
  const U = T / 100;
  const epsMeanSec =
    84381.448 - 4680.93 * U - 1.55 * U ** 2 + 1999.25 * U ** 3 - 51.38 * U ** 4 - 249.67 * U ** 5 - 39.05 * U ** 6 +
    7.12 * U ** 7 + 27.87 * U ** 8 + 5.79 * U ** 9 + 2.45 * U ** 10;
  return { dpsiDeg: dpsi / 3600, depsDeg: deps / 3600, epsMeanDeg: epsMeanSec / 3600 };
}

export function frame(jdUt: number): { gastDeg: number; epsTrueDeg: number } {
  const n = nutation(jdUt);
  const epsTrue = n.epsMeanDeg + n.depsDeg;
  return { gastDeg: norm(gmstDeg(jdUt) + n.dpsiDeg * cosd(epsTrue)), epsTrueDeg: epsTrue };
}

export function mc(ramc: number, eps: number): number {
  return norm(Math.atan2(sind(ramc), cosd(ramc) * cosd(eps)) * R2D);
}

export function asc(ramc: number, eps: number, lat: number): number {
  return norm(Math.atan2(cosd(ramc), -(sind(ramc) * cosd(eps) + tand(lat) * sind(eps))) * R2D);
}

/** Longitude eclíptica (β = 0) a partir da ascensão reta. */
const lonFromRa = (ra: number, eps: number) => norm(Math.atan2(sind(ra), cosd(ra) * cosd(eps)) * R2D);
const decFromLon = (lon: number, eps: number) => Math.asin(sind(eps) * sind(lon)) * R2D;

/** Cúspide Placidus: ângulo horário oriental = SA·a + NSA·b (a, b frações). */
function placidusCusp(ramc: number, eps: number, lat: number, a: number, b: number): number | null {
  let ra = norm(ramc + 90 * (a + b));
  for (let i = 0; i < 100; i++) {
    const dec = decFromLon(lonFromRa(ra, eps), eps);
    const x = -tand(lat) * tand(dec);
    if (x < -1 || x > 1) return null; // ponto circumpolar: Placidus indefinido
    const sa = Math.acos(x) * R2D;
    const next = norm(ramc + a * sa + b * (180 - sa));
    const d = ((next - ra + 540) % 360) - 180;
    ra = next;
    if (Math.abs(d) < 1e-10) break;
  }
  return lonFromRa(ra, eps);
}

export interface OracleHouses {
  ramc: number;
  eps: number;
  asc: number;
  mc: number;
  placidus: number[] | null; // cúspides 1..12, null se indefinido (circumpolar)
}

export function oracleHouses(jdUt: number, lat: number, lon: number, gastDegOverride?: number): OracleHouses {
  const f = frame(jdUt);
  const ramc = norm((gastDegOverride ?? f.gastDeg) + lon);
  const eps = f.epsTrueDeg;
  const A = asc(ramc, eps, lat);
  const M = mc(ramc, eps);
  const c11 = placidusCusp(ramc, eps, lat, 1 / 3, 0);
  const c12 = placidusCusp(ramc, eps, lat, 2 / 3, 0);
  const c2 = placidusCusp(ramc, eps, lat, 1, 1 / 3);
  const c3 = placidusCusp(ramc, eps, lat, 1, 2 / 3);
  const placidus =
    c11 === null || c12 === null || c2 === null || c3 === null
      ? null
      : [A, c2, c3, norm(M + 180), norm(c11 + 180), norm(c12 + 180), norm(A + 180), norm(c2 + 180), norm(c3 + 180), M, c11, c12];
  return { ramc, eps, asc: A, mc: M, placidus };
}
