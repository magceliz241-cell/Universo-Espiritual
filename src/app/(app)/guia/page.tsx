import type { Metadata } from "next";
import { GuideChat } from "@/components/ai/guide-chat";
import { getSelfProfile } from "@/lib/charts/service";
import { requireMember } from "@/lib/data/session";

export const metadata: Metadata = { title: "Seu Guia" };

export default async function GuiaPage({ searchParams }: PageProps<"/guia">) {
  const { db } = await requireMember();
  const sp = await searchParams;
  const self = await getSelfProfile(db);
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <header>
        <p className="mb-3 flex items-center gap-2 text-sm text-lilac">
          <span aria-hidden>✦</span> Seu Guia
        </p>
        <h1 className="text-display text-[2.6rem] md:text-[3.2rem]">Pergunte ao seu mapa</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
          O Seu Guia traduz o seu mapa para uma linguagem simples. Pergunte sobre amor, trabalho, fases e escolhas: a
          resposta parte do seu céu calculado, não de um texto genérico de signo.
        </p>
      </header>
      <GuideChat initialQuestion={typeof sp.q === "string" ? sp.q.slice(0, 300) : undefined} hasChart={Boolean(self)} />
    </div>
  );
}
