import type { ReactNode } from "react";
import { OrbitalDecoration } from "@/components/celestial/orbital-decoration";
import { Card } from "./card";

/** Empty state com voz do produto (design system §28). */
export function EmptyState({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <Card className="relative overflow-hidden px-6 py-12 text-center">
      <OrbitalDecoration className="absolute left-1/2 top-1/2 w-[520px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-60" />
      <div className="relative mx-auto max-w-sm">
        <h2 className="text-display text-[1.9rem]">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-2">{children}</p>
        {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
      </div>
    </Card>
  );
}
