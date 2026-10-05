# 01 — The stack

| | |
| --- | --- |
| Decided | 2026-10-05 |
| Decided by | Proposed by Claude; not yet reviewed by Troy and Ian |
| Replaces | none |

## The question

What is the app built with, and where does it run?

## The decision

Next.js 16 with TypeScript and Tailwind. Postgres hosted by Supabase, reached through Drizzle. The site is hosted by Vercel.

## Why

- **Next.js** holds the pages and the server code in one project, so there is one thing to run and one thing to deploy.
- **Postgres** is the database the app will not outgrow. Starting on it avoids a migration later, when login and payments need it anyway.
- **Supabase** hosts Postgres with a free tier and a dashboard for looking at data. It also provides login, so that step needs no second service.
- **Drizzle** keeps the tables in a TypeScript file, so the editor knows the shape of every row, and changes are recorded as migration files.
- **Vercel** deploys a Next.js app from GitHub with no server to manage.

## What we did not choose

- **SQLite** (a database in a single file). Lighter on a laptop, but it does not fit Vercel, which has no permanent disk.
- **Railway** for hosting. A good service, and the right one if the app later needs a program that runs all the time (a background worker, a queue). For a Next.js site it adds a server to manage without a benefit today.
- **Supabase's own client library for data.** It would tie every query to Supabase. Drizzle talks plain Postgres, so the database can move.

## When to look at this again

- The app needs long-running background work → consider Railway next to Vercel.
- Vercel or Supabase costs grow faster than the app's income.
