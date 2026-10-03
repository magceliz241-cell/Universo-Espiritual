import type { NavItem } from "./nav";

export type IconName = NavItem["icon"] | "sun" | "chevron" | "menu";

/** Ícones de linha fina, família única (estética da capa: traço dourado). */
export function NavIcon({ name, className, size = 22 }: { name: IconName; className?: string; size?: number }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className={className}>
      {name === "home" && (
        <g {...common}>
          <path d="M4 10.5 12 4l8 6.5" />
          <path d="M6 9.2V20h12V9.2" />
          <path d="M10 20v-5.5h4V20" />
        </g>
      )}
      {(name === "sun" || name === "chart") && (
        <g {...common}>
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" />
        </g>
      )}
      {name === "tarot" && (
        <g {...common}>
          <rect x="5.5" y="3" width="13" height="18" rx="1.8" />
          <rect x="7.3" y="4.8" width="9.4" height="14.4" rx="1" strokeOpacity="0.45" />
          <path d="M12 8.2 14.3 12 12 15.8 9.7 12z" />
        </g>
      )}
      {name === "love" && (
        <g {...common}>
          <circle cx="9.2" cy="12" r="5" />
          <circle cx="14.8" cy="12" r="5" />
        </g>
      )}
      {name === "guide" && (
        <g {...common}>
          <path d="M12 3.2l2.6 5.5 6 .8-4.4 4.1 1.1 5.9L12 16.6l-5.3 2.9 1.1-5.9L3.4 9.5l6-.8z" />
        </g>
      )}
      {name === "moon" && (
        <g {...common}>
          <path d="M15.8 3.6a8.6 8.6 0 1 0 4.6 12.8A7 7 0 0 1 15.8 3.6z" />
        </g>
      )}
      {name === "numbers" && (
        <g {...common}>
          <path d="M12 12c-1.8-2.4-3.3-3.6-5-3.6a3.6 3.6 0 0 0 0 7.2c1.7 0 3.2-1.2 5-3.6zm0 0c1.8 2.4 3.3 3.6 5 3.6a3.6 3.6 0 0 0 0-7.2c-1.7 0-3.2 1.2-5 3.6z" />
        </g>
      )}
      {name === "dreams" && (
        <g {...common}>
          <path d="M12 18.5c-2.2-1.6-3-4-3-6.3 0-2.4 1.2-4.6 3-6.2 1.8 1.6 3 3.8 3 6.2 0 2.3-.8 4.7-3 6.3z" />
          <path d="M12 18.5c-3 .2-5.6-.8-7.3-3 .9-2 2.5-3.4 4.4-4M12 18.5c3 .2 5.6-.8 7.3-3-.9-2-2.5-3.4-4.4-4" />
          <path d="M4 19.5h16" strokeOpacity="0.5" />
        </g>
      )}
      {name === "profile" && (
        <g {...common}>
          <circle cx="12" cy="9" r="3.5" />
          <path d="M5 19.5c1.5-3.2 4-4.5 7-4.5s5.5 1.3 7 4.5" />
        </g>
      )}
      {name === "chevron" && (
        <g {...common}>
          <path d="M9.5 6l6 6-6 6" />
        </g>
      )}
      {name === "menu" && (
        <g {...common}>
          <path d="M4.5 7h15M4.5 12h15M4.5 17h15" />
        </g>
      )}
    </svg>
  );
}
