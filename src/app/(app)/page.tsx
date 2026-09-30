import type { Metadata } from "next";
import Link from "next/link";
import { MoonPhase } from "@/components/celestial/moon-phase";
import { PlacementCard } from "@/components/dashboard/placement-card";
import { NavIcon } from "@/components/shell/icons";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/page-header";
import { moonState } from "@/lib/astro/moon";
import { SIGN_NAMES } from "@/lib/astro/labels";
import { DEFAULT_HOUSE_SYSTEM } from "@/lib/astro/config";
import { getOrCreateChart, getSelfProfile } from "@/lib/charts/service";
import { getProfile, requireMember } from "@/lib/data/session";
import { formatDatePt, greeting } from "@/lib/greeting";

export const metadata: Metadata = { title: "Início" };

const EXPLORE = [
  { href: "/tarot", label: "Tarot", text: "Uma carta para o dia ou uma pergunta aberta.", icon: "tarot" },
  { href: "/amor", label: "Amor", text: "Seu perfil amoroso e o mapa do casal.", icon: "love" },
  { href: "/numerologia", label: "Numerologia", text: "Os números da sua data e do seu nome.", icon: "numbers" },
  { href: "/sonhos", label: "Sonhos", text: "Símbolos e leituras possíveis do que você sonhou.", icon: "dreams" },
] as const;

const SUGGESTIONS = ["O que minha Lua representa?", "Por que eu ajo assim nos relacionamentos?", "O que meu mapa destaca neste momento?"];

export default async function Dashboard() {
  const { db } = await requireMember();
  const [profile, self] = await Promise.all([getProfile(db), getSelfProfile(db)]);
  const chart = self ? (await getOrCreateChart(db, self, DEFAULT_HOUSE_SYSTEM)).chart : null;
  const tz = self?.timezone ?? "America/Sao_Paulo";
  const moon = moonState();
  const name = profile?.display_name?.split(" ")[0];

  return (
    <div className="flex flex-col gap-12">
      <header>
        <p className="eyebrow mb-3">{formatDatePt(new Date(), tz, { weekday: "long", day: "numeric", month: "long" })}</p>
        <h1 className="text-display text-[2.6rem] md:text-[3.4rem]">
          {greeting(tz)}
          {name ? `, ${name}` : ""}
        </h1>
      </header>

      <section aria-labelledby="ceu-hoje">
        <SectionTitle>
          <span id="ceu-hoje">Seu céu hoje</span>
        </SectionTitle>
        <Link href="/lua" className="block">
          <Card interactive className="relative flex flex-col items-center gap-6 overflow-hidden p-6 sm:flex-row sm:p-8">
            <MoonPhase illumination={moon.illumination} waxing={moon.waxing} size={132} southern={(self?.latitude ?? -15) < 0} />
            <div className="text-center sm:text-left">
              <p className="eyebrow">Fase da Lua</p>
              <p className="text-display mt-1 text-[2rem]">{moon.phaseLabel}</p>
              <p className="mt-1 text-sm text-ink-2">
                {Math.round(moon.illumination * 100)}% iluminada · Lua em {SIGN_NAMES[moon.moonSign]}
              </p>
              <p className="mt-3 text-xs text-ink-3">
                Próxima: {moon.next[0].label}, {formatDatePt(moon.next[0].instant, tz, { day: "numeric", month: "long" })}
              </p>
            </div>
          </Card>
        </Link>
      </section>

      <section aria-labelledby="seu-mapa">
        <SectionTitle
          action={
            chart ? (
              <Link href="/mapa" className="text-sm text-ink-2 hover:text-ink">
                Ver mapa completo →
              </Link>
            ) : null
          }
        >
          <span id="seu-mapa">Seu mapa</span>
        </SectionTitle>
        {chart ? (
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <PlacementCard label="Sol" body="sun" sign={chart.planets.sun.sign} degree={chart.planets.sun.degree} minute={chart.planets.sun.minute} />
            <PlacementCard label="Lua" body="moon" sign={chart.planets.moon.sign} degree={chart.planets.moon.degree} minute={chart.planets.moon.minute} />
            {chart.angles ? (
              <PlacementCard label="Ascendente" short="ASC" sign={chart.angles.ascendant.sign} degree={chart.angles.ascendant.degree} minute={chart.angles.ascendant.minute} />
            ) : (
              <Card className="flex flex-col justify-end gap-1 p-4 md:p-5">
                <p className="eyebrow">Ascendente</p>
                <p className="text-xs leading-relaxed text-ink-3">Depende do horário de nascimento.</p>
              </Card>
            )}
          </div>
        ) : (
          <EmptyState title="Ainda não criamos seu mapa" action={<ButtonLink href="/perfil/nascimento">Criar meu mapa</ButtonLink>}>
            Adicione seus dados de nascimento para descobrir seu céu pessoal.
          </EmptyState>
        )}
      </section>

      <section aria-labelledby="explorar">
        <SectionTitle>
          <span id="explorar">Explorar</span>
        </SectionTitle>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {EXPLORE.map((e) => (
            <Link key={e.href} href={e.href}>
              <Card interactive className="flex h-full flex-col gap-3 p-4 md:p-5">
                <NavIcon name={e.icon} className="text-gold" />
                <div>
                  <p className="text-display text-[1.35rem]">{e.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-3">{e.text}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="guia">
        <Card className="relative overflow-hidden p-6 md:p-8">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet/15 blur-3xl" />
          <p id="guia" className="relative flex items-center gap-2 text-sm text-lilac">
            <span aria-hidden>✦</span> Seu Guia
          </p>
          <p className="text-display relative mt-3 text-[1.9rem]">Pergunte ao seu mapa</p>
          <div className="relative mt-5 flex flex-wrap gap-2">
            {SUGGESTIONS.map((q) => (
              <Link
                key={q}
                href={`/guia?q=${encodeURIComponent(q)}`}
                className="rounded-full border border-line-strong bg-surface-2 px-3.5 py-2 text-sm text-ink-2 transition-colors hover:border-violet/60 hover:text-ink"
              >
                {q}
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
