"use client";

import { useActionState } from "react";
import { type AuthState, claimPurchaseEmailAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";

/** Comprou com outro e-mail: confirma o e-mail do checkout por link antes de ligar a compra a esta conta. */
export function ClaimForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(claimPurchaseEmailAction, {});

  if (state.ok && state.code === "claim_sent") {
    return (
      <div className="flex flex-col gap-3">
        <Notice tone="success">
          Enviamos um link de confirmação para <strong className="text-ink">{state.email}</strong>.
        </Notice>
        <p className="text-sm leading-relaxed text-ink-2">
          Abra esse e-mail e toque em <em>Confirmar</em>. Se não encontrar, procure no spam ou na aba Promoções. Se
          também chegar um e-mail no endereço atual da conta, confirme por ele. Depois volte aqui e atualize a página.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3" noValidate>
      <Field label="E-mail usado no checkout" id="claim-email">
        <Input id="claim-email" name="email" type="email" autoComplete="email" required defaultValue={state.email} />
      </Field>
      {state.message ? <Notice tone="error">{state.message}</Notice> : null}
      <Button type="submit" variant="secondary" disabled={pending}>
        {pending ? "Enviando…" : "Confirmar e-mail da compra"}
      </Button>
      <p className="text-xs leading-relaxed text-ink-3">
        Ao confirmar, a compra é ligada a esta conta e esse passa a ser o e-mail dela. Você continua entrando do mesmo
        jeito (inclusive pelo Google).
      </p>
    </form>
  );
}
