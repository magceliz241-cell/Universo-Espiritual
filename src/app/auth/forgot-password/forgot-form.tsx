"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { type AuthState, forgotPasswordAction } from "../actions";

export function ForgotForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(forgotPasswordAction, {});
  if (state.ok) {
    return (
      <Notice tone="success">
        Se existir uma conta para <strong className="text-ink">{state.email}</strong>, você vai receber um link para
        criar uma nova senha. Confira também o spam.
      </Notice>
    );
  }
  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <Field label="E-mail" id="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      {state.message ? <Notice tone="error">{state.message}</Notice> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Enviando…" : "Enviar link"}
      </Button>
    </form>
  );
}
