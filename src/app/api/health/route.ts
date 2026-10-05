import { sql } from "drizzle-orm";
import { ok } from "@/lib/api/response";
import { getDb } from "@/lib/db";
import { env } from "@/lib/env";

// Open /api/health to see whether the app can reach its database, and which version is running.
// The doctor and the CI pipeline (.github/workflows/ci.yml) both read this.
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
  return ok({ app: "ok", database, version: env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local" });
}
