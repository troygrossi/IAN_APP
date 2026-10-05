import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// The shape of the database. This file is the source of truth (docs/rules/DATABASE.md).
// After changing it: `npm run db:generate`, then `npm run db:migrate`.

/** One row per person. Room for login and payments; nothing writes here yet. */
export const profiles = pgTable("profiles", {
  // Will equal the Supabase auth user id once login is connected.
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  plan: text("plan").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Example table that proves the whole path works. Replace with the real product's tables. */
export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
