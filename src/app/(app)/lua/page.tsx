import type { Metadata } from "next";
import { GuideCard } from "@/components/ai/guide-card";
import { MoonPhase } from "@/components/celestial/moon-phase";
import { SignGlyph } from "@/components/celestial/glyph";
import { IntentionForm } from "@/components/forms/intention-form";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/page-header";
import { moonState } from "@/lib/astro/moon";
import { SIGN_NAMES } from "@/lib/astro/labels";
import { getSelfProfile } from "@/lib/charts/service";
import { requireMember } from "@/lib/data/session";
import { formatDatePt } from "@/lib/greeting";
import { kb } from "@/lib/knowledge/ids";
import { kbSection } from "@/lib/knowledge/sections";
import { interpretMoon } from "../interpret-actions";

export const metadata: Metadata = { title: "Lua" };

export default async function LuaPage() {
  const { db } = await requireMember();
  const self = await getSelfProfile(db);
  const tz = self?.timezone ?? "America/Sao_Paulo";
  const s = moonState();
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
  const { data: entry } = await db.from("moon_journeys").select("intention, journal").eq("entry_date", today).maybeSingle();
  const symbolic = kbSection(kb.moonPhase(s.phaseSlug), "Uso simbólico no produto");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-12">
      <section className="flex flex-col items-center pt-2 text-center">
        <MoonPhase illumination={s.illumination} waxing={s.waxing} size={220} southern={(self?.latitude ?? -15) < 0} className="animate-[fade-in_900ms_var(--ease-soft)]" />
        <h1 className="eyebrow mt-8 text-[0.8rem] text-ink-2">{s.phaseLabel}</h1>
        <p className="text-display mt-3 text-[3.6rem] leading-none">{Math.round(s.illumination * 100)}%</p>
        <p className="mt-2 text-sm text-ink-3">iluminada</p>
        <p className="eyebrow mt-6">{formatDatePt(new Date(), tz, { day: "numeric", month: "long" })}</p>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink-2">
          <SignGlyph sign={s.moonSign} className="text-base text-gold" /> Lua em {SIGN_NAMES[s.moonSign]}
        </p>
        {symbolic ? <p className="text-display mt-5 max-w-md text-[1.25rem] leading-snug text-ink-2">{symbolic}</p> : null}
      </section>

      <Card className="p-6 md:p-8">
        <IntentionForm intention={entry?.intention ?? ""} journal={entry?.journal ?? ""} />
      </Card>

      <GuideCard action={interpretMoon} intro="O que esta fase convida você a observar?" cta="Ler o céu de hoje" loadingText="Observando a Lua…" />

      <section>
        <SectionTitle>Próximas fases</SectionTitle>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {s.next.map((n) => (
            <li key={n.phase} className="surface-glass flex flex-col items-center gap-1 rounded-[var(--radius-md)] border border-line px-3 py-4 text-center">
              <MoonPhase
                illumination={n.phase === "new_moon" ? 0 : n.phase === "full_moon" ? 1 : 0.5}
                waxing={n.phase !== "last_quarter"}
                size={40}
                southern={(self?.latitude ?? -15) < 0}
              />
              <span className="text-display mt-2 text-[2rem] leading-none text-gold-gradient">{formatDatePt(n.instant, tz, { day: "numeric" })}</span>
              <span className="font-brand text-[11px] tracking-[0.16em] text-ink-2">{formatDatePt(n.instant, tz, { month: "short" }).replace(".", "").toUpperCase()}</span>
              <span className="mt-1 text-xs text-ink">{n.label}</span>
              <span className="text-[11px] text-ink-3">{formatDatePt(n.instant, tz, { hour: "2-digit", minute: "2-digit" })}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-ink-3">
          Fase e iluminação calculadas a partir das posições do Sol e da Lua (XALEN Ephemeris). O simbolismo lunar é uma
          prática de reflexão, não uma influência física comprovada.
        </p>
      </section>
    </div>
  );
}
