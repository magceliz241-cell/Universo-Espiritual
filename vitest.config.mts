import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(new URL("./tests/stubs/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    // O benchmark é pesado (6 mil mapas): roda com `npm run benchmark`.
    exclude: process.env.BENCHMARK ? ["**/node_modules/**"] : ["**/node_modules/**", "tests/benchmark/**"],
  },
});
