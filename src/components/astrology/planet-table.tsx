import { SignGlyph, BodyGlyph } from "@/components/celestial/glyph";
import { ANGLE_NAMES, ANGLE_SHORT, BODY_NAMES, SIGN_NAMES } from "@/lib/astro/labels";
import type { BirthChart, PlanetId, PointId, SignId } from "@/lib/astro/types";

const ROWS: (PlanetId | PointId)[] = [
  "sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "true_node", "chiron", "mean_lilith",
];

const deg = (d: number, m: number) => `${d}°${String(m).padStart(2, "0")}′`;

function Row({
  icon,
  name,
  sign,
  degree,
  minute,
  house,
  showHouse,
  retro,
}: {
  icon: React.ReactNode;
  name: string;
  sign: SignId;
  degree: number;
  minute: number;
  house?: number | null;
  showHouse: boolean;
  retro?: boolean;
}) {
  return (
    <tr className="surface-glass">
      <th scope="row" className="rounded-l-[var(--radius-md)] border-y border-l border-line py-2.5 pl-3 pr-2 text-left font-normal">
        <span className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/45 bg-gold/5 text-gold">{icon}</span>
          <span className="min-w-0">
            <span className="block text-[15px] text-ink">
              {name}
              {retro ? (
                <abbr title="retrógrado" className="ml-1.5 text-xs text-lilac no-underline">
                  R
                </abbr>
              ) : null}
            </span>
            <span className="flex items-center gap-1 text-xs text-ink-2">
              em {SIGN_NAMES[sign]} <SignGlyph sign={sign} className="text-[13px] text-gold/80" />
            </span>
          </span>
        </span>
      </th>
      <td className={`border-y border-line px-2 py-2.5 text-right text-sm tabular-nums text-ink-2 ${showHouse ? "" : "rounded-r-[var(--radius-md)] border-r pr-4"}`}>
        {deg(degree, minute)}
      </td>
      {showHouse ? (
        <td className="rounded-r-[var(--radius-md)] border-y border-r border-line py-2.5 pl-2 pr-4 text-right text-sm text-ink-3">
          {house ? `Casa ${house}` : "—"}
        </td>
      ) : null}
    </tr>
  );
}

export function PlanetTable({ chart }: { chart: BirthChart }) {
  const showHouse = chart.houses.length > 0;
  return (
    <table className="w-full border-separate border-spacing-y-2 text-sm">
      <caption className="sr-only">Posições dos planetas e pontos</caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Corpo e signo</th>
          <th scope="col">Grau</th>
          {showHouse ? <th scope="col">Casa</th> : null}
        </tr>
      </thead>
      <tbody>
        {chart.angles
          ? (["ascendant", "mc"] as const).map((k) => (
              <Row
                key={k}
                icon={<span className="font-brand text-[10px] tracking-[0.08em]">{ANGLE_SHORT[k]}</span>}
                name={ANGLE_NAMES[k]}
                sign={chart.angles![k].sign}
                degree={chart.angles![k].degree}
                minute={chart.angles![k].minute}
                showHouse={showHouse}
              />
            ))
          : null}
        {ROWS.map((b) => {
          const p = b in chart.planets ? chart.planets[b as PlanetId] : chart.points[b as PointId];
          return (
            <Row
              key={b}
              icon={<BodyGlyph body={b} className="text-lg" />}
              name={BODY_NAMES[b]}
              sign={p.sign}
              degree={p.degree}
              minute={p.minute}
              house={p.house}
              showHouse={showHouse}
              retro={p.retrograde}
            />
          );
        })}
      </tbody>
    </table>
  );
}
