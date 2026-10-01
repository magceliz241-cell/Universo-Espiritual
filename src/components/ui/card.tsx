import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Card padrão (design system §11): surface 1, borda 6% branca, raio 16px. */
export function Card({ className, interactive, ...props }: ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-line bg-surface",
        interactive &&
          "transition-[background-color,transform,border-color] duration-[var(--duration-normal)] ease-[var(--ease-soft)] hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2",
        className,
      )}
      {...props}
    />
  );
}
