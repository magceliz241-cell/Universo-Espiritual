import type { Metadata } from "next";
import { AspectList } from "@/components/astrology/aspect-list";
import { ChartWheel } from "@/components/astrology/chart-wheel";
import { HouseSystemPicker } from "@/components/astrology/house-system-picker";
import { PlanetTable } from "@/components/astrology/planet-table";
import { GuideCard } from "@/components/ai/guide-card";
import { SignGlyph } from "@/components/celestial/glyph";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Notice } from "@/components/ui/notice";
import { PageHeader, SectionTitle } from "@/components/ui/page-header";
import { DEFAULT_HOUSE_SYSTEM } from "@/lib/astro/config";
import { SIGN_NAMES } from "@/lib/astro/labels";
import type { HouseSystem } from "@/lib/astro/types";
import { getOrCreateChart, getSelfProfile } from "@/lib/charts/service";
import { requireMember } from "@/lib/data/session";
import { formatDatePt } from "@/lib/greeting";
import { interpretNatal } from "../interpret-actions";

export const metadata: Metadata = { title: "Seu mapa" };

const SYSTEM_NAMES: Record<string, string> = { placidus: "Placidus", whole_sign: "Whole Sign", equal: "Equal", porphyry: "Porphyry" };

export default async function MapaPage({ searchParams }: PageProps<"/mapa">) {
  const { db } = await requireMember();
  const sp = await searchParams;
  const system: HouseSystem = sp.casas === "whole_sign" || sp.casas === "equal" ? sp.casas : DEFAULT_HOUSE_SYSTEM;
  const self = await getSelfProfile(db);

  if (!self) {
    return (
      <>
        <PageHeader eyebrow="Mapa astral" title="Seu mapa" />
        <EmptyState title="Ainda não criamos seu mapa" action={<ButtonLink href="/perfil/nascimento">Criar meu mapa</ButtonLink>}>
          Adicione seus dados de nascimento para descobrir seu céu pessoal.
        </EmptyState>
      </>
    );
  }

  const { chart } = await getOrCreateChart(db, self, system);
  const b = chart.birth_data;
  const when = formatDatePt(`${b.date}T12:00:00Z`, "UTC", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex flex-col gap-12">
      <PageHeader eyebrow="Mapa astral" title="Seu mapa">
        {when}
        {b.time ? ` · ${b.time.slice(0, 5)}` : " · horário desconhecido"}
        {self.place_label ? ` · ${self.place_label}` : ""}
      </PageHeader>

      <nav aria-label="Partes do mapa" className="-mt-6 flex gap-1.5 overflow-x-auto pb-1">
        {[
          ["#roda", "Mapa"],
          ["#planetas", "Planetas"],
          ["#aspectos", "Aspectos"],
          ...(chart.houses.length ? [["#casas", "Casas"]] : []),
        ].map(([href, label], i) => (
          <a
            key={href}
            href={href}
            className={
              i === 0
                ? "shrink-0 rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-sm text-gold"
                : "shrink-0 rounded-full border border-line px-4 py-1.5 text-sm text-ink-2 hover:border-gold/40 hover:text-ink"
            }
          >
            {label}
          </a>
        ))}
      </nav>

      {!b.time_known ? (
        <Notice>
          Sem o horário de nascimento, o mapa mostra os planetas nos signos, mas não as casas nem o Ascendente.
          {chart.moon_sign_range && chart.moon_sign_range.length > 1
            ? ` Nesse dia a Lua passou por ${chart.moon_sign_range.map((s) => SIGN_NAMES[s]).join(" e ")}.`
            : ""}
        </Notice>
      ) : null}
      {chart.house_system_effective === "porphyry" ? (
        <Notice>
          Na latitude do seu nascimento, o sistema {SYSTEM_NAMES[chart.house_system]} não pode ser calculado. Usamos
          Porphyry, a alternativa padrão do motor.
        </Notice>
      ) : null}

      <section className="grid scroll-mt-20 items-start gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]" id="roda">
        <div className="flex flex-col gap-6">
          <ChartWheel chart={chart} className="mx-auto w-full max-w-[560px] animate-[fade-in_700ms_var(--ease-soft)]" />
          {b.time_known ? <HouseSystemPicker current={system} /> : null}
        </div>
        <div className="flex scroll-mt-20 flex-col gap-2" id="planetas">
          <SectionTitle>Planetas</SectionTitle>
          <PlanetTable chart={chart} />
        </div>
      </section>

      <section>
        <GuideCard
          action={interpretNatal.bind(null, system)}
          intro="Seu mapa revela… Quer ler o que o seu Sol, a sua Lua e o seu Ascendente contam juntos?"
          loadingText="Observando seu céu…"
        />
      </section>

      <section id="aspectos" className="scroll-mt-20">
        <SectionTitle>Aspectos</SectionTitle>
        <p className="-mt-2 mb-4 text-sm text-ink-3">Os encontros angulares mais exatos do seu mapa (orbe em graus).</p>
        <AspectList aspects={chart.aspects} />
      </section>

      {chart.houses.length ? (
        <section id="casas" className="scroll-mt-20">
          <SectionTitle>Casas</SectionTitle>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {chart.houses.map((h) => (
              <li key={h.house} className="flex items-center justify-between rounded-[var(--radius-md)] border border-line bg-surface px-3.5 py-2.5 text-sm">
                <span className="text-ink-3">Casa {h.house}</span>
                <span className="inline-flex items-center gap-1.5 text-ink-2">
                  <SignGlyph sign={h.sign} className="text-base" />
                  <span className="tabular-nums">
                    {h.degree}°{String(h.minute).padStart(2, "0")}′
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-3">
            Sistema {SYSTEM_NAMES[chart.house_system_effective ?? chart.house_system]} · zodíaco tropical · calculado com
            XALEN Ephemeris
          </p>
        </section>
      ) : null}
    </div>
  );
}
