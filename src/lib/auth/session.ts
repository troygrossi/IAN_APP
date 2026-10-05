import { cookies } from "next/headers";
import { AppError } from "@/lib/errors";
import { SESSION_COOKIE } from "./config";

// PLACEHOLDER login (docs/rules/AUTH.md). The "session" is a cookie holding the email
// someone typed; nothing is checked. When real login is connected, only the inside of
// getSession() changes. Every page and route keeps calling these two functions.

export type Session = { user: { email: string } };

export async function getSession(): Promise<Session | null> {
  const email = (await cookies()).get(SESSION_COOKIE)?.value;
  return email ? { user: { email } } : null;
}

/** For API routes: the session, or a "signed-out" error that `fail()` turns into a 401. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) throw new AppError("signed-out", "Please sign in to continue.");
  return session;
}
