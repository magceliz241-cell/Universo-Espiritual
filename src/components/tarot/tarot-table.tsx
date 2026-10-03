"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { drawAction, type DrawResult } from "@/app/(app)/tarot/actions";
import { GuideCard } from "@/components/ai/guide-card";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import type { AiOutcome } from "@/lib/ai/server";
import type { Interpretation } from "@/lib/ai/response-parser";
import { cn } from "@/lib/cn";
import { CardBack, CardFace } from "./tarot-card";

interface SpreadInfo {
  id: "daily-card" | "open-question" | "love-3-cards";
  name: string;
  positions: string[];
  locked: boolean;
  description: string;
}

export function TarotTable({
  spreads,
  initialSpread,
  interpret,
}: {
  spreads: SpreadInfo[];
  initialSpread: SpreadInfo["id"];
  interpret: (readingId: string) => Promise<AiOutcome<Interpretation>>;
}) {
  const [spreadId, setSpreadId] = useState(initialSpread);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<Extract<DrawResult, { ok: true }> | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const spread = spreads.find((s) => s.id === spreadId)!;

  const draw = () =>
    start(async () => {
      setError(null);
      setRevealed(0);
      // Embaralha por pelo menos ~1,4 s enquanto o servidor sorteia (o CSS respeita prefers-reduced-motion).
      const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const [r] = await Promise.all([drawAction(spreadId, question), new Promise((ok) => setTimeout(ok, reduced ? 0 : 1400))]);
      if (!r.ok) return setError(r.message);
      setResult(r);
      // Distribui e revela uma a uma, com uma pausa entre as cartas.
      r.cards.forEach((_, i) => setTimeout(() => setRevealed((n) => Math.max(n, i + 1)), reduced ? 0 : 900 + i * 1000));
    });

  if (result) {
    const done = revealed >= result.cards.length;
    return (
      <div className="flex flex-col gap-10">
        <div className={cn("mx-auto grid w-full gap-4", result.cards.length === 1 ? "max-w-[220px]" : "max-w-[640px] grid-cols-3")}>
          {result.cards.map((c, i) => (
            <figure key={c.cardId} className="tarot-deal flex flex-col items-center gap-3" style={{ animationDelay: `${i * 140}ms` }}>
              <div className="w-full [perspective:1200px]">
                <div
                  className={cn(
                    "relative w-full transition-transform duration-[var(--duration-complex)] ease-[var(--ease-soft)] [transform-style:preserve-3d]",
                    i < revealed && "[transform:rotateY(180deg)]",
                  )}
                >
                  <div className="[backface-visibility:hidden]">
                    <CardBack />
                  </div>
                  <div
                    className={cn("absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]", i < revealed && "tarot-glow")}
                    style={{ animationDelay: "320ms" }}
                  >
                    <CardFace cardId={c.cardId} name={c.name} arcana={c.arcana} number={c.number} rank={c.rank} reversed={c.reversed} />
                  </div>
                </div>
              </div>
              <figcaption className="text-center">
                <p className="eyebrow">{c.position}</p>
                <p className={cn("mt-1 text-sm transition-opacity duration-300", i < revealed ? "opacity-100" : "opacity-0")}>
                  {c.name}
                  {c.reversed ? <span className="text-ink-3"> · invertida</span> : null}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        {done && result.cards.some((c) => c.reversed) ? (
          <p className="-mt-5 text-center text-xs leading-relaxed text-ink-3">
            Cartas invertidas aparecem de cabeça para baixo de propósito: na tradição do Tarot, a carta invertida muda o
            tom da leitura.
          </p>
        ) : null}

        {done ? (
          <GuideCard
            action={interpret.bind(null, result.id)}
            intro="As cartas estão na mesa. Quer uma leitura possível do que elas trazem?"
            cta="Ler as cartas"
            loadingText="Preparando sua leitura…"
          />
        ) : null}

        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => setResult(null)}>
            Nova tiragem
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div role="radiogroup" aria-label="Tiragem" className="grid gap-3 sm:grid-cols-3">
        {spreads.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={s.id === spreadId}
            disabled={s.locked}
            onClick={() => setSpreadId(s.id)}
            className={cn(
              "rounded-[var(--radius-lg)] border p-4 text-left transition-colors duration-[var(--duration-normal)]",
              s.id === spreadId ? "border-violet/70 bg-surface-2" : "border-line bg-surface hover:border-line-strong",
              s.locked && "opacity-60",
            )}
          >
            <p className="text-display text-[1.3rem]">{s.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-3">{s.description}</p>
            <p className="mt-2 text-[11px] text-ink-3">
              {s.positions.length} {s.positions.length === 1 ? "carta" : "cartas"}
              {s.locked ? " · Astarot Love" : ""}
            </p>
          </button>
        ))}
      </div>
      {spreads.some((s) => s.locked) ? (
        <p className="-mt-4 text-xs text-ink-3">
          O Tarot do amor faz parte do{" "}
          <Link href="/amor" className="underline underline-offset-4 hover:text-ink">
            Astarot Love
          </Link>
          .
        </p>
      ) : null}

      {spread.id !== "daily-card" ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="question" className="text-sm text-ink-2">
            Sua pergunta <span className="text-ink-3">(opcional)</span>
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={500}
            rows={2}
            placeholder={spread.id === "love-3-cards" ? "O que posso observar na minha relação agora?" : "O que merece minha atenção neste momento?"}
            className={cn(inputClass, "h-auto py-3")}
          />
          <p className="text-xs text-ink-3">Perguntas abertas funcionam melhor que “sim ou não”.</p>
        </div>
      ) : null}

      <div className={cn("mx-auto grid w-full max-w-[380px] grid-cols-3 gap-3 transition-opacity", pending ? "opacity-100" : "opacity-80")} aria-hidden>
        {[0, 1, 2].map((i) => (
          <CardBack
            key={i}
            className={cn(
              i === 1 ? "-translate-y-2" : "",
              spread.positions.length === 1 && i !== 1 && !pending && "opacity-30",
              pending && ["tarot-shuffle-a", "tarot-shuffle-b", "tarot-shuffle-c"][i],
            )}
          />
        ))}
      </div>

      {error ? <Notice tone="error">{error}</Notice> : null}
      <Button onClick={draw} disabled={pending} className="self-center">
        {pending ? "Embaralhando…" : "Embaralhar e tirar"}
      </Button>
      <p className="-mt-4 text-center text-xs text-ink-3">O sorteio é feito pelo sistema, com aleatoriedade criptográfica.</p>
    </div>
  );
}
