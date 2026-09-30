"use client";

import { useActionState } from "react";
import { type IntentionState, saveIntentionAction } from "@/app/(app)/lua/actions";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/ui/field";
import { cn } from "@/lib/cn";

export function IntentionForm({ intention, journal }: { intention: string; journal: string }) {
  const [state, action, pending] = useActionState<IntentionState, FormData>(saveIntentionAction, { ok: null });
  return (
    <form action={action} className="flex flex-col gap-4">
      <label htmlFor="intention" className="eyebrow text-center">
        Sua intenção
      </label>
      <input
        id="intention"
        name="intention"
        defaultValue={intention}
        maxLength={1000}
        placeholder="Escreva sua intenção…"
        className={cn(inputClass, "text-display h-14 text-center text-[1.25rem]")}
      />
      <label htmlFor="journal" className="sr-only">
        Diário
      </label>
      <textarea
        id="journal"
        name="journal"
        defaultValue={journal}
        maxLength={5000}
        rows={3}
        placeholder="Notas, sentimentos, o que você quer observar nesta fase (opcional)"
        className={cn(inputClass, "h-auto py-3")}
      />
      <div className="flex items-center justify-center gap-3">
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Guardando…" : "Guardar"}
        </Button>
        {state.message ? (
          <span role="status" className={cn("text-sm", state.ok ? "text-gold" : "text-danger")}>
            {state.message}
          </span>
        ) : null}
      </div>
    </form>
  );
}
