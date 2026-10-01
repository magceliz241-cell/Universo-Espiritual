"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import type { AiOutcome } from "@/lib/ai/server";
import type { Interpretation } from "@/lib/ai/response-parser";
import { InterpretationView } from "./interpretation-view";

/**
 * "✦ Seu Guia" — a IA como camada integrada ao produto (design system §21, §26).
 * O texto de carregamento é só UX; não finge processamento místico.
 */
export function GuideCard({
  action,
  intro,
  cta = "Ver minha leitura",
  loadingText,
  initial = null,
}: {
  action: () => Promise<AiOutcome<Interpretation>>;
  intro: string;
  cta?: string;
  loadingText: string;
  initial?: Interpretation | null;
}) {
  const [data, setData] = useState<Interpretation | null>(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const run = () =>
    start(async () => {
      setError(null);
      const r = await action();
      if (r.ok) setData(r.output);
      else setError(r.message);
    });

  return (
    <Card className="relative overflow-hidden p-6 md:p-8">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet/10 blur-3xl" />
      <p className="relative mb-4 flex items-center gap-2 text-sm text-lilac">
        <span aria-hidden>✦</span> Seu Guia
      </p>
      <div className="relative" aria-live="polite" aria-busy={pending}>
        {data ? (
          <InterpretationView data={data} />
        ) : pending ? (
          <div className="flex items-center gap-3 py-6 text-ink-2">
            <span className="size-2 animate-pulse rounded-full bg-lilac" aria-hidden />
            {loadingText}
          </div>
        ) : (
          <div className="flex flex-col items-start gap-4">
            <p className="text-display text-[1.45rem] leading-snug">{intro}</p>
            <Button onClick={run}>{cta}</Button>
          </div>
        )}
        {error ? (
          <div className="mt-4 flex flex-col gap-3">
            <Notice tone="error">{error}</Notice>
            <Button variant="secondary" onClick={run} disabled={pending}>
              Tentar de novo
            </Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
