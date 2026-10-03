import { cn } from "@/lib/cn";

/** Mares lunares aproximados da face visível (coordenadas 0–100, norte para cima). */
const MARIA: [number, number, number, number, number][] = [
  // [x, y, raio x, raio y, opacidade relativa]
  [36, 31, 9, 7, 1], [43, 36, 7, 6, 0.9], [31, 38, 5, 4, 0.8], // Imbrium
  [57, 31, 6, 5.5, 1], [61, 35, 3.5, 3, 0.7], // Serenitatis
  [63, 45, 7.5, 5.5, 1], [68, 50, 4, 3.5, 0.8], [57, 48, 3.5, 3, 0.7], // Tranquillitatis
  [80, 38, 5, 4, 1], // Crisium
  [74, 57, 4.5, 5.5, 0.9], [71, 63, 3, 2.5, 0.7], // Fecunditatis
  [64, 62, 3.5, 3.5, 0.8], // Nectaris
  [22, 47, 7, 10, 0.9], [27, 58, 6, 7, 0.85], [19, 62, 4, 5, 0.7], [30, 47, 4, 5, 0.6], // Procellarum
  [43, 67, 6.5, 4.5, 0.85], [48, 63, 3, 2.5, 0.6], // Nubium
  [30, 71, 4, 4, 0.8], // Humorum
];
const CRATERS: [number, number, number][] = [
  [46, 83, 2.2], [36, 46, 1.6], [57, 76, 1.4], [70, 26, 1.3], [22, 34, 1.5], [82, 52, 1.2], [52, 56, 1.1],
];

/**
 * Lua desenhada pela iluminação real (0–1) e pelo sentido (crescente/minguante), com textura realista.
 * Hemisfério sul: a parte iluminada da Lua crescente aparece à esquerda para quem observa do Brasil,
 * e a face aparece girada 180°; `southern` inverte o desenho.
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
  const id = `moon-${Math.round(k * 1000)}-${waxing ? 1 : 0}-${southern ? 1 : 0}-${size}`;
  const detailed = size >= 40;
  const face = southern ? "rotate(180 50 50)" : undefined;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={label} className={cn("overflow-visible", className)}>
      <defs>
        <radialGradient id={`${id}-lit`} cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#f6f1e6" />
          <stop offset="70%" stopColor="#d9d1c0" />
          <stop offset="100%" stopColor="#a69d8c" />
        </radialGradient>
        <radialGradient id={`${id}-dark`} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#221d33" />
          <stop offset="100%" stopColor="#120f1d" />
        </radialGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="62%" stopColor="rgb(241 217 160 / 0.16)" />
          <stop offset="100%" stopColor="rgb(241 217 160 / 0)" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <path d={d} />
        </clipPath>
        {detailed ? (
          <>
            <filter id={`${id}-soft`} x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="0.9" />
            </filter>
            <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="4" />
              <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.33  0 0 0 0 0.3  0 0 0 0.55 0" />
            </filter>
          </>
        ) : null}
      </defs>
      <circle cx="50" cy="50" r="66" fill={`url(#${id}-glow)`} />
      <circle cx="50" cy="50" r={r} fill={`url(#${id}-dark)`} stroke="rgb(241 217 160 / 0.14)" strokeWidth="0.5" />
      {detailed ? (
        <g transform={face} opacity="0.18">
          {MARIA.map(([x, y, a, b, o], i) => (
            <ellipse key={i} cx={x} cy={y} rx={a} ry={b} fill="#4a4360" fillOpacity={o} filter={`url(#${id}-soft)`} />
          ))}
        </g>
      ) : null}
      {k > 0.005 ? (
        <g clipPath={`url(#${id}-clip)`}>
          <circle cx="50" cy="50" r={r} fill={`url(#${id}-lit)`} />
          {detailed ? (
            <>
              <g transform={face}>
                {MARIA.map(([x, y, a, b, o], i) => (
                  <ellipse key={i} cx={x} cy={y} rx={a} ry={b} fill="#857d6d" fillOpacity={0.42 * o} filter={`url(#${id}-soft)`} />
                ))}
                {CRATERS.map(([x, y, c], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r={c} fill="#fbf7ee" fillOpacity="0.55" />
                    <circle cx={x + c * 0.25} cy={y + c * 0.25} r={c * 0.7} fill="#8a8273" fillOpacity="0.35" />
                  </g>
                ))}
              </g>
              <rect x="0" y="0" width="100" height="100" filter={`url(#${id}-grain)`} opacity="0.5" />
            </>
          ) : null}
        </g>
      ) : null}
    </svg>
  );
}
