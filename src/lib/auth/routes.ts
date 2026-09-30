/**
 * Regras de acesso por rota (puras, testáveis). O servidor decide; o cliente
 * nunca recebe conteúdo protegido.
 */
export type Tier = "base" | "love";

/** Rotas públicas (sem login). As APIs validam acesso por conta própria. */
const PUBLIC_PREFIXES = ["/auth", "/api", "/acesso", "/legal"];

/** Rotas que exigem o bump de relacionamento. As páginas mostram a oferta; nunca o conteúdo. */
export const LOVE_PREFIXES = ["/amor"];

export function isPublic(path: string): boolean {
  return PUBLIC_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

export function needsLove(path: string): boolean {
  return LOVE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

export type Decision =
  | { action: "next" }
  | { action: "login"; next: string }
  | { action: "no_access" }
  | { action: "allow"; tier: Tier };

export function decide(
  path: string,
  search: string,
  state: { userId: string | null; access: { active: boolean; love: boolean } | null },
): Decision {
  if (isPublic(path)) return { action: "next" };
  if (!state.userId) return { action: "login", next: `${path}${search}` };
  if (!state.access?.active) return { action: "no_access" };
  return { action: "allow", tier: state.access.love ? "love" : "base" };
}

/** Cabeçalhos internos definidos pelo proxy (os que vierem do navegador são apagados). */
export const ACCESS_HEADER = "x-su-access";
export const TIER_HEADER = "x-su-tier";
export const USER_HEADER = "x-su-user";
