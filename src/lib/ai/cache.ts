import { hashParts } from "@/lib/astro/hash";

/**
 * Chave de cache da IA: tarefa + input + versão do prompt + versão da KB + modelo.
 * Separado do cache astronômico: texto de IA nunca é tratado como cálculo.
 */
export function aiCacheKey(p: {
  task: string;
  inputHash: string;
  promptVersion: string;
  knowledgeVersion: string;
  model: string;
}): string {
  return hashParts(["ai", p.task, p.inputHash, p.promptVersion, p.knowledgeVersion, p.model]);
}
