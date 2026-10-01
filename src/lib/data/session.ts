import "server-only";
import { redirect } from "next/navigation";
import { currentAccess } from "@/lib/auth/access";
import type { Tier } from "@/lib/auth/routes";
import { createClient } from "@/lib/supabase/server";

/** Pessoa com acesso ativo (o proxy já barrou quem não tem). */
export async function requireMember(): Promise<{ db: Awaited<ReturnType<typeof createClient>>; userId: string; tier: Tier }> {
  const { userId, active, tier } = await currentAccess();
  if (!userId) redirect("/auth/login");
  if (!active || !tier) redirect("/acesso");
  return { db: await createClient(), userId, tier };
}

export interface ProfileRow {
  id: string;
  display_name: string | null;
  birth_name: string | null;
  onboarding_done: boolean;
}

export async function getProfile(db: Awaited<ReturnType<typeof createClient>>): Promise<ProfileRow | null> {
  const { data } = await db.from("profiles").select("id, display_name, birth_name, onboarding_done").maybeSingle();
  return (data as ProfileRow) ?? null;
}

export async function getEmail(db: Awaited<ReturnType<typeof createClient>>): Promise<string | null> {
  const { data } = await db.auth.getUser();
  return data.user?.email ?? null;
}
