"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { type AuthState, resendConfirmationAction, signInAction } from "../actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signInAction, {});
  const [resent, resend, resending] = useActionState<AuthState, FormData>(resendConfirmationAction, {});

  return (
    <div className="flex flex-col gap-5">
      <form action={action} className="flex flex-col gap-4" noValidate>
        <input type="hidden" name="next" value={next} />
        <Field label="E-mail" id="email">
          <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.email} />
        </Field>
        <Field label="Senha" id="password">
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </Field>
        {state.message ? <Notice tone="error">{state.message}</Notice> : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      {state.code === "email_not_confirmed" ? (
        <form action={resend}>
          <input type="hidden" name="email" value={state.email ?? ""} />
          <Button type="submit" variant="secondary" className="w-full" disabled={resending}>
            {resending ? "Enviando…" : "Reenviar e-mail de confirmação"}
          </Button>
          {resent.message ? <p className="mt-2 text-center text-xs text-ink-3">{resent.message}</p> : null}
        </form>
      ) : null}

      <Link href="/auth/forgot-password" className="text-center text-sm text-ink-2 underline-offset-4 hover:text-ink hover:underline">
        Esqueci minha senha
      </Link>
    </div>
  );
}
