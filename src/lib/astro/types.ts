/** Tipos públicos do motor astrológico. O resto do app só conhece estes tipos. */

export type HouseSystem = "placidus" | "whole_sign" | "equal";
export type EffectiveHouseSystem = HouseSystem | "porphyry";
export type Zodiac = "tropical";

export type SignId =
  | "aries" | "taurus" | "gemini" | "cancer" | "leo" | "virgo"
  | "libra" | "scorpio" | "sagittarius" | "capricorn" | "aquarius" | "pisces";

export type PlanetId =
  | "sun" | "moon" | "mercury" | "venus" | "mars"
  | "jupiter" | "saturn" | "uranus" | "neptune" | "pluto";

export type PointId = "mean_node" | "true_node" | "chiron" | "mean_lilith";
export type AngleId = "ascendant" | "mc" | "descendant" | "ic";
export type BodyId = PlanetId | PointId;

/** Dados de nascimento como o usuário informa (horário local + fuso IANA). */
export interface BirthData {
  date: string; // YYYY-MM-DD
  time: string | null; // HH:mm ou HH:mm:ss; null = horário desconhecido
  timezone: string; // IANA, ex.: America/Sao_Paulo
  latitude: number;
  longitude: number;
  /** Resolve horário ambíguo (fim do horário de verão): 0 = primeira ocorrência, 1 = segunda. */
  fold?: 0 | 1;
}

export interface ChartOptions {
  houseSystem: HouseSystem;
  zodiac?: Zodiac;
}

export interface ZodiacPosition {
  longitude: number; // [0, 360)
  sign: SignId;
  /** Grau/min/seg dentro do signo, truncados (nunca 30°00′00″). */
  degree: number;
  minute: number;
  second: number;
}

export interface BodyPlacement extends ZodiacPosition {
  latitude: number;
  speed: number; // graus/dia
  retrograde: boolean;
  house: number | null; // 1..12, null sem horário
}

export interface HouseCusp extends ZodiacPosition {
  house: number;
}

export interface Aspect {
  a: BodyId | AngleId;
  b: BodyId | AngleId;
  type: AspectType;
  angle: number; // ângulo exato do aspecto (0, 60, ...)
  separation: number; // separação real [0, 180]
  orb: number; // |separation - angle|
  applying: boolean | null; // null quando não determinável (ângulos)
}

export type AspectType = "conjunction" | "sextile" | "square" | "trine" | "opposition";

export interface NormalizedBirth {
  date: string;
  time: string | null; // HH:mm:ss
  time_known: boolean;
  timezone: string;
  latitude: number;
  longitude: number;
  utc: string; // ISO 8601 do instante usado no cálculo
  utc_offset_minutes: number;
  jd_ut: number;
}

export interface BirthChart {
  schema_version: 1;
  methodology_version: string;
  engine: {
    name: "xalen";
    version: string; // commit
    wrapper: string;
    method: "analytical";
    house_frame: string;
  };
  zodiac: Zodiac;
  house_system: HouseSystem;
  house_system_effective: EffectiveHouseSystem | null;
  birth_data: NormalizedBirth;
  time: { jd_tt: number; delta_t_seconds: number; obliquity_true_deg: number; gast_deg: number };
  planets: Record<PlanetId, BodyPlacement>;
  points: Record<PointId, BodyPlacement>;
  angles: Record<AngleId, ZodiacPosition> | null;
  houses: HouseCusp[];
  aspects: Aspect[];
  /** Horário desconhecido: signos possíveis da Lua ao longo do dia local. */
  moon_sign_range: SignId[] | null;
  input_hash: string;
}

export class ChartInputError extends Error {
  constructor(
    public code:
      | "invalid_date"
      | "invalid_time"
      | "invalid_timezone"
      | "invalid_coordinates"
      | "date_out_of_range"
      | "nonexistent_local_time"
      | "ambiguous_local_time",
    message: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ChartInputError";
  }
}
