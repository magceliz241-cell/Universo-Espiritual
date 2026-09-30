"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { type AuthState, signUpAction } from "../actions";

export function SignUpForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signUpAction, {});

  if (state.ok && state.code === "check_email") {
    return (
      <div className="flex flex-col gap-4">
        <Notice tone="success">
          Enviamos um link de confirmação para <strong className="text-ink">{state.email}</strong>.
        </Notice>
        <p className="text-sm leading-relaxed text-ink-2">
          Abra o e-mail e clique em <em>Confirmar meu e-mail</em>. Se não encontrar, procure no spam ou na aba
          Promoções. Depois é só entrar com sua senha.
        </p>
        <Link href="/auth/login" className="text-sm text-ink underline underline-offset-4">
          Ir para o login
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-4" noValidate>
      <Field label="E-mail" id="email" hint="Use o mesmo e-mail da sua compra.">
        <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={state.email} />
      </Field>
      <Field label="Senha" id="password" hint="Pelo menos 8 caracteres.">
        <Input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
      </Field>
      <Field label="Confirme a senha" id="confirm">
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={8} />
      </Field>
      {state.message ? (
        <Notice tone="error">
          {state.message}
          {state.code === "already_registered" ? (
            <>
              {" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Entrar
              </Link>
            </>
          ) : null}
        </Notice>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Criando…" : "Criar minha conta"}
      </Button>
    </form>
  );
}
