import { cn } from "@/lib/cn";

/** Órbitas finas, baixa opacidade (design system §5). Puramente decorativo. */
export function OrbitalDecoration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 600" fill="none" aria-hidden className={cn("pointer-events-none", className)}>
      <g stroke="var(--color-ink)" strokeOpacity="0.07">
        <circle cx="300" cy="300" r="290" />
        <circle cx="300" cy="300" r="220" strokeDasharray="2 6" />
        <circle cx="300" cy="300" r="150" />
        <ellipse cx="300" cy="300" rx="290" ry="110" transform="rotate(-18 300 300)" />
      </g>
      <circle cx="517" cy="208" r="3" fill="var(--color-gold)" fillOpacity="0.7" />
      <circle cx="160" cy="430" r="2" fill="var(--color-lilac)" fillOpacity="0.6" />
    </svg>
  );
}
