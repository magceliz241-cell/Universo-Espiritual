import { BodyGlyph, SignGlyph } from "@/components/celestial/glyph";
import { Card } from "@/components/ui/card";
import { SIGN_NAMES } from "@/lib/astro/labels";
import type { PlanetId, SignId } from "@/lib/astro/types";

export function PlacementCard({
  label,
  body,
  short,
  sign,
  degree,
  minute,
}: {
  label: string;
  body?: PlanetId;
  short?: string;
  sign: SignId;
  degree: number;
  minute: number;
}) {
  return (
    <Card className="flex flex-col gap-3 p-4 md:p-5">
      <div className="flex items-center justify-between text-ink-3">
        {body ? <BodyGlyph body={body} className="text-xl text-gold" /> : <span className="text-xs font-semibold tracking-[0.14em] text-gold">{short}</span>}
        <SignGlyph sign={sign} className="text-lg" />
      </div>
      <div>
        <p className="eyebrow">{label}</p>
        <p className="text-display mt-1 text-[1.5rem] leading-tight">{SIGN_NAMES[sign]}</p>
        <p className="mt-0.5 text-xs tabular-nums text-ink-3">
          {degree}°{String(minute).padStart(2, "0")}′
        </p>
      </div>
    </Card>
  );
}
