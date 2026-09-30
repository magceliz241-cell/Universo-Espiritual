import type { Metadata } from "next";
import { BirthForm } from "@/components/forms/birth-form";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { LoveOffer } from "@/components/love/love-offer";
import { getBirthProfile, toDefaults } from "@/lib/data/profiles";
import { requireMember } from "@/lib/data/session";

export const metadata: Metadata = { title: "Dados da outra pessoa" };

export default async function PartnerPage({ searchParams }: PageProps<"/perfil/parceiro">) {
  const { db, tier } = await requireMember();
  if (tier !== "love") return <LoveOffer />;
  const sp = await searchParams;
  const id = typeof sp.id === "string" ? sp.id : null;
  const partner = id ? await getBirthProfile(db, id) : null;
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader eyebrow="Mapa do casal" title={partner ? `Dados de ${partner.name}` : "Adicionar outra pessoa"}>
        Os dados de nascimento da outra pessoa permitem comparar os dois céus. Sem o horário, as casas desse mapa
        ficam de fora, mas o resto continua valendo.
      </PageHeader>
      <Card className="p-6 md:p-8">
        <BirthForm kind="partner" defaults={toDefaults(partner?.kind === "partner" ? partner : null)} redirectTo="/amor/sinastria" />
      </Card>
    </div>
  );
}
