"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import type { BirthActionState } from "@/app/(app)/perfil/actions";
import { saveBirthAction } from "@/app/(app)/perfil/actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { CitySearch } from "./city-search";

export interface BirthDefaults {
  id?: string;
  name?: string;
  date?: string;
  time?: string | null;
  city?: { id: number; label: string } | null;
  birthName?: string | null;
}

export function BirthForm({
  kind,
  defaults = {},
  redirectTo,
  submitLabel = "Salvar",
}: {
  kind: "self" | "partner";
  defaults?: BirthDefaults;
  redirectTo: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<BirthActionState, FormData>(saveBirthAction, { ok: null });
  const [unknownTime, setUnknownTime] = useState(defaults.time === null && Boolean(defaults.date));

  useEffect(() => {
    if (state.ok === true) router.push(redirectTo);
  }, [state, router, redirectTo]);

  const err = state.ok === false ? state : null;
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="kind" value={kind} />
      {defaults.id ? <input type="hidden" name="id" value={defaults.id} /> : null}

      <Field label={kind === "self" ? "Como podemos te chamar?" : "Nome ou apelido da outra pessoa"} id="name" error={err?.field === "name" ? err.message : null}>
        <Input id="name" name="name" required maxLength={80} defaultValue={defaults.name} autoComplete={kind === "self" ? "given-name" : "off"} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Data de nascimento" id="date" error={err?.field === "date" ? err.message : null}>
          <Input id="date" name="date" type="date" required min="1800-01-01" max="2100-12-31" defaultValue={defaults.date} />
        </Field>
        <Field label="Horário de nascimento" id="time" hint="Quanto mais exato, melhor para Ascendente e casas." error={err?.field === "time" ? err.message : null}>
          <Input id="time" name="time" type="time" disabled={unknownTime} defaultValue={defaults.time ?? undefined} />
        </Field>
      </div>

      <label className="-mt-2 flex items-center gap-2.5 text-sm text-ink-2">
        <input
          type="checkbox"
          name="unknownTime"
          checked={unknownTime}
          onChange={(e) => setUnknownTime(e.target.checked)}
          className="size-4 accent-[var(--color-violet)]"
        />
        Não sei o horário
      </label>

      <Field label="Cidade de nascimento" id="cityId" error={err?.field === "city" || err?.field === "cityId" ? err.message : null}>
        <CitySearch name="cityId" defaultCity={defaults.city} invalid={err?.field === "city"} />
      </Field>

      {kind === "self" ? (
        <Field label="Nome completo de nascimento (opcional)" id="birthName" hint="Usado só para calcular sua numerologia. Não é enviado à IA.">
          <Input id="birthName" name="birthName" maxLength={200} defaultValue={defaults.birthName ?? undefined} autoComplete="name" />
        </Field>
      ) : null}

      {err?.ambiguous ? (
        <fieldset className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-gold/30 bg-gold/5 p-4">
          <legend className="px-1 text-sm text-ink">{err.message}</legend>
          {err.ambiguous.map((o) => (
            <label key={o.fold} className="flex items-center gap-2.5 text-sm text-ink-2">
              <input type="radio" name="fold" value={o.fold} required className="accent-[var(--color-violet)]" />
              {o.label}
            </label>
          ))}
        </fieldset>
      ) : err && !err.field ? (
        <Notice tone="error">{err.message}</Notice>
      ) : null}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Salvando…" : submitLabel}
      </Button>
    </form>
  );
}
