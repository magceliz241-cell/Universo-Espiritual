import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Card padrão: vidro roxo com borda dourada fina, raio 16px (estética da capa). */
export function Card({ className, interactive, ...props }: ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "surface-glass rounded-[var(--radius-lg)] border border-line backdrop-blur-[2px]",
        interactive &&
          "transition-[background-color,transform,border-color] duration-[var(--duration-normal)] ease-[var(--ease-soft)] hover:-translate-y-0.5 hover:border-line-strong",
        className,
      )}
      {...props}
    />
  );
}
