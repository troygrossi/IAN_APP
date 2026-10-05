import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import { AppError } from "@/lib/errors";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

// Kept on globalThis so the dev server's hot reload reuses one connection
// instead of opening a new one on every file save.
const cache = globalThis as unknown as { db?: Db };

/** The database. Only `src/lib/services/*` may call this (docs/rules/DATA_FLOW.md). */
export function getDb(): Db {
  if (!env.DATABASE_URL) {
    // The fix is for the developer, so it goes to the terminal; the screen gets plain words.
    console.warn("DATABASE_URL is empty. Run `npm run doctor` to see how to connect the database.");
    throw new AppError("service-down", "The database is not connected yet, so nothing can be saved or loaded.");
  }
  // prepare: false is required by Supabase's connection pooler.
  cache.db ??= drizzle(postgres(env.DATABASE_URL, { prepare: false }), { schema });
  return cache.db;
}
