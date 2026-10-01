import type { Metadata } from "next";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader, SectionTitle } from "@/components/ui/page-header";
import { loveCheckoutUrl } from "@/lib/checkout";
import { getSelfProfile } from "@/lib/charts/service";
import { listPartners } from "@/lib/data/profiles";
import { getEmail, getProfile, requireMember } from "@/lib/data/session";
import { formatDatePt } from "@/lib/greeting";

export const metadata: Metadata = { title: "Perfil" };

export default async function PerfilPage() {
  const { db, tier } = await requireMember();
  const [profile, self, email] = await Promise.all([getProfile(db), getSelfProfile(db), getEmail(db)]);
  const partners = tier === "love" ? await listPartners(db) : [];
  const offer = tier !== "love" ? loveCheckoutUrl(email) : null;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10">
      <PageHeader eyebrow="Sua conta" title={profile?.display_name ?? "Perfil"}>
        {email}
      </PageHeader>

      <section>
        <SectionTitle action={<Link href="/perfil/nascimento" className="text-sm text-ink-2 hover:text-ink">Editar</Link>}>Nascimento</SectionTitle>
        <Card className="p-5 text-sm leading-relaxed text-ink-2">
          {self ? (
            <>
              <p className="text-ink">{formatDatePt(`${self.birth_date}T12:00:00Z`, "UTC", { day: "numeric", month: "long", year: "numeric" })}</p>
              <p>{self.time_known && self.birth_time ? `às ${self.birth_time.slice(0, 5)}` : "Horário desconhecido"}</p>
              <p>{self.place_label}</p>
            </>
          ) : (
            <p>
              Nenhum dado ainda. <Link href="/perfil/nascimento" className="text-ink underline underline-offset-4">Adicionar</Link>
            </p>
          )}
        </Card>
      </section>

      {tier === "love" ? (
        <section>
          <SectionTitle action={<Link href="/perfil/parceiro" className="text-sm text-ink-2 hover:text-ink">Adicionar</Link>}>Pessoas</SectionTitle>
          {partners.length ? (
            <ul className="flex flex-col gap-2">
              {partners.map((p) => (
                <li key={p.id}>
                  <Link href={`/perfil/parceiro?id=${p.id}`} className="flex items-center justify-between rounded-[var(--radius-md)] border border-line bg-surface px-4 py-3 text-sm hover:border-line-strong">
                    <span className="text-ink">{p.name}</span>
                    <span className="text-ink-3">{p.place_label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-3">Ninguém adicionado para o mapa do casal.</p>
          )}
        </section>
      ) : null}

      <section>
        <SectionTitle>Seu acesso</SectionTitle>
        <Card className="flex flex-col gap-3 p-5 text-sm">
          <p className="flex items-center justify-between">
            <span className="text-ink">Seu Universo</span>
            <span className="text-gold">vitalício</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="text-ink">Relacionamentos</span>
            <span className={tier === "love" ? "text-gold" : "text-ink-3"}>{tier === "love" ? "vitalício" : "não incluído"}</span>
          </p>
          {offer ? (
            <ButtonLink href={offer} variant="secondary" className="mt-2 self-start">
              Liberar relacionamentos
            </ButtonLink>
          ) : null}
        </Card>
      </section>

      <form action="/auth/logout" method="post">
        <Button type="submit" variant="ghost">
          Sair da conta
        </Button>
      </form>

      <section className="border-t border-line pt-8 text-xs leading-relaxed text-ink-3">
        <p className="eyebrow mb-3">Sobre</p>
        <p>
          Astrologia, Tarot, numerologia e leitura de sonhos são linguagens simbólicas, apresentadas aqui para reflexão
          e autoconhecimento. Não substituem orientação médica, psicológica, jurídica ou financeira.
        </p>
        <p className="mt-3">
          Posições astronômicas calculadas com XALEN Ephemeris (Apache-2.0), modo analítico VSOP87/ELP2000. Dados de
          cidades: GeoNames (geonames.org), CC-BY 4.0. Interpretações geradas por IA a partir dos cálculos e da nossa
          base editorial; a IA não calcula posições nem sorteia cartas.
        </p>
      </section>
    </div>
  );
}
