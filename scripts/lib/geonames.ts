import { normalizeCityQuery } from "../../src/lib/cities/normalize.ts";

/** Linha pronta para public.cities. */
export interface CityRow {
  id: number;
  name: string;
  ascii_name: string;
  search_name: string;
  admin1_code: string | null;
  admin1_name: string | null;
  country_code: string;
  latitude: number;
  longitude: number;
  timezone: string;
  population: number;
  feature_code: string | null;
  source_dump: string;
}

/** admin1CodesASCII.txt → "BR.27" → "São Paulo" */
export function parseAdmin1(text: string): Map<string, string> {
  const m = new Map<string, string>();
  for (const line of text.split("\n")) {
    const [code, name] = line.split("\t");
    if (code && name) m.set(code, name);
  }
  return m;
}

/**
 * Formato GeoNames (19 colunas, tab): geonameid, name, asciiname, alternatenames, latitude, longitude,
 * feature class, feature code, country code, cc2, admin1, admin2, admin3, admin4, population,
 * elevation, dem, timezone, modification date. Só lugares povoados (classe P).
 */
export function parseCities(text: string, admin1: Map<string, string>, dumpDate: string, into = new Map<number, CityRow>()) {
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    const f = line.split("\t");
    if (f.length < 19 || f[6] !== "P") continue;
    const id = Number(f[0]);
    const lat = Number(f[4]);
    const lon = Number(f[5]);
    if (!Number.isInteger(id) || !Number.isFinite(lat) || !Number.isFinite(lon) || !f[17]) continue;
    const country = f[8];
    const a1 = f[10] || null;
    into.set(id, {
      id,
      name: f[1],
      ascii_name: f[2] || f[1],
      search_name: normalizeCityQuery(f[1]),
      admin1_code: a1,
      admin1_name: a1 ? (admin1.get(`${country}.${a1}`) ?? null) : null,
      country_code: country,
      latitude: lat,
      longitude: lon,
      timezone: f[17],
      population: Number(f[14]) || 0,
      feature_code: f[7] || null,
      source_dump: dumpDate,
    });
  }
  return into;
}

const COLUMNS: (keyof CityRow)[] = [
  "id", "name", "ascii_name", "search_name", "admin1_code", "admin1_name", "country_code",
  "latitude", "longitude", "timezone", "population", "feature_code", "source_dump",
];

function csvCell(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** CSV para `\copy public.cities from 'arquivo.csv' csv header`. */
export function toCsv(rows: Iterable<CityRow>): string {
  const out = [COLUMNS.join(",")];
  for (const r of rows) out.push(COLUMNS.map((c) => csvCell(r[c])).join(","));
  return `${out.join("\n")}\n`;
}
