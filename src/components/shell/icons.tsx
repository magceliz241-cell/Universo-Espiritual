import type { NavItem } from "./nav";

/** Ícones de linha fina, família única (design system §8). */
export function NavIcon({ name, className }: { name: NavItem["icon"]; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden className={className}>
      {name === "home" && (
        <g {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="2.2" />
          <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2" />
        </g>
      )}
      {name === "chart" && (
        <g {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="5" />
          <path d="M3.5 12h17M12 3.5v17" strokeOpacity="0.7" />
        </g>
      )}
      {name === "tarot" && (
        <g {...common}>
          <rect x="6.5" y="3.5" width="11" height="17" rx="2" />
          <path d="M12 8.5l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.3-2.4 1.3.5-2.6-1.9-1.8 2.6-.4z" />
        </g>
      )}
      {name === "love" && (
        <g {...common}>
          <circle cx="9" cy="12" r="5" />
          <circle cx="15" cy="12" r="5" />
        </g>
      )}
      {name === "guide" && (
        <g {...common}>
          <path d="M12 3.5l1.6 6.9 6.9 1.6-6.9 1.6L12 20.5l-1.6-6.9L3.5 12l6.9-1.6z" />
        </g>
      )}
      {name === "moon" && (
        <g {...common}>
          <path d="M16.5 17.8A8 8 0 1 1 11 4a6.5 6.5 0 0 0 5.5 13.8z" />
        </g>
      )}
      {name === "numbers" && (
        <g {...common}>
          <path d="M8 4.5L6.5 19.5M15.5 4.5L14 19.5M4.5 9h15M4 15h15" />
        </g>
      )}
      {name === "dreams" && (
        <g {...common}>
          <path d="M4 15.5c2-3 5-3 8 0s6 3 8 0M4 10.5c2-3 5-3 8 0s6 3 8 0" />
        </g>
      )}
      {name === "profile" && (
        <g {...common}>
          <circle cx="12" cy="9" r="3.5" />
          <path d="M5 19.5c1.5-3.2 4-4.5 7-4.5s5.5 1.3 7 4.5" />
        </g>
      )}
    </svg>
  );
}
