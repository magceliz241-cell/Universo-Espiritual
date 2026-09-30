/**
 * Casos do benchmark (60). Cada caso é um instante + local. As referências vêm de:
 * - planetas: JPL Horizons (fixtures em tests/fixtures/jpl/, geradas por scripts/fetch-jpl-fixtures.ts);
 * - casas/ASC/MC: oráculo independente (tests/benchmark/oracle/houses.ts), com o tempo sideral
 *   do JPL quando a fixture existir.
 */
export interface BenchCase {
  id: string;
  date: string; // local
  time: string; // local HH:mm:ss
  timezone: string;
  lat: number;
  lon: number;
  tags: string[];
  fold?: 0 | 1;
}

export const C = (id: string, date: string, time: string, timezone: string, lat: number, lon: number, ...tags: string[]): BenchCase => ({
  id, date, time, timezone, lat, lon, tags,
});

export const CASES: BenchCase[] = [
  // Capitais brasileiras, horários variados
  C("sp-1990", "1990-08-15", "14:30:00", "America/Sao_Paulo", -23.5475, -46.6361, "brasil"),
  C("rj-1985", "1985-01-20", "03:15:00", "America/Sao_Paulo", -22.9064, -43.1822, "brasil", "dst"),
  C("recife-1992", "1992-03-02", "06:10:00", "America/Recife", -8.0539, -34.8811, "brasil"),
  C("belem-1978", "1978-11-11", "23:59:00", "America/Belem", -1.4558, -48.5044, "brasil", "23:59", "equador"),
  C("manaus-2001", "2001-06-30", "00:00:00", "America/Manaus", -3.1019, -60.025, "brasil", "00:00"),
  C("poa-1999", "1999-12-31", "23:59:59", "America/Sao_Paulo", -30.0331, -51.23, "brasil", "23:59", "dst"),
  C("curitiba-2010", "2010-02-14", "12:00:00", "America/Sao_Paulo", -25.4278, -49.2731, "brasil", "dst"),
  C("brasilia-1960", "1960-04-21", "09:30:00", "America/Sao_Paulo", -15.7797, -47.9297, "brasil"),
  C("salvador-1975", "1975-07-02", "18:45:00", "America/Bahia", -12.9711, -38.5108, "brasil"),
  C("fortaleza-2015", "2015-10-05", "05:05:00", "America/Fortaleza", -3.7172, -38.5431, "brasil"),
  C("bh-1988", "1988-05-13", "16:20:00", "America/Sao_Paulo", -19.9208, -43.9378, "brasil"),
  C("floripa-2019", "2019-02-16", "22:30:00", "America/Sao_Paulo", -27.5969, -48.5495, "brasil", "dst"),
  C("noronha-2005", "2005-09-09", "10:10:00", "America/Noronha", -3.8403, -32.4297, "brasil"),
  C("rio-branco-1995", "1995-08-01", "07:00:00", "America/Rio_Branco", -9.9747, -67.81, "brasil"),
  // Horário de verão: dias de transição (horários válidos) e datas próximas
  C("sp-dst-inicio-2018", "2018-11-04", "01:30:00", "America/Sao_Paulo", -23.5475, -46.6361, "dst", "transicao"),
  C("sp-dst-fim-2019", "2019-02-17", "00:30:00", "America/Sao_Paulo", -23.5475, -46.6361, "dst", "transicao"),
  C("ny-dst-2021", "2021-03-14", "03:30:00", "America/New_York", 40.7143, -74.006, "dst", "transicao"),
  { ...C("london-bst-2020", "2020-10-25", "01:30:00", "Europe/London", 51.5085, -0.1257, "dst", "transicao", "ambiguo"), fold: 0 },
  C("sydney-dst-2022", "2022-10-02", "03:00:00", "Australia/Sydney", -33.8678, 151.2073, "dst", "transicao"),
  // Mundo, latitudes normais
  C("london-2000", "2000-01-01", "12:00:00", "Europe/London", 51.5085, -0.1257, "j2000"),
  C("paris-1969", "1969-07-20", "21:17:00", "Europe/Paris", 48.8534, 2.3488),
  C("tokyo-2011", "2011-03-11", "14:46:00", "Asia/Tokyo", 35.6895, 139.6917),
  C("delhi-1947", "1947-08-15", "00:00:00", "Asia/Kolkata", 28.6519, 77.2315, "00:00", "meia-hora"),
  C("kathmandu-2015", "2015-04-25", "11:56:00", "Asia/Kathmandu", 27.7017, 85.3206, "45min"),
  C("cairo-1970", "1970-09-28", "18:00:00", "Africa/Cairo", 30.0626, 31.2497),
  C("nairobi-1990", "1990-02-11", "15:00:00", "Africa/Nairobi", -1.2833, 36.8167, "equador"),
  C("capetown-1994", "1994-04-27", "07:00:00", "Africa/Johannesburg", -33.9258, 18.4232),
  C("mexico-1985", "1985-09-19", "07:17:00", "America/Mexico_City", 19.4285, -99.1277),
  C("buenos-aires-1978", "1978-06-25", "15:00:00", "America/Argentina/Buenos_Aires", -34.6132, -58.3772),
  C("santiago-2010", "2010-02-27", "03:34:00", "America/Santiago", -33.4569, -70.6483),
  C("lisboa-1974", "1974-04-25", "00:25:00", "Europe/Lisbon", 38.7167, -9.1333),
  C("la-1994", "1994-01-17", "04:31:00", "America/Los_Angeles", 34.0522, -118.2437),
  C("honolulu-1959", "1959-08-21", "12:00:00", "Pacific/Honolulu", 21.3069, -157.8583),
  C("auckland-2000", "2000-01-01", "00:00:00", "Pacific/Auckland", -36.8485, 174.7633, "00:00"),
  C("singapore-1965", "1965-08-09", "10:00:00", "Asia/Singapore", 1.2897, 103.8501, "equador"),
  // Anos bissextos e virada de século
  C("leap-2000", "2000-02-29", "12:00:00", "UTC", 0, 0, "bissexto"),
  C("leap-2024", "2024-02-29", "23:59:00", "America/Sao_Paulo", -23.5475, -46.6361, "bissexto", "23:59"),
  C("leap-1904", "1904-02-29", "06:00:00", "UTC", 45, 10, "bissexto", "antigo"),
  C("1900-01-01", "1900-01-01", "00:00:00", "UTC", 0, 0, "limite", "00:00"),
  C("2099-12-30", "2099-12-30", "23:59:00", "UTC", 10, -20, "limite", "23:59"),
  C("1885-limite", "1885-01-02", "12:00:00", "UTC", 40, -3, "limite", "antigo"),
  // Proximidade de mudança de signo (ingressos do Sol, instantes aproximados)
  C("equinocio-2024", "2024-03-20", "03:06:00", "UTC", -23.5475, -46.6361, "ingresso"),
  C("solsticio-2023", "2023-06-21", "14:58:00", "UTC", 51.5085, -0.1257, "ingresso"),
  C("equinocio-2022", "2022-09-23", "01:04:00", "UTC", 35.6895, 139.6917, "ingresso"),
  C("solsticio-2020", "2020-12-21", "10:02:00", "UTC", -33.8678, 151.2073, "ingresso"),
  C("lua-cheia-2024", "2024-01-25", "17:54:00", "UTC", 0, 0, "lua"),
  // Latitudes altas (60°–66°)
  C("oslo-1990", "1990-06-21", "12:00:00", "Europe/Oslo", 59.9127, 10.7461, "alta"),
  C("helsinki-1985", "1985-12-21", "08:00:00", "Europe/Helsinki", 60.1695, 24.9354, "alta"),
  C("anchorage-2000", "2000-03-15", "16:30:00", "America/Anchorage", 61.2181, -149.9003, "alta"),
  C("reykjavik-1975", "1975-10-24", "14:00:00", "Atlantic/Reykjavik", 64.1355, -21.8954, "alta"),
  C("akureyri-2012", "2012-01-10", "10:00:00", "Atlantic/Reykjavik", 65.6835, -18.0878, "alta"),
  C("arkhangelsk-1995", "1995-07-15", "03:00:00", "Europe/Moscow", 64.5401, 40.5433, "alta"),
  C("ushuaia-2008", "2008-12-01", "20:00:00", "America/Argentina/Ushuaia", -54.8, -68.3, "alta-sul"),
  C("yellowknife-2018", "2018-09-01", "22:00:00", "America/Yellowknife", 62.456, -114.3525, "alta"),
  // Polares (fallback do motor)
  C("tromso-1990", "1990-01-15", "12:00:00", "Europe/Oslo", 69.6496, 18.957, "polar"),
  C("longyearbyen-2000", "2000-06-21", "00:00:00", "Arctic/Longyearbyen", 78.2232, 15.6267, "polar", "00:00"),
  C("murmansk-2010", "2010-03-01", "09:00:00", "Europe/Moscow", 68.9792, 33.0925, "polar"),
  C("mcmurdo-1990", "1990-12-25", "12:00:00", "Antarctica/McMurdo", -77.846, 166.676, "polar"),
  // Longitudes extremas
  C("fiji-2016", "2016-02-20", "18:00:00", "Pacific/Fiji", -18.1416, 178.4415, "antimeridiano"),
  C("samoa-2012", "2012-01-01", "12:00:00", "Pacific/Apia", -13.8333, -171.7667, "antimeridiano"),
];
