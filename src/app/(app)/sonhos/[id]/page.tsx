import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideCard } from "@/components/ai/guide-card";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { interpretationSchema } from "@/lib/ai/response-parser";
import { requireMember } from "@/lib/data/session";
import { DREAM_SYMBOLS } from "@/lib/dreams/symbols";
import { formatDatePt } from "@/lib/greeting";
import { interpretDream } from "../../interpret-actions";

export const metadata: Metadata = { title: "Seu sonho" };

export default async function DreamPage({ params }: PageProps<"/sonhos/[id]">) {
  const { id } = await params;
  const { db } = await requireMember();
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const { data: dream } = await db.from("dream_entries").select("*").eq("id", id).maybeSingle();
  if (!dream) notFound();
  let initial = null;
  if (dream.generation_id) {
    const { data: gen } = await db.from("ai_generations").select("output").eq("id", dream.generation_id).maybeSingle();
    const parsed = interpretationSchema.safeParse(gen?.output);
    if (parsed.success) initial = parsed.data;
  }
  const symbols = DREAM_SYMBOLS.filter((s) => (dream.symbols as string[]).includes(s.slug));

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10">
      <PageHeader eyebrow={formatDatePt(dream.created_at, "America/Sao_Paulo", { day: "numeric", month: "long", year: "numeric" })} title="Seu sonho" />
      <Card className="-mt-4 p-6">
        <p className="text-display whitespace-pre-line text-[1.2rem] leading-relaxed text-ink">{dream.content}</p>
        {dream.emotions.length ? <p className="mt-4 text-sm text-ink-3">Você sentiu: {(dream.emotions as string[]).join(", ").toLowerCase()}</p> : null}
      </Card>
      <section>
        <p className="eyebrow mb-3">Possíveis símbolos</p>
        {symbols.length ? (
          <ul className="flex flex-wrap gap-2">
            {symbols.map((s) => (
              <li key={s.slug} className="rounded-full border border-gold/30 bg-gold/5 px-3.5 py-1.5 text-sm text-ink">
                {s.label}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-ink-3">Não encontramos símbolos da nossa base no relato. A leitura parte das suas emoções e do contexto.</p>
        )}
      </section>
      <GuideCard
        action={interpretDream.bind(null, dream.id)}
        intro="Seu sonho pode estar relacionado a… Quer ver leituras possíveis?"
        cta="Ler meu sonho"
        loadingText="Organizando os símbolos do seu relato…"
        initial={initial}
      />
      <Link href="/sonhos" className="text-sm text-ink-3 hover:text-ink">
        ← Voltar aos sonhos
      </Link>
    </div>
  );
}
