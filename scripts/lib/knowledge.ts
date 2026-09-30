import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

export interface KnowledgeDoc {
  id: string; // caminho sem .md, ex.: "astrology/signs/leo"
  domain: string; // astrology | tarot | numerology | moon | dreams | rules
  title: string;
  /** Conteúdo para a IA, sem as seções/linhas de fonte. */
  content: string;
  sources: string[];
}

/** Arquivos que não vão para a IA (técnicos/bibliográficos). */
const EXCLUDE = new Set(["XALEN_INTEGRATION.md", "SOURCES.md", "README.md"]);

function walk(dir: string): string[] {
  return readdirSync(dir)
    .sort()
    .flatMap((f) => {
      const p = path.join(dir, f);
      return statSync(p).isDirectory() ? walk(p) : [p];
    });
}

const URL_RE = /https?:\/\/[^\s)]+/g;

/** Remove seções "## Fonte…" e linhas "Fonte …:/Referência…:" (guardando as URLs). */
export function splitSources(md: string): { content: string; sources: string[] } {
  const sources = new Set<string>();
  const out: string[] = [];
  let skipping = false;
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^#{1,6}\s/.test(line)) skipping = /^#{1,6}\s*(Fonte|Fontes|Referência)/i.test(line);
    if (!skipping && /^(Fonte|Referência)[^:\n]*:\s*$/i.test(line.trim())) {
      // "Fonte astronômica:" seguido de linhas de referência até a próxima linha em branco
      while (i + 1 < lines.length && lines[i + 1].trim() !== "") {
        i++;
        for (const u of lines[i].match(URL_RE) ?? []) sources.add(u);
      }
      continue;
    }
    if (skipping) {
      for (const u of line.match(URL_RE) ?? []) sources.add(u);
      continue;
    }
    out.push(line);
  }
  return { content: out.join("\n").replace(/\n{3,}/g, "\n\n").trim(), sources: [...sources] };
}

export function loadKnowledge(root: string): { docs: KnowledgeDoc[]; version: string } {
  const hash = createHash("sha256");
  const docs: KnowledgeDoc[] = [];
  const files = walk(root).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    const raw = readFileSync(file, "utf8");
    hash.update(rel).update("\0").update(raw).update("\0");
    if (EXCLUDE.has(rel)) continue;
    const { content, sources } = splitSources(raw);
    const id = rel.replace(/\.md$/, "");
    const title = /^#\s+(.+)$/m.exec(raw)?.[1]?.trim() ?? id;
    const domain = rel.includes("/") ? rel.split("/")[0] : "rules";
    docs.push({ id, domain, title, content, sources });
  }
  const index = JSON.parse(readFileSync(path.join(root, "INDEX.json"), "utf8")) as { version: string };
  return { docs, version: `${index.version}+${hash.digest("hex").slice(0, 12)}` };
}

export function renderModule(k: { docs: KnowledgeDoc[]; version: string }): string {
  const body = JSON.stringify(Object.fromEntries(k.docs.map((d) => [d.id, d])), null, 1);
  return `// ARQUIVO GERADO por scripts/build-knowledge.ts a partir de knowledge/. Não edite à mão.
// Rode: npm run build:knowledge
import type { KnowledgeDoc } from "./types";

export const KNOWLEDGE_VERSION = ${JSON.stringify(k.version)};

export const DOCS: Record<string, KnowledgeDoc> = ${body};
`;
}
