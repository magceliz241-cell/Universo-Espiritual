import type { Metadata } from "next";
import { TarotTable } from "@/components/tarot/tarot-table";
import { PageHeader } from "@/components/ui/page-header";
import { requireMember } from "@/lib/data/session";
import { SPREADS } from "@/lib/tarot/draw";
import { interpretTarot } from "../interpret-actions";

export const metadata: Metadata = { title: "Tarot" };

const DESCRIPTIONS = {
  "daily-card": "Um tema para observar hoje.",
  "open-question": "Destaque, ponto cego e perspectiva.",
  "love-3-cards": "Energia atual, dinâmica e reflexão.",
} as const;

export default async function TarotPage({ searchParams }: PageProps<"/tarot">) {
  const { tier } = await requireMember();
  const sp = await searchParams;
  const spreads = Object.values(SPREADS).map((s) => ({
    id: s.id,
    name: s.name,
    positions: s.positions,
    locked: s.love && tier !== "love",
    description: DESCRIPTIONS[s.id],
  }));
  const wanted = sp.tiragem === "open-question" || sp.tiragem === "love-3-cards" ? sp.tiragem : "daily-card";
  const initial = spreads.find((s) => s.id === wanted && !s.locked)?.id ?? "daily-card";
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader eyebrow="Tarot Rider-Waite-Smith" title="Tarot">
        Escolha uma tiragem, respire e tire as cartas. O Seu Guia traduz o que elas trazem para a sua pergunta, carta por carta.
      </PageHeader>
      <TarotTable spreads={spreads} initialSpread={initial} interpret={interpretTarot} />
    </div>
  );
}
