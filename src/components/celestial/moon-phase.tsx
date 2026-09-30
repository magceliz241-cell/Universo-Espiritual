import { cn } from "@/lib/cn";

/**
 * Lua desenhada pela iluminação real (0–1) e pelo sentido (crescente/minguante).
 * Hemisfério sul: a parte iluminada da Lua crescente aparece à esquerda para quem
 * observa do Brasil; `southern` inverte o desenho.
 */
export function MoonPhase({
  illumination,
  waxing,
  size = 160,
  southern = true,
  className,
}: {
  illumination: number;
  waxing: boolean;
  size?: number;
  southern?: boolean;
  className?: string;
}) {
  const r = 48;
  const k = Math.min(1, Math.max(0, illumination));
  // Terminador: elipse com semi-eixo horizontal |1-2k|·r
  const rx = Math.abs(1 - 2 * k) * r;
  const litRight = waxing !== southern; // norte: crescente ilumina à direita
  const outer = litRight ? 1 : 0; // arco externo pelo lado iluminado
  const inner = k > 0.5 ? outer : 1 - outer;
  const d = `M 50 ${50 - r} A ${r} ${r} 0 0 ${outer} 50 ${50 + r} A ${rx} ${r} 0 0 ${inner} 50 ${50 - r} Z`;
  const label = `Lua ${Math.round(k * 100)}% iluminada, ${waxing ? "crescendo" : "minguando"}`;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={label} className={cn("overflow-visible", className)}>
      <defs>
        <radialGradient id="moon-lit" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#f5f1ea" />
          <stop offset="100%" stopColor="#cfc6b3" />
        </radialGradient>
        <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor="rgb(214 181 110 / 0.10)" />
          <stop offset="100%" stopColor="rgb(214 181 110 / 0)" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="64" fill="url(#moon-glow)" />
      <circle cx="50" cy="50" r={r} fill="#1d1a29" stroke="rgb(245 241 234 / 0.10)" strokeWidth="0.6" />
      {k > 0.005 ? <path d={d} fill="url(#moon-lit)" /> : null}
    </svg>
  );
}
