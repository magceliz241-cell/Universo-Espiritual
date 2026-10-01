"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { type AuthState, updatePasswordAction } from "../actions";

export function UpdatePasswordForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(updatePasswordAction, {});
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <Field label="Nova senha" id="password" hint="Pelo menos 8 caracteres.">
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
      </Field>
      <Field label="Confirme a nova senha" id="confirm">
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={8} />
      </Field>
      {state.message ? <Notice tone="error">{state.message}</Notice> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando…" : "Salvar nova senha"}
      </Button>
    </form>
  );
}
