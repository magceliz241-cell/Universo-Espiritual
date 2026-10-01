"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { cn } from "@/lib/cn";
import { isActive } from "./bottom-nav";
import { NavIcon } from "./icons";
import { PRIMARY_NAV, SECONDARY_NAV } from "./nav";

export function TopBar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16 md:px-6">
        <Link href="/" aria-label="Seu Universo — início">
          <Wordmark />
        </Link>
        <nav aria-label="Seções" className="hidden items-center gap-1 md:flex">
          {[...PRIMARY_NAV.slice(1), ...SECONDARY_NAV.slice(0, 3)].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors duration-[var(--duration-micro)]",
                isActive(pathname, item.href) ? "bg-surface-2 text-ink" : "text-ink-2 hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/perfil"
          aria-label="Perfil"
          className={cn("rounded-full p-2 text-ink-2 hover:text-ink", isActive(pathname, "/perfil") && "text-ink")}
        >
          <NavIcon name="profile" />
        </Link>
      </div>
    </header>
  );
}
