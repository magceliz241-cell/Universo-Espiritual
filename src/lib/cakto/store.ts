import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { WebhookStore } from "./process";

/** WebhookStore sobre o Supabase (service_role) e as funções SQL da migration 0002. */
export function supabaseWebhookStore(db: SupabaseClient): WebhookStore {
  return {
    async recordEvent(e) {
      const { error } = await db.from("cakto_webhook_events").insert({
        event_key: e.eventKey,
        event: e.event || "unknown",
        order_id: e.orderId,
        email: e.email,
        kind: e.kind,
        product_ids: e.productIds,
        payload: e.payload ?? {},
      });
      if (!error) return true;
      if (error.code === "23505") return false; // unique_violation → repetido
      throw new Error(`recordEvent: ${error.message}`);
    },
    async markEvent(eventKey, status, result) {
      const { error } = await db
        .from("cakto_webhook_events")
        .update({ processing_status: status, result, processed_at: new Date().toISOString() })
        .eq("event_key", eventKey);
      if (error) throw new Error(`markEvent: ${error.message}`);
    },
    async applyPurchase(email, kind, orderId, paidAt, customerId) {
      const { data, error } = await db.rpc("cakto_apply_purchase", {
        p_email: email,
        p_kind: kind,
        p_order_id: orderId,
        p_paid_at: paidAt ?? new Date().toISOString(),
        p_customer_id: customerId,
      });
      if (error) throw new Error(`applyPurchase: ${error.message}`);
      return String(data);
    },
    async applyRevocation(orderId, email, reason) {
      const { data, error } = await db.rpc("cakto_apply_revocation", {
        p_order_id: orderId,
        p_email: email,
        p_reason: reason,
      });
      if (error) throw new Error(`applyRevocation: ${error.message}`);
      return String(data);
    },
  };
}
