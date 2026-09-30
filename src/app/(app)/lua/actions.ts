"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { moonState } from "@/lib/astro/moon";
import { requireMember } from "@/lib/data/session";

export type IntentionState = { ok: boolean | null; message?: string };

const schema = z.object({
  intention: z.string().trim().max(1000),
  journal: z.string().trim().max(5000),
});

/** Intenção/diário do dia (fase calculada no servidor). */
export async function saveIntentionAction(_: IntentionState, form: FormData): Promise<IntentionState> {
  const { db, userId } = await requireMember();
  const parsed = schema.safeParse({ intention: form.get("intention") ?? "", journal: form.get("journal") ?? "" });
  if (!parsed.success) return { ok: false, message: "Texto longo demais." };
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
  const { error } = await db.from("moon_journeys").upsert(
    { user_id: userId, entry_date: today, phase: moonState().phase, intention: parsed.data.intention || null, journal: parsed.data.journal || null },
    { onConflict: "user_id,entry_date" },
  );
  if (error) return { ok: false, message: "Não conseguimos salvar agora." };
  revalidatePath("/lua");
  return { ok: true, message: "Guardado." };
}
