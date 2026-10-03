"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/wordmark";
import { cn } from "@/lib/cn";
import { isActive } from "./bottom-nav";
import { NavIcon } from "./icons";
import { PRIMARY_NAV, SECONDARY_NAV } from "./nav";

export function TopBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Fecha o menu ao trocar de página ou com Esc.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[#0b0817]/80 backdrop-blur-md">
      <div className="mx-auto grid h-14 max-w-6xl grid-cols-[44px_1fr_44px] items-center px-3 md:flex md:h-16 md:justify-between md:px-6">
        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={open}
          aria-controls="menu-secoes"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full p-2 text-gold/90 hover:text-gold md:hidden"
        >
          <NavIcon name="menu" />
        </button>
        <Link href="/" aria-label="Astarot — início" className="justify-self-center">
          <Logo size={19} />
        </Link>
        <nav aria-label="Seções" className="hidden items-center gap-1 md:flex">
          {[...PRIMARY_NAV.slice(1), ...SECONDARY_NAV.slice(0, 3)].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors duration-[var(--duration-micro)]",
                isActive(pathname, item.href) ? "bg-surface-2 text-gold" : "text-ink-2 hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/perfil"
          aria-label="Perfil"
          className={cn(
            "justify-self-end rounded-full border border-line-strong p-1.5 text-gold/80 hover:text-gold",
            isActive(pathname, "/perfil") && "border-gold/60 text-gold",
          )}
        >
          <NavIcon name="profile" size={20} />
        </Link>
      </div>

      {open ? (
        <nav id="menu-secoes" aria-label="Mais seções" className="border-t border-line bg-[#0d0919]/95 px-3 pb-4 pt-2 md:hidden">
          <ul className="grid grid-cols-2 gap-2">
            {SECONDARY_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className={cn(
                    "surface-glass flex items-center gap-3 rounded-[var(--radius-md)] border border-line px-3.5 py-3 text-sm",
                    isActive(pathname, item.href) ? "text-gold" : "text-ink-2",
                  )}
                >
                  <NavIcon name={item.icon} className="text-gold" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
