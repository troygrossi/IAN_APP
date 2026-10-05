# 09 — Supabase's free plan for the live site, Postgres.app for building

| | |
| --- | --- |
| Decided | 2026-10-05 |
| Decided by | Ian, with Claude |
| Replaces | none (it settles the "later" in decision 08) |

## The question

Decision 08 put the database on Ian's computer while the app is built. Ian found Supabase's free plan and wants the live site online now. What does the live site use, and what keeps working on his computer?

## The decision

Two databases that never share data. Ian's computer keeps Postgres.app (`.env.local`). The live site uses a Supabase project on the free plan: Vercel gets its **Transaction pooler** address, GitHub gets its **Session pooler** address for migrations. A daily GitHub job (`.github/workflows/keep-awake.yml`) asks the live database one question so the free plan does not pause it.

## Why

- Free until there are paying users.
- Test accounts and half-finished work on Ian's computer can never reach the live database.
- The free plan's one real trap is the pause after a week without use; the daily job removes it.
- The Transaction pooler suits a site that opens many short connections; migrations need the Session pooler, which keeps a normal connection.

## What we did not choose

- **One Supabase database for both.** Simpler, but every test on Ian's computer would land in the live data.
- **Supabase Pro now ($25 per month).** Backups and no pausing, but nothing paid depends on it yet.
- **No keep-awake job.** The site would go down whenever nobody used it for a week, and someone would have to press Restore.

## When to look at this again

Before the first paying user: move to the Pro plan for backups, and the keep-awake job can then go. Also if Supabase changes what counts as activity, or starts treating automated pings differently.
