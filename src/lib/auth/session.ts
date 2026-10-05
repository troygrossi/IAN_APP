import { cache } from "react";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { AppError } from "@/lib/errors";
import { findSessionUser } from "@/lib/services/sessions";
import type { SessionUser } from "@/lib/services/users";
import { SESSION_COOKIE } from "./config";

// The one place the session is read (docs/rules/AUTH.md).
// Pages call getSession(). API routes call requireSession().

export type Session = { user: SessionUser };

/** The signed-in user, or null. `cache` means one database lookup per request, however often it is called. */
export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  // No database yet means nobody can be signed in. Public pages must still load.
  if (!token || !env.DATABASE_URL) return null;
  const user = await findSessionUser(token);
  return user ? { user } : null;
});

/** For API routes: the session, or a "signed-out" error that `fail()` turns into a 401. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new AppError("signed-out", "Please sign in to continue.");
  return session;
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, // page scripts cannot read it
    secure: process.env.NODE_ENV === "production", // only sent over https on the live site
    sameSite: "lax", // not sent when another site posts a form here
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}
