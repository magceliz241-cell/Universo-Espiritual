import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "../auth-card";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Recuperar senha"
      subtitle="Enviaremos um link para você criar uma nova senha."
      footer={
        <Link href="/auth/login" className="text-ink underline underline-offset-4">
          Voltar ao login
        </Link>
      }
    >
      <ForgotForm />
    </AuthCard>
  );
}
