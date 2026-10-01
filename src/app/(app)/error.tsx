"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** Erro humano, sem stack trace (design system §29). */
export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md py-10">
      <Card className="p-6 text-center md:p-8">
        <h1 className="text-display text-[2rem]">Algo saiu da órbita</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-2">
          Não conseguimos carregar esta parte agora. Seus dados estão seguros. Tente de novo em instantes.
        </p>
        <Button onClick={reset} className="mt-6">
          Tentar de novo
        </Button>
      </Card>
    </div>
  );
}
