import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  return (
    <>
      <Card className="p-6 sm:p-8">
        <h1 className="text-display text-[2rem]">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm leading-relaxed text-ink-2">{subtitle}</p> : null}
        <div className="mt-6">{children}</div>
      </Card>
      {footer ? <div className="mt-6 text-center text-sm text-ink-2">{footer}</div> : null}
    </>
  );
}
