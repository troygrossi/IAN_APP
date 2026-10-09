import { z } from "zod";

// The one place the app reads environment variables (docs/rules/TYPES.md).
// Server-only values stay undefined in the browser; only NEXT_PUBLIC_* reach it.
const schema = z.object({
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(1).optional(),
  // Set by Vercel on every build: the id of the version being built.
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  // Financial Modeling Prep, for live Core Four prices. Without it the app shows its price snapshot.
  FMP_API_KEY: z.string().min(1).optional(),
});

export const env = schema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || undefined,
  DATABASE_URL: process.env.DATABASE_URL || undefined,
  VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || undefined,
  FMP_API_KEY: process.env.FMP_API_KEY || undefined,
});
