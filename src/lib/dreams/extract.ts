import { DREAM_SYMBOLS, type DreamSymbol } from "./symbols";

export const DREAM_EXTRACT_VERSION = "dream-extract-1.0.0";

export function normalizeText(s: string): string {
  return ` ${s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\- ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

function matches(text: string, term: string): boolean {
  if (term.endsWith("*")) {
    const stem = term.slice(0, -1);
    return new RegExp(`(^| )${stem.replace(/[-]/g, "\\-")}[a-z0-9-]*( |$)`).test(text);
  }
  return text.includes(` ${term} `);
}

/** Símbolos da KB presentes no relato, na ordem em que aparecem pela primeira vez. */
export function extractDreamSymbols(dream: string): DreamSymbol[] {
  const text = normalizeText(dream);
  const found: { s: DreamSymbol; pos: number }[] = [];
  for (const s of DREAM_SYMBOLS) {
    let first = -1;
    for (const t of s.terms) {
      if (!matches(text, t)) continue;
      const stem = t.endsWith("*") ? t.slice(0, -1) : t;
      const pos = text.indexOf(` ${stem}`);
      if (first === -1 || (pos >= 0 && pos < first)) first = pos;
    }
    if (first >= 0) found.push({ s, pos: first });
  }
  return found.sort((a, b) => a.pos - b.pos).map((f) => f.s);
}
