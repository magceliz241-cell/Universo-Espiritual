"use server";

import { moonState } from "@/lib/astro/moon";
import { synastry } from "@/lib/astro/synastry";
import { DEFAULT_HOUSE_SYSTEM } from "@/lib/astro/config";
import type { HouseSystem } from "@/lib/astro/types";
import { generateForCurrentUser, type AiOutcome } from "@/lib/ai/server";
import type { Interpretation } from "@/lib/ai/response-parser";
import { getOrCreateChart, getSelfProfile } from "@/lib/charts/service";
import { getBirthProfile } from "@/lib/data/profiles";
import { requireMember } from "@/lib/data/session";
import { numerologyProfile, METRIC_LABELS } from "@/lib/numerology/pythagorean";
import { SPREADS } from "@/lib/tarot/draw";

/**
 * Ações de interpretação. Cada uma RECALCULA/relê os dados no servidor (RLS):
 * o navegador só diz "qual leitura", nunca envia dados astrológicos.
 */
type Out = AiOutcome<Interpretation>;
const noProfile: Out = { ok: false, message: "Adicione seus dados de nascimento primeiro." };
const needsLove: Out = { ok: false, message: "Esta leitura faz parte do Astarot Love." };

const parseSystem = (s: string | undefined): HouseSystem =>
  s === "whole_sign" || s === "equal" ? s : DEFAULT_HOUSE_SYSTEM;

export async function interpretNatal(houseSystem?: string): Promise<Out> {
  const { db } = await requireMember();
  const self = await getSelfProfile(db);
  if (!self) return noProfile;
  const { chart } = await getOrCreateChart(db, self, parseSystem(houseSystem));
  return generateForCurrentUser({ task: "natal_summary", chart });
}

export async function interpretLove(): Promise<Out> {
  const { db, tier } = await requireMember();
  if (tier !== "love") return needsLove;
  const self = await getSelfProfile(db);
  if (!self) return noProfile;
  const { chart } = await getOrCreateChart(db, self, DEFAULT_HOUSE_SYSTEM);
  return generateForCurrentUser({ task: "love_profile", chart });
}

export async function interpretSynastry(partnerId: string): Promise<Out> {
  const { db, tier } = await requireMember();
  if (tier !== "love") return needsLove;
  const [self, partner] = await Promise.all([getSelfProfile(db), getBirthProfile(db, partnerId)]);
  if (!self) return noProfile;
  if (!partner || partner.kind !== "partner") return { ok: false, message: "Não encontramos essa pessoa." };
  const [a, b] = await Promise.all([
    getOrCreateChart(db, self, DEFAULT_HOUSE_SYSTEM),
    getOrCreateChart(db, partner, DEFAULT_HOUSE_SYSTEM),
  ]);
  return generateForCurrentUser({ task: "synastry", a: a.chart, b: b.chart, synastry: synastry(a.chart, b.chart) });
}

export async function interpretNumerology(): Promise<Out> {
  const { db } = await requireMember();
  const [self, profile] = await Promise.all([
    getSelfProfile(db),
    db.from("profiles").select("birth_name").maybeSingle(),
  ]);
  if (!self) return noProfile;
  const p = numerologyProfile({
    birthDate: self.birth_date,
    fullName: (profile.data?.birth_name as string | null) ?? null,
    currentYear: new Date().getFullYear(),
  });
  return generateForCurrentUser({
    task: "numerology",
    metrics: p.metrics.map((m) => ({ metric: m.metric, label: METRIC_LABELS[m.metric], value: m.value })),
  });
}

export async function interpretMoon(): Promise<Out> {
  await requireMember();
  const s = moonState();
  const date = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", day: "numeric", month: "long" }).format(new Date());
  return generateForCurrentUser({
    task: "moon_today",
    phase: s.phaseSlug,
    phaseLabel: s.phaseLabel,
    illumination: s.illumination,
    moonSign: s.moonSign,
    date,
  });
}

export async function interpretTarot(readingId: string): Promise<Out> {
  const { db, tier } = await requireMember();
  const { data: reading } = await db.from("tarot_readings").select("*").eq("id", readingId).maybeSingle();
  if (!reading) return { ok: false, message: "Não encontramos essa tiragem." };
  const spread = SPREADS[reading.spread as keyof typeof SPREADS];
  if (!spread) return { ok: false, message: "Tiragem inválida." };
  if (spread.love && tier !== "love") return needsLove;
  const r = await generateForCurrentUser({ task: "tarot_reading", spread: spread.id, question: reading.question, cards: reading.cards });
  if (r.ok && r.generationId) await db.from("tarot_readings").update({ generation_id: r.generationId }).eq("id", readingId);
  return r;
}

export async function interpretDream(dreamId: string): Promise<Out> {
  const { db } = await requireMember();
  const { data: dream } = await db.from("dream_entries").select("*").eq("id", dreamId).maybeSingle();
  if (!dream) return { ok: false, message: "Não encontramos esse sonho." };
  const r = await generateForCurrentUser({ task: "dream_analysis", text: dream.content, emotions: dream.emotions, symbols: dream.symbols });
  if (r.ok && r.generationId) await db.from("dream_entries").update({ generation_id: r.generationId }).eq("id", dreamId);
  return r;
}
