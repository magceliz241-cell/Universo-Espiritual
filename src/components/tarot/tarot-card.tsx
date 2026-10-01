import { cn } from "@/lib/cn";

const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];

/** Símbolos de naipe em traço fino (arte própria). */
function SuitMark({ suit }: { suit: string | null }) {
  const c = { fill: "none", stroke: "var(--color-gold)", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 40 40" width="44" height="44" aria-hidden>
      {suit === "wands" && <g {...c}><path d="M20 5v30" /><path d="M20 12c4-3 7-2 8 1M20 18c-4-3-7-2-8 1" /></g>}
      {suit === "cups" && <g {...c}><path d="M11 9h18c0 9-4 14-9 14s-9-5-9-14z" /><path d="M20 23v8M14 33h12" /></g>}
      {suit === "swords" && <g {...c}><path d="M20 4l3 6v18h-6V10z" /><path d="M13 28h14M20 28v8" /></g>}
      {suit === "pentacles" && <g {...c}><circle cx="20" cy="20" r="13" /><path d="M20 10l2.9 8.9h9.1l-7.4 5.3 2.9 8.8-7.5-5.4-7.5 5.4 2.9-8.8-7.4-5.3h9.1z" transform="scale(.62) translate(12.3 12.3)" /></g>}
      {suit === null && <g {...c}><circle cx="20" cy="20" r="12" /><path d="M20 8v24M8 20h24" strokeOpacity=".5" /></g>}
    </svg>
  );
}

export function CardFace({
  name,
  arcana,
  number,
  suit,
  reversed,
  className,
}: {
  name: string;
  arcana: "major" | "minor";
  number: number | null;
  suit: string | null;
  reversed: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-[2/3.3] w-full flex-col items-center justify-between rounded-[14px] border border-gold/40 bg-gradient-to-b from-surface-3 to-surface p-3 text-center",
        className,
      )}
    >
      <div className="absolute inset-1.5 rounded-[10px] border border-gold/15" aria-hidden />
      <div className={cn("flex h-full w-full flex-col items-center justify-between", reversed && "rotate-180")}>
        <span className="text-display text-lg text-gold">{arcana === "major" ? ROMAN[number ?? 0] : number ?? ""}</span>
        <SuitMark suit={arcana === "major" ? null : suit} />
        <span className="text-display px-1 text-[15px] leading-tight text-ink">{name}</span>
      </div>
    </div>
  );
}

export function CardBack({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-[2/3.3] w-full overflow-hidden rounded-[14px] border border-line-strong bg-surface-2", className)}>
      <svg viewBox="0 0 100 165" className="absolute inset-0 h-full w-full" aria-hidden>
        <rect x="5" y="5" width="90" height="155" rx="8" fill="none" stroke="var(--color-gold)" strokeOpacity=".25" />
        <g fill="none" stroke="var(--color-ink)" strokeOpacity=".14">
          <circle cx="50" cy="82" r="32" />
          <circle cx="50" cy="82" r="20" strokeDasharray="1.5 3" />
          <ellipse cx="50" cy="82" rx="32" ry="12" transform="rotate(-20 50 82)" />
        </g>
        <circle cx="79" cy="70" r="2" fill="var(--color-gold)" fillOpacity=".7" />
      </svg>
    </div>
  );
}
