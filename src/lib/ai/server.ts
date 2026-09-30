import "server-only";
import { currentAccess } from "@/lib/auth/access";
import { createClient } from "@/lib/supabase/server";
import type { AiInput } from "./context-builder";
import { AI_ERROR_MESSAGES, AiError } from "./errors";
import { generate } from "./generate";
import type { GuideAnswer, Interpretation } from "./response-parser";
import { supabaseAiStore } from "./usage";

export type AiOutcome<T> = { ok: true; output: T; cacheHit: boolean; generationId: string | null } | { ok: false; message: string };

/** Gera para a pessoa logada (RLS: grava e lê só as próprias gerações). */
export async function generateForCurrentUser<I extends AiInput>(
  input: I,
): Promise<AiOutcome<I["task"] extends "guide_chat" ? GuideAnswer : Interpretation>> {
  const { userId, active } = await currentAccess();
  if (!userId || !active) return { ok: false, message: "Entre na sua conta para continuar." };
  try {
    const db = await createClient();
    const r = await generate(supabaseAiStore(db), userId, input);
    return { ok: true, output: r.output, cacheHit: r.cacheHit, generationId: r.generationId };
  } catch (e) {
    const code = e instanceof AiError ? e.code : "provider_error";
    if (!(e instanceof AiError)) console.error("[ai]", e instanceof Error ? e.message : "erro");
    return { ok: false, message: AI_ERROR_MESSAGES[code] };
  }
}
