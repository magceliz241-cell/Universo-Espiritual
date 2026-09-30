import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // O .wasm do XALEN é lido do disco em runtime (src/lib/astro/xalen-loader.ts);
  // garante que ele vá junto nas funções serverless.
  outputFileTracingIncludes: {
    "/**": ["./vendor/xalen-wasm/xalen_wasm_bg.wasm"],
  },
};

export default nextConfig;
