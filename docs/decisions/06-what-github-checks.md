# 06 — What GitHub does after a publish or a deploy

| | |
| --- | --- |
| Decided | 2026-10-05 |
| Decided by | Troy asked for a light pipeline; Claude chose the shape, not yet reviewed |
| Replaces | none |

## The question

Troy asked for a light pipeline that applies database changes and deploys. What should run automatically, and where?

## The decision

One file, `.github/workflows/ci.yml`, run by GitHub.

- After every **Publish (save to GitHub)**: check the code and build it.
- After every **Deploy (deploy to Vercel)**: check and build, then apply new migrations to the live database, then wait for Vercel and confirm the live site is running the new version with its database connected.

Vercel keeps building the live site by itself when `main` changes. The pipeline does not start that build.

## Why

- **One secret.** GitHub needs only the database address. Vercel is already connected to the repository.
- **Migrations stop being a step someone can forget.** Before this, a person had to run `npm run db:migrate` against the live database before each deploy.
- **A deploy now has an answer.** The last job fails, with the reason, if the live site did not come up, came up as an old version, or cannot reach its database.
- **Nobody learns a new command.** It runs because of Publish and Deploy.

## What we did not choose

- **Having the pipeline deploy to Vercel itself**, with Vercel's command-line tool or a deploy hook, so the order is strictly check, migrate, deploy. It is the stricter design. It needs Vercel's own automatic deploys turned off and two to four more secrets, and a wrong setting stops all deploys. Not worth it yet.
- **Running migrations inside Vercel's build.** One fewer moving part, but then every preview build could change the live database.
- **Supabase's own migration tool and branching.** The project's migrations are Drizzle's; two tools for one job would disagree.

## What this costs

Vercel's build and the migration start at the same moment, so for a short time new code can run against the old database, or the reverse. Adding a table or column is safe either way. Removing or renaming one is not: do it in two deploys, first the code that stops using it, then the migration that removes it. The rule is in [DATABASE.md](../rules/DATABASE.md).

## When to look at this again

- A deploy breaks the live site because of that gap.
- Tests exist and should block a deploy.
- A second database, for development, is added.
