import { idList } from "@/lib/env";

/**
 * Classificação SEMPRE por ID de produto/oferta (nunca por valor).
 * CAKTO_MAIN_IDS  = plano principal
 * CAKTO_LOVE_IDS  = bump de relacionamento (checkout e oferta dentro do app)
 * Um id nunca pode estar nas duas listas.
 */
export type PurchaseKind = "main" | "love";

export interface ProductConfig {
  main: string[];
  love: string[];
}

export function productConfigFromEnv(): ProductConfig {
  return { main: idList(process.env.CAKTO_MAIN_IDS), love: idList(process.env.CAKTO_LOVE_IDS) };
}

export function configProblems(cfg: ProductConfig): string[] {
  const problems: string[] = [];
  if (cfg.main.length === 0) problems.push("CAKTO_MAIN_IDS vazio");
  if (cfg.love.length === 0) problems.push("CAKTO_LOVE_IDS vazio");
  const overlap = cfg.main.filter((id) => cfg.love.includes(id));
  if (overlap.length) problems.push("id em CAKTO_MAIN_IDS e CAKTO_LOVE_IDS ao mesmo tempo");
  return problems;
}

/** Tipos de compra presentes no evento (o bump pode vir junto ou separado). */
export function classify(productIds: string[], cfg: ProductConfig): PurchaseKind[] {
  const kinds: PurchaseKind[] = [];
  if (productIds.some((id) => cfg.main.includes(id))) kinds.push("main");
  if (productIds.some((id) => cfg.love.includes(id))) kinds.push("love");
  return kinds;
}
