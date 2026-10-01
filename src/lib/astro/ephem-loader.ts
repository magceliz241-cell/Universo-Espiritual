import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";
import * as ephem from "su-ephem";

/**
 * Único ponto do app que carrega o motor (wrapper su-ephem sobre o XALEN).
 * O .wasm é lido do disco uma vez por processo (vendor/su-ephem, incluído no
 * deploy via outputFileTracingIncludes) e instanciado de forma síncrona.
 * Só src/lib/astro/xalen-engine.ts deve importar este arquivo.
 */
const WASM_PATH = path.join(process.cwd(), "vendor", "su-ephem", "su_ephem_bg.wasm");

let ready = false;
let initMs = 0;

export function getEphem(): { ephem: typeof ephem; initMs: number } {
  if (!ready) {
    const t0 = performance.now();
    ephem.initSync({ module: readFileSync(WASM_PATH) });
    ready = true;
    initMs = performance.now() - t0;
  }
  return { ephem, initMs };
}
