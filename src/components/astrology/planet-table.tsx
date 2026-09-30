import { SignGlyph, BodyGlyph } from "@/components/celestial/glyph";
import { ANGLE_NAMES, BODY_NAMES, SIGN_NAMES } from "@/lib/astro/labels";
import type { BirthChart, PlanetId, PointId } from "@/lib/astro/types";

const ROWS: (PlanetId | PointId)[] = [
  "sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "true_node", "chiron", "mean_lilith",
];

const deg = (d: number, m: number) => `${d}°${String(m).padStart(2, "0")}′`;

export function PlanetTable({ chart }: { chart: BirthChart }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-line">
      <table className="w-full text-sm">
        <caption className="sr-only">Posições dos planetas e pontos</caption>
        <thead className="bg-surface-2 text-left text-xs text-ink-3">
          <tr>
            <th scope="col" className="px-4 py-2.5 font-normal">Corpo</th>
            <th scope="col" className="px-2 py-2.5 font-normal">Signo</th>
            <th scope="col" className="px-2 py-2.5 text-right font-normal">Grau</th>
            {chart.houses.length ? <th scope="col" className="px-4 py-2.5 text-right font-normal">Casa</th> : null}
          </tr>
        </thead>
        <tbody>
          {chart.angles ? (
            (["ascendant", "mc"] as const).map((k) => (
              <tr key={k} className="border-t border-line bg-surface">
                <th scope="row" className="px-4 py-2.5 text-left font-normal text-gold">
                  {ANGLE_NAMES[k]}
                </th>
                <td className="px-2 py-2.5">
                  <span className="inline-flex items-center gap-1.5">
                    <SignGlyph sign={chart.angles![k].sign} className="text-base text-ink-2" />
                    {SIGN_NAMES[chart.angles![k].sign]}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums text-ink-2">{deg(chart.angles![k].degree, chart.angles![k].minute)}</td>
                {chart.houses.length ? <td className="px-4 py-2.5 text-right text-ink-3">—</td> : null}
              </tr>
            ))
          ) : null}
          {ROWS.map((b) => {
            const p = b in chart.planets ? chart.planets[b as PlanetId] : chart.points[b as PointId];
            return (
              <tr key={b} className="border-t border-line bg-surface">
                <th scope="row" className="px-4 py-2.5 text-left font-normal">
                  <span className="inline-flex items-center gap-2">
                    <BodyGlyph body={b} className="w-5 text-center text-lg text-ink-2" />
                    {BODY_NAMES[b]}
                    {p.retrograde ? (
                      <abbr title="retrógrado" className="text-xs text-lilac no-underline">
                        R
                      </abbr>
                    ) : null}
                  </span>
                </th>
                <td className="px-2 py-2.5">
                  <span className="inline-flex items-center gap-1.5">
                    <SignGlyph sign={p.sign} className="text-base text-ink-2" />
                    {SIGN_NAMES[p.sign]}
                  </span>
                </td>
                <td className="px-2 py-2.5 text-right tabular-nums text-ink-2">{deg(p.degree, p.minute)}</td>
                {chart.houses.length ? <td className="px-4 py-2.5 text-right tabular-nums text-ink-2">{p.house}</td> : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
