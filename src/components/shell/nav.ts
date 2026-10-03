export interface NavItem {
  href: string;
  label: string;
  icon: "home" | "chart" | "tarot" | "love" | "guide" | "moon" | "numbers" | "dreams" | "profile";
}

/** Navegação inferior (design system §25): Início, Mapa, ✦ Guia (centro, em destaque), Tarot, Amor. */
export const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Início", icon: "home" },
  { href: "/mapa", label: "Mapa", icon: "chart" },
  { href: "/guia", label: "Guia", icon: "guide" },
  { href: "/tarot", label: "Tarot", icon: "tarot" },
  { href: "/amor", label: "Amor", icon: "love" },
];

/** Nome curto de cada seção (botão de voltar e dicas). */
export const SECTION_LABEL: Record<string, string> = {
  "/": "Início",
  "/mapa": "Mapa",
  "/guia": "Guia",
  "/tarot": "Tarot",
  "/amor": "Amor",
  "/lua": "Lua",
  "/numerologia": "Numerologia",
  "/sonhos": "Sonhos",
  "/perfil": "Perfil",
};

export const SECONDARY_NAV: NavItem[] = [
  { href: "/lua", label: "Lua", icon: "moon" },
  { href: "/numerologia", label: "Numerologia", icon: "numbers" },
  { href: "/sonhos", label: "Sonhos", icon: "dreams" },
  { href: "/perfil", label: "Perfil", icon: "profile" },
];
