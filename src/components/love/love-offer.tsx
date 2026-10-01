import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { loveCheckoutUrl } from "@/lib/checkout";
import { getEmail, requireMember } from "@/lib/data/session";

/**
 * Oferta do bump de relacionamento dentro do app (sem o conteúdo exclusivo).
 * O checkout abre com o e-mail da conta preenchido; o webhook libera na hora.
 */
export async function LoveOffer() {
  const { db } = await requireMember();
  const url = loveCheckoutUrl(await getEmail(db));
  return (
    <div className="mx-auto max-w-2xl">
      <Card className="relative overflow-hidden p-6 md:p-10">
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-wine/30 blur-3xl" />
        <div className="relative">
          <p className="eyebrow mb-3 text-rose">Relacionamentos</p>
          <h1 className="text-display text-[2.3rem] md:text-[3rem]">O seu céu, em relação</h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-2">
            Entenda como você ama pela linguagem do seu mapa, compare o seu céu com o de outra pessoa e faça o Tarot do
            amor. Tudo calculado a partir de dados reais, interpretado com cuidado. Sem porcentagens mágicas.
          </p>
          <ul className="mt-6 grid gap-3 text-sm text-ink-2 sm:grid-cols-3">
            {[
              ["Perfil amoroso", "Vênus, Marte, Lua e as casas do encontro."],
              ["Mapa do casal", "Conexões entre os dois mapas."],
              ["Tarot do amor", "Tiragem de 3 cartas para refletir."],
            ].map(([t, d]) => (
              <li key={t} className="rounded-[var(--radius-md)] border border-line bg-surface-2 p-4">
                <p className="text-ink">{t}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-3">{d}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {url ? (
              <ButtonLink href={url} className="bg-rose text-bg hover:bg-[#d693ab]">
                Liberar relacionamentos
              </ButtonLink>
            ) : (
              <p className="text-sm text-ink-3">A oferta estará disponível em breve.</p>
            )}
            <p className="text-xs text-ink-3">Acesso vitalício. Liberado na hora, na mesma conta.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
