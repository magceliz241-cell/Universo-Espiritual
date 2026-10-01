import { describe, expect, it } from "vitest";
import { decide, isPublic, needsLove } from "@/lib/auth/routes";
import { safeNext } from "@/lib/auth/safe-next";

describe("regras de rota", () => {
  it("públicas", () => {
    for (const p of ["/auth/login", "/api/webhooks/cakto", "/acesso", "/legal/termos"]) expect(isPublic(p)).toBe(true);
    for (const p of ["/", "/mapa", "/authx", "/amor"]) expect(isPublic(p)).toBe(false);
  });

  it("sem login → login com next; sem compra → /acesso; com compra → tier", () => {
    expect(decide("/mapa", "?x=1", { userId: null, access: null })).toEqual({ action: "login", next: "/mapa?x=1" });
    expect(decide("/mapa", "", { userId: "u", access: { active: false, love: false } })).toEqual({ action: "no_access" });
    expect(decide("/mapa", "", { userId: "u", access: { active: true, love: false } })).toEqual({ action: "allow", tier: "base" });
    expect(decide("/amor", "", { userId: "u", access: { active: true, love: true } })).toEqual({ action: "allow", tier: "love" });
  });

  it("áreas de amor", () => {
    expect(needsLove("/amor")).toBe(true);
    expect(needsLove("/amor/sinastria")).toBe(true);
    expect(needsLove("/amores")).toBe(false);
  });

  it("safeNext bloqueia redirecionamento externo", () => {
    expect(safeNext("/mapa")).toBe("/mapa");
    expect(safeNext("//evil.com")).toBe("/");
    expect(safeNext("https://evil.com")).toBe("/");
    expect(safeNext("/\\evil.com")).toBe("/");
    expect(safeNext(null, "/x")).toBe("/x");
  });
});
