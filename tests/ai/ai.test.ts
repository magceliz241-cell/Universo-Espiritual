import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { synastry } from "@/lib/astro/synastry";
import { XalenEphemerisEngine } from "@/lib/astro/xalen-engine";
import { aiCacheKey } from "@/lib/ai/cache";
import { buildContext } from "@/lib/ai/context-builder";
import { AiError } from "@/lib/ai/errors";
import { generate } from "@/lib/ai/generate";
import { callGroq } from "@/lib/ai/groq";
import { editorialViolations, interpretationSchema, parseJson } from "@/lib/ai/response-parser";
import type { AiStore, GenerationRow, UsageEvent } from "@/lib/ai/usage";

const KEY = "gsk_test_secret_key_123";
const engine = new XalenEphemerisEngine();
const A = engine.calculateChartSync(
  { date: "1990-08-15", time: "14:30", timezone: "America/Sao_Paulo", latitude: -23.5505, longitude: -46.6333 },
  { houseSystem: "placidus" },
);
const B = engine.calculateChartSync(
  { date: "1992-03-02", time: "06:10", timezone: "America/Recife", latitude: -8.0476, longitude: -34.877 },
  { houseSystem: "placidus" },
);

const GOOD = {
  title: "Seu mapa revela",
  summary: "Uma leitura possível do seu céu de nascimento.",
  sections: [{ heading: "Sol em Leão", body: "Na tradição astrológica, o Sol em Leão costuma ser associado à expressão criativa." }],
  reflection_questions: ["Onde você se sente mais à vontade para se expressar?"],
  practice: null,
};

function groqResponse(content: unknown, status = 200) {
  return new Response(
    JSON.stringify({
      model: "openai/gpt-oss-120b",
      choices: [{ message: { content: typeof content === "string" ? content : JSON.stringify(content) } }],
      usage: { prompt_tokens: 1200, completion_tokens: 300 },
    }),
    { status, headers: { "Content-Type": "application/json" } },
  );
}

function fakeFetch(responses: (Response | (() => Response))[]) {
  const calls: { url: string; init: RequestInit }[] = [];
  const impl = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    const r = responses.shift();
    if (!r) throw new Error("sem resposta");
    return typeof r === "function" ? r() : r;
  }) as unknown as typeof fetch;
  return { impl, calls };
}

function fakeStore(opts: { cached?: unknown; count?: number } = {}) {
  const saved: GenerationRow[] = [];
  const usage: UsageEvent[] = [];
  const store: AiStore = {
    async findCached() {
      return opts.cached ?? null;
    },
    async countLast24h() {
      return opts.count ?? 0;
    },
    async saveGeneration(row) {
      saved.push(row);
      return `gen-${saved.length}`;
    },
    async logUsage(e) {
      usage.push(e);
    },
  };
  return { store, saved, usage };
}

beforeEach(() => {
  process.env.GROQ_API_KEY = KEY;
  process.env.AI_RETRY_DELAY_MS = "0";
  delete process.env.GROQ_MODEL;
});
afterEach(() => {
  delete process.env.GROQ_API_KEY;
});

describe("cliente Groq", () => {
  it("usa o modelo padrão, JSON mode e a chave só no header", async () => {
    const f = fakeFetch([groqResponse(GOOD)]);
    const r = await callGroq({ messages: [{ role: "user", content: "oi" }], json: true, fetchImpl: f.impl });
    const body = JSON.parse(String(f.calls[0].init.body));
    expect(f.calls[0].url).toBe("https://api.groq.com/openai/v1/chat/completions");
    expect(body.model).toBe("openai/gpt-oss-120b");
    expect(body.response_format).toEqual({ type: "json_object" });
    expect((f.calls[0].init.headers as Record<string, string>).Authorization).toBe(`Bearer ${KEY}`);
    expect(String(f.calls[0].init.body)).not.toContain(KEY);
    expect(r).toMatchObject({ tokensIn: 1200, tokensOut: 300 });
  });

  it("GROQ_MODEL troca o modelo", async () => {
    process.env.GROQ_MODEL = "outro/modelo";
    const f = fakeFetch([groqResponse(GOOD)]);
    await callGroq({ messages: [], fetchImpl: f.impl });
    expect(JSON.parse(String(f.calls[0].init.body)).model).toBe("outro/modelo");
  });

  it("tenta de novo uma vez em 5xx/429 e depois desiste", async () => {
    const ok = fakeFetch([groqResponse({}, 500), groqResponse(GOOD)]);
    await expect(callGroq({ messages: [], fetchImpl: ok.impl })).resolves.toBeTruthy();
    const fail = fakeFetch([groqResponse({}, 429), groqResponse({}, 429)]);
    await expect(callGroq({ messages: [], fetchImpl: fail.impl })).rejects.toMatchObject({ code: "rate_limited" });
    const bad = fakeFetch([groqResponse({}, 400)]);
    await expect(callGroq({ messages: [], fetchImpl: bad.impl })).rejects.toMatchObject({ code: "provider_error" });
  });

  it("sem chave → not_configured", async () => {
    delete process.env.GROQ_API_KEY;
    await expect(callGroq({ messages: [] })).rejects.toMatchObject({ code: "not_configured" });
  });
});

describe("parser e checagem editorial", () => {
  it("aceita JSON com cercas e rejeita formato errado", () => {
    expect(parseJson("```json\n" + JSON.stringify(GOOD) + "\n```", interpretationSchema).title).toBe("Seu mapa revela");
    expect(() => parseJson("não é json", interpretationSchema)).toThrow(AiError);
    expect(() => parseJson(JSON.stringify({ title: "x" }), interpretationSchema)).toThrow(/formato inválido/);
  });

  it("detecta garantias, diagnósticos e porcentagens; não acusa texto normal", () => {
    expect(editorialViolations({ a: "Garanto que ele vai voltar." })).toContain("garantia");
    expect(editorialViolations(["Com certeza vai dar certo"])).toContain("previsão garantida");
    expect(editorialViolations("Vocês têm 92% de compatibilidade")).toContain("porcentagem de compatibilidade");
    expect(editorialViolations("Você tem depressão")).toContain("diagnóstico");
    expect(editorialViolations(GOOD)).toEqual([]);
    expect(editorialViolations("Reserve um tempo para garantir espaço para você. É possível que isso ajude.")).toEqual([]);
  });
});

describe("contexto por tarefa (sem dados pessoais)", () => {
  it("resumo natal: Sol/Lua/ASC calculados, sem coordenadas, fuso, data, nome", () => {
    const ctx = buildContext({ task: "natal_summary", chart: A });
    const json = JSON.stringify(ctx.data);
    expect(ctx.data).toMatchObject({ sun: { sign: A.planets.sun.sign }, moon: { sign: A.planets.moon.sign } });
    for (const leak of ["-23.55", "-46.63", "America/Sao_Paulo", "1990-08-15", "latitude", "longitude", "utc"]) {
      expect(json).not.toContain(leak);
    }
  });

  it("sinastria usa 'você' e 'a outra pessoa' e não tem score", () => {
    const ctx = buildContext({ task: "synastry", a: A, b: B, synastry: synastry(A, B) });
    const json = JSON.stringify(ctx.data);
    expect(json).toContain("other_person");
    expect(json).not.toMatch(/score|percent/i);
  });

  it("Tarot: só as cartas sorteadas pelo sistema", () => {
    const ctx = buildContext({
      task: "tarot_reading",
      spread: "daily-card",
      question: null,
      cards: [{ cardId: "major-17", position: "Carta do dia", reversed: false }],
    });
    expect(ctx.data).toEqual({ spread: "daily-card", question: null, cards: [{ position: "Carta do dia", card: "A Estrela", card_en: "The Star", orientation: "upright" }] });
    expect(ctx.knowledge.docs.map((d) => d.id)).toContain("tarot/major-arcana/17-the-star");
  });

  it("numerologia não envia o nome", () => {
    const ctx = buildContext({ task: "numerology", metrics: [{ metric: "life-path", label: "Caminho de Vida", value: 7 }] });
    expect(JSON.stringify(ctx.data)).not.toMatch(/name|nome/i);
  });

  it("hash do input é determinístico e muda com os dados", () => {
    const a = buildContext({ task: "natal_summary", chart: A }).inputHash;
    expect(buildContext({ task: "natal_summary", chart: A }).inputHash).toBe(a);
    expect(buildContext({ task: "natal_summary", chart: B }).inputHash).not.toBe(a);
  });

  it("chave de cache muda com prompt, KB e modelo", () => {
    const base = { task: "t", inputHash: "h", promptVersion: "p@1", knowledgeVersion: "k", model: "m" };
    const k = aiCacheKey(base);
    expect(aiCacheKey({ ...base, promptVersion: "p@2" })).not.toBe(k);
    expect(aiCacheKey({ ...base, knowledgeVersion: "k2" })).not.toBe(k);
    expect(aiCacheKey({ ...base, model: "m2" })).not.toBe(k);
  });
});

describe("orquestração", () => {
  const input = { task: "natal_summary" as const, chart: A };

  it("gera, valida e registra versões, tokens e latência (sem segredos)", async () => {
    const { store, saved, usage } = fakeStore();
    const f = fakeFetch([groqResponse(GOOD)]);
    const r = await generate(store, "user-1", input, { fetchImpl: f.impl });
    expect(r).toMatchObject({ cacheHit: false, generationId: "gen-1" });
    expect(saved[0]).toMatchObject({ task: "natal_summary", model: "openai/gpt-oss-120b", prompt_version: "natal_summary@1", tokens_in: 1200, tokens_out: 300, error: null });
    expect(saved[0].knowledge_version).toMatch(/^2\.0\+/);
    expect(usage[0].meta.cache_hit).toBe(false);
    expect(JSON.stringify({ saved, usage })).not.toContain(KEY);
    // O prompt enviado contém os dados calculados e as regras.
    const sent = JSON.parse(String(f.calls[0].init.body));
    expect(sent.messages[0].content).toMatch(/Nunca calcule posições/);
    expect(sent.messages[1].content).toContain(A.planets.sun.sign);
  });

  it("cache hit não chama a Groq", async () => {
    const { store, usage } = fakeStore({ cached: GOOD });
    const f = fakeFetch([]);
    const r = await generate(store, "user-1", input, { fetchImpl: f.impl });
    expect(r.cacheHit).toBe(true);
    expect(f.calls).toHaveLength(0);
    expect(usage[0].meta.cache_hit).toBe(true);
  });

  it("limite diário", async () => {
    process.env.AI_DAILY_LIMIT = "3";
    const { store } = fakeStore({ count: 3 });
    await expect(generate(store, "u", input, { fetchImpl: fakeFetch([]).impl })).rejects.toMatchObject({ code: "daily_limit" });
    delete process.env.AI_DAILY_LIMIT;
  });

  it("violação editorial → uma correção → sucesso", async () => {
    const { store, saved } = fakeStore();
    const bad = { ...GOOD, summary: "Garanto que tudo vai dar certo." };
    const f = fakeFetch([groqResponse(bad), groqResponse(GOOD)]);
    const r = await generate(store, "u", input, { fetchImpl: f.impl });
    expect(r.output.summary).toBe(GOOD.summary);
    const second = JSON.parse(String(f.calls[1].init.body));
    expect(second.messages.at(-1).content).toMatch(/não seguiu as regras \(garantia\)/);
    expect(saved[0].tokens_in).toBe(2400);
  });

  it("duas violações seguidas → erro registrado, nada devolvido", async () => {
    const { store, saved } = fakeStore();
    const bad = { ...GOOD, summary: "Vocês têm 90% de compatibilidade." };
    const f = fakeFetch([groqResponse(bad), groqResponse(bad)]);
    await expect(generate(store, "u", input, { fetchImpl: f.impl })).rejects.toMatchObject({ code: "editorial_violation" });
    expect(saved[0]).toMatchObject({ output: null, error: "editorial_violation" });
  });

  it("JSON inválido → correção → sucesso", async () => {
    const { store } = fakeStore();
    const f = fakeFetch([groqResponse("oops"), groqResponse(GOOD)]);
    await expect(generate(store, "u", input, { fetchImpl: f.impl })).resolves.toMatchObject({ cacheHit: false });
  });

  it("Tarot nunca usa cache (sorteio novo)", async () => {
    const { store } = fakeStore({ cached: GOOD });
    const f = fakeFetch([groqResponse(GOOD)]);
    const r = await generate(
      store,
      "u",
      { task: "tarot_reading", spread: "daily-card", question: null, cards: [{ cardId: "major-00", position: "Carta do dia", reversed: true }] },
      { fetchImpl: f.impl },
    );
    expect(r.cacheHit).toBe(false);
    expect(f.calls).toHaveLength(1);
  });
});
