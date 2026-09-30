import type { Metadata } from "next";
import Link from "next/link";
import { safeNext } from "@/lib/auth/safe-next";
import { AuthCard } from "../auth-card";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }: PageProps<"/auth/login">) {
  const sp = await searchParams;
  const next = safeNext(typeof sp.next === "string" ? sp.next : null, "/");
  return (
    <AuthCard
      title="Que bom te ver de novo"
      subtitle="Entre para abrir o seu observatório pessoal."
      footer={
        <>
          Primeira vez aqui?{" "}
          <Link href="/auth/sign-up" className="text-ink underline underline-offset-4">
            Crie sua conta
          </Link>
        </>
      }
    >
      <LoginForm next={next} />
    </AuthCard>
  );
}
