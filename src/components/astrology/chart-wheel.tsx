import { ASPECT_NAMES, BODY_GLYPHS, BODY_NAMES, SIGN_GLYPHS, SIGN_NAMES, VS15 } from "@/lib/astro/labels";
import type { BirthChart, PlanetId, PointId } from "@/lib/astro/types";
import { SIGNS } from "@/lib/astro/zodiac";

/**
 * Roda do mapa (design system §13): círculos finos, divisões precisas, hierarquia
 * signos → planetas → ASC → casas → aspectos. SVG estático gerado no servidor.
 * Orientação tradicional: Ascendente à esquerda, zodíaco no sentido anti-horário.
 */
const SIZE = 600;
const C = SIZE / 2;
const R_OUT = 290; // borda externa do anel zodiacal
const R_SIGN_IN = 248; // borda interna do anel zodiacal
const R_PLANET = 212; // raio dos glifos planetários
const R_HOUSE_IN = 150; // círculo interno (casas)
const R_ASPECT = 138; // raio das linhas de aspecto

const BODIES: (PlanetId | PointId)[] = [
  "sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto", "true_node", "chiron",
];

function polar(lon: number, r: number, zero: number) {
  const a = Math.PI + ((lon - zero) * Math.PI) / 180;
  return { x: C + r * Math.cos(a), y: C - r * Math.sin(a) };
}

/** Afasta glifos muito próximos (mínimo `gap` graus), mantendo a ordem. */
function spread(lons: number[], gap = 7.5): number[] {
  const n = lons.length;
  if (n === 0) return [];
  const order = lons.map((l, i) => ({ l, i })).sort((a, b) => a.l - b.l);
  const pos = order.map((o) => o.l);
  for (let iter = 0; iter < 60; iter++) {
    let moved = false;
    for (let k = 0; k < n; k++) {
      const next = (k + 1) % n;
      let d = pos[next] - pos[k];
      if (next === 0) d += 360;
      if (n > 1 && d < gap) {
        const push = (gap - d) / 2;
        pos[k] -= push;
        pos[next] += push;
        moved = true;
      }
    }
    if (!moved) break;
  }
  const out = new Array<number>(n);
  order.forEach((o, k) => (out[o.i] = pos[k]));
  return out;
}

const ASPECT_STROKE: Record<string, string> = {
  trine: "var(--color-violet)",
  sextile: "var(--color-violet)",
  square: "var(--color-rose)",
  opposition: "var(--color-rose)",
};

export function ChartWheel({ chart, className }: { chart: BirthChart; className?: string }) {
  const zero = chart.angles?.ascendant.longitude ?? 0;
  const lons = BODIES.map((b) => (b in chart.planets ? chart.planets[b as PlanetId] : chart.points[b as PointId]).longitude);
  const shown = spread(lons);
  const posOf = (key: string): number | null => {
    const i = BODIES.indexOf(key as PlanetId);
    if (i >= 0) return lons[i];
    if (chart.angles && (key === "ascendant" || key === "mc")) return chart.angles[key].longitude;
    return null;
  };

  const title = chart.angles
    ? `Mapa astral com Ascendente em ${SIGN_NAMES[chart.angles.ascendant.sign]}`
    : "Mapa astral sem horário de nascimento (sem casas)";

  return (
    <svg viewBox={`-22 -22 ${SIZE + 44} ${SIZE + 44}`} role="img" aria-label={title} className={className}>
      <defs>
        <radialGradient id="wheel-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22183c" />
          <stop offset="100%" stopColor="#0f0b1c" />
        </radialGradient>
      </defs>

      <circle cx={C} cy={C} r={R_OUT} fill="url(#wheel-bg)" />

      {/* Traços de grau: 1° curtos, 5° médios, 10° longos */}
      <g stroke="var(--color-gold)" strokeLinecap="round">
        {Array.from({ length: 360 }, (_, d) => {
          const len = d % 10 === 0 ? 9 : d % 5 === 0 ? 6 : 3;
          const a = polar(d, R_SIGN_IN, zero);
          const b = polar(d, R_SIGN_IN + len, zero);
          return <line key={d} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeOpacity={d % 30 === 0 ? 0 : 0.32} strokeWidth={0.7} />;
        })}
      </g>

      {/* Anel zodiacal */}
      <g fill="none" stroke="var(--color-gold)" strokeOpacity="0.38" strokeWidth="0.8">
        <circle cx={C} cy={C} r={R_OUT} />
        <circle cx={C} cy={C} r={R_SIGN_IN} />
        <circle cx={C} cy={C} r={R_HOUSE_IN} />
      </g>
      {SIGNS.map((s, i) => {
        const a = polar(i * 30, R_OUT, zero);
        const b = polar(i * 30, R_SIGN_IN, zero);
        const g = polar(i * 30 + 15, (R_OUT + R_SIGN_IN) / 2 + 4, zero);
        return (
          <g key={s}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--color-gold)" strokeOpacity="0.32" strokeWidth="0.8" />
            <text
              x={g.x}
              y={g.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="glyph"
              fontSize="22"
              fill="var(--color-gold)"
              fillOpacity="0.92"
            >
              <title>{SIGN_NAMES[s]}</title>
              {SIGN_GLYPHS[s] + VS15}
            </text>
          </g>
        );
      })}

      {/* Casas */}
      {chart.houses.length === 12 ? (
        <g>
          {chart.houses.map((h, i) => {
            const angular = i % 3 === 0;
            const a = polar(h.longitude, R_SIGN_IN, zero);
            const b = polar(h.longitude, angular ? 30 : R_HOUSE_IN, zero);
            const next = chart.houses[(i + 1) % 12].longitude;
            const span = (next - h.longitude + 360) % 360;
            const label = polar(h.longitude + span / 2, R_HOUSE_IN - 14, zero);
            return (
              <g key={h.house}>
                <line
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={angular ? "var(--color-gold)" : "var(--color-ink)"}
                  strokeOpacity={angular ? 0.55 : 0.14}
                  strokeWidth={angular ? 1 : 0.7}
                />
                <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="central" fontSize="11" fill="var(--color-ink-3)">
                  {h.house}
                </text>
              </g>
            );
          })}
        </g>
      ) : null}

      {/* Aspectos (camada inferior de informação) */}
      <g strokeLinecap="round">
        {chart.aspects
          .filter((a) => a.type !== "conjunction")
          .map((asp, i) => {
            const la = posOf(asp.a);
            const lb = posOf(asp.b);
            if (la === null || lb === null) return null;
            const p = polar(la, R_ASPECT, zero);
            const q = polar(lb, R_ASPECT, zero);
            const tight = asp.orb < 2;
            return (
              <line
                key={`${asp.a}-${asp.b}-${i}`}
                x1={p.x}
                y1={p.y}
                x2={q.x}
                y2={q.y}
                stroke={ASPECT_STROKE[asp.type]}
                strokeOpacity={tight ? 0.55 : 0.28}
                strokeWidth={tight ? 1 : 0.7}
              >
                <title>{`${ASPECT_NAMES[asp.type]} (orbe ${asp.orb.toFixed(1)}°)`}</title>
              </line>
            );
          })}
      </g>

      {/* Planetas: traço na posição real + glifo afastado das colisões */}
      {BODIES.map((b, i) => {
        const real = lons[i];
        const tickA = polar(real, R_SIGN_IN, zero);
        const tickB = polar(real, R_SIGN_IN - 8, zero);
        const g = polar(shown[i], R_PLANET, zero);
        const dot = polar(real, R_ASPECT, zero);
        const point = !(b in chart.planets);
        return (
          <g key={b}>
            <line x1={tickA.x} y1={tickA.y} x2={tickB.x} y2={tickB.y} stroke="var(--color-gold)" strokeWidth="1.2" />
            <circle cx={dot.x} cy={dot.y} r="1.8" fill="var(--color-ink)" fillOpacity="0.5" />
            <text
              x={g.x}
              y={g.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="glyph"
              fontSize={point ? 16 : 21}
              fill={b === "sun" || b === "moon" ? "var(--color-gold)" : "var(--color-ink)"}
              fillOpacity={point ? 0.6 : 0.95}
            >
              <title>{BODY_NAMES[b]}</title>
              {BODY_GLYPHS[b] + VS15}
            </text>
          </g>
        );
      })}

      {/* Ascendente e Meio do Céu */}
      {chart.angles ? (
        <g fontSize="11" letterSpacing="1.5" fill="var(--color-gold)">
          {(["ascendant", "mc"] as const).map((k) => {
            const p = polar(chart.angles![k].longitude, R_OUT, zero);
            const t = polar(chart.angles![k].longitude, R_OUT + 14, zero);
            return (
              <g key={k}>
                <circle cx={p.x} cy={p.y} r="3" fill="var(--color-gold)" />
                <text x={t.x} y={t.y} textAnchor="middle" dominantBaseline="central" fontWeight="600" style={{ paintOrder: "stroke" }} stroke="#0c0a16" strokeWidth="3">
                  {k === "ascendant" ? "ASC" : "MC"}
                </text>
              </g>
            );
          })}
        </g>
      ) : null}
    </svg>
  );
}
