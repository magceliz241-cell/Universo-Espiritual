import { describe, expect, it } from "vitest";
import { clientIp, rateLimit } from "@/lib/rate-limit";

describe("rate limit", () => {
  it("bloqueia acima do limite e libera após a janela", () => {
    const k = `t-${Math.random()}`;
    for (let i = 0; i < 3; i++) expect(rateLimit(k, 3, 1000, 0)).toBe(true);
    expect(rateLimit(k, 3, 1000, 10)).toBe(false);
    expect(rateLimit(k, 3, 1000, 1500)).toBe(true);
  });
  it("IP do cliente", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" }))).toBe("1.2.3.4");
    expect(clientIp(new Headers())).toBe("anon");
  });
});
