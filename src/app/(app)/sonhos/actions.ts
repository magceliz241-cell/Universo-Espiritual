"use server";

import { z } from "zod";
import { requireMember } from "@/lib/data/session";
import { EMOTIONS } from "@/lib/dreams/emotions";
import { extractDreamSymbols } from "@/lib/dreams/extract";

export type DreamState = { ok: null } | { ok: false; message: string } | { ok: true; id: string };

const schema = z.object({
  content: z.string().trim().min(10, "Conte um pouco mais sobre o sonho.").max(5000),
  emotions: z.array(z.enum(EMOTIONS)).max(6),
});

export async function saveDreamAction(_: DreamState, form: FormData): Promise<DreamState> {
  const { db, userId } = await requireMember();
  const parsed = schema.safeParse({ content: form.get("content"), emotions: form.getAll("emotions") });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  const symbols = extractDreamSymbols(parsed.data.content).map((s) => s.slug);
  const { data, error } = await db
    .from("dream_entries")
    .insert({ user_id: userId, content: parsed.data.content, emotions: parsed.data.emotions, symbols })
    .select("id")
    .single();
  if (error) return { ok: false, message: "Não conseguimos guardar seu sonho agora." };
  return { ok: true, id: data.id };
}
