import "server-only";
import type { z } from "zod";
import { aiCacheKey } from "./cache";
import { aiDailyLimit, aiModel } from "./config";
import { type AiInput, buildContext } from "./context-builder";
import { AiError } from "./errors";
import { callGroq, type ChatMessage } from "./groq";
import { CORRECTION_PROMPT, PROMPT_VERSIONS, systemPrompt, userPrompt } from "./prompts";
import { editorialViolations, type GuideAnswer, guideAnswerSchema, type Interpretation, interpretationSchema, parseJson } from "./response-parser";
import type { AiStore } from "./usage";

export interface GenerateResult<T> {
  output: T;
  cacheHit: boolean;
  generationId: string | null;
}

type OutputFor<I extends AiInput> = I["task"] extends "guide_chat" ? GuideAnswer : Interpretation;

/**
 * Orquestra uma geração: contexto por tarefa → cache → limite diário → Groq →
 * validação do JSON → checagem editorial (uma correção) → registro.
 * A IA só interpreta: todo dado de entrada já vem calculado.
 */
export async function generate<I extends AiInput>(
  store: AiStore,
  userId: string,
  input: I,
  opts: { fetchImpl?: typeof fetch; useCache?: boolean } = {},
): Promise<GenerateResult<OutputFor<I>>> {
  const ctx = buildContext(input);
  const model = aiModel();
  const promptVersion = PROMPT_VERSIONS[ctx.task];
  const cacheKey = aiCacheKey({
    task: ctx.task,
    inputHash: ctx.inputHash,
    promptVersion,
    knowledgeVersion: ctx.knowledge.knowledgeVersion,
    model,
  });
  const schema = (ctx.task === "guide_chat" ? guideAnswerSchema : interpretationSchema) as unknown as z.ZodType<OutputFor<I>>;
  const meta = { model, prompt_version: promptVersion, knowledge_version: ctx.knowledge.knowledgeVersion };

  // O Tarot é sempre um sorteio novo e a conversa é sempre única, então essas tarefas não usam cache.
  const useCache = opts.useCache ?? !["tarot_reading", "guide_chat", "dream_analysis"].includes(ctx.task);
  if (useCache) {
    const cached = await store.findCached(userId, cacheKey);
    if (cached) {
      const ok = schema.safeParse(cached);
      if (ok.success) {
        await store.logUsage({
          user_id: userId,
          event: "ai_generation",
          feature: ctx.task,
          meta: { ...meta, cache_hit: true, latency_ms: 0, tokens_in: null, tokens_out: null, error: null },
        });
        return { output: ok.data, cacheHit: true, generationId: null };
      }
    }
  }

  if ((await store.countLast24h(userId)) >= aiDailyLimit()) {
    throw new AiError("daily_limit", "limite diário");
  }

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt() },
    { role: "user", content: userPrompt(ctx.task, ctx.data, ctx.knowledge) },
  ];

  let tokensIn = 0;
  let tokensOut = 0;
  let latency = 0;
  const record = async (output: unknown | null, error: string | null) => {
    const row = {
      user_id: userId,
      task: ctx.task,
      ...meta,
      cache_key: cacheKey,
      output,
      tokens_in: tokensIn || null,
      tokens_out: tokensOut || null,
      latency_ms: latency || null,
      cache_hit: false,
      error,
    };
    const id = await store.saveGeneration(row);
    await store.logUsage({
      user_id: userId,
      event: "ai_generation",
      feature: ctx.task,
      meta: { ...meta, cache_hit: false, latency_ms: row.latency_ms, tokens_in: row.tokens_in, tokens_out: row.tokens_out, error },
    });
    return id;
  };

  try {
    let output: OutputFor<I> | null = null;
    for (let attempt = 0; attempt < 2 && output === null; attempt++) {
      const res = await callGroq({ messages, json: true, fetchImpl: opts.fetchImpl });
      tokensIn += res.tokensIn ?? 0;
      tokensOut += res.tokensOut ?? 0;
      latency += res.latencyMs;

      let parsed: OutputFor<I>;
      try {
        parsed = parseJson(res.content, schema);
      } catch (e) {
        if (attempt === 1) throw e;
        messages.push({ role: "assistant", content: res.content }, { role: "user", content: CORRECTION_PROMPT(["formato JSON"]) });
        continue;
      }
      const issues = editorialViolations(parsed);
      if (issues.length === 0) {
        output = parsed;
        break;
      }
      if (attempt === 1) throw new AiError("editorial_violation", issues.join(", "));
      messages.push({ role: "assistant", content: res.content }, { role: "user", content: CORRECTION_PROMPT(issues) });
    }
    if (output === null) throw new AiError("invalid_response", "sem saída");
    const generationId = await record(output, null);
    return { output, cacheHit: false, generationId };
  } catch (e) {
    const code = e instanceof AiError ? e.code : "provider_error";
    await record(null, code);
    throw e instanceof AiError ? e : new AiError("provider_error", "falha");
  }
}
