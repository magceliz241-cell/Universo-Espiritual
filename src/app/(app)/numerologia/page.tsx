import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/ai/guide-card";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getSelfProfile } from "@/lib/charts/service";
import { getProfile, requireMember } from "@/lib/data/session";
import { kb } from "@/lib/knowledge/ids";
import { kbSection } from "@/lib/knowledge/sections";
import { METRIC_LABELS, numerologyProfile } from "@/lib/numerology/pythagorean";
import { interpretNumerology } from "../interpret-actions";

export const metadata: Metadata = { title: "Numerologia" };

export default async function NumerologiaPage() {
  const { db } = await requireMember();
  const [self, profile] = await Promise.all([getSelfProfile(db), getProfile(db)]);
  if (!self) {
    return (
      <>
        <PageHeader eyebrow="Numerologia pitagórica" title="Numerologia" />
        <EmptyState title="Seus números começam na sua data" action={<ButtonLink href="/perfil/nascimento">Adicionar meus dados</ButtonLink>}>
          Adicione sua data de nascimento (e, se quiser, seu nome completo de nascimento).
        </EmptyState>
      </>
    );
  }

  const year = new Date().getFullYear();
  const p = numerologyProfile({ birthDate: self.birth_date, fullName: profile?.birth_name ?? null, currentYear: year });
  const main = p.metrics[0];
  const rest = p.metrics.slice(1);
  const themes = kbSection(kb.number(main.value), "Temas");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-12">
      <PageHeader eyebrow="Numerologia pitagórica" title="Numerologia" />

      <section className="-mt-4 flex flex-col items-center text-center">
        <p className="text-display animate-[fade-in_700ms_var(--ease-soft)] text-[8rem] leading-none text-gold md:text-[10rem]">{main.value}</p>
        <p className="eyebrow mt-4">{METRIC_LABELS[main.metric]}</p>
        {themes ? <p className="text-display mt-3 max-w-md text-[1.4rem] leading-snug text-ink-2">{themes.split(",").map((t) => t.trim()).join(" · ")}</p> : null}
        {[11, 22, 33].includes(main.value) ? <p className="mt-3 text-xs text-ink-3">Número mestre, preservado pela metodologia.</p> : null}
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {rest.map((m) => (
          <Card key={m.metric} className="flex flex-col items-center gap-1 px-3 py-5 text-center">
            <span className="text-display text-[2.6rem] leading-none">{m.value}</span>
            <span className="eyebrow mt-2">{m.metric === "personal-year" ? `${METRIC_LABELS[m.metric]} ${year}` : METRIC_LABELS[m.metric]}</span>
          </Card>
        ))}
      </section>
      {!profile?.birth_name ? (
        <p className="-mt-8 text-center text-sm text-ink-3">
          Expressão, Alma e Personalidade usam o nome completo de nascimento.{" "}
          <Link href="/perfil/nascimento" className="text-ink-2 underline underline-offset-4 hover:text-ink">
            Adicionar nome
          </Link>
        </p>
      ) : null}

      <GuideCard action={interpretNumerology} intro="O que os seus números sugerem, juntos?" cta="Ler meus números" loadingText="Calculando seus números…" />

      <p className="text-center text-xs leading-relaxed text-ink-3">
        Método pitagórico ({p.method_version}). Caminho de Vida pelo método de 3 ciclos; letras sem acento de forma
        uniforme; Y como consoante. Numerologia é uma linguagem simbólica, não uma ciência.
      </p>
    </div>
  );
}
