import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt, lt } from "drizzle-orm";
import { SESSION_DAYS } from "@/lib/auth/config";
import { getDb } from "@/lib/db";
import { sessions, users } from "@/lib/db/schema";
import type { SessionUser } from "./users";

// A session is a long random secret. The browser keeps the secret in a cookie; the
// database keeps only its fingerprint (docs/rules/AUTH.md). Someone who reads the
// database therefore cannot sign in as anyone.
const fingerprint = (token: string) => createHash("sha256").update(token).digest("hex");

/** Starts a session and returns the secret to put in the cookie. */
export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const db = getDb();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  // Housekeeping: this user's expired sessions are of no use to anyone.
  await db.delete(sessions).where(and(eq(sessions.userId, userId), lt(sessions.expiresAt, new Date())));
  await db.insert(sessions).values({ tokenHash: fingerprint(token), userId, expiresAt });
  return { token, expiresAt };
}

/** The user a cookie's secret belongs to, or null when it is unknown or expired. */
export async function findSessionUser(token: string): Promise<SessionUser | null> {
  const [row] = await getDb()
    .select({ id: users.id, email: users.email })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(and(eq(sessions.tokenHash, fingerprint(token)), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return row ?? null;
}

export async function deleteSession(token: string): Promise<void> {
  await getDb().delete(sessions).where(eq(sessions.tokenHash, fingerprint(token)));
}
