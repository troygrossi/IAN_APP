import type { NavIcon as NavIconName } from "./nav-items";

/** Simple line icons for the tab bar. They inherit the text color. */
export function NavIcon({ name }: { name: NavIconName }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "size-6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 3.5v17M3.5 12h17M6 6l12 12M18 6 6 18" />
          <circle cx="12" cy="12" r="2.2" fill="currentColor" />
        </svg>
      );
    case "alerts":
      return (
        <svg {...common}>
          <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" />
          <path d="M10 20.5a2 2 0 0 0 4 0" />
        </svg>
      );
    case "pnl":
      return (
        <svg {...common}>
          <path d="M4 19.5h16" />
          <path d="M5 15.5 10 10l3.5 3.5L19.5 7" />
          <path d="M15 7h4.5v4.5" />
        </svg>
      );
    case "drip":
      return (
        <svg {...common}>
          <path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5Z" />
          <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
        </svg>
      );
    case "learn":
      return (
        <svg {...common}>
          <path d="M3.5 6.5c3-1.3 5.8-1.3 8.5.5 2.7-1.8 5.5-1.8 8.5-.5v12c-3-1.3-5.8-1.3-8.5.5-2.7-1.8-5.5-1.8-8.5-.5v-12Z" />
          <path d="M12 7v12" />
        </svg>
      );
  }
}
