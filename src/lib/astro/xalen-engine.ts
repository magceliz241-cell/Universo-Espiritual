import "server-only";
import { ASPECTS_VERSION, chartBodies, natalAspects } from "./aspects";
import { CHART_METHODOLOGY_VERSION, UNKNOWN_TIME_NOON } from "./config";
import type { EphemerisEngine } from "./engine";
import { getEphem } from "./ephem-loader";
import { hashParts } from "./hash";
import { assertTimeZone, jdFromUtcMs, localToUtcMs, offsetMs, parseDate, parseTime } from "./time";
import {
  type AngleId,
  type BirthChart,
  type BirthData,
  type BodyPlacement,
  type ChartOptions,
  ChartInputError,
  type EffectiveHouseSystem,
  type HouseCusp,
  type HouseSystem,
  type NormalizedBirth,
  type PlanetId,
  type PointId,
  type SignId,
  type ZodiacPosition,
} from "./types";
import { houseOf, SIGNS, toZodiac } from "./zodiac";

export { houseOf };

/** Formato do JSON devolvido por su-ephem (engine/src/lib.rs). */
interface RawBody {
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
  retrograde: boolean;
}
interface RawChart {
  engine: { name: "xalen"; xalen_commit: string; wrapper: string; method: "analytical"; house_frame: string };
  time: { jd_ut: number; jd_tt: number; delta_t_seconds: number; obliquity_true_deg: number; gast_deg: number };
  bodies: [string, RawBody][];
  houses: null | {
    requested_system: HouseSystem;
    effective_system: EffectiveHouseSystem;
    fallback_used: boolean;
    cusps: number[];
    ascendant: number;
    mc: number;
    descendant: number;
    ic: number;
    vertex: number;
  };
  ramc_deg: number | null;
}

const PLANETS: readonly PlanetId[] = [
  "sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto",
];
const POINTS: readonly PointId[] = ["mean_node", "true_node", "chiron", "mean_lilith"];

export function engineVersion(): { commit: string; wrapper: string } {
  const info = JSON.parse(getEphem().ephem.engineInfoJson()) as RawChart["engine"];
  return { commit: info.xalen_commit, wrapper: info.wrapper };
}

export function normalizeBirth(input: BirthData): { birth: NormalizedBirth; utcMs: number } {
  const d = parseDate(input.date);
  assertTimeZone(input.timezone);
  const { latitude, longitude } = input;
  if (
    typeof latitude !== "number" || typeof longitude !== "number" ||
    !Number.isFinite(latitude) || !Number.isFinite(longitude) ||
    latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180
  ) {
    throw new ChartInputError("invalid_coordinates", "Coordenadas inválidas.");
  }
  const timeKnown = input.time !== null && input.time !== undefined && input.time !== "";
  const t = parseTime(timeKnown ? (input.time as string) : UNKNOWN_TIME_NOON);
  const utcMs = localToUtcMs({ ...d, ...t }, input.timezone, input.fold);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    utcMs,
    birth: {
      date: input.date,
      time: timeKnown ? `${pad(t.hour)}:${pad(t.minute)}:${pad(t.second)}` : null,
      time_known: timeKnown,
      timezone: input.timezone,
      latitude,
      longitude,
      utc: new Date(utcMs).toISOString(),
      utc_offset_minutes: offsetMs(utcMs, input.timezone) / 60_000,
      jd_ut: jdFromUtcMs(utcMs),
    },
  };
}

export class XalenEphemerisEngine implements EphemerisEngine {
  async calculateChart(input: BirthData, options: ChartOptions): Promise<BirthChart> {
    return this.calculateChartSync(input, options);
  }

  calculateChartSync(input: BirthData, options: ChartOptions): BirthChart {
    const { ephem } = getEphem();
    const { birth } = normalizeBirth(input);
    const system = options.houseSystem;
    if (options.zodiac && options.zodiac !== "tropical") {
      throw new ChartInputError("invalid_date", "Somente o zodíaco tropical é suportado.");
    }

    const raw = JSON.parse(
      ephem.chartJson(birth.jd_ut, birth.latitude, birth.longitude, system, birth.time_known),
    ) as RawChart;

    const cusps = raw.houses?.cusps ?? null;
    const bodies = new Map(raw.bodies);
    const place = (key: string): BodyPlacement => {
      const b = bodies.get(key);
      if (!b) throw new Error(`motor não retornou ${key}`);
      return {
        ...toZodiac(b.longitude),
        latitude: b.latitude,
        speed: b.speed,
        retrograde: b.retrograde,
        house: cusps ? houseOf(b.longitude, cusps) : null,
      };
    };

    const planets = Object.fromEntries(PLANETS.map((p) => [p, place(p)])) as BirthChart["planets"];
    const points = Object.fromEntries(POINTS.map((p) => [p, place(p)])) as BirthChart["points"];

    let angles: Record<AngleId, ZodiacPosition> | null = null;
    let houses: HouseCusp[] = [];
    if (raw.houses) {
      const h = raw.houses;
      angles = {
        ascendant: toZodiac(h.ascendant),
        mc: toZodiac(h.mc),
        descendant: toZodiac(h.descendant),
        ic: toZodiac(h.ic),
      };
      houses = h.cusps.map((c, i) => ({ house: i + 1, ...toZodiac(c) }));
    }

    const moon_sign_range = birth.time_known ? null : this.moonSignRange(birth.jd_ut);

    return {
      schema_version: 1,
      methodology_version: CHART_METHODOLOGY_VERSION,
      engine: {
        name: "xalen",
        version: raw.engine.xalen_commit,
        wrapper: raw.engine.wrapper,
        method: raw.engine.method,
        house_frame: raw.engine.house_frame,
      },
      zodiac: "tropical",
      house_system: system,
      house_system_effective: raw.houses?.effective_system ?? null,
      birth_data: birth,
      time: {
        jd_tt: raw.time.jd_tt,
        delta_t_seconds: raw.time.delta_t_seconds,
        obliquity_true_deg: raw.time.obliquity_true_deg,
        gast_deg: raw.time.gast_deg,
      },
      planets,
      points,
      angles,
      houses,
      aspects: natalAspects(chartBodies({ planets, points, angles })),
      moon_sign_range,
      input_hash: chartInputHash(birth, system, raw.engine.xalen_commit, raw.engine.wrapper),
    };
  }

  /** Signos que a Lua ocupa ao longo das 24 h em torno do meio-dia local. */
  private moonSignRange(jdNoon: number): SignId[] {
    const { ephem } = getEphem();
    const lonAt = (jd: number) => (JSON.parse(ephem.bodyJson(jd, "moon")) as RawBody).longitude;
    const start = SIGNS.indexOf(toZodiac(lonAt(jdNoon - 0.5)).sign);
    const end = SIGNS.indexOf(toZodiac(lonAt(jdNoon + 0.5)).sign);
    const out: SignId[] = [];
    for (let i = start; ; i = (i + 1) % 12) {
      out.push(SIGNS[i]);
      if (i === end) break;
    }
    return out;
  }
}

/** Hash do input normalizado + tudo que muda o resultado (cache/deduplicação). */
export function chartInputHash(
  birth: NormalizedBirth,
  system: HouseSystem,
  engineCommit: string,
  wrapper: string,
): string {
  return hashParts([
    birth.date,
    birth.time,
    birth.timezone,
    birth.latitude.toFixed(6),
    birth.longitude.toFixed(6),
    birth.utc, // resolve o fold em horários ambíguos
    "tropical",
    system,
    engineCommit,
    wrapper,
    "analytical",
    CHART_METHODOLOGY_VERSION,
    ASPECTS_VERSION,
  ]);
}
