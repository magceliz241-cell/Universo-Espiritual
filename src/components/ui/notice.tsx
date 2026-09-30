import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Notice({ tone = "info", children }: { tone?: "info" | "error" | "success"; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-[var(--radius-md)] border px-4 py-3 text-sm leading-relaxed",
        tone === "error" && "border-danger/40 bg-danger/10 text-ink",
        tone === "success" && "border-gold/30 bg-gold/10 text-ink",
        tone === "info" && "border-line-strong bg-surface-2 text-ink-2",
      )}
    >
      {children}
    </div>
  );
}
