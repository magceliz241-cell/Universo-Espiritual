"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { NavIcon } from "./icons";
import { PRIMARY_NAV } from "./nav";

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-gradient-to-b from-[#120d22]/95 to-[#0a0714]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {PRIMARY_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          if (item.href === "/guia") {
            // Guia no centro, em dourado e com mais destaque.
            return (
              <li key={item.href} className="flex justify-center">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="relative -mt-5 flex flex-col items-center gap-1 text-[11px] font-medium text-gold"
                >
                  <span
                    className={cn(
                      "grid size-14 place-items-center rounded-full border border-[#f6e2ad]/70 bg-[radial-gradient(circle_at_35%_30%,#f6e2ad,#d6b56e_45%,#a8853f)] text-[#1a1230] shadow-[0_6px_22px_-6px_rgb(214_181_110_/_0.75)] transition-transform duration-[var(--duration-micro)]",
                      active ? "scale-105 ring-2 ring-gold/40 ring-offset-2 ring-offset-[#0a0714]" : "hover:scale-105",
                    )}
                  >
                    <NavIcon name={item.icon} size={26} className="[&_path]:fill-[#1a1230]/15" />
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          }
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] transition-colors duration-[var(--duration-micro)]",
                  active ? "text-gold" : "text-ink-3 hover:text-ink-2",
                )}
              >
                {active ? <span aria-hidden className="absolute top-0 h-px w-8 bg-gradient-to-r from-transparent via-gold to-transparent" /> : null}
                <NavIcon name={item.icon} className={active ? "text-gold drop-shadow-[0_0_6px_rgb(214_181_110_/_0.45)]" : undefined} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
