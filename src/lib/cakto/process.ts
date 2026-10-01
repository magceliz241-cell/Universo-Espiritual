import { classify, type ProductConfig, type PurchaseKind } from "./classify";
import type { ParsedCaktoEvent } from "./parse";

export type ProcessingStatus = "processed" | "ignored" | "user_pending" | "needs_review" | "error" | "duplicate";

/** Persistência usada pelo webhook (implementação real em store.ts; fake nos testes). */
export interface WebhookStore {
  /** Grava o evento; false se o event_key já existia (webhook repetido). */
  recordEvent(e: {
    eventKey: string;
    event: string;
    orderId: string | null;
    email: string | null;
    kind: PurchaseKind | null;
    productIds: string[];
    payload: unknown;
  }): Promise<boolean>;
  markEvent(eventKey: string, status: ProcessingStatus, result: string): Promise<void>;
  applyPurchase(email: string, kind: PurchaseKind, orderId: string, paidAt: string | null, customerId: string | null): Promise<string>;
  applyRevocation(orderId: string, email: string | null, reason: "refunded" | "chargeback"): Promise<string>;
}

export interface ProcessOutcome {
  eventKey: string;
  status: ProcessingStatus;
  result: string;
}

/** Remove o segredo antes de registrar o payload. */
export function sanitize(body: unknown): unknown {
  if (typeof body !== "object" || body === null || Array.isArray(body)) return body;
  const { secret: _secret, ...rest } = body as Record<string, unknown>;
  void _secret;
  return rest;
}

export async function processCaktoEvent(
  ev: ParsedCaktoEvent,
  body: unknown,
  cfg: ProductConfig,
  store: WebhookStore,
): Promise<ProcessOutcome[]> {
  const kinds = classify(ev.productIds, cfg);
  // Compra: um registro por tipo presente (plano e/ou bump). Reembolso: o pedido é revogado uma vez.
  const targets: (PurchaseKind | null)[] =
    ev.kind === "purchase" && kinds.length ? kinds : [kinds[0] ?? null];
  const outcomes: ProcessOutcome[] = [];

  for (const kind of targets) {
    const eventKey = `${ev.event || "unknown"}:${ev.orderId ?? "no-order"}:${kind ?? "none"}`;
    const inserted = await store.recordEvent({
      eventKey,
      event: ev.event,
      orderId: ev.orderId,
      email: ev.email,
      kind,
      productIds: ev.productIds,
      payload: sanitize(body),
    });
    if (!inserted) {
      outcomes.push({ eventKey, status: "duplicate", result: "already_received" });
      continue;
    }

    const finish = async (status: ProcessingStatus, result: string) => {
      await store.markEvent(eventKey, status, result);
      outcomes.push({ eventKey, status, result });
    };

    if (ev.kind === "other") {
      await finish("ignored", `event:${ev.event || "unknown"}`);
      continue;
    }
    if (!ev.orderId) {
      await finish("needs_review", "missing_order_id");
      continue;
    }

    if (ev.kind === "purchase") {
      if (!ev.paid) {
        await finish("ignored", "not_paid");
        continue;
      }
      if (!kind) {
        await finish("needs_review", "unknown_product");
        continue;
      }
      if (!ev.email) {
        await finish("needs_review", "missing_email");
        continue;
      }
      const r = await store.applyPurchase(ev.email, kind, ev.orderId, ev.paidAt, ev.customerId);
      await finish(r === "applied_user_pending" ? "user_pending" : "processed", r);
      continue;
    }

    // Reembolso / chargeback: vale para o pedido, independente do produto.
    const r = await store.applyRevocation(ev.orderId, ev.email, ev.kind === "refund" ? "refunded" : "chargeback");
    await finish(r === "not_found" ? "needs_review" : "processed", r);
  }
  return outcomes;
}
