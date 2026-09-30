import { SIGN_GLYPHS, SIGN_NAMES, BODY_GLYPHS, BODY_NAMES, VS15 } from "@/lib/astro/labels";
import type { PlanetId, PointId, SignId } from "@/lib/astro/types";
import { cn } from "@/lib/cn";

export function SignGlyph({ sign, className, title = true }: { sign: SignId; className?: string; title?: boolean }) {
  return (
    <span className={cn("glyph", className)} role="img" aria-label={SIGN_NAMES[sign]} title={title ? SIGN_NAMES[sign] : undefined}>
      {SIGN_GLYPHS[sign] + VS15}
    </span>
  );
}

export function BodyGlyph({ body, className }: { body: PlanetId | PointId; className?: string }) {
  return (
    <span className={cn("glyph", className)} role="img" aria-label={BODY_NAMES[body]} title={BODY_NAMES[body]}>
      {BODY_GLYPHS[body] + VS15}
    </span>
  );
}
