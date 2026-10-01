import { z } from "zod";
import { AiError } from "./errors";

/** Formato padrão das interpretações (design system §15: resumo, seções, reflexão). */
export const interpretationSchema = z.object({
  title: z.string().min(1).max(160),
  summary: z.string().min(1).max(900),
  sections: z
    .array(z.object({ heading: z.string().min(1).max(160), body: z.string().min(1).max(2000) }))
    .min(1)
    .max(8),
  reflection_questions: z.array(z.string().min(1).max(300)).max(4).default([]),
  practice: z.string().max(500).nullish(),
});
export type Interpretation = z.infer<typeof interpretationSchema>;

/** Conversa com o Seu Guia. */
export const guideAnswerSchema = z.object({
  answer: z.string().min(1).max(3500),
  reflection_questions: z.array(z.string().min(1).max(300)).max(3).default([]),
  suggested_questions: z.array(z.string().min(1).max(160)).max(3).default([]),
});
export type GuideAnswer = z.infer<typeof guideAnswerSchema>;

/** Extrai o JSON (tolerando cercas ```json) e valida. */
export function parseJson<T>(raw: string, schema: z.ZodType<T>): T {
  let text = raw.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)\s*```$/i.exec(text);
  if (fence) text = fence[1];
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < start) throw new AiError("invalid_response", "sem JSON");
  let data: unknown;
  try {
    data = JSON.parse(text.slice(start, end + 1));
  } catch {
    throw new AiError("invalid_response", "JSON inválido");
  }
  const r = schema.safeParse(data);
  if (!r.success) throw new AiError("invalid_response", `formato inválido: ${r.error.issues[0]?.path.join(".")}`);
  return r.data;
}

/**
 * Checagem editorial pós-geração (LEGAL_AND_EDITORIAL_NOTES): garantias, diagnósticos,
 * previsões absolutas e porcentagens de compatibilidade.
 */
const FORBIDDEN: [RegExp, string][] = [
  [/\bgarant(o|imos|ido|ida)\s+que\b/i, "garantia"],
  [/\bcom\s+certeza\s+(vai|ir[aá]|v[aã]o)\b/i, "previsão garantida"],
  [/\b(vai|ir[aá])\s+voltar\s+para\s+voc[eê]\b/i, "reconciliação garantida"],
  [/\bvoc[eê]\s+(tem|sofre\s+de|est[aá]\s+com)\s+(depress[aã]o|ansiedade|transtorno|trauma|doen[cç]a)\b/i, "diagnóstico"],
  [/\b(compat[ií]veis?|compatibilidade)\b[^.]{0,40}\b\d{1,3}\s?%/i, "porcentagem de compatibilidade"],
  [/\b\d{1,3}\s?%\s+(de\s+)?(compat|afinidade|match)/i, "porcentagem de compatibilidade"],
  [/\b(vai|ir[aá])\s+(morrer|ficar\s+doente)\b/i, "previsão de morte/doença"],
  [/\b(vai|ir[aá])\s+(ficar\s+rico|enriquecer|ganhar\s+na\s+loteria)\b/i, "promessa financeira"],
  [/\bcura\s+(garantida|definitiva)\b/i, "promessa de cura"],
];

export function editorialViolations(value: unknown): string[] {
  const texts: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === "string") texts.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(value);
  const all = texts.join("\n");
  return [...new Set(FORBIDDEN.filter(([re]) => re.test(all)).map(([, label]) => label))];
}
