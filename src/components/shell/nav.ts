export interface NavItem {
  href: string;
  label: string;
  icon: "home" | "chart" | "tarot" | "love" | "guide" | "moon" | "numbers" | "dreams" | "profile";
}

/** Navegação inferior (design system §25): Início, Mapa, Tarot, Amor, ✦ Guia. */
export const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Início", icon: "home" },
  { href: "/mapa", label: "Mapa", icon: "chart" },
  { href: "/tarot", label: "Tarot", icon: "tarot" },
  { href: "/amor", label: "Amor", icon: "love" },
  { href: "/guia", label: "Guia", icon: "guide" },
];

export const SECONDARY_NAV: NavItem[] = [
  { href: "/lua", label: "Lua", icon: "moon" },
  { href: "/numerologia", label: "Numerologia", icon: "numbers" },
  { href: "/sonhos", label: "Sonhos", icon: "dreams" },
  { href: "/perfil", label: "Perfil", icon: "profile" },
];
