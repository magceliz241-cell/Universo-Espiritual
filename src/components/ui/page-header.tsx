import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="mb-8 md:mb-10">
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h1 className="text-display text-[2.4rem] md:text-[3.2rem]">{title}</h1>
      {children ? <div className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">{children}</div> : null}
    </header>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="text-display text-[1.6rem]">{children}</h2>
      {action}
    </div>
  );
}
