import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputClass =
  "w-full h-11 rounded-[var(--radius-md)] border border-line-strong bg-surface-2 px-3.5 text-[15px] text-ink " +
  "placeholder:text-ink-3 outline-none transition-colors duration-[var(--duration-micro)] " +
  "focus:border-violet focus-visible:outline-none aria-[invalid=true]:border-danger";

export function Field({
  label,
  hint,
  error,
  id,
  children,
}: {
  label: string;
  hint?: ReactNode;
  error?: string | null;
  id: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-ink-2">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-3">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(inputClass, className)} {...props} />;
}
