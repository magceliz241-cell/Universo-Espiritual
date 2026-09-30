import "server-only";
import { z } from "zod";
import { normalizeBirth } from "@/lib/astro/xalen-engine";
import { ChartInputError } from "@/lib/astro/types";
import { cityLabel } from "@/lib/cities/types";
import type { createClient } from "@/lib/supabase/server";

type Db = Awaited<ReturnType<typeof createClient>>;

export const birthFormSchema = z.object({
  kind: z.enum(["self", "partner"]),
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Informe um nome.").max(80),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data de nascimento."),
  time: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
  cityId: z.coerce.number().int().positive({ message: "Escolha a cidade na lista." }),
  fold: z.union([z.literal(0), z.literal(1)]).nullable(),
  birthName: z.string().trim().max(200).optional(),
});
export type BirthForm = z.infer<typeof birthFormSchema>;

export type SaveBirthResult =
  | { ok: true; id: string }
  | { ok: false; message: string; field?: string; ambiguous?: { fold: 0 | 1; label: string }[] };

/** Valida no servidor (cidade vem do banco, não do cliente) e grava o perfil de nascimento. */
export async function saveBirthProfile(db: Db, userId: string, form: BirthForm): Promise<SaveBirthResult> {
  const { data: city } = await db
    .from("cities")
    .select("id, name, admin1_name, country_code, latitude, longitude, timezone")
    .eq("id", form.cityId)
    .maybeSingle();
  if (!city) return { ok: false, message: "Escolha a cidade na lista.", field: "city" };

  try {
    normalizeBirth({
      date: form.date,
      time: form.time,
      timezone: city.timezone,
      latitude: city.latitude,
      longitude: city.longitude,
      fold: form.fold ?? undefined,
    });
  } catch (e) {
    if (e instanceof ChartInputError) {
      if (e.code === "ambiguous_local_time") {
        const opts = (e.details?.options as { fold: 0 | 1; offset_minutes: number }[]) ?? [];
        return {
          ok: false,
          message: "Nesse dia o relógio voltou uma hora (fim do horário de verão), e esse horário aconteceu duas vezes. Qual delas?",
          ambiguous: opts.map((o) => ({
            fold: o.fold,
            label: `${o.fold === 0 ? "Primeira" : "Segunda"} vez (UTC${o.offset_minutes >= 0 ? "+" : "−"}${Math.abs(o.offset_minutes / 60)})`,
          })),
        };
      }
      if (e.code === "nonexistent_local_time") {
        return { ok: false, field: "time", message: "Esse horário não existiu nesse local (o relógio adiantou uma hora para o horário de verão). Confira o horário." };
      }
      if (e.code === "date_out_of_range") return { ok: false, field: "date", message: "Aceitamos datas de 02/01/1885 a 30/12/2099 (limite do cálculo de Plutão)." };
      return { ok: false, field: "date", message: "Não conseguimos calcular com esses dados. Confira a data e o horário." };
    }
    throw e;
  }

  const row = {
    user_id: userId,
    kind: form.kind,
    name: form.name,
    birth_date: form.date,
    birth_time: form.time ? `${form.time}:00` : null,
    time_known: form.time !== null,
    timezone: city.timezone,
    latitude: city.latitude,
    longitude: city.longitude,
    city_id: city.id,
    place_label: cityLabel(city),
    fold: form.fold,
  };

  let id: string;
  if (form.kind === "self") {
    const { data: existing } = await db.from("birth_profiles").select("id").eq("kind", "self").maybeSingle();
    if (existing) {
      const { error } = await db.from("birth_profiles").update(row).eq("id", existing.id);
      if (error) throw new Error(error.message);
      id = existing.id;
    } else {
      const { data, error } = await db.from("birth_profiles").insert(row).select("id").single();
      if (error) throw new Error(error.message);
      id = data.id;
    }
    const { error: pErr } = await db
      .from("profiles")
      .update({ display_name: form.name, birth_name: form.birthName || null, onboarding_done: true })
      .eq("id", userId);
    if (pErr) throw new Error(pErr.message);
  } else if (form.id) {
    const { error } = await db.from("birth_profiles").update(row).eq("id", form.id).eq("kind", "partner");
    if (error) throw new Error(error.message);
    id = form.id;
  } else {
    const { data, error } = await db.from("birth_profiles").insert(row).select("id").single();
    if (error) throw new Error(error.message);
    id = data.id;
  }
  // Dados mudaram: mapas antigos deste perfil saem (o cache é refeito pelo hash).
  await db.from("birth_charts").delete().eq("birth_profile_id", id);
  return { ok: true, id };
}
