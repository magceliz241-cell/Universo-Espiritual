"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { type DreamState, saveDreamAction } from "@/app/(app)/sonhos/actions";
import { EMOTIONS } from "@/lib/dreams/emotions";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { cn } from "@/lib/cn";

export function DreamForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState<DreamState, FormData>(saveDreamAction, { ok: null });
  useEffect(() => {
    if (state.ok === true) router.push(`/sonhos/${state.id}`);
  }, [state, router]);

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="text-display text-[1.6rem]">
          O que você sonhou?
        </label>
        <textarea
          id="content"
          name="content"
          rows={7}
          maxLength={5000}
          required
          placeholder="Conte seu sonho do jeito que lembrar…"
          className={cn(inputClass, "text-display h-auto py-4 text-[1.15rem] leading-relaxed")}
        />
      </div>
      <fieldset className="flex flex-col gap-3">
        <legend className="text-display mb-2 text-[1.35rem]">Como você se sentiu?</legend>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((e) => (
            <label key={e} className="cursor-pointer">
              <input type="checkbox" name="emotions" value={e} className="peer sr-only" />
              <span className="inline-block rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-ink-2 transition-colors peer-checked:border-violet/70 peer-checked:bg-violet/15 peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-lilac">
                {e}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {state.ok === false ? <Notice tone="error">{state.message}</Notice> : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Organizando…" : "Guardar e ler"}
      </Button>
      <p className="-mt-3 text-xs text-ink-3">Seus sonhos ficam só na sua conta. A leitura é reflexiva, nunca um diagnóstico.</p>
    </form>
  );
}
