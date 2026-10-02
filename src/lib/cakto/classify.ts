import { idList } from "@/lib/env";

/**
 * Classificação SEMPRE por ID de produto/oferta (nunca por valor).
 * CAKTO_MAIN_IDS  = Astarot (produto principal)
 * CAKTO_LOVE_IDS  = Astarot Love como complemento: order bump no checkout do Astarot e oferta dentro do app
 * CAKTO_FULL_IDS  = produto Astarot Love vendido sozinho (checkout próprio): libera o Astarot e o Love
 * Um id nunca pode estar em duas listas.
 */
export type PurchaseKind = "main" | "love";

export interface ProductConfig {
  main: string[];
  love: string[];
  full?: string[];
}

export function productConfigFromEnv(): ProductConfig {
  return {
    main: idList(process.env.CAKTO_MAIN_IDS),
    love: idList(process.env.CAKTO_LOVE_IDS),
    full: idList(process.env.CAKTO_FULL_IDS),
  };
}

export function configProblems(cfg: ProductConfig): string[] {
  const problems: string[] = [];
  const full = cfg.full ?? [];
  if (cfg.main.length === 0) problems.push("CAKTO_MAIN_IDS vazio");
  if (cfg.love.length === 0) problems.push("CAKTO_LOVE_IDS vazio");
  if (full.length === 0) problems.push("CAKTO_FULL_IDS vazio");
  const lists: [string, string[]][] = [["CAKTO_MAIN_IDS", cfg.main], ["CAKTO_LOVE_IDS", cfg.love], ["CAKTO_FULL_IDS", full]];
  for (let i = 0; i < lists.length; i++)
    for (let j = i + 1; j < lists.length; j++)
      if (lists[i][1].some((id) => lists[j][1].includes(id))) problems.push(`id em ${lists[i][0]} e ${lists[j][0]} ao mesmo tempo`);
  return problems;
}

/** Tipos de compra presentes no evento (o bump pode vir junto ou separado; o produto completo traz os dois). */
export function classify(productIds: string[], cfg: ProductConfig): PurchaseKind[] {
  const full = productIds.some((id) => (cfg.full ?? []).includes(id));
  const kinds: PurchaseKind[] = [];
  if (full || productIds.some((id) => cfg.main.includes(id))) kinds.push("main");
  if (full || productIds.some((id) => cfg.love.includes(id))) kinds.push("love");
  return kinds;
}
