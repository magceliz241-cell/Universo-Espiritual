import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { AuthCard } from "../auth-card";

export const metadata: Metadata = { title: "Algo não deu certo" };

const MESSAGES: Record<string, { title: string; text: string }> = {
  link: {
    title: "Esse link não funciona mais",
    text: "Links de confirmação e de recuperação valem por pouco tempo e só podem ser usados uma vez. Peça um novo e tente de novo.",
  },
  config: {
    title: "Estamos terminando de preparar tudo",
    text: "O acesso ainda não está configurado neste ambiente. Tente novamente em instantes.",
  },
};

export default async function AuthErrorPage({ searchParams }: PageProps<"/auth/error">) {
  const sp = await searchParams;
  const m = MESSAGES[typeof sp.reason === "string" ? sp.reason : ""] ?? MESSAGES.link;
  return (
    <AuthCard title={m.title} subtitle={m.text}>
      <div className="flex flex-col gap-3">
        <ButtonLink href="/auth/login">Ir para o login</ButtonLink>
        <ButtonLink href="/auth/forgot-password" variant="ghost">
          Recuperar senha
        </ButtonLink>
      </div>
    </AuthCard>
  );
}
