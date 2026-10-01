"use server";

import { revalidatePath } from "next/cache";
import { birthFormSchema, type SaveBirthResult, saveBirthProfile } from "@/lib/data/birth";
import { requireMember } from "@/lib/data/session";

export type BirthActionState = SaveBirthResult | { ok: null };

export async function saveBirthAction(_: BirthActionState, form: FormData): Promise<BirthActionState> {
  const { db, userId } = await requireMember();
  const unknownTime = form.get("unknownTime") === "on";
  const parsed = birthFormSchema.safeParse({
    kind: form.get("kind"),
    id: form.get("id") || undefined,
    name: form.get("name"),
    date: form.get("date"),
    time: unknownTime ? null : (form.get("time") as string) || null,
    cityId: form.get("cityId"),
    fold: form.get("fold") === "0" ? 0 : form.get("fold") === "1" ? 1 : null,
    birthName: (form.get("birthName") as string) || undefined,
  });
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, message: issue.path[0] === "time" ? "Informe o horário ou marque que não sabe." : issue.message, field: String(issue.path[0]) };
  }
  if (!unknownTime && parsed.data.time === null) {
    return { ok: false, message: "Informe o horário ou marque que não sabe.", field: "time" };
  }
  try {
    const r = await saveBirthProfile(db, userId, parsed.data);
    if (r.ok) revalidatePath("/", "layout");
    return r;
  } catch (e) {
    console.error("[birth]", e instanceof Error ? e.message : e);
    return { ok: false, message: "Não conseguimos salvar agora. Tente novamente." };
  }
}

export async function deletePartnerAction(id: string): Promise<void> {
  const { db } = await requireMember();
  await db.from("birth_profiles").delete().eq("id", id).eq("kind", "partner");
  revalidatePath("/amor", "layout");
}
