/**
 * Leitura centralizada de variáveis de ambiente.
 * Públicas (NEXT_PUBLIC_*) entram no bundle do cliente; as demais só no servidor.
 */
export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  appUrl: (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/+$/, ""),
  checkoutLoveUrl: process.env.NEXT_PUBLIC_CHECKOUT_LOVE_URL ?? "",
  landingUrl: process.env.NEXT_PUBLIC_LANDING_URL ?? "",
};

export const supabaseConfigured = () => Boolean(publicEnv.supabaseUrl && publicEnv.supabaseAnonKey);

/** Lista separada por vírgulas → array sem vazios. */
export function idList(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Acesso falso só para desenvolvimento local da interface (next dev), nunca em produção.
 * SU_DEV_FAKE_ACCESS=base|love
 */
export function devFakeAccess(): "base" | "love" | null {
  if (process.env.NODE_ENV !== "development") return null;
  const v = process.env.SU_DEV_FAKE_ACCESS;
  return v === "base" || v === "love" ? v : null;
}
