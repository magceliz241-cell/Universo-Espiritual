import type { Aspect, BirthChart, BodyPlacement, PlanetId, SignId, ZodiacPosition } from "@/lib/astro/types";
import type { SynastryResult } from "@/lib/astro/synastry";
import { hashParts } from "@/lib/astro/hash";
import {
  type RetrievedContext,
  retrieveDream,
  retrieveGeneral,
  retrieveLoveProfile,
  retrieveMoonToday,
  retrieveNatalSummary,
  retrieveNumerology,
  retrieveSynastry,
  retrieveTarot,
  type SpreadId,
} from "@/lib/knowledge/retrieve";
import { CARD_BY_ID } from "@/lib/tarot/deck";
import type { AiTask } from "./prompts";

/**
 * Monta o contexto de cada tarefa: SÓ dados calculados relevantes + KB da tarefa.
 * Nunca envia nome, e-mail, coordenadas, cidade ou data de nascimento completa.
 */
export type NumerologyMetric = "life-path" | "expression" | "soul-urge" | "personality" | "personal-year" | "birthday";

export type AiInput =
  | { task: "natal_summary"; chart: BirthChart }
  | { task: "love_profile"; chart: BirthChart }
  | { task: "synastry"; a: BirthChart; b: BirthChart; synastry: SynastryResult }
  | {
      task: "tarot_reading";
      spread: SpreadId;
      question: string | null;
      cards: { cardId: string; position: string; reversed: boolean }[];
    }
  | { task: "numerology"; metrics: { metric: NumerologyMetric; label: string; value: number }[] }
  | { task: "moon_today"; phase: string; phaseLabel: string; illumination: number; moonSign: SignId; date: string }
  | { task: "dream_analysis"; text: string; emotions: string[]; symbols: string[] }
  | {
      task: "guide_chat";
      question: string;
      history: { role: "user" | "assistant"; content: string }[];
      chart: BirthChart | null;
    };

export interface BuiltContext {
  task: AiTask;
  data: unknown;
  knowledge: RetrievedContext;
  /** sha256 do payload exato enviado (entra na chave de cache). */
  inputHash: string;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

function place(p: BodyPlacement) {
  return { sign: p.sign, degree: p.degree, minute: p.minute, house: p.house, retrograde: p.retrograde };
}
function angle(p: ZodiacPosition) {
  return { sign: p.sign, degree: p.degree, minute: p.minute };
}
function aspect(a: Aspect) {
  return { between: [a.a, a.b], type: a.type, orb: round2(a.orb), applying: a.applying };
}

function chartCore(c: BirthChart) {
  return {
    time_known: c.birth_data.time_known,
    house_system: c.house_system_effective ?? c.house_system,
    moon_sign_range: c.moon_sign_range,
  };
}

function natalData(c: BirthChart) {
  const involves = (a: Aspect, keys: string[]) => keys.includes(a.a) || keys.includes(a.b);
  return {
    ...chartCore(c),
    sun: place(c.planets.sun),
    moon: place(c.planets.moon),
    ascendant: c.angles ? angle(c.angles.ascendant) : null,
    key_aspects: c.aspects.filter((a) => involves(a, ["sun", "moon", "ascendant"])).slice(0, 6).map(aspect),
  };
}

const LOVE: PlanetId[] = ["venus", "mars", "moon", "sun"];

function loveData(c: BirthChart) {
  return {
    ...chartCore(c),
    placements: Object.fromEntries(LOVE.map((p) => [p, place(c.planets[p])])),
    house_5_cusp: c.houses[4] ? angle(c.houses[4]) : null,
    house_7_cusp: c.houses[6] ? angle(c.houses[6]) : null,
    venus_mars_aspects: c.aspects
      .filter((a) => ["venus", "mars"].includes(a.a) || ["venus", "mars"].includes(a.b))
      .slice(0, 8)
      .map(aspect),
  };
}

function withContext(task: AiTask, data: unknown, knowledge: RetrievedContext): BuiltContext {
  return { task, data, knowledge, inputHash: hashParts([task, JSON.stringify(data)]) };
}

export function buildContext(input: AiInput): BuiltContext {
  switch (input.task) {
    case "natal_summary":
      return withContext(input.task, natalData(input.chart), retrieveNatalSummary(input.chart));

    case "love_profile":
      return withContext(input.task, loveData(input.chart), retrieveLoveProfile(input.chart));

    case "synastry": {
      const { a, b, synastry: s } = input;
      const data = {
        you: { ...chartCore(a), placements: Object.fromEntries(LOVE.map((p) => [p, place(a.planets[p])])) },
        other_person: { ...chartCore(b), placements: Object.fromEntries(LOVE.map((p) => [p, place(b.planets[p])])) },
        cross_aspects: s.aspects.slice(0, 16).map((x) => ({ you: x.a, other_person: x.b, type: x.type, orb: round2(x.orb), key_contact: x.key_contact })),
        overlays: {
          your_planets_in_other_houses: s.overlays.a_in_b
            ? Object.fromEntries(LOVE.map((p) => [p, s.overlays.a_in_b![p]]))
            : null,
          other_planets_in_your_houses: s.overlays.b_in_a
            ? Object.fromEntries(LOVE.map((p) => [p, s.overlays.b_in_a![p]]))
            : null,
        },
      };
      return withContext(input.task, data, retrieveSynastry(s, a, b));
    }

    case "tarot_reading": {
      const data = {
        spread: input.spread,
        question: input.question?.slice(0, 500) ?? null,
        cards: input.cards.map((c) => {
          const card = CARD_BY_ID.get(c.cardId);
          if (!card) throw new Error(`carta desconhecida: ${c.cardId}`);
          return { position: c.position, card: card.name, card_en: card.nameEn, orientation: c.reversed ? "reversed" : "upright" };
        }),
      };
      return withContext(input.task, data, retrieveTarot(input.spread, input.cards.map((c) => c.cardId)));
    }

    case "numerology": {
      const data = { method: "pythagorean", metrics: input.metrics.map((m) => ({ metric: m.label, value: m.value })) };
      return withContext(input.task, data, retrieveNumerology(input.metrics));
    }

    case "moon_today": {
      const data = {
        date: input.date,
        phase: input.phaseLabel,
        illumination_percent: Math.round(input.illumination * 100),
        moon_sign: input.moonSign,
      };
      return withContext(input.task, data, retrieveMoonToday(input.phase, input.moonSign));
    }

    case "dream_analysis": {
      const data = { dream: input.text.slice(0, 5000), emotions: input.emotions.slice(0, 6), symbols_found: input.symbols };
      return withContext(input.task, data, retrieveDream(input.symbols));
    }

    case "guide_chat": {
      const data = {
        question: input.question.slice(0, 1000),
        recent_messages: input.history.slice(-4).map((m) => ({ role: m.role, content: m.content.slice(0, 1200) })),
        chart: input.chart ? natalData(input.chart) : null,
      };
      const knowledge = input.chart ? routeGuideKnowledge(input.question, input.chart) : retrieveGeneral();
      return withContext(input.task, data, knowledge);
    }
  }
}

/** Escolhe a KB da conversa pelo tema da pergunta (determinístico). */
export function routeGuideKnowledge(question: string, chart: BirthChart): RetrievedContext {
  const q = question.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  if (/\b(amor|amoros|relacion|namor|casament|parceir|crush|paquera|afeto|venus|marte)/.test(q)) {
    return retrieveLoveProfile(chart);
  }
  return retrieveNatalSummary(chart);
}
