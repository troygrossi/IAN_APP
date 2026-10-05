import { index, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// The shape of the database. This file is the source of truth (docs/rules/DATABASE.md).
// After changing it: `npm run db:generate`, then `npm run db:migrate`.

/** One row per person who can sign in (docs/rules/AUTH.md). */
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Always stored trimmed and lower-case, so "A@b.com" and "a@b.com" are one account.
  email: text("email").notNull().unique(),
  // Never the password itself. See src/lib/auth/password.ts.
  passwordHash: text("password_hash").notNull(),
  // Wrong passwords in a row, and when the account may be tried again.
  failedSignIns: integer("failed_sign_ins").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  // Room for payments; nothing writes these yet (docs/rules/PAYMENTS.md).
  plan: text("plan").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** One row per signed-in browser. Deleting the row signs that browser out. */
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // A fingerprint of the secret in the browser's cookie. The secret itself is never stored.
    tokenHash: text("token_hash").notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)],
);

/** Example table that proves the whole path works. Replace with the real product's tables. */
export const notes = pgTable(
  "notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("notes_user_id_idx").on(table.userId)],
);
