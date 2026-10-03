import type { Metadata } from "next";
import Link from "next/link";
import { GoogleButton } from "@/components/auth/google-button";
import { safeNext } from "@/lib/auth/safe-next";
import { publicEnv } from "@/lib/env";
import { AuthCard } from "../auth-card";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: PageProps<"/auth/login">) {
  const sp = await searchParams;
  const next = safeNext(typeof sp.next === "string" ? sp.next : null, "/");
  const withEmail = !publicEnv.googleAuth || sp.metodo === "email";
  const q = next === "/" ? "" : `next=${encodeURIComponent(next)}`;

  if (!withEmail) {
    return (
      <AuthCard
        title="Que bom te ver de novo"
        subtitle="Entre para abrir o seu observatório pessoal."
        footer={
          <>
            Prefere usar o e-mail do checkout?{" "}
            <Link href={`/auth/login?metodo=email${q ? `&${q}` : ""}`} className="text-ink underline underline-offset-4">
              Entrar com e-mail
            </Link>
          </>
        }
      >
        <div className="flex flex-col gap-4 pb-1">
          <GoogleButton next={next} />
          <p className="text-center text-xs leading-relaxed text-ink-3">
            Se a sua conta Google tiver outro e-mail que não o da compra, você confirma o e-mail do checkout logo depois.
          </p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Que bom te ver de novo"
      subtitle={publicEnv.googleAuth ? "Entre com o e-mail e a senha que você cadastrou." : "Entre para abrir o seu observatório pessoal."}
      footer={
        <>
          Primeira vez aqui?{" "}
          <Link href={publicEnv.googleAuth ? "/auth/sign-up?metodo=email" : "/auth/sign-up"} className="text-ink underline underline-offset-4">
            Crie sua conta
          </Link>
          {publicEnv.googleAuth ? (
            <>
              <br />
              <Link href={`/auth/login${q ? `?${q}` : ""}`} className="mt-2 inline-block text-ink underline underline-offset-4">
                Entrar com o Google
              </Link>
            </>
          ) : null}
        </>
      }
    >
      <LoginForm next={next} />
    </AuthCard>
  );
}
