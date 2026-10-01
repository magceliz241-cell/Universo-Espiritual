import Link from "next/link";
import type { HouseSystem } from "@/lib/astro/types";
import { cn } from "@/lib/cn";

const OPTIONS: { id: HouseSystem; label: string }[] = [
  { id: "placidus", label: "Placidus" },
  { id: "whole_sign", label: "Whole Sign" },
  { id: "equal", label: "Equal" },
];

/** Seleção discreta do sistema de casas (design system §14). Placidus pré-selecionado. */
export function HouseSystemPicker({ current, basePath = "/mapa" }: { current: HouseSystem; basePath?: string }) {
  return (
    <nav aria-label="Sistema de casas" className="flex flex-col gap-2">
      <p className="eyebrow">Sistema de casas</p>
      <ul className="flex flex-wrap gap-4 text-sm">
        {OPTIONS.map((o) => {
          const active = o.id === current;
          return (
            <li key={o.id}>
              <Link
                href={o.id === "placidus" ? basePath : `${basePath}?casas=${o.id}`}
                aria-current={active ? "true" : undefined}
                className={cn("inline-flex items-center gap-2", active ? "text-ink" : "text-ink-3 hover:text-ink-2")}
              >
                <span
                  aria-hidden
                  className={cn("inline-block size-3 rounded-full border", active ? "border-gold bg-gold" : "border-ink-3")}
                />
                {o.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
