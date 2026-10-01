import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "../auth-card";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = { title: "Criar conta" };

export default function SignUpPage() {
  return (
    <AuthCard
      title="Crie sua conta"
      subtitle="Seu acesso é liberado automaticamente para o e-mail usado na compra."
      footer={
        <>
          Já tem conta?{" "}
          <Link href="/auth/login" className="text-ink underline underline-offset-4">
            Entrar
          </Link>
        </>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}
