import type { SupabaseClient } from "@supabase/supabase-js";

/** Persistência da IA (implementação Supabase com RLS; fake nos testes). */
export interface AiStore {
  findCached(userId: string, cacheKey: string): Promise<unknown | null>;
  /** Gerações reais (não cache) nas últimas 24 h. */
  countLast24h(userId: string): Promise<number>;
  saveGeneration(row: GenerationRow): Promise<string | null>;
  logUsage(event: UsageEvent): Promise<void>;
}

export interface GenerationRow {
  user_id: string;
  task: string;
  model: string;
  prompt_version: string;
  knowledge_version: string;
  cache_key: string;
  output: unknown | null;
  tokens_in: number | null;
  tokens_out: number | null;
  latency_ms: number | null;
  cache_hit: boolean;
  error: string | null;
}

export interface UsageEvent {
  user_id: string;
  event: "ai_generation";
  feature: string;
  meta: {
    cache_hit: boolean;
    model: string;
    prompt_version: string;
    knowledge_version: string;
    latency_ms: number | null;
    tokens_in: number | null;
    tokens_out: number | null;
    error: string | null;
  };
}

export function supabaseAiStore(db: SupabaseClient): AiStore {
  return {
    async findCached(userId, cacheKey) {
      const { data } = await db
        .from("ai_generations")
        .select("output")
        .eq("user_id", userId)
        .eq("cache_key", cacheKey)
        .is("error", null)
        .not("output", "is", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data?.output ?? null;
    },
    async countLast24h(userId) {
      const since = new Date(Date.now() - 86_400_000).toISOString();
      const { count } = await db
        .from("ai_generations")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("cache_hit", false)
        .gte("created_at", since);
      return count ?? 0;
    },
    async saveGeneration(row) {
      const { data, error } = await db.from("ai_generations").insert(row).select("id").single();
      if (error) {
        console.error("[ai] saveGeneration", error.message);
        return null;
      }
      return data.id as string;
    },
    async logUsage(event) {
      const { error } = await db.from("usage_events").insert(event);
      if (error) console.error("[ai] logUsage", error.message);
    },
  };
}
