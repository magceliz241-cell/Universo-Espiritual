import { safeNext } from "./safe-next";

/** Endereço de volta do Google: passa pela troca de código em /auth/callback e só aceita destino interno. */
export function googleRedirectTo(origin: string, next: string | null | undefined): string {
  return `${origin.replace(/\/+$/, "")}/auth/callback?next=${encodeURIComponent(safeNext(next, "/"))}`;
}

/** Primeiro nome informado pelo Google (user_metadata), para sugerir no cadastro do mapa. */
export function googleFirstName(meta: Record<string, unknown> | null | undefined): string | undefined {
  if (!meta) return undefined;
  const pick = (k: string) => (typeof meta[k] === "string" ? (meta[k] as string).trim() : "");
  const name = pick("given_name") || pick("full_name").split(/\s+/)[0] || pick("name").split(/\s+/)[0];
  return name ? name.slice(0, 80) : undefined;
}
