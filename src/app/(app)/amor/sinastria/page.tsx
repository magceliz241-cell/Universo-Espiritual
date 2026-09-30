import type { Metadata } from "next";
import Link from "next/link";
import { GuideCard } from "@/components/ai/guide-card";
import { BodyGlyph } from "@/components/celestial/glyph";
import { LoveOffer } from "@/components/love/love-offer";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader, SectionTitle } from "@/components/ui/page-header";
import { DEFAULT_HOUSE_SYSTEM } from "@/lib/astro/config";
import { ASPECT_GLYPHS, ASPECT_NAMES, BODY_NAMES, keyGlyph, keyName, SIGN_NAMES, VS15 } from "@/lib/astro/labels";
import { synastry } from "@/lib/astro/synastry";
import type { PlanetId } from "@/lib/astro/types";
import { getOrCreateChart, getSelfProfile } from "@/lib/charts/service";
import { getBirthProfile, listPartners } from "@/lib/data/profiles";
import { requireMember } from "@/lib/data/session";
import { cn } from "@/lib/cn";
import { interpretSynastry } from "../../interpret-actions";

export const metadata: Metadata = { title: "Mapa do casal" };

const COMPARE: PlanetId[] = ["sun", "moon", "venus", "mars"];

export default async function SinastriaPage({ searchParams }: PageProps<"/amor/sinastria">) {
  const { db, tier } = await requireMember();
  if (tier !== "love") return <LoveOffer />;
  const sp = await searchParams;
  const [self, partners] = await Promise.all([getSelfProfile(db), listPartners(db)]);

  if (!self) {
    return (
      <>
        <PageHeader eyebrow="Mapa do casal" title="Sinastria" />
        <EmptyState title="Primeiro, o seu céu" action={<ButtonLink href="/perfil/nascimento">Adicionar meus dados</ButtonLink>}>
          Para comparar dois mapas, começamos pelo seu.
        </EmptyState>
      </>
    );
  }
  if (partners.length === 0) {
    return (
      <>
        <PageHeader eyebrow="Mapa do casal" title="Sinastria" />
        <EmptyState title="Com quem vamos comparar?" action={<ButtonLink href="/perfil/parceiro">Adicionar outra pessoa</ButtonLink>}>
          Adicione a data, o horário (se souber) e a cidade de nascimento da outra pessoa.
        </EmptyState>
      </>
    );
  }

  const selectedId = typeof sp.p === "string" ? sp.p : partners[0].id;
  const partner = (await getBirthProfile(db, selectedId)) ?? partners[0];
  const [a, b] = await Promise.all([getOrCreateChart(db, self, DEFAULT_HOUSE_SYSTEM), getOrCreateChart(db, partner, DEFAULT_HOUSE_SYSTEM)]);
  const syn = synastry(a.chart, b.chart);
  const key = syn.aspects.filter((x) => x.key_contact);

  return (
    <div className="flex flex-col gap-12">
      <PageHeader eyebrow="Mapa do casal" title={`Você & ${partner.name}`}>
        Conexões entre os dois mapas: onde há afinidade, onde há atrito e o que cada um desperta no outro.
      </PageHeader>

      <nav aria-label="Pessoas" className="-mt-6 flex flex-wrap items-center gap-2">
          {partners.map((p) => (
            <Link
              key={p.id}
              href={`/amor/sinastria?p=${p.id}`}
              aria-current={p.id === partner.id ? "true" : undefined}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm",
                p.id === partner.id ? "border-rose/50 bg-wine/30 text-ink" : "border-line-strong text-ink-2 hover:text-ink",
              )}
            >
              {p.name}
            </Link>
          ))}
          <Link href="/perfil/parceiro" className="px-2 text-sm text-ink-3 hover:text-ink">
            + adicionar
          </Link>
          <Link href={`/perfil/parceiro?id=${partner.id}`} className="px-2 text-sm text-ink-3 hover:text-ink">
            editar dados
          </Link>
        </nav>

      <section>
        <Card className="overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-line px-4 py-3 text-xs tracking-[0.14em] text-ink-3 uppercase">
            <span>Você</span>
            <span />
            <span className="text-right">{partner.name}</span>
          </div>
          {COMPARE.map((p) => (
            <div key={p} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-line px-4 py-3 text-sm last:border-0">
              <span className="text-ink-2">{SIGN_NAMES[a.chart.planets[p].sign]}</span>
              <span className="flex flex-col items-center text-ink-3">
                <BodyGlyph body={p} className="text-lg text-gold" />
                <span className="text-[10px]">{BODY_NAMES[p]}</span>
              </span>
              <span className="text-right text-ink-2">{SIGN_NAMES[b.chart.planets[p].sign]}</span>
            </div>
          ))}
        </Card>
        {!b.chart.birth_data.time_known ? (
          <p className="mt-3 text-xs text-ink-3">Sem o horário de {partner.name}, as casas e o Ascendente desse mapa ficam de fora.</p>
        ) : null}
      </section>

      <section>
        <SectionTitle>Conexões entre os mapas</SectionTitle>
        {key.length === 0 ? (
          <p className="text-sm text-ink-3">Nenhum contato principal dentro dos orbes. Os demais aspectos ainda contam na leitura.</p>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {key.slice(0, 12).map((x, i) => (
              <li key={i} className="flex min-w-0 items-center justify-between gap-3 rounded-[var(--radius-md)] border border-line bg-surface px-3.5 py-2.5 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="glyph min-w-5 text-center text-base text-ink-2">{keyGlyph(x.a)}</span>
                  <span className="glyph text-base text-rose">{ASPECT_GLYPHS[x.type] + VS15}</span>
                  <span className="glyph min-w-5 text-center text-base text-ink-2">{keyGlyph(x.b)}</span>
                  <span className="truncate text-ink-2">
                    {keyName(x.a)} (você) · {ASPECT_NAMES[x.type].toLowerCase()} · {keyName(x.b)} ({partner.name})
                  </span>
                </span>
                <span className="shrink-0 tabular-nums text-xs text-ink-3">{x.orb.toFixed(1)}°</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <GuideCard
        action={interpretSynastry.bind(null, partner.id)}
        intro={`O que o seu céu e o de ${partner.name} despertam um no outro?`}
        cta="Ler o mapa do casal"
        loadingText="Observando os dois céus…"
      />
    </div>
  );
}
