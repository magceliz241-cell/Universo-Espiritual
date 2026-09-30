export type AiErrorCode =
  | "not_configured"
  | "rate_limited"
  | "daily_limit"
  | "timeout"
  | "provider_error"
  | "invalid_response"
  | "editorial_violation";

export class AiError extends Error {
  constructor(
    public code: AiErrorCode,
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "AiError";
  }
}

/** Mensagens para a pessoa (nunca detalhes técnicos). */
export const AI_ERROR_MESSAGES: Record<AiErrorCode, string> = {
  not_configured: "O Seu Guia ainda não está disponível. Tente mais tarde.",
  rate_limited: "Muitas consultas agora. Tente de novo em alguns segundos.",
  daily_limit: "Você chegou ao limite de consultas de hoje. Amanhã tem mais.",
  timeout: "A leitura demorou mais que o normal. Tente novamente.",
  provider_error: "Não conseguimos gerar sua leitura agora. Tente novamente.",
  invalid_response: "Não conseguimos gerar sua leitura agora. Tente novamente.",
  editorial_violation: "Não conseguimos gerar sua leitura agora. Tente novamente.",
};
