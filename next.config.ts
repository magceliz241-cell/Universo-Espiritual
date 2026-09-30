import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O .wasm do motor (su-ephem/XALEN) é lido do disco em runtime (src/lib/astro/ephem-loader.ts);
  // garante que ele vá junto nas funções serverless.
  outputFileTracingIncludes: {
    "/**": ["./vendor/su-ephem/su_ephem_bg.wasm"],
  },
};

export default nextConfig;
