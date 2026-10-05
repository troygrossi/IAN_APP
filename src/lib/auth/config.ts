// Names, paths and limits the login flow shares (docs/rules/AUTH.md).

export const SESSION_COOKIE = "session";
export const SESSION_DAYS = 30;
export const LOGIN_PATH = "/login";
export const AFTER_LOGIN_PATH = "/dashboard";

/** Wrong passwords in a row before an account is paused, and for how long. */
export const MAX_FAILED_SIGN_INS = 5;
export const LOCK_MINUTES = 15;

// Every page is private unless it is listed here. A new page is therefore
// protected by default, and making one public is a deliberate one-line change.
const PUBLIC_PATHS = ["/", "/pricing", "/login", "/signup"];
const PUBLIC_PREFIXES = ["/checkout"];

/**
 * Does this address need a signed-in user?
 * `src/proxy.ts` asks this for every page request, before the page runs.
 */
export function isProtectedPath(pathname: string): boolean {
  if (PUBLIC_PATHS.includes(pathname)) return false;
  // Match "/checkout" and "/checkout/…", but not "/checkout-something".
  return !PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/** Where to send someone after login. Only paths inside this site are allowed. */
export function safeNextPath(value: unknown): string {
  if (typeof value !== "string") return AFTER_LOGIN_PATH;
  // "//evil.com" and "/\evil.com" look like paths but leave the site.
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return AFTER_LOGIN_PATH;
  return value;
}
