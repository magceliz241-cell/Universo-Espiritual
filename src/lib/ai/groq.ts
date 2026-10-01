import "server-only";
import { AI_TIMEOUT_MS, aiModel, groqBaseUrl } from "./config";
import { AiError } from "./errors";

function retryDelay(status: number): number {
  const override = Number(process.env.AI_RETRY_DELAY_MS);
  if (Number.isFinite(override) && override >= 0 && process.env.AI_RETRY_DELAY_MS !== undefined) return override;
  return status === 429 ? 1500 : 500;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GroqResult {
  content: string;
  model: string;
  tokensIn: number | null;
  tokensOut: number | null;
  latencyMs: number;
}

export interface GroqRequest {
  messages: ChatMessage[];
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
  /** Para testes: injeta fetch. */
  fetchImpl?: typeof fetch;
}

/**
 * Chamada única à Groq (API compatível com OpenAI: /chat/completions).
 * A chave só existe no servidor. Uma nova tentativa em 429/5xx.
 */
export async function callGroq(req: GroqRequest): Promise<GroqResult> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new AiError("not_configured", "GROQ_API_KEY ausente");
  const doFetch = req.fetchImpl ?? fetch;
  const model = aiModel();
  const body = JSON.stringify({
    model,
    messages: req.messages,
    temperature: req.temperature ?? 0.7,
    max_completion_tokens: req.maxTokens ?? 1800,
    ...(req.json ? { response_format: { type: "json_object" } } : {}),
  });

  let lastError: AiError | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    const t0 = performance.now();
    let res: Response;
    try {
      res = await doFetch(`${groqBaseUrl()}/chat/completions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body,
        signal: AbortSignal.timeout(AI_TIMEOUT_MS),
      });
    } catch (e) {
      const timeout = e instanceof Error && (e.name === "TimeoutError" || e.name === "AbortError");
      lastError = new AiError(timeout ? "timeout" : "provider_error", timeout ? "timeout" : "falha de rede");
      if (timeout) throw lastError;
      continue;
    }

    if (res.status === 429 || res.status >= 500) {
      lastError = new AiError(res.status === 429 ? "rate_limited" : "provider_error", `groq ${res.status}`, res.status);
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, retryDelay(res.status)));
        continue;
      }
      throw lastError;
    }
    if (!res.ok) throw new AiError("provider_error", `groq ${res.status}`, res.status);

    const data = (await res.json()) as {
      model?: string;
      choices?: { message?: { content?: string | null } }[];
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new AiError("invalid_response", "resposta vazia");
    return {
      content,
      model: data.model ?? model,
      tokensIn: data.usage?.prompt_tokens ?? null,
      tokensOut: data.usage?.completion_tokens ?? null,
      latencyMs: Math.round(performance.now() - t0),
    };
  }
  throw lastError ?? new AiError("provider_error", "falha");
}
