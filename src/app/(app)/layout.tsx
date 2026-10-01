import { BottomNav } from "@/components/shell/bottom-nav";
import { TopBar } from "@/components/shell/top-bar";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface-2 focus:px-3 focus:py-2">
        Pular para o conteúdo
      </a>
      <TopBar />
      <main id="conteudo" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 md:px-6 md:pb-16 md:pt-10">
        {children}
      </main>
      <BottomNav />
    </>
  );
}
