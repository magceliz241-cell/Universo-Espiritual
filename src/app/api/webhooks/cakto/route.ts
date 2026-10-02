import { configProblems, productConfigFromEnv } from "@/lib/cakto/classify";
import { parseCaktoPayload } from "@/lib/cakto/parse";
import { processCaktoEvent } from "@/lib/cakto/process";
import { secretMatches } from "@/lib/cakto/secret";
import { supabaseWebhookStore } from "@/lib/cakto/store";
import { adminConfigured, createAdminClient } from "@/lib/supabase/admin";

/**
 * Webhook da Cakto: compra aprovada, reembolso e chargeback.
 * O segredo vem no corpo (campo `secret`); header x-cakto-secret/Bearer aceitos para testes.
 */
export async function POST(request: Request) {
  const expected = process.env.CAKTO_WEBHOOK_SECRET;
  if (!expected) return Response.json({ error: "webhook não configurado" }, { status: 500 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const ev = parseCaktoPayload(body);
  const headerSecret =
    request.headers.get("x-cakto-secret") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null;
  if (!secretMatches(ev.secret, expected) && !secretMatches(headerSecret, expected)) {
    return Response.json({ error: "não autorizado" }, { status: 401 });
  }

  try {
    const outcomes = await processCaktoEvent(ev, body, productConfigFromEnv(), supabaseWebhookStore(createAdminClient()));
    return Response.json({ ok: true, outcomes });
  } catch (e) {
    console.error("[cakto-webhook]", e instanceof Error ? e.message : "erro");
    // 500 faz a Cakto tentar de novo.
    return Response.json({ ok: false }, { status: 500 });
  }
}

/** Diagnóstico sem expor valores: só true/false. */
export async function GET() {
  const cfg = productConfigFromEnv();
  return Response.json({
    webhook_secret: Boolean(process.env.CAKTO_WEBHOOK_SECRET),
    supabase_admin: adminConfigured(),
    main_ids: cfg.main.length > 0,
    love_ids: cfg.love.length > 0,
    full_ids: (cfg.full ?? []).length > 0,
    config_ok: configProblems(cfg).length === 0,
  });
}
