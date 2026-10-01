import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // CSP mínima sem quebrar os scripts inline do Next: sem iframes, sem plugins, base fixa.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://*.cakto.com.br" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // O .wasm do motor (su-ephem/XALEN) é lido do disco em runtime (src/lib/astro/ephem-loader.ts);
  // garante que ele vá junto nas funções serverless.
  outputFileTracingIncludes: {
    "/**": ["./vendor/su-ephem/su_ephem_bg.wasm"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
