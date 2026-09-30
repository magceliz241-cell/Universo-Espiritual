import type { Metadata } from "next";
import Link from "next/link";
import { DreamForm } from "@/components/forms/dream-form";
import { Card } from "@/components/ui/card";
import { PageHeader, SectionTitle } from "@/components/ui/page-header";
import { requireMember } from "@/lib/data/session";
import { formatDatePt } from "@/lib/greeting";

export const metadata: Metadata = { title: "Sonhos" };

export default async function SonhosPage() {
  const { db } = await requireMember();
  const { data: dreams } = await db.from("dream_entries").select("id, content, created_at").order("created_at", { ascending: false }).limit(12);
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-12">
      <PageHeader eyebrow="Diário de sonhos" title="Sonhos">
        Escreva o que lembrar. O sistema identifica símbolos do relato e o Seu Guia oferece leituras possíveis, sempre
        a partir do que você sentiu.
      </PageHeader>
      <Card className="p-6 md:p-8">
        <DreamForm />
      </Card>
      {dreams?.length ? (
        <section>
          <SectionTitle>Seus sonhos</SectionTitle>
          <ul className="flex flex-col gap-2">
            {dreams.map((d) => (
              <li key={d.id}>
                <Link href={`/sonhos/${d.id}`} className="block rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3 transition-colors hover:border-line-strong">
                  <p className="eyebrow">{formatDatePt(d.created_at, "America/Sao_Paulo", { day: "numeric", month: "long" })}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-2">{d.content}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
