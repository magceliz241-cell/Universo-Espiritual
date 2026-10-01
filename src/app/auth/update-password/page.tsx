import type { Metadata } from "next";
import { AuthCard } from "../auth-card";
import { UpdatePasswordForm } from "./update-form";

export const metadata: Metadata = { title: "Nova senha" };

export default function UpdatePasswordPage() {
  return (
    <AuthCard title="Nova senha" subtitle="Escolha uma senha para entrar daqui em diante.">
      <UpdatePasswordForm />
    </AuthCard>
  );
}
