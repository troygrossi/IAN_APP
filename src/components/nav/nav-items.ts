// Every navigation link in the app lives here (docs/rules/NAVIGATION.md).
// To add a page to a menu, add one line.

export type NavIcon = "dashboard" | "alerts" | "pnl" | "drip" | "learn";
export type NavItem = { href: string; label: string; icon?: NavIcon };

export const APP_NAME = "Harvest the Wheel";

export const marketingNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
];

/** The main sections after sign-in. On a phone they become the tab bar at the bottom of the screen. */
export const appNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/dashboard/alerts", label: "Alerts", icon: "alerts" },
  { href: "/dashboard/pnl", label: "P/L", icon: "pnl" },
  { href: "/dashboard/drip", label: "DRIP", icon: "drip" },
  { href: "/dashboard/learn", label: "Learn", icon: "learn" },
];

/** Account pages, shown in the header beside the sign-out button. */
export const accountNav: NavItem[] = [
  { href: "/dashboard/notes", label: "Notes" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/settings", label: "Settings" },
];
