import type { BenchCase } from "./cases.ts";

/**
 * JD (UT) de um caso, calculado com Intl (independente do motor) — usado pelo script do JPL.
 * O benchmark confere que é igual ao JD calculado pelo app.
 */
export function jdOfCase(c: BenchCase): number {
  const [y, m, d] = c.date.split("-").map(Number);
  const [hh, mm, ss] = c.time.split(":").map(Number);
  const wall = Date.UTC(y, m - 1, d, hh, mm, ss);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: c.timezone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const local = (t: number) => {
    const p = Object.fromEntries(fmt.formatToParts(new Date(t)).map((x) => [x.type, x.value]));
    return Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute), Number(p.second));
  };
  const candidates = [-86400000, 0, 86400000]
    .map((dt) => wall - (local(wall + dt) - (wall + dt)))
    .filter((t, i, a) => a.indexOf(t) === i && local(t) === wall)
    .sort((a, b) => a - b);
  const t = candidates[c.fold ?? 0];
  if (t === undefined) throw new Error(`horário inexistente: ${c.id}`);
  return t / 86400000 + 2440587.5;
}
