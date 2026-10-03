import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/ai/guide-card";
import { PlacementCard } from "@/components/dashboard/placement-card";
import { LoveOffer } from "@/components/love/love-offer";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader, SectionTitle } from "@/components/ui/page-header";
import { DEFAULT_HOUSE_SYSTEM } from "@/lib/astro/config";
import { getOrCreateChart, getSelfProfile } from "@/lib/charts/service";
import { requireMember } from "@/lib/data/session";
import { interpretLove } from "../interpret-actions";

export const metadata: Metadata = { title: "Amor" };

export default async function AmorPage() {
  const { db, tier } = await requireMember();
  if (tier !== "love") return <LoveOffer />;
  const self = await getSelfProfile(db);

  return (
    <div className="flex flex-col gap-12">
      <PageHeader eyebrow="Relacionamentos" title="Amor">
        Como você ama, na linguagem do seu mapa, e como o seu céu conversa com o de outra pessoa.
      </PageHeader>

      {!self ? (
        <EmptyState title="Primeiro, o seu céu" action={<ButtonLink href="/perfil/nascimento">Adicionar meus dados</ButtonLink>}>
          O perfil amoroso nasce do seu mapa. Adicione seus dados de nascimento para começar.
        </EmptyState>
      ) : (
        <LoveProfile />
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <Link href="/amor/sinastria">
          <Card interactive className="relative h-full overflow-hidden p-6">
            <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-wine/25 blur-3xl" />
            <p className="eyebrow text-rose">Mapa do casal</p>
            <p className="text-display mt-2 text-[1.7rem]">Conexões entre dois céus</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">Compare o seu mapa com o de outra pessoa: afinidades, tensões e crescimento. Sem porcentagens.</p>
          </Card>
        </Link>
        <Link href="/tarot?tiragem=love-3-cards">
          <Card interactive className="h-full p-6">
            <p className="eyebrow text-rose">Tarot do amor</p>
            <p className="text-display mt-2 text-[1.7rem]">Três cartas sobre o seu amor</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">Energia atual, dinâmica e reflexão. Um espelho, não uma previsão.</p>
          </Card>
        </Link>
      </section>
    </div>
  );

  async function LoveProfile() {
    const { chart } = await getOrCreateChart(db, self!, DEFAULT_HOUSE_SYSTEM);
    return (
      <>
        <section>
          <SectionTitle>Seus planetas do encontro</SectionTitle>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <PlacementCard label="Vênus · afeto" body="venus" sign={chart.planets.venus.sign} degree={chart.planets.venus.degree} minute={chart.planets.venus.minute} />
            <PlacementCard label="Marte · desejo" body="mars" sign={chart.planets.mars.sign} degree={chart.planets.mars.degree} minute={chart.planets.mars.minute} />
            <PlacementCard label="Lua · necessidades" body="moon" sign={chart.planets.moon.sign} degree={chart.planets.moon.degree} minute={chart.planets.moon.minute} />
            <PlacementCard label="Sol · identidade" body="sun" sign={chart.planets.sun.sign} degree={chart.planets.sun.degree} minute={chart.planets.sun.minute} />
          </div>
        </section>
        <GuideCard action={interpretLove} intro="Como você ama? Vênus, Marte e a sua Lua têm algo a dizer." cta="Ver meu perfil amoroso" loadingText="Observando seu céu…" />
      </>
    );
  }
}
