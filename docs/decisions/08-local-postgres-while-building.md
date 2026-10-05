# 08 — Postgres on Ian's computer while the app is being built

| | |
| --- | --- |
| Decided | 2026-10-05 |
| Decided by | Ian, with Claude |
| Replaces | none |

## The question

Ian wants to sign in and test the app now, but does not want to set up Supabase until the app is further along. Where does the database live in the meantime?

## The decision

On Ian's Mac, in Postgres.app. `DATABASE_URL` in `.env.local` points at `localhost`, and `npm run doctor -- --fix` creates the database and its tables. Supabase comes back when the live site needs a database.

## Why

- It costs nothing and needs no account.
- It is the same Postgres the live site will use, so the migrations, the services and sign-in are tested for real.
- Test accounts and data stay on one computer and never mix with real users later.

## What we did not choose

- **Supabase's free plan now.** It also costs nothing, but Ian chose to wait, and a free project pauses after a week without use.
- **Homebrew (`brew install postgresql`).** Fine for developers, but it means a terminal, a package manager and a background service to manage. Postgres.app is one app with a Start button.
- **Docker.** A large install for one database.
- **A database inside the app (PGlite).** It would not be the same Postgres as the live site, and the code would need a second connection path.

## When to look at this again

When the app gets its first live users, or a second person needs to see the same data: set up Supabase (HELP.md, section 5) and keep Postgres.app for testing.
