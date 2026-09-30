import "server-only";
import { headers } from "next/headers";
import { ACCESS_HEADER, TIER_HEADER, type Tier, USER_HEADER } from "./routes";

/** Acesso da requisição atual, definido pelo proxy (fonte: banco). */
export async function currentAccess(): Promise<{ userId: string | null; active: boolean; tier: Tier | null }> {
  const h = await headers();
  const active = h.get(ACCESS_HEADER) === "1";
  const tier = h.get(TIER_HEADER);
  return {
    userId: h.get(USER_HEADER),
    active,
    tier: active && (tier === "base" || tier === "love") ? tier : null,
  };
}
