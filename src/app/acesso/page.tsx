import type { Metadata } from "next";
import { connection } from "next/server";
import { BrandHero } from "@/components/brand/wordmark";
import { OrbitalDecoration } from "@/components/celestial/orbital-decoration";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { publicEnv, supabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { ClaimForm } from "./claim-form";

export const metadata: Metadata = { title: "Acesso" };

/** Conta logada sem compra vinculada. */
export default async function AcessoPage() {
  await connection();
  let email: string | null = null;
  if (supabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    email = data.user?.email ?? null;
  }

  return (
    <main className="relative flex min-h-dvh flex-col items-center overflow-hidden px-4 py-10 sm:justify-center">
      <OrbitalDecoration className="absolute -top-40 left-1/2 w-[720px] max-w-none -translate-x-1/2 opacity-80" />
      <div className="relative w-full max-w-[440px]">
        <BrandHero className="mb-9" />
        <Card className="p-6 sm:p-8">
          <h1 className="text-display text-[2rem]">Ainda não encontramos sua compra</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            {email ? (
              <>
                Você entrou como <strong className="text-ink">{email}</strong>, mas não há uma compra do Astarot
                ligada a esse e-mail.
              </>
            ) : (
              <>Não há uma compra do Astarot ligada a esta conta.</>
            )}
          </p>
          {email ? (
            <div className="mt-6 border-t border-line pt-5">
              <h2 className="text-display text-[1.35rem]">Comprou com outro e-mail?</h2>
              <p className="mb-4 mt-1 text-sm leading-relaxed text-ink-2">
                Informe o e-mail usado no checkout. Enviamos um link para ele e, quando você confirmar, o acesso é
                liberado nesta conta.
              </p>
              <ClaimForm />
            </div>
          ) : null}
          <ul className="mt-6 flex flex-col gap-3 text-sm leading-relaxed text-ink-2">
            <li>
              <span className="text-gold">·</span> Acabou de comprar? A liberação costuma levar menos de um minuto.
              Atualize esta página.
            </li>
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            <ButtonLink href="/">Atualizar</ButtonLink>
            {publicEnv.landingUrl ? (
              <ButtonLink href={publicEnv.landingUrl} variant="secondary">
                Conhecer o Astarot
              </ButtonLink>
            ) : null}
            <form action="/auth/logout" method="post">
              <Button type="submit" variant="ghost" className="w-full">
                Sair e entrar com outro e-mail
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </main>
  );
}
