/**
 * Leitura defensiva do webhook da Cakto. O formato exato pode variar entre
 * eventos; coletamos tudo que importa sem assumir uma estrutura rígida.
 */
export type CaktoEventKind = "purchase" | "refund" | "chargeback" | "other";

export interface ParsedCaktoEvent {
  event: string;
  kind: CaktoEventKind;
  paid: boolean;
  orderId: string | null;
  email: string | null;
  customerId: string | null;
  paidAt: string | null;
  /** Todos os ids/códigos de produto e oferta encontrados (inclui itens e bumps). */
  productIds: string[];
  secret: string | null;
}

const REFUND = new Set(["refund", "refunded", "purchase_refunded"]);
const CHARGEBACK = new Set(["chargeback", "chargedback", "purchase_chargeback"]);
const PAID_STATUS = new Set(["paid", "approved", "authorized", "completed"]);

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v.trim() : typeof v === "number" ? String(v) : null;

function pick(o: Obj | undefined, ...keys: string[]): string | null {
  if (!o) return null;
  for (const k of keys) {
    const v = str(o[k]);
    if (v) return v;
  }
  return null;
}

/** Ids em objetos de produto/oferta: id, short_id, code, checkout code etc. */
function collectIds(v: unknown, out: Set<string>, depth = 0) {
  if (depth > 4 || v === null || v === undefined) return;
  if (Array.isArray(v)) {
    for (const x of v) collectIds(x, out, depth + 1);
    return;
  }
  if (!isObj(v)) {
    const s = str(v);
    if (s) out.add(s);
    return;
  }
  for (const k of ["id", "short_id", "shortId", "code", "offer_code", "checkout_code", "link", "uuid"]) {
    const s = str(v[k]);
    if (s) out.add(s);
  }
  for (const k of ["product", "offer", "offers", "products", "items", "order_bumps", "orderBumps", "bumps", "checkout"]) {
    if (k in v) collectIds(v[k], out, depth + 1);
  }
}

export function parseCaktoPayload(body: unknown): ParsedCaktoEvent {
  const root = isObj(body) ? body : {};
  const data = isObj(root.data) ? root.data : root;
  const event = (pick(root, "event", "type", "event_type") ?? pick(data, "event") ?? "").toLowerCase();

  let kind: CaktoEventKind = "other";
  if (event === "purchase_approved") kind = "purchase";
  else if (REFUND.has(event)) kind = "refund";
  else if (CHARGEBACK.has(event)) kind = "chargeback";

  const customer = isObj(data.customer) ? data.customer : isObj(data.buyer) ? data.buyer : undefined;
  const status = (pick(data, "status", "payment_status") ?? "").toLowerCase();

  const ids = new Set<string>();
  for (const k of ["product", "offer", "products", "offers", "items", "order_bumps", "orderBumps", "bumps", "checkout"]) {
    if (k in data) collectIds(data[k], ids);
  }
  for (const k of ["product_id", "productId", "offer_id", "offerId", "offer_code", "checkout_code"]) {
    const s = pick(data, k);
    if (s) ids.add(s);
  }

  const email = pick(customer, "email") ?? pick(data, "customer_email", "email");
  return {
    event,
    kind,
    paid: PAID_STATUS.has(status),
    orderId: pick(data, "id", "order_id", "orderId", "refId", "ref_id"),
    email: email ? email.toLowerCase() : null,
    customerId: pick(customer, "id", "docNumber"),
    paidAt: pick(data, "paidAt", "paid_at", "approved_at", "createdAt", "created_at"),
    productIds: [...ids],
    secret: pick(root, "secret"),
  };
}
