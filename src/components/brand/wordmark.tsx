import { cn } from "@/lib/cn";

/** Estrela de quatro pontas (o brilho dentro do "O" do logo e acima da lua). */
export function Sparkle({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className={className}>
      <defs>
        <linearGradient id="astarot-gold-sparkle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e2ad" />
          <stop offset="55%" stopColor="#d6b56e" />
          <stop offset="100%" stopColor="#a8853f" />
        </linearGradient>
      </defs>
      <path d="M12 0.5 C12.7 8 16 11.3 23.5 12 C16 12.7 12.7 16 12 23.5 C11.3 16 8 12.7 0.5 12 C8 11.3 11.3 8 12 0.5 Z" fill="url(#astarot-gold-sparkle)" />
    </svg>
  );
}

/** Símbolo: estrela sobre a lua crescente (topo da capa). Funciona em 16px. */
export function Mark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 32 40" width={size} height={(size * 40) / 32} aria-hidden className={className}>
      <defs>
        <linearGradient id="astarot-gold-mark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e2ad" />
          <stop offset="60%" stopColor="#d6b56e" />
          <stop offset="100%" stopColor="#a8853f" />
        </linearGradient>
      </defs>
      <path d="M16 1 C16.5 8.5 18 11 23 12 C18 13 16.5 15.5 16 23 C15.5 15.5 14 13 9 12 C14 11 15.5 8.5 16 1 Z" fill="url(#astarot-gold-mark)" />
      <path d="M6 26 A10 10 0 0 0 26 26 A13 13 0 0 1 6 26 Z" fill="url(#astarot-gold-mark)" />
    </svg>
  );
}

/**
 * Logo "ASTAROT" dos criativos: desenho com floreios no A e no R e a estrela dentro do "O"
 * (public/brand/astarot-logo.webp, recortado da capa e recolorido no dourado do app; 700×148).
 * size: referência de altura das letras em px.
 */
export function Logo({ size = 20, className }: { size?: number; className?: string }) {
  const h = Math.round(size * 1.35);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- imagem estática pequena, com transparência
    <img
      src="/brand/astarot-logo.webp"
      alt="Astarot"
      width={Math.round((h * 700) / 148)}
      height={h}
      className={cn("inline-block select-none", className)}
      draggable={false}
    />
  );
}

/** Versão de capa: lua com estrela, logo grande, lema e ornamento (login, acesso). */
export function BrandHero({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <Mark size={30} />
      <Logo size={40} className="mt-3" />
      <p className="font-brand mt-4 text-[10.5px] tracking-[0.34em] text-ink-2">SEU MAPA. SEUS CICLOS. SEUS SINAIS.</p>
      <div aria-hidden className="mt-4 flex items-center gap-2">
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
        <Sparkle size={9} />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
      </div>
    </div>
  );
}

/** Mantido para os lugares que já usam o nome antigo do componente. */
export function Wordmark({ className }: { className?: string }) {
  return <Logo size={20} className={className} />;
}
