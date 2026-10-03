import { describe, expect, it } from "vitest";
import { googleFirstName, googleRedirectTo } from "@/lib/auth/google";

describe("login com Google", () => {
  it("volta por /auth/callback com destino interno", () => {
    expect(googleRedirectTo("https://astarot-app.vercel.app", "/mapa")).toBe(
      "https://astarot-app.vercel.app/auth/callback?next=%2Fmapa",
    );
    expect(googleRedirectTo("http://localhost:3000/", null)).toBe("http://localhost:3000/auth/callback?next=%2F");
  });

  it("não aceita destino externo", () => {
    expect(googleRedirectTo("https://a.app", "https://evil.com")).toBe("https://a.app/auth/callback?next=%2F");
    expect(googleRedirectTo("https://a.app", "//evil.com")).toBe("https://a.app/auth/callback?next=%2F");
  });

  it("primeiro nome do Google", () => {
    expect(googleFirstName({ given_name: "Luna", full_name: "Luna Souza" })).toBe("Luna");
    expect(googleFirstName({ full_name: "  Rafa Lima " })).toBe("Rafa");
    expect(googleFirstName({ name: "Ana" })).toBe("Ana");
    expect(googleFirstName({ avatar_url: "x" })).toBeUndefined();
    expect(googleFirstName(undefined)).toBeUndefined();
  });
});
