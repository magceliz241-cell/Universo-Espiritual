import type { Metadata } from "next";
import { BirthForm } from "@/components/forms/birth-form";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { googleFirstName } from "@/lib/auth/google";
import { getSelfProfile } from "@/lib/charts/service";
import { toDefaults } from "@/lib/data/profiles";
import { getProfile, requireMember } from "@/lib/data/session";

export const metadata: Metadata = { title: "Seus dados de nascimento" };

export default async function BirthPage() {
  const { db } = await requireMember();
  const [self, profile, { data: auth }] = await Promise.all([getSelfProfile(db), getProfile(db), db.auth.getUser()]);
  const defaults = toDefaults(self, profile?.birth_name);
  // Primeiro mapa: sugere o nome da conta (ou o primeiro nome informado pelo Google).
  if (!self) defaults.name = profile?.display_name ?? googleFirstName(auth.user?.user_metadata);
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader eyebrow="Seu céu pessoal" title={self ? "Seus dados de nascimento" : "Vamos desenhar o seu céu"}>
        Com a data, o horário e a cidade em que você nasceu, calculamos as posições reais dos planetas naquele
        instante. Seus dados ficam só na sua conta.
      </PageHeader>
      <Card className="p-6 md:p-8">
        <BirthForm kind="self" defaults={defaults} redirectTo="/mapa" submitLabel={self ? "Salvar" : "Criar meu mapa"} />
      </Card>
    </div>
  );
}
