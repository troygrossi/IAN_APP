# Ian's App

A starter web app. The structure is in place: pages, a database, and stand-ins for login and payment. The product itself comes next.

## Start here

| I want to… | Do this |
| --- | --- |
| Run the app for the first time | [HELP.md](HELP.md), section 1 |
| Check that my computer is set up | `npm run doctor` |
| Find a command, a file, or a word I don't know | `npm run help` |
| Know how the code is meant to be written | [docs/README.md](docs/README.md) |
| See what was done last, and what is next | [docs/work/LOG.md](docs/work/LOG.md) and [docs/work/BACKLOG.md](docs/work/BACKLOG.md) |
| Publish (save to GitHub) | `npm run publish -- "what changed"` |
| Deploy (deploy to Vercel) | `npm run deploy` |
| Connect GitHub and Vercel for the first time | [docs/setup/DEPLOY.md](docs/setup/DEPLOY.md) |

## Quick start

On Windows, double-click **`Start App.cmd`** in this folder. It installs what is needed, starts the app and opens your browser.

Or, in a terminal:

```
npm install
npm run doctor -- --fix
npm run dev
```

Then open http://localhost:3000.

## What works today

| Part | State |
| --- | --- |
| Pages and menus | Real |
| Notes, the example feature | Real once a database is connected ([HELP.md](HELP.md), section 5) |
| Sign in | **Placeholder.** Any email signs in |
| Payment | **Placeholder.** No money moves |

## What it is built with

Next.js (the web framework), TypeScript (the language), Tailwind (styling), Postgres on Supabase (the database), Drizzle (how the code talks to the database), and Vercel (hosting). Why these: [docs/decisions/01-stack.md](docs/decisions/01-stack.md).
