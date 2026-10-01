import "server-only";
import type { BirthProfileRow } from "@/lib/charts/service";
import type { createClient } from "@/lib/supabase/server";
import type { BirthDefaults } from "@/components/forms/birth-form";

type Db = Awaited<ReturnType<typeof createClient>>;

export async function listPartners(db: Db): Promise<BirthProfileRow[]> {
  const { data, error } = await db.from("birth_profiles").select("*").eq("kind", "partner").order("created_at");
  if (error) throw new Error(error.message);
  return (data ?? []) as BirthProfileRow[];
}

export async function getBirthProfile(db: Db, id: string): Promise<BirthProfileRow | null> {
  const { data } = await db.from("birth_profiles").select("*").eq("id", id).maybeSingle();
  return (data as BirthProfileRow) ?? null;
}

export function toDefaults(p: BirthProfileRow | null, birthName?: string | null): BirthDefaults {
  if (!p) return { birthName };
  return {
    id: p.kind === "partner" ? p.id : undefined,
    name: p.name,
    date: p.birth_date,
    time: p.time_known && p.birth_time ? p.birth_time.slice(0, 5) : null,
    city: p.city_id && p.place_label ? { id: p.city_id, label: p.place_label } : null,
    birthName,
  };
}
