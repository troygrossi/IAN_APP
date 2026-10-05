// Every navigation link in the app lives here (docs/rules/NAVIGATION.md).
// To add a page to a menu, add one line.

export type NavItem = { href: string; label: string };

export const APP_NAME = "Ian's App";

export const marketingNav: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
];

export const appNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/notes", label: "Notes" },
  { href: "/dashboard/billing", label: "Billing" },
  { href: "/dashboard/settings", label: "Settings" },
];
