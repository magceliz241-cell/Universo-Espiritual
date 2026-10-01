import { cn } from "@/lib/cn";

/** Símbolo: órbita fina com um ponto dourado (funciona em 16px). */
export function Mark({ className, size = 22 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.2" />
      <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-24 12 12)" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="19.2" cy="8.6" r="1.7" fill="var(--color-gold)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-ink", className)}>
      <Mark />
      <span className="text-display text-[1.35rem] leading-none">Astarot</span>
    </span>
  );
}
