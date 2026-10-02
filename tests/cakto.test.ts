import { describe, expect, it } from "vitest";
import { classify, configProblems } from "@/lib/cakto/classify";
import { parseCaktoPayload } from "@/lib/cakto/parse";
import { type ProcessingStatus, processCaktoEvent, sanitize, type WebhookStore } from "@/lib/cakto/process";
import { secretMatches } from "@/lib/cakto/secret";

const cfg = { main: ["prod-main", "offer-main"], love: ["prod-love", "offer-love-app"], full: ["prod-full"] };

const payload = (event: string, over: Record<string, unknown> = {}) => ({
  secret: "s3cr3t",
  event,
  data: {
    id: "ord-1",
    status: "paid",
    paidAt: "2026-09-30T12:00:00Z",
    customer: { email: "Ana@Example.com", id: "cus-1" },
    product: { id: "prod-main" },
    offer: { id: "offer-x" },
    ...over,
  },
});

function fakeStore() {
  const events = new Map<string, { status?: ProcessingStatus; result?: string }>();
  const calls: string[] = [];
  const store: WebhookStore = {
    async recordEvent(e) {
      if (events.has(e.eventKey)) return false;
      events.set(e.eventKey, {});
      return true;
    },
    async markEvent(k, status, result) {
      events.set(k, { status, result });
    },
    async applyPurchase(email, kind, order) {
      calls.push(`buy:${email}:${kind}:${order}`);
      return email.startsWith("ana") ? "applied" : "applied_user_pending";
    },
    async applyRevocation(order, email, reason) {
      calls.push(`revoke:${order}:${reason}`);
      return order === "ord-unknown" ? "not_found" : "revoked_main";
    },
  };
  return { store, events, calls };
}

describe("parse", () => {
  it("lê compra aprovada, normaliza e-mail e coleta ids de produto/oferta/itens", () => {
    const ev = parseCaktoPayload(payload("purchase_approved", { items: [{ product: { id: "prod-love" } }] }));
    expect(ev).toMatchObject({ kind: "purchase", paid: true, orderId: "ord-1", email: "ana@example.com", secret: "s3cr3t" });
    expect(ev.productIds).toEqual(expect.arrayContaining(["prod-main", "offer-x", "prod-love"]));
  });

  it("reconhece reembolso e chargeback por vários nomes", () => {
    for (const e of ["refund", "refunded", "purchase_refunded"]) expect(parseCaktoPayload(payload(e)).kind).toBe("refund");
    for (const e of ["chargeback", "chargedback", "purchase_chargeback"]) expect(parseCaktoPayload(payload(e)).kind).toBe("chargeback");
    expect(parseCaktoPayload(payload("pix_gerado")).kind).toBe("other");
  });

  it("não quebra com payload estranho", () => {
    expect(parseCaktoPayload(null)).toMatchObject({ kind: "other", orderId: null, email: null });
    expect(parseCaktoPayload([1, 2]).productIds).toEqual([]);
  });
});

describe("classify", () => {
  it("por id, nunca por valor", () => {
    expect(classify(["prod-main"], cfg)).toEqual(["main"]);
    expect(classify(["offer-love-app"], cfg)).toEqual(["love"]);
    expect(classify(["prod-main", "prod-love"], cfg)).toEqual(["main", "love"]);
    expect(classify(["qualquer"], cfg)).toEqual([]);
    // Astarot Love vendido sozinho libera o principal e o Love
    expect(classify(["prod-full"], cfg)).toEqual(["main", "love"]);
  });

  it("aponta configuração inválida", () => {
    expect(configProblems(cfg)).toEqual([]);
    expect(configProblems({ main: ["a"], love: ["a"], full: ["f"] })).toHaveLength(1);
    expect(configProblems({ main: ["a"], love: ["b"], full: ["a"] })).toHaveLength(1);
    expect(configProblems({ main: [], love: [], full: [] })).toHaveLength(3);
  });
});

describe("processamento", () => {
  it("compra do principal é aplicada; repetida vira duplicate", async () => {
    const { store, calls } = fakeStore();
    const body = payload("purchase_approved");
    const ev = parseCaktoPayload(body);
    expect(await processCaktoEvent(ev, body, cfg, store)).toMatchObject([{ status: "processed", result: "applied" }]);
    expect(await processCaktoEvent(ev, body, cfg, store)).toMatchObject([{ status: "duplicate" }]);
    expect(calls).toEqual(["buy:ana@example.com:main:ord-1"]);
  });

  it("plano + bump no mesmo evento aplicam os dois", async () => {
    const { store, calls } = fakeStore();
    const body = payload("purchase_approved", { items: [{ offer: { id: "offer-love-app" } }] });
    const out = await processCaktoEvent(parseCaktoPayload(body), body, cfg, store);
    expect(out.map((o) => o.eventKey)).toEqual(["purchase_approved:ord-1:main", "purchase_approved:ord-1:love"]);
    expect(calls).toHaveLength(2);
  });

  it("Astarot Love vendido sozinho aplica principal e Love no mesmo pedido; reembolso revoga uma vez", async () => {
    const { store, calls } = fakeStore();
    const body = payload("purchase_approved", { product: { id: "prod-full" } });
    const out = await processCaktoEvent(parseCaktoPayload(body), body, cfg, store);
    expect(out.map((o) => o.eventKey)).toEqual(["purchase_approved:ord-1:main", "purchase_approved:ord-1:love"]);
    expect(calls).toEqual(["buy:ana@example.com:main:ord-1", "buy:ana@example.com:love:ord-1"]);
    const refund = payload("refunded", { product: { id: "prod-full" } });
    await processCaktoEvent(parseCaktoPayload(refund), refund, cfg, store);
    expect(calls.filter((c) => c.startsWith("revoke"))).toEqual(["revoke:ord-1:refunded"]);
  });

  it("comprador sem conta fica user_pending", async () => {
    const { store } = fakeStore();
    const body = payload("purchase_approved", { customer: { email: "bia@x.com" } });
    expect(await processCaktoEvent(parseCaktoPayload(body), body, cfg, store)).toMatchObject([{ status: "user_pending" }]);
  });

  it("produto desconhecido, sem e-mail, sem pedido ou não pago não liberam", async () => {
    const cases: [Record<string, unknown>, string][] = [
      [{ product: { id: "outro" }, offer: null }, "unknown_product"],
      [{ customer: {} }, "missing_email"],
      [{ id: null }, "missing_order_id"],
      [{ status: "waiting_payment" }, "not_paid"],
    ];
    for (const [over, result] of cases) {
      const { store, calls } = fakeStore();
      const body = payload("purchase_approved", over);
      const out = await processCaktoEvent(parseCaktoPayload(body), body, cfg, store);
      expect(out[0].result).toBe(result);
      expect(calls).toEqual([]);
    }
  });

  it("eventos irrelevantes são ignorados", async () => {
    const { store } = fakeStore();
    const body = payload("pix_gerado");
    expect(await processCaktoEvent(parseCaktoPayload(body), body, cfg, store)).toMatchObject([{ status: "ignored" }]);
  });

  it("reembolso e chargeback revogam o pedido uma única vez", async () => {
    const { store, calls } = fakeStore();
    const body = payload("refunded", { items: [{ offer: { id: "offer-love-app" } }] });
    await processCaktoEvent(parseCaktoPayload(body), body, cfg, store);
    expect(calls).toEqual(["revoke:ord-1:refunded"]);
    const cb = payload("chargeback", { id: "ord-unknown" });
    expect(await processCaktoEvent(parseCaktoPayload(cb), cb, cfg, store)).toMatchObject([{ status: "needs_review" }]);
  });

  it("o segredo nunca é registrado", () => {
    expect(sanitize(payload("purchase_approved"))).not.toHaveProperty("secret");
  });
});

describe("segredo", () => {
  it("comparação exata", () => {
    expect(secretMatches("abc", "abc")).toBe(true);
    expect(secretMatches("abd", "abc")).toBe(false);
    expect(secretMatches("ab", "abc")).toBe(false);
    expect(secretMatches(null, "abc")).toBe(false);
    expect(secretMatches("abc", "")).toBe(false);
  });
});
