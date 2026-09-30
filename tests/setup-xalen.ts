import { readFileSync } from "node:fs";
import { initSync } from "xalen-wasm";

initSync({ module: readFileSync("vendor/xalen-wasm/xalen_wasm_bg.wasm") });
