import { BrandHero } from "@/components/brand/wordmark";
import { OrbitalDecoration } from "@/components/celestial/orbital-decoration";

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center overflow-hidden px-4 py-10 sm:justify-center">
      <OrbitalDecoration className="absolute -top-40 left-1/2 w-[720px] max-w-none -translate-x-1/2 opacity-80 sm:-top-24" />
      <div className="relative w-full max-w-[400px]">
        <BrandHero className="mb-9" />
        {children}
      </div>
    </main>
  );
}
