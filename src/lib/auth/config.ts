// Names and paths the login flow shares (docs/rules/AUTH.md).

export const SESSION_COOKIE = "demo_session";
export const LOGIN_PATH = "/login";
export const AFTER_LOGIN_PATH = "/dashboard";

/**
 * Does this address need a signed-in user?
 * `src/proxy.ts` asks this for every page request, before the page runs.
 */
export function isProtectedPath(pathname: string): boolean {
  // TODO(human): decide which paths require login.
  void pathname;
  return false;
}

/** Where to send someone after login. Only paths inside this site are allowed. */
export function safeNextPath(value: unknown): string {
  if (typeof value !== "string") return AFTER_LOGIN_PATH;
  // "//evil.com" and "/\evil.com" look like paths but leave the site.
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return AFTER_LOGIN_PATH;
  return value;
}
