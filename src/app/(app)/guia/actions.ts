"use server";

import { z } from "zod";
import { DEFAULT_HOUSE_SYSTEM } from "@/lib/astro/config";
import { generateForCurrentUser, type AiOutcome } from "@/lib/ai/server";
import type { GuideAnswer } from "@/lib/ai/response-parser";
import { getOrCreateChart, getSelfProfile } from "@/lib/charts/service";
import { requireMember } from "@/lib/data/session";

const schema = z.object({
  question: z.string().trim().min(3).max(1000),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(3500) })).max(8),
});

export async function askGuideAction(question: string, history: { role: "user" | "assistant"; content: string }[]): Promise<AiOutcome<GuideAnswer>> {
  const { db } = await requireMember();
  const parsed = schema.safeParse({ question, history });
  if (!parsed.success) return { ok: false, message: "Escreva sua pergunta com um pouco mais de detalhe." };
  const self = await getSelfProfile(db);
  const chart = self ? (await getOrCreateChart(db, self, DEFAULT_HOUSE_SYSTEM)).chart : null;
  return generateForCurrentUser({ task: "guide_chat", question: parsed.data.question, history: parsed.data.history.slice(-4), chart });
}
