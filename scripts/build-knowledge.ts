import { writeFileSync } from "node:fs";
import { loadKnowledge, renderModule } from "./lib/knowledge.ts";

const k = loadKnowledge("knowledge");
writeFileSync("src/lib/knowledge/generated.ts", renderModule(k));
console.log(`${k.docs.length} documentos · versão ${k.version}`);
