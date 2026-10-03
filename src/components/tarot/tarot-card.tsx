/* eslint-disable @next/next/no-img-element -- arte estática local, já otimizada em WebP */
import { cn } from "@/lib/cn";

const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
const COURT: Record<string, string> = { page: "Valete", knight: "Cavaleiro", queen: "Rainha", king: "Rei" };

/**
 * Frente da carta: arte original do baralho Rider-Waite-Smith (1909, Pamela Colman Smith, domínio público),
 * convertida para traço dourado sobre roxo (public/tarot/<id>.webp, gerada por scripts/build-tarot-art.mjs).
 */
export function CardFace({
  cardId,
  name,
  arcana,
  number,
  rank,
  reversed,
  className,
}: {
  cardId: string;
  name: string;
  arcana: "major" | "minor";
  number: number | null;
  rank?: string | null;
  reversed: boolean;
  className?: string;
}) {
  const label = arcana === "major" ? ROMAN[number ?? 0] : rank && COURT[rank] ? COURT[rank] : number ? String(number) : "";
  return (
    <div
      className={cn(
        "relative flex aspect-[2/3.3] w-full flex-col overflow-hidden rounded-[12px] border border-gold/70 bg-[#160f28] p-[5px] shadow-[0_0_0_1px_rgb(0_0_0_/_0.4),0_18px_40px_-18px_rgb(214_181_110_/_0.35)]",
        className,
      )}
    >
      <div className="relative flex-1 overflow-hidden rounded-[8px] border border-gold/40">
        <img
          src={`/tarot/${cardId}.webp`}
          alt={`Carta ${name}${reversed ? ", invertida" : ""}`}
          width={300}
          height={485}
          loading="lazy"
          decoding="async"
          className={cn("h-full w-full object-cover", reversed && "rotate-180")}
        />
      </div>
      <div className="flex h-[13%] min-h-5 items-center justify-center">
        <span className="font-brand text-[11px] sm:text-[13px] tracking-[0.2em] text-gold">{label}</span>
      </div>
    </div>
  );
}

export function CardBack({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-[2/3.3] w-full overflow-hidden rounded-[12px] border border-gold/60 bg-[radial-gradient(circle_at_50%_40%,#2b1d4a,#120c22_75%)]", className)}>
      <svg viewBox="0 0 100 165" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="tarot-back-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6e2ad" />
            <stop offset="100%" stopColor="#a8853f" />
          </linearGradient>
        </defs>
        <rect x="5" y="5" width="90" height="155" rx="6" fill="none" stroke="url(#tarot-back-gold)" strokeOpacity=".7" />
        <rect x="8.5" y="8.5" width="83" height="148" rx="4" fill="none" stroke="#d6b56e" strokeOpacity=".25" />
        <g fill="none" stroke="#d6b56e" strokeOpacity=".3">
          <circle cx="50" cy="82" r="30" />
          <circle cx="50" cy="82" r="22" strokeDasharray="1 2.5" />
          <circle cx="50" cy="82" r="38" strokeOpacity=".15" />
        </g>
        <path d="M50 58c.6 9 2.6 12 9 13.5-6.4 1.5-8.4 4.5-9 13.5-.6-9-2.6-12-9-13.5 6.4-1.5 8.4-4.5 9-13.5z" fill="url(#tarot-back-gold)" />
        <path d="M38 92a12 12 0 0 0 24 0 15.5 15.5 0 0 1-24 0z" fill="url(#tarot-back-gold)" />
        {[[18, 24], [82, 30], [22, 140], [80, 136], [50, 18], [50, 148]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" fill="#f1d9a0" fillOpacity=".7" />
        ))}
      </svg>
    </div>
  );
}
