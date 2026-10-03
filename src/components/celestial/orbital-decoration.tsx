import { cn } from "@/lib/cn";

const SIGNS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

/** Astrolábio dourado de traço fino, baixa opacidade (estética da capa). Puramente decorativo. */
export function OrbitalDecoration({ className }: { className?: string }) {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <svg viewBox="0 0 600 600" fill="none" aria-hidden className={cn("pointer-events-none", className)}>
      <g stroke="var(--color-gold)" strokeOpacity="0.16">
        <circle cx="300" cy="300" r="292" />
        <circle cx="300" cy="300" r="270" />
        <circle cx="300" cy="300" r="214" strokeDasharray="1.5 5" />
        <circle cx="300" cy="300" r="150" />
        <circle cx="300" cy="300" r="90" strokeOpacity="0.1" />
        <ellipse cx="300" cy="300" rx="292" ry="108" transform="rotate(-18 300 300)" strokeOpacity="0.1" />
        {SIGNS.map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return <line key={i} x1={300 + 214 * Math.cos(a)} y1={300 + 214 * Math.sin(a)} x2={300 + 270 * Math.cos(a)} y2={300 + 270 * Math.sin(a)} />;
        })}
        {ticks.map((d) => {
          const a = (d * Math.PI) / 180;
          const r2 = d % 30 === 0 ? 282 : 286;
          return <line key={d} x1={300 + 292 * Math.cos(a)} y1={300 + 292 * Math.sin(a)} x2={300 + r2 * Math.cos(a)} y2={300 + r2 * Math.sin(a)} />;
        })}
      </g>
      <g fill="var(--color-gold)" fillOpacity="0.28" fontSize="20" textAnchor="middle" dominantBaseline="central" className="glyph">
        {SIGNS.map((s, i) => {
          const a = ((i * 30 + 15) * Math.PI) / 180;
          return (
            <text key={s} x={300 + 242 * Math.cos(a)} y={300 + 242 * Math.sin(a)}>
              {s}&#xFE0E;
            </text>
          );
        })}
      </g>
      <circle cx="517" cy="208" r="3" fill="var(--color-gold)" fillOpacity="0.8" />
      <circle cx="160" cy="430" r="2" fill="var(--color-gold-2)" fillOpacity="0.6" />
    </svg>
  );
}
