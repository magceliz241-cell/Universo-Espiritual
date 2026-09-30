import { randomInt } from "node:crypto";
import type { SpreadId } from "@/lib/knowledge/retrieve";
import { DECK } from "./deck";

/**
 * Sorteio do Tarot: SEMPRE pelo runtime (RNG criptográfico do Node), nunca pela IA.
 */
export const TAROT_VERSION = "tarot-1.0.0";
export const TAROT_RNG = "node:crypto.randomInt (Fisher–Yates)";

export interface Spread {
  id: SpreadId;
  name: string;
  positions: string[];
  love: boolean; // exige o bump de relacionamento
}

export const SPREADS: Record<SpreadId, Spread> = {
  "daily-card": { id: "daily-card", name: "Carta do dia", positions: ["Carta do dia"], love: false },
  "open-question": {
    id: "open-question",
    name: "Pergunta aberta",
    positions: ["O que está em destaque", "O que pode estar sendo ignorado", "Que perspectiva pode ajudar"],
    love: false,
  },
  "love-3-cards": {
    id: "love-3-cards",
    name: "Tarot do amor",
    positions: ["Energia atual", "Dinâmica", "Reflexão"],
    love: true,
  },
};

export interface DrawnCard {
  cardId: string;
  position: string;
  reversed: boolean;
}

export type RandomInt = (maxExclusive: number) => number;

/** Embaralha (Fisher–Yates) e tira as primeiras cartas; orientação por sorteio 50/50. */
export function drawSpread(spreadId: SpreadId, opts: { reversals?: boolean; rng?: RandomInt } = {}): DrawnCard[] {
  const spread = SPREADS[spreadId];
  if (!spread) throw new Error(`tiragem desconhecida: ${spreadId}`);
  const rng = opts.rng ?? ((max: number) => randomInt(max));
  const ids = DECK.map((c) => c.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = rng(i + 1);
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  return spread.positions.map((position, i) => ({
    cardId: ids[i],
    position,
    reversed: opts.reversals === false ? false : rng(2) === 1,
  }));
}
