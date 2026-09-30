import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import { initSync, XalenWasm } from "xalen-wasm";

/**
 * Único ponto do app que carrega o XALEN. O .wasm é lido do disco uma vez por
 * processo (vendor/xalen-wasm, incluído no deploy via outputFileTracingIncludes)
 * e instanciado de forma síncrona. Não importe este arquivo fora de src/lib/astro/.
 */
const WASM_PATH = path.join(process.cwd(), "vendor", "xalen-wasm", "xalen_wasm_bg.wasm");

let instance: XalenWasm | null = null;
let initMs = 0;

export function getXalen(): { xalen: XalenWasm; initMs: number } {
  if (!instance) {
    const t0 = performance.now();
    initSync({ module: readFileSync(WASM_PATH) });
    instance = new XalenWasm();
    initMs = performance.now() - t0;
  }
  return { xalen: instance, initMs };
}

export { XalenWasm };
