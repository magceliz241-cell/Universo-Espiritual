import { ASPECT_GLYPHS, ASPECT_NAMES, keyGlyph, keyName, VS15 } from "@/lib/astro/labels";
import type { Aspect } from "@/lib/astro/types";

export function AspectList({ aspects, limit = 14 }: { aspects: Aspect[]; limit?: number }) {
  if (aspects.length === 0) return <p className="text-sm text-ink-3">Nenhum aspecto maior dentro dos orbes.</p>;
  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {aspects.slice(0, limit).map((a, i) => (
        <li key={`${a.a}-${a.b}-${i}`} className="flex min-w-0 items-center justify-between gap-3 rounded-[var(--radius-md)] border border-line bg-surface px-3.5 py-2.5 text-sm">
          <span className="flex min-w-0 items-center gap-2">
            <span className="glyph min-w-5 text-center text-base text-ink-2 [&:not(:empty)]:px-0.5">{keyGlyph(a.a)}</span>
            <span className="glyph text-base text-gold" title={ASPECT_NAMES[a.type]}>
              {ASPECT_GLYPHS[a.type] + VS15}
            </span>
            <span className="glyph min-w-5 text-center text-base text-ink-2 [&:not(:empty)]:px-0.5">{keyGlyph(a.b)}</span>
            <span className="truncate text-ink-2">
              {keyName(a.a)} · {ASPECT_NAMES[a.type].toLowerCase()} · {keyName(a.b)}
            </span>
          </span>
          <span className="shrink-0 tabular-nums text-xs text-ink-3">{a.orb.toFixed(1)}°</span>
        </li>
      ))}
    </ul>
  );
}
