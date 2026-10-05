# Database

Tables and migrations. The database is Postgres, hosted by Supabase. The code talks to it through Drizzle. The steps to run are in [HELP.md](../../HELP.md), sections 5 and 6.

## Rules

**`src/lib/db/schema.ts` is the source of truth.** Change tables there, never by clicking in the Supabase dashboard. A change made in the dashboard is lost the next time someone sets up the project.

**Every change is a migration.** Edit the schema, `npm run db:generate`, read the new file in `drizzle/`, `npm run db:migrate`. Commit the schema and the migration together.

**A migration that has been applied is never edited or deleted.** Fix a mistake with a new migration.

**Read a generated migration before applying it.** If it says `DROP`, data will be deleted. Be sure that is what you meant.

**Every table has** an `id` (uuid, generated) and a `createdAt` (timestamp with time zone, defaults to now).

**Names:** tables are plural and snake_case (`notes`). Columns are snake_case in the database and camelCase in code (`created_at` / `createdAt`).

**Only services query the database** ([DATA_FLOW.md](DATA_FLOW.md)).

**Limit every list query.** `listNotes` stops at 100 rows. A list with no limit works until the table is large, then takes the page down.

## Tables

| Table | Holds |
| --- | --- |
| `profiles` | One row per person: email, plan, Stripe customer id. Nothing writes to it yet. |
| `notes` | The example feature. Replace with the product's real tables. |

## Known gaps

- One database serves both your computer and the live site until a second Supabase project is created. Before real users arrive, make a separate project for development.
- Row Level Security is not set up. It matters once the browser talks to Supabase directly; today only the server does.
