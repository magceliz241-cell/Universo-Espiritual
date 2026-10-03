import type { Metadata } from "next";
import Link from "next/link";
import { Sparkle } from "@/components/brand/wordmark";
import { MoonPhase } from "@/components/celestial/moon-phase";
import { PlacementCard } from "@/components/dashboard/placement-card";
import { type IconName, NavIcon } from "@/components/shell/icons";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionTitle } from "@/components/ui/page-header";
import { moonState, type MoonPhaseId } from "@/lib/astro/moon";
import { SIGN_NAMES } from "@/lib/astro/labels";
import { DEFAULT_HOUSE_SYSTEM } from "@/lib/astro/config";
import { getOrCreateChart, getSelfProfile } from "@/lib/charts/service";
import { getProfile, requireMember } from "@/lib/data/session";
import { formatDatePt } from "@/lib/greeting";

export const metadata: Metadata = { title: "Início" };

/** Atalhos em grade (estética da capa): só telas que já existem. */
const TILES: { href: string; label: string; icon: IconName }[] = [
  { href: "/mapa", label: "Mapa Astral", icon: "sun" },
  { href: "/tarot", label: "Tarot", icon: "tarot" },
  { href: "/numerologia", label: "Numerologia", icon: "numbers" },
  { href: "/lua", label: "Lua", icon: "moon" },
  { href: "/sonhos", label: "Sonhos", icon: "dreams" },
  { href: "/amor", label: "Amor", icon: "love" },
];

/** Ordem das fases e o desenho aproximado de cada uma na faixa. */
const STRIP: { id: MoonPhaseId; k: number; waxing: boolean; line: string }[] = [
  { id: "new_moon", k: 0, waxing: true, line: "Tempo de começar de novo." },
  { id: "waxing_crescent", k: 0.25, waxing: true, line: "Tempo de dar os primeiros passos." },
  { id: "first_quarter", k: 0.5, waxing: true, line: "Tempo de ação e movimento." },
  { id: "waxing_gibbous", k: 0.75, waxing: true, line: "Tempo de ajustar e persistir." },
  { id: "full_moon", k: 1, waxing: true, line: "Tempo de ver com clareza." },
  { id: "waning_gibbous", k: 0.75, waxing: false, line: "Tempo de agradecer e compartilhar." },
  { id: "last_quarter", k: 0.5, waxing: false, line: "Tempo de soltar o que pesa." },
  { id: "waning_crescent", k: 0.25, waxing: false, line: "Tempo de descanso e recolhimento." },
];

export default async function Dashboard() {
  const { db } = await requireMember();
  const [profile, self] = await Promise.all([getProfile(db), getSelfProfile(db)]);
  const chart = self ? (await getOrCreateChart(db, self, DEFAULT_HOUSE_SYSTEM)).chart : null;
  const tz = self?.timezone ?? "America/Sao_Paulo";
  const southern = (self?.latitude ?? -15) < 0;
  const moon = moonState();
  const name = profile?.display_name?.split(" ")[0];
  const idx = STRIP.findIndex((p) => p.id === moon.phase);
  const strip = [-2, -1, 0, 1, 2].map((o) => STRIP[(idx + o + 8) % 8]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-9">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow mb-2">{formatDatePt(new Date(), tz, { weekday: "long", day: "numeric", month: "long" })}</p>
          <h1 className="text-display flex items-center gap-2 text-[2.3rem] md:text-[3rem]">
            Olá{name ? `, ${name}` : ""} <Sparkle size={18} className="mt-1 shrink-0" />
          </h1>
          <p className="mt-1.5 text-[15px] text-ink-2">O universo sempre tem algo para te mostrar.</p>
        </div>
        <MoonPhase illumination={moon.illumination} waxing={moon.waxing} size={76} southern={southern} className="mt-2 shrink-0" />
      </header>

      <section aria-labelledby="fase-lua">
        <Link href="/lua" className="block">
          <Card interactive className="px-4 pb-5 pt-6 text-center">
            <ul aria-hidden className="flex items-center justify-center gap-3 sm:gap-5">
              {strip.map((p, i) => (
                <li key={p.id} className={i === 2 ? "rounded-full ring-1 ring-gold/50 ring-offset-4 ring-offset-transparent" : "opacity-55"}>
                  <MoonPhase illumination={p.k} waxing={p.waxing} size={i === 2 ? 38 : 26} southern={southern} />
                </li>
              ))}
            </ul>
            <p id="fase-lua" className="eyebrow mt-5">Fase da Lua</p>
            <p className="text-display mt-1 text-[1.7rem]">{moon.phaseLabel}</p>
            <p className="mt-1 text-sm text-ink-2">{STRIP[idx].line}</p>
            <p className="mt-2 text-xs text-ink-3">
              {Math.round(moon.illumination * 100)}% iluminada · Lua em {SIGN_NAMES[moon.moonSign]} · próxima: {moon.next[0].label},{" "}
              {formatDatePt(moon.next[0].instant, tz, { day: "numeric", month: "short" })}
            </p>
          </Card>
        </Link>
      </section>

      <nav aria-label="Explorar">
        <ul className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {TILES.map((t) => (
            <li key={t.href}>
              <Link href={t.href} className="block h-full">
                <Card interactive className="flex aspect-[1/0.92] flex-col items-center justify-center gap-2.5 p-3 text-center">
                  <NavIcon name={t.icon} size={30} className="text-gold drop-shadow-[0_0_8px_rgb(214_181_110_/_0.35)]" />
                  <span className="text-[13px] text-ink">{t.label}</span>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link href="/guia" className="block">
        <Card interactive className="flex items-center gap-4 p-4 md:p-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/5">
            <NavIcon name="guide" size={24} className="text-gold" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-display block text-[1.45rem] leading-tight">Seu Guia</span>
            <span className="block text-sm text-ink-2">Converse sobre o seu mapa, em linguagem simples.</span>
          </span>
          <NavIcon name="chevron" className="shrink-0 text-gold/70" />
        </Card>
      </Link>

      <section aria-labelledby="seu-mapa">
        <SectionTitle
          action={
            chart ? (
              <Link href="/mapa" className="text-sm text-gold/90 hover:text-gold">
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
    </div>
  );
}
