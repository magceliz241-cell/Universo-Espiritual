/** Estatística de erros do benchmark: máximo, média, RMS, p95 e p99 (não só PASS/FAIL). */
export interface ErrorStats {
  n: number;
  max: number;
  mean: number;
  rms: number;
  p95: number;
  p99: number;
}

export function stats(errors: number[]): ErrorStats {
  const xs = errors.map(Math.abs).sort((a, b) => a - b);
  const n = xs.length;
  if (n === 0) return { n: 0, max: 0, mean: 0, rms: 0, p95: 0, p99: 0 };
  const q = (p: number) => xs[Math.min(n - 1, Math.ceil(p * n) - 1)];
  return {
    n,
    max: xs[n - 1],
    mean: xs.reduce((s, x) => s + x, 0) / n,
    rms: Math.sqrt(xs.reduce((s, x) => s + x * x, 0) / n),
    p95: q(0.95),
    p99: q(0.99),
  };
}

/** Diferença angular com sinal, em graus, no intervalo (−180, 180]. */
export function angDiff(a: number, b: number): number {
  const d = (((a - b) % 360) + 540) % 360 - 180;
  return d === -180 ? 180 : d;
}

export const fmt = (x: number, unit: "arcsec" | "deg") =>
  unit === "arcsec" ? `${(x * 3600).toFixed(2)}″` : `${x.toFixed(5)}°`;
