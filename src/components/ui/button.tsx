import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] px-5 h-11 text-sm font-medium " +
  "transition-[background-color,border-color,color,transform] duration-[var(--duration-normal)] ease-[var(--ease-soft)] " +
  "disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  // Violeta = elemento interativo/ativo (design system §4)
  primary:
    "border border-gold/35 bg-gradient-to-b from-[#7d64c2] to-[#55409a] text-ink shadow-[0_10px_28px_-14px_rgb(139_114_201_/_0.9)] hover:from-[#8a72cc] hover:to-[#5f49a6] active:translate-y-px",
  secondary: "border border-line-strong bg-surface-2/80 text-ink hover:border-gold/45 hover:bg-surface-3",
  ghost: "text-ink-2 hover:text-ink hover:bg-surface-2",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cn(base, variants[variant], className)} {...props} />;
}
