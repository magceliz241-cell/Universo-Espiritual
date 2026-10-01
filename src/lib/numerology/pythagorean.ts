/**
 * Numerologia pitagórica — metodologia versionada (knowledge/numerology/methodology.md).
 *
 * Tabela: A J S = 1 · B K T = 2 · C L U = 3 · D M V = 4 · E N W = 5 · F O X = 6 · G P Y = 7 · H Q Z = 8 · I R = 9
 * Normalização do nome: remove acentos de forma uniforme (Á→A, Ç→C, Ñ→N), maiúsculas, ignora o que não for letra A–Z.
 * Vogais: A E I O U. O Y é sempre consoante nesta versão.
 * Números mestres 11, 22 e 33: preservados onde a métrica indica (ver MASTER_RULES); nunca no Ano Pessoal.
 * Caminho de Vida: método de 3 ciclos (mês, dia e ano reduzidos separadamente, depois somados).
 * Não mistura com o método caldeu.
 */
export const NUMEROLOGY_METHOD = "pythagorean";
export const NUMEROLOGY_VERSION = "numerology-pyth-1.0.0";

export type Metric = "life-path" | "expression" | "soul-urge" | "personality" | "birthday" | "personal-year";

export const METRIC_LABELS: Record<Metric, string> = {
  "life-path": "Caminho de Vida",
  expression: "Expressão",
  "soul-urge": "Alma",
  personality: "Personalidade",
  birthday: "Aniversário",
  "personal-year": "Ano Pessoal",
};

const MASTERS = [11, 22, 33] as const;

const VALUES: Record<string, number> = {};
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((l, i) => {
  VALUES[l] = (i % 9) + 1;
});
const VOWELS = new Set(["A", "E", "I", "O", "U"]);

export interface MetricResult {
  metric: Metric;
  value: number;
  raw_components: number[];
  reduced_components: number[];
  method: typeof NUMEROLOGY_METHOD;
  method_version: typeof NUMEROLOGY_VERSION;
}

const digitSum = (n: number) =>
  String(Math.abs(n))
    .split("")
    .reduce((s, d) => s + Number(d), 0);

/** Reduz a um dígito, preservando os mestres informados. */
export function reduce(n: number, keep: readonly number[] = MASTERS): number {
  let x = Math.abs(Math.trunc(n));
  while (x > 9 && !keep.includes(x)) x = digitSum(x);
  return x;
}

export function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

export function letterValues(name: string, filter: (l: string) => boolean = () => true): number[] {
  return normalizeName(name)
    .split("")
    .filter(filter)
    .map((l) => VALUES[l]);
}

function result(metric: Metric, value: number, raw: number[], reduced: number[]): MetricResult {
  return { metric, value, raw_components: raw, reduced_components: reduced, method: NUMEROLOGY_METHOD, method_version: NUMEROLOGY_VERSION };
}

function parseDate(date: string): { y: number; m: number; d: number } {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!m) throw new Error(`data inválida: ${date}`);
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

/** Caminho de Vida — 3 ciclos: reduz mês, dia e ano (preservando mestres), soma e reduz (preservando mestres). */
export function lifePath(birthDate: string): MetricResult {
  const { y, m, d } = parseDate(birthDate);
  const raw = [m, d, y];
  const reduced = [reduce(m), reduce(d), reduce(y)];
  return result("life-path", reduce(reduced.reduce((a, b) => a + b, 0)), raw, reduced);
}

/** Expressão/Destino — todas as letras do nome completo de nascimento. */
export function expression(fullName: string): MetricResult {
  const vals = letterValues(fullName);
  if (vals.length === 0) throw new Error("nome sem letras");
  const total = vals.reduce((a, b) => a + b, 0);
  return result("expression", reduce(total), vals, [total]);
}

/** Alma (Soul Urge) — vogais A E I O U. */
export function soulUrge(fullName: string): MetricResult {
  const vals = letterValues(fullName, (l) => VOWELS.has(l));
  const total = vals.reduce((a, b) => a + b, 0);
  return result("soul-urge", reduce(total), vals, [total]);
}

/** Personalidade — consoantes (Y incluído). */
export function personality(fullName: string): MetricResult {
  const vals = letterValues(fullName, (l) => !VOWELS.has(l));
  const total = vals.reduce((a, b) => a + b, 0);
  return result("personality", reduce(total), vals, [total]);
}

/** Aniversário — o dia do mês, reduzido preservando 11 e 22. */
export function birthday(birthDate: string): MetricResult {
  const { d } = parseDate(birthDate);
  return result("birthday", reduce(d, [11, 22]), [d], [reduce(d, [11, 22])]);
}

/** Ano Pessoal — mês + dia + ano corrente, cada um reduzido; ciclo de 1 a 9 (sem mestres). */
export function personalYear(birthDate: string, currentYear: number): MetricResult {
  const { m, d } = parseDate(birthDate);
  const reduced = [reduce(m, []), reduce(d, []), reduce(currentYear, [])];
  return result("personal-year", reduce(reduced.reduce((a, b) => a + b, 0), []), [m, d, currentYear], reduced);
}

export interface NumerologyProfile {
  method: typeof NUMEROLOGY_METHOD;
  method_version: typeof NUMEROLOGY_VERSION;
  metrics: MetricResult[];
}

export function numerologyProfile(input: { birthDate: string; fullName: string | null; currentYear: number }): NumerologyProfile {
  const metrics: MetricResult[] = [lifePath(input.birthDate)];
  if (input.fullName && normalizeName(input.fullName).length > 0) {
    metrics.push(expression(input.fullName), soulUrge(input.fullName), personality(input.fullName));
  }
  metrics.push(birthday(input.birthDate), personalYear(input.birthDate, input.currentYear));
  return { method: NUMEROLOGY_METHOD, method_version: NUMEROLOGY_VERSION, metrics };
}
