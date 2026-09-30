import { DOCS } from "./generated";

/** Texto de uma seção "## Título" de um documento da KB (para rótulos curtos na interface). */
export function kbSection(id: string, heading: string): string | null {
  const doc = DOCS[id];
  if (!doc) return null;
  const re = new RegExp(`^##\\s+${heading}\\s*$([\\s\\S]*?)(?=^##\\s|$(?![\\s\\S]))`, "mi");
  const m = re.exec(doc.content);
  return m ? m[1].trim() : null;
}
