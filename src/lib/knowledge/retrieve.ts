import type { AspectType, BirthChart, PlanetId, SignId } from "@/lib/astro/types";
import type { SynastryResult } from "@/lib/astro/synastry";
import { CARD_BY_ID } from "@/lib/tarot/deck";
import { DOCS, KNOWLEDGE_VERSION } from "./generated";
import { kb } from "./ids";
import type { KnowledgeDoc } from "./types";

/**
 * Recuperação determinística por tarefa: só os documentos necessários, em ordem de
 * prioridade, dentro de um orçamento de caracteres. Nunca a KB inteira.
 */
export type KnowledgeTask =
  | "natal_summary"
  | "love_profile"
  | "synastry"
  | "tarot_reading"
  | "numerology"
  | "moon_today"
  | "dream_analysis";

export interface RetrievedContext {
  task: KnowledgeTask;
  knowledgeVersion: string;
  docs: Pick<KnowledgeDoc, "id" | "title" | "content">[];
  /** Ids pedidos mas cortados pelo orçamento. */
  truncated: string[];
}

export const DEFAULT_BUDGET_CHARS = 14_000;

function assemble(task: KnowledgeTask, ids: string[], budget = DEFAULT_BUDGET_CHARS): RetrievedContext {
  const seen = new Set<string>();
  const docs: RetrievedContext["docs"] = [];
  const truncated: string[] = [];
  let used = 0;
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const d = DOCS[id];
    if (!d) throw new Error(`documento da KB inexistente: ${id}`);
    if (used + d.content.length > budget) {
      truncated.push(id);
      continue;
    }
    used += d.content.length;
    docs.push({ id: d.id, title: d.title, content: d.content });
  }
  return { task, knowledgeVersion: KNOWLEDGE_VERSION, docs, truncated };
}

const uniq = <T,>(xs: T[]) => [...new Set(xs)];

/** Sol, Lua e Ascendente: o resumo pessoal. */
export function retrieveNatalSummary(chart: BirthChart): RetrievedContext {
  const ids: string[] = [kb.astrologyMethod];
  const signs: SignId[] = [chart.planets.sun.sign, chart.planets.moon.sign];
  if (chart.angles) signs.push(chart.angles.ascendant.sign);
  for (const s of uniq(signs)) ids.push(kb.sign(s));
  ids.push(kb.planet("sun"), kb.planet("moon"));
  if (chart.planets.sun.house) ids.push(kb.house(chart.planets.sun.house));
  if (chart.planets.moon.house) ids.push(kb.house(chart.planets.moon.house));
  if (chart.angles) ids.push(kb.house(1));
  return assemble("natal_summary", ids);
}

const LOVE_PLANETS: PlanetId[] = ["venus", "mars", "moon", "sun"];

/** Perfil amoroso: Vênus, Marte, Lua, Sol + casas 5/7 + aspectos que envolvem Vênus/Marte. */
export function retrieveLoveProfile(chart: BirthChart): RetrievedContext {
  const ids: string[] = [kb.planet("venus"), kb.planet("mars"), kb.planet("moon")];
  for (const p of LOVE_PLANETS) ids.push(kb.sign(chart.planets[p].sign));
  if (chart.angles) ids.push(kb.house(7), kb.house(5));
  for (const p of ["venus", "mars"] as const) {
    const h = chart.planets[p].house;
    if (h) ids.push(kb.house(h));
  }
  const types = uniq(
    chart.aspects
      .filter((a) => ["venus", "mars"].includes(a.a) || ["venus", "mars"].includes(a.b))
      .map((a) => a.type),
  );
  for (const t of types) ids.push(kb.aspect(t));
  ids.push(kb.astrologyMethod);
  return assemble("love_profile", ids);
}

/** Sinastria: metodologia + planetas e aspectos dos contatos-chave. */
export function retrieveSynastry(s: SynastryResult, a: BirthChart, b: BirthChart): RetrievedContext {
  const ids: string[] = [kb.synastry];
  const key = s.aspects.filter((x) => x.key_contact).slice(0, 12);
  const planets = uniq(
    key.flatMap((x) => [x.a, x.b]).filter((k): k is PlanetId => k in a.planets),
  );
  for (const p of planets) ids.push(kb.planet(p));
  for (const t of uniq(key.map((x) => x.type as AspectType))) ids.push(kb.aspect(t));
  for (const p of ["venus", "mars", "moon"] as const) ids.push(kb.sign(a.planets[p].sign), kb.sign(b.planets[p].sign));
  return assemble("synastry", ids);
}

export type SpreadId = "daily-card" | "open-question" | "love-3-cards";

/** Tarot: só as cartas sorteadas + a tiragem + a metodologia. */
export function retrieveTarot(spread: SpreadId, cardIds: string[]): RetrievedContext {
  const ids: string[] = [kb.tarotSpread(spread)];
  for (const id of cardIds) {
    const c = CARD_BY_ID.get(id);
    if (!c) throw new Error(`carta desconhecida: ${id}`);
    ids.push(c.kb);
  }
  ids.push(kb.tarotMethod);
  return assemble("tarot_reading", ids);
}

/** Numerologia: documentos dos números obtidos e dos cálculos. */
export function retrieveNumerology(
  values: { metric: "life-path" | "expression" | "soul-urge" | "personality" | "personal-year" | "birthday"; value: number }[],
): RetrievedContext {
  const ids: string[] = [];
  for (const v of values) {
    if (v.metric !== "birthday") ids.push(kb.numerologyCalc(v.metric));
    ids.push(kb.number(v.value));
  }
  ids.push(kb.numerologyMethod);
  return assemble("numerology", ids);
}

/** Lua de hoje: fase + signo da Lua. */
export function retrieveMoonToday(phaseSlug: string, moonSign: SignId): RetrievedContext {
  return assemble("moon_today", [kb.moonPhase(phaseSlug), kb.moonMethod, kb.sign(moonSign)]);
}

/** Sonhos: metodologia + símbolos identificados no relato. */
export function retrieveDream(symbolSlugs: string[]): RetrievedContext {
  return assemble("dream_analysis", [kb.dreamMethod, ...symbolSlugs.map(kb.dreamSymbol)]);
}

/** Conversa sem mapa: só a metodologia geral. */
export function retrieveGeneral(): RetrievedContext {
  return assemble("natal_summary", [kb.astrologyMethod]);
}

/** Regras editoriais fixas para o system prompt (não são "recuperadas" por tarefa). */
export function editorialRules(): string {
  return [DOCS.AI_CONTEXT_RULES?.content, DOCS.LEGAL_AND_EDITORIAL_NOTES?.content].filter(Boolean).join("\n\n");
}
