import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { chartInputHash, engineVersion, normalizeBirth, XalenEphemerisEngine } from "@/lib/astro/xalen-engine";
import type { BirthChart, BirthData, HouseSystem } from "@/lib/astro/types";

export interface BirthProfileRow {
  id: string;
  user_id: string;
  kind: "self" | "partner";
  name: string;
  birth_date: string;
  birth_time: string | null;
  time_known: boolean;
  timezone: string;
  latitude: number;
  longitude: number;
  city_id: number | null;
  place_label: string | null;
  fold: 0 | 1 | null;
}

export function profileToBirthData(p: BirthProfileRow): BirthData {
  return {
    date: p.birth_date,
    time: p.time_known && p.birth_time ? p.birth_time.slice(0, 8) : null,
    timezone: p.timezone,
    latitude: p.latitude,
    longitude: p.longitude,
    fold: p.fold ?? undefined,
  };
}

export async function getBirthProfiles(db: SupabaseClient): Promise<BirthProfileRow[]> {
  const { data, error } = await db.from("birth_profiles").select("*").order("created_at");
  if (error) throw new Error(`birth_profiles: ${error.message}`);
  return (data ?? []) as BirthProfileRow[];
}

export async function getSelfProfile(db: SupabaseClient): Promise<BirthProfileRow | null> {
  const { data, error } = await db.from("birth_profiles").select("*").eq("kind", "self").maybeSingle();
  if (error) throw new Error(`birth_profiles: ${error.message}`);
  return (data as BirthProfileRow) ?? null;
}

/**
 * Mesmo input → mesmo mapa. Procura pelo input_hash; se não existir, calcula com o
 * XALEN e grava. A IA nunca entra aqui.
 */
export async function getOrCreateChart(
  db: SupabaseClient,
  profile: BirthProfileRow,
  houseSystem: HouseSystem,
): Promise<{ chart: BirthChart; cacheHit: boolean }> {
  const input = profileToBirthData(profile);
  const { birth } = normalizeBirth(input);
  const v = engineVersion();
  const hash = chartInputHash(birth, houseSystem, v.commit, v.wrapper);

  const { data: cached, error: readError } = await db
    .from("birth_charts")
    .select("chart")
    .eq("user_id", profile.user_id)
    .eq("input_hash", hash)
    .maybeSingle();
  if (readError) throw new Error(`birth_charts: ${readError.message}`);
  if (cached?.chart) return { chart: cached.chart as BirthChart, cacheHit: true };

  const chart = new XalenEphemerisEngine().calculateChartSync(input, { houseSystem });
  const { error } = await db.from("birth_charts").upsert(
    {
      user_id: profile.user_id,
      birth_profile_id: profile.id,
      input_hash: chart.input_hash,
      input: chart.birth_data,
      timezone: birth.timezone,
      latitude: birth.latitude,
      longitude: birth.longitude,
      engine: chart.engine.name,
      engine_version: chart.engine.version,
      engine_wrapper: chart.engine.wrapper,
      method: chart.engine.method,
      zodiac: chart.zodiac,
      house_system: chart.house_system,
      house_system_effective: chart.house_system_effective,
      methodology_version: chart.methodology_version,
      chart,
    },
    { onConflict: "user_id,input_hash", ignoreDuplicates: true },
  );
  if (error) throw new Error(`birth_charts insert: ${error.message}`);
  return { chart, cacheHit: false };
}
