import { BrandHero } from "@/components/brand/wordmark";
import { OrbitalDecoration } from "@/components/celestial/orbital-decoration";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 text-center">
      <OrbitalDecoration className="absolute left-1/2 top-1/2 w-[720px] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-70" />
      <div className="relative">
        <BrandHero />
        <h1 className="text-display mt-10 text-[2.4rem]">Esta página não está no mapa</h1>
        <p className="mt-3 text-sm text-ink-2">O endereço pode ter mudado ou nunca ter existido.</p>
        <ButtonLink href="/" className="mt-8">
          Voltar ao início
        </ButtonLink>
      </div>
    </main>
  );
}
