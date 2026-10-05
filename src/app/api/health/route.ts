import { sql } from "drizzle-orm";
import { ok } from "@/lib/api/response";
import { getDb } from "@/lib/db";
import { env } from "@/lib/env";

// Open http://localhost:3000/api/health to see whether the app can reach its database.
export async function GET() {
  let database: "connected" | "not-configured" | "down" = "not-configured";
  if (env.DATABASE_URL) {
    try {
      await getDb().execute(sql`select 1`);
      database = "connected";
    } catch (err) {
      console.error("[GET /api/health]", err);
      database = "down";
    }
  }
  return ok({ app: "ok", database });
}
