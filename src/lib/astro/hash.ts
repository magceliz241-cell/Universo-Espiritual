import { createHash } from "node:crypto";

/** sha256 hex de uma lista de partes, unidas por "|". */
export function hashParts(parts: (string | number | null)[]): string {
  return createHash("sha256")
    .update(parts.map((p) => (p === null ? "∅" : String(p))).join("|"))
    .digest("hex");
}
