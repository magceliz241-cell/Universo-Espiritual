"use server";

import { z } from "zod";
import { requireMember } from "@/lib/data/session";
import { CARD_BY_ID } from "@/lib/tarot/deck";
import { type DrawnCard, drawSpread, SPREADS, TAROT_RNG, TAROT_VERSION } from "@/lib/tarot/draw";

export type DrawResult =
  | { ok: true; id: string; cards: (DrawnCard & { name: string; arcana: "major" | "minor"; number: number | null; suit: string | null })[] }
  | { ok: false; message: string };

const input = z.object({
  spread: z.enum(["daily-card", "open-question", "love-3-cards"]),
  question: z.string().trim().max(500).optional(),
});

/** O sorteio acontece AQUI, no servidor, com RNG criptográfico. A IA nunca sorteia. */
export async function drawAction(spread: string, question?: string): Promise<DrawResult> {
  const { db, userId, tier } = await requireMember();
  const parsed = input.safeParse({ spread, question: question || undefined });
  if (!parsed.success) return { ok: false, message: "Tiragem inválida." };
  const s = SPREADS[parsed.data.spread];
  if (s.love && tier !== "love") return { ok: false, message: "O Tarot do amor faz parte do Astarot Love." };

  const cards = drawSpread(s.id);
  const { data, error } = await db
    .from("tarot_readings")
    .insert({ user_id: userId, spread: s.id, question: parsed.data.question ?? null, cards, rng: TAROT_RNG, methodology_version: TAROT_VERSION })
    .select("id")
    .single();
  if (error) {
    console.error("[tarot]", error.message);
    return { ok: false, message: "Não conseguimos registrar a tiragem. Tente novamente." };
  }
  return {
    ok: true,
    id: data.id,
    cards: cards.map((c) => {
      const card = CARD_BY_ID.get(c.cardId)!;
      return { ...c, name: card.name, arcana: card.arcana, number: card.number, suit: card.suit };
    }),
  };
}
