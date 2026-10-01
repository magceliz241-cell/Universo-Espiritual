import "server-only";
import { createClient } from "@supabase/supabase-js";
import { publicEnv } from "@/lib/env";

/**
 * Cliente com service_role (ignora RLS). Só para webhooks e tarefas do servidor.
 * NUNCA importe em código de cliente nem use com dados vindos do usuário sem validar.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!publicEnv.supabaseUrl || !key) throw new Error("Supabase admin não configurado");
  return createClient(publicEnv.supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const adminConfigured = () => Boolean(publicEnv.supabaseUrl && process.env.SUPABASE_SERVICE_ROLE_KEY);
