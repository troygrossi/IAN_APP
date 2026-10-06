# Database

Tables and migrations. The database is Postgres: on your own computer (Postgres.app) while the app is being built, and on Supabase for the live site ([decision 08](../decisions/08-local-postgres-while-building.md)). The code talks to it through Drizzle. The steps to run are in [HELP.md](../../HELP.md), sections 5 and 6.

## Rules

**`src/lib/db/schema.ts` is the source of truth.** Change tables there, never by clicking in the Supabase dashboard. A change made in the dashboard is lost the next time someone sets up the project.

**Every change is a migration.** Edit the schema, `npm run db:generate`, read the new file in `drizzle/`, `npm run db:migrate`. Commit the schema and the migration together.

**A migration that has been applied is never edited or deleted.** Fix a mistake with a new migration.

**A table that holds private data has a `userId` column** that references `users.id`, and every query filters by it ([AUTH.md](AUTH.md)).

**The live database is updated by GitHub, not by hand.** After a Deploy (deploy to Vercel), the pipeline in `.github/workflows/ci.yml` applies new migration files. It starts at the same moment as Vercel's build, so for a short time new code can meet the old database. Adding a table or column is safe. To remove or rename one, use two deploys: first the code that stops using it, then the migration ([decision 06](../decisions/06-what-github-checks.md)).

**Read a generated migration before applying it.** If it says `DROP`, data will be deleted. Be sure that is what you meant.

**Every table has** an `id` (uuid, generated) and a `createdAt` (timestamp with time zone, defaults to now).

**Every table has Row Level Security on:** it ends with `.enableRLS()` in `schema.ts`. With no policies, only the table's owner can read or write it. The app connects as the owner (`postgres`), so it is not affected; Supabase's public web API connects as other roles and sees nothing. Add policies only if the browser ever talks to Supabase directly.

**Names:** tables are plural and snake_case (`notes`). Columns are snake_case in the database and camelCase in code (`created_at` / `createdAt`).

**Only services query the database** ([DATA_FLOW.md](DATA_FLOW.md)).

**Limit every list query.** `listNotes` stops at 100 rows. A list with no limit works until the table is large, then takes the page down.

## Tables

| Table | Holds |
| --- | --- |
| `users` | One row per person who can sign in: email, password hash, plan. Never the password itself ([AUTH.md](AUTH.md)) |
| `sessions` | One row per signed-in browser. Deleting a row signs that browser out |
| `notes` | The example feature, one user's notes. Replace with the product's real tables |

## Known gaps

- The live database is on Supabase's free plan: no backups, and it pauses after a week without use (a daily job keeps it awake). Move to the Pro plan before people pay ([decision 09](../decisions/09-free-supabase-for-the-live-site.md)).
