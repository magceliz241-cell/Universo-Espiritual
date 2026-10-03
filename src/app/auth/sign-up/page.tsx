import type { Metadata } from "next";
import Link from "next/link";
import { GoogleButton } from "@/components/auth/google-button";
import { publicEnv } from "@/lib/env";
import { AuthCard } from "../auth-card";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = { title: "Criar conta" };

export default async function SignUpPage({ searchParams }: PageProps<"/auth/sign-up">) {
  const sp = await searchParams;
  const withEmail = !publicEnv.googleAuth || sp.metodo === "email";

  if (!withEmail) {
    return (
      <AuthCard
        title="Crie sua conta"
        subtitle="Comprou o Astarot? Entre com o Google em um toque e o seu acesso é liberado."
        footer={
          <>
            Prefere criar a conta com o e-mail do checkout?{" "}
            <Link href="/auth/sign-up?metodo=email" className="text-ink underline underline-offset-4">
              Cadastrar com e-mail
            </Link>
          </>
        }
      >
        <div className="flex flex-col gap-4 pb-1">
          <GoogleButton next="/" />
          <p className="text-center text-xs leading-relaxed text-ink-3">
            Se a sua conta Google tiver outro e-mail que não o da compra, você confirma o e-mail do checkout logo depois.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Crie sua conta"
      subtitle="Seu acesso é liberado automaticamente para o e-mail usado na compra."
      footer={
        <>
          Já tem conta?{" "}
          <Link href={publicEnv.googleAuth ? "/auth/login?metodo=email" : "/auth/login"} className="text-ink underline underline-offset-4">
            Entrar
          </Link>
          {publicEnv.googleAuth ? (
            <>
              <br />
              <Link href="/auth/sign-up" className="mt-2 inline-block text-ink underline underline-offset-4">
                Criar com o Google
              </Link>
            </>
          ) : null}
        </>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}
