import { eq, sql } from "drizzle-orm";
import { LOCK_MINUTES, MAX_FAILED_SIGN_INS } from "@/lib/auth/config";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import type { Credentials } from "@/lib/contracts/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { AppError } from "@/lib/errors";

export type SessionUser = { id: string; email: string };

// One message for "no such account" and "wrong password", so the sign-in form
// cannot be used to find out which email addresses have accounts.
const WRONG_CREDENTIALS = "That email and password do not match. Check them and try again.";

export async function createUser({ email, password }: Credentials): Promise<SessionUser> {
  const passwordHash = await hashPassword(password);
  // onConflictDoNothing makes "already exists" an empty result instead of a database error,
  // and leaves no gap between checking and inserting for two sign-ups to slip through.
  const [row] = await getDb().insert(users).values({ email, passwordHash }).onConflictDoNothing({ target: users.email }).returning();
  if (!row) throw new AppError("bad-input", "An account with that email already exists. Sign in instead.");
  return { id: row.id, email: row.email };
}

// Checked when the email is unknown, so that case takes as long as a wrong password does.
let decoyHash: Promise<string> | undefined;

/** The user these credentials belong to. Throws when they do not match or the account is paused. */
export async function checkCredentials({ email, password }: Credentials): Promise<SessionUser> {
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user) {
    await verifyPassword(password, await (decoyHash ??= hashPassword("decoy")));
    throw new AppError("signed-out", WRONG_CREDENTIALS);
  }
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60_000);
    throw new AppError("too-many-tries", `Too many wrong passwords. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`);
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    // Counted in the database in one statement, so parallel guesses cannot each read "4".
    await db
      .update(users)
      .set({
        failedSignIns: sql`case when ${users.failedSignIns} + 1 >= ${MAX_FAILED_SIGN_INS} then 0 else ${users.failedSignIns} + 1 end`,
        lockedUntil: sql`case when ${users.failedSignIns} + 1 >= ${MAX_FAILED_SIGN_INS} then now() + make_interval(mins => ${LOCK_MINUTES}) else ${users.lockedUntil} end`,
      })
      .where(eq(users.id, user.id));
    throw new AppError("signed-out", WRONG_CREDENTIALS);
  }

  if (user.failedSignIns > 0 || user.lockedUntil) {
    await db.update(users).set({ failedSignIns: 0, lockedUntil: null }).where(eq(users.id, user.id));
  }
  return { id: user.id, email: user.email };
}
