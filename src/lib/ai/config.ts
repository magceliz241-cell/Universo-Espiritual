/** Configuração da IA. Único provedor no MVP: Groq. */
export const AI_PROVIDER = "groq";
export const DEFAULT_MODEL = "openai/gpt-oss-120b";

export function aiModel(): string {
  return process.env.GROQ_MODEL || DEFAULT_MODEL;
}

export function groqBaseUrl(): string {
  return (process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1").replace(/\/+$/, "");
}

/** Limite diário de gerações por pessoa (controle de custo). */
export function aiDailyLimit(): number {
  const n = Number(process.env.AI_DAILY_LIMIT);
  return Number.isInteger(n) && n > 0 ? n : 40;
}

export const AI_TIMEOUT_MS = 45_000;
