"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { askGuideAction } from "@/app/(app)/guia/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { inputClass } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import type { GuideAnswer } from "@/lib/ai/response-parser";
import { cn } from "@/lib/cn";

interface Turn {
  question: string;
  answer: GuideAnswer;
}

const SUGGESTIONS = [
  "Por que eu ajo assim nos relacionamentos?",
  "O que minha Lua representa?",
  "Quero entender minha vida amorosa.",
  "O que meu mapa destaca neste momento?",
  "Quero interpretar meu sonho.",
];

export function GuideChat({ initialQuestion, hasChart }: { initialQuestion?: string; hasChart: boolean }) {
  const [question, setQuestion] = useState(initialQuestion ?? "");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const ask = (q: string) => {
    const text = q.trim();
    if (text.length < 3 || pending) return;
    if (/sonh/i.test(text) && text.length < 40) {
      router.push("/sonhos");
      return;
    }
    start(async () => {
      setError(null);
      const history = turns.flatMap((t) => [
        { role: "user" as const, content: t.question },
        { role: "assistant" as const, content: t.answer.answer },
      ]);
      const r = await askGuideAction(text, history);
      if (!r.ok) return setError(r.message);
      setTurns((prev) => [{ question: text, answer: r.output }, ...prev]);
      setQuestion("");
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
        className="flex flex-col gap-3"
      >
        <label htmlFor="q" className="sr-only">
          Sua pergunta
        </label>
        <textarea
          id="q"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              ask(question);
            }
          }}
          rows={2}
          maxLength={1000}
          placeholder="Pergunte ao seu mapa…"
          className={cn(inputClass, "text-display h-auto resize-none py-4 text-[1.35rem] leading-snug")}
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-ink-3">{hasChart ? "O Guia usa o seu mapa calculado." : "Adicione seus dados de nascimento para respostas mais pessoais."}</p>
          <Button type="submit" disabled={pending || question.trim().length < 3}>
            {pending ? "Consultando…" : "Perguntar"}
          </Button>
        </div>
      </form>

      {turns.length === 0 && !pending ? (
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="rounded-full border border-line-strong bg-surface-2 px-3.5 py-2 text-left text-sm text-ink-2 transition-colors hover:border-violet/60 hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      {error ? <Notice tone="error">{error}</Notice> : null}
      <div aria-live="polite" className="flex flex-col gap-5">
        {pending ? (
          <Card className="flex items-center gap-3 p-6 text-ink-2">
            <span className="size-2 animate-pulse rounded-full bg-lilac" aria-hidden />
            Consultando seu mapa…
          </Card>
        ) : null}
        {turns.map((t, i) => (
          <Card key={turns.length - i} className="relative overflow-hidden p-6 md:p-8">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-violet/10 blur-3xl" />
            <p className="relative text-display text-[1.45rem] leading-snug text-ink-2">“{t.question}”</p>
            <p className="relative mt-5 flex items-center gap-2 text-sm text-lilac">
              <span aria-hidden>✦</span> Seu Guia
            </p>
            <div className="relative mt-2 flex flex-col gap-3">
              {t.answer.answer.split(/\n{2,}/).map((p, j) => (
                <p key={j} className="text-[15px] leading-relaxed text-ink">
                  {p}
                </p>
              ))}
            </div>
            {t.answer.reflection_questions.length ? (
              <ul className="relative mt-5 flex flex-col gap-1 border-l border-gold/40 pl-4">
                {t.answer.reflection_questions.map((q, j) => (
                  <li key={j} className="text-display text-[1.1rem] text-ink-2">
                    {q}
                  </li>
                ))}
              </ul>
            ) : null}
            {i === 0 && t.answer.suggested_questions.length ? (
              <div className="relative mt-5 flex flex-wrap gap-2">
                {t.answer.suggested_questions.map((q) => (
                  <button key={q} type="button" onClick={() => ask(q)} className="rounded-full border border-line-strong px-3 py-1.5 text-xs text-ink-2 hover:text-ink">
                    {q}
                  </button>
                ))}
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
