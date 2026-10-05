# Help

This is the map of working on this app. Read it here, or in the terminal with `npm run help`.

**You rarely need to type.** The everyday commands are files at the top of the project folder that you double-click: `Start App.cmd`, `Doctor.cmd`, `Sync.cmd`, `Publish.cmd`, `Deploy.cmd` and `Help.cmd`. Each one runs the terminal command shown next to it in section 3.

Two commands answer most questions:

- `npm run doctor` checks that this computer is ready and tells you the next command when it is not.
- `npm run help` shows this page, one section at a time.

A rule for every command in this project: **when something fails, it must say what to do next.** If a command leaves you stuck, that is a bug in the command. Write it in [the backlog](docs/work/BACKLOG.md).

## 1. First time on this computer

**New to all of this? Use the checklist in [ONBOARDING.md](ONBOARDING.md) instead.** It starts from a brand-new Windows computer and covers the accounts too. This section is the short version for someone who has done it before.

1. Install **Node** (the LTS version) from https://nodejs.org. Node is the program that runs the app on your computer.
2. Install **Git** from https://git-scm.com. Git keeps the history of your work.
3. Get the project, if it is not on this computer yet. Open a terminal where you keep your projects and run this, with the address of the repository on GitHub:
   ```
   git clone -b develop https://github.com/your-name/your-app.git
   ```
   Then open the new folder in VS Code and open a terminal there: the **Terminal** menu, then **New Terminal**.
4. In File Explorer, double-click **`Start App.cmd`** in the project folder. The first time, it downloads the code this app is built on (a minute), creates your settings file, starts the app and opens it in your browser.

If Windows shows a blue "Windows protected your PC" box, choose **More info**, then **Run anyway**. It appears because the file came from the internet.

The same thing in a terminal: `npm install`, then `npm run doctor -- --fix`, then `npm run dev` and open http://localhost:3000.

The pages load at this point. Signing in and saving data need a database (section 5). Payment is simulated.

## 2. Every time you sit down

Double-click the file, or type the command. They do the same thing.

1. **`Sync.cmd`** (`npm run sync`). Sync (get the latest from GitHub).
2. **`Doctor.cmd`** (`npm run doctor`). Green means go. Yellow is worth reading. Red tells you the next command.
3. **`Start App.cmd`** (`npm run dev`). The app opens at http://localhost:3000. Leave the window open; the page updates when you save a file.
4. To stop the app, close that window. In a terminal, press `Ctrl` + `C`.
5. When a piece of work is finished: add an entry to [the work log](docs/work/LOG.md), then **`Publish.cmd`** (`npm run publish -- "what changed"`). Publish (save to GitHub).
6. When it is ready for visitors: **`Deploy.cmd`** (`npm run deploy`). Deploy (deploy to Vercel).

Steps 5 and 6 are explained in section 8.

## 3. Commands

| Command | Or double-click | What it does | When you run it |
| --- | --- | --- | --- |
| `npm run dev` | `Start App.cmd` | Starts the app on your computer at http://localhost:3000 | Every time you work |
| `npm run sync` | `Sync.cmd` | Sync (get the latest from GitHub) | Start of every session |
| `npm run doctor` | `Doctor.cmd` | Checks that this computer is ready. Add `-- --fix` to let it repair what it can | Start of every session, and whenever something is wrong |
| `npm run help` | `Help.cmd` | Shows this page. Add `-- 5` or `-- database` for one section | When you are lost |
| `npm run publish` | `Publish.cmd` | Publish (save to GitHub). Checks the code, saves a version, sends it. Add `-- "what changed"` | When a piece of work is finished |
| `npm run deploy` | `Deploy.cmd` | Deploy (deploy to Vercel). Makes the live site match what you last published | When the work is ready for visitors |
| `npm run check` | | Runs `lint`, `typecheck` and `check:docs` together. `publish` runs it for you | Any time you want to know the code is sound |
| `npm run lint` | | Looks for common mistakes in the code | Part of `check` |
| `npm run typecheck` | | Checks that the pieces of code fit together | Part of `check` |
| `npm run check:docs` | | Checks that the documents still match the project | Part of `check` |
| `npm run db:generate` | | Writes a migration file from your changes to the schema | After you edit `src/lib/db/schema.ts` |
| `npm run db:migrate` | | Applies migration files to the database | After `db:generate`, and when doctor says tables are missing |
| `npm run db:studio` | | Opens a page where you can look at the data | When you want to see what is saved |
| `npm run build` | | Builds the app the way the live site does | To find a build error before you deploy |
| `npm run start` | | Runs the result of `build` | Rarely. Only to test the built app |

## 4. Where things are

| You want to… | Look in |
| --- | --- |
| Change a page | `src/app/` — each folder is an address. `src/app/(marketing)/pricing/page.tsx` is `/pricing` |
| Change the menus | `src/components/nav/nav-items.ts` |
| Change the colors | `src/app/globals.css` |
| Change what the database stores | `src/lib/db/schema.ts`, then section 6 |
| Change what the server does with data | `src/lib/services/` |
| See an example of a whole feature | Notes: `src/app/(app)/dashboard/notes/` |
| Change the plans and prices | `src/lib/billing/plans.ts` |
| Know the rules of the code | [docs/rules/](docs/README.md) |
| Know how work gets to GitHub and the live site | [docs/rules/WORKFLOW.md](docs/rules/WORKFLOW.md) |
| See what was done and why | [docs/work/LOG.md](docs/work/LOG.md) and [docs/decisions/](docs/decisions/README.md) |
| See what is left to do | [docs/work/BACKLOG.md](docs/work/BACKLOG.md) |

Folders in round brackets, like `(marketing)`, group pages that share a layout. The brackets are not part of the address.

## 5. Connecting the database

The database is hosted by Supabase. You do this once.

1. Create a free account at https://supabase.com and make a **new project**. Save the database password it shows you.
2. In the project, click **Connect** at the top. Under **Connection string**, copy the **Transaction pooler** address. It starts with `postgresql://`.
3. Open `.env.local` in this folder. Paste the address after `DATABASE_URL=` and replace `[YOUR-PASSWORD]` with your database password.
4. Run `npm run db:migrate`. It creates the tables.
5. Run `npm run doctor`. The Database check turns green.
6. Restart `npm run dev`. You can now create an account, sign in, and save notes.

`.env.local` holds secrets. It is never published. Do not paste its contents into a chat or a screenshot.

## 6. Changing the database

A **migration** is a small file that describes one change to the database, so the same change can be applied to your database and to the live one.

1. Edit `src/lib/db/schema.ts`.
2. `npm run db:generate` writes a new file into `drizzle/`. Read it. It should say what you meant.
3. `npm run db:migrate` applies it.
4. Publish the schema change and the new file in `drizzle/` together, in one version.

Never edit or delete a migration file that has already been applied. Make a new one. The rules are in [docs/rules/DATABASE.md](docs/rules/DATABASE.md).

## 7. When something is broken

Work down this list. Stop when it is fixed.

1. Read the error. The first lines usually name the file and the line.
2. `npm run doctor`. It finds most setup problems.
3. Stop the app (`Ctrl` + `C`) and start it again with `npm run dev`.
4. `npm run check`. It points at code that does not fit together.
5. Open http://localhost:3000/api/health. It says whether the app can reach the database.
6. `npm install`, in case the packages are out of date.
7. Ask Claude. Paste the whole error and say what you did just before it.

| What you see | What it means | What to do |
| --- | --- | --- |
| "The database is not connected yet" | `DATABASE_URL` is empty | Section 5 |
| "Too many wrong passwords" | Five wrong passwords in a row pause an account for 15 minutes | Wait, or see [docs/rules/AUTH.md](docs/rules/AUTH.md) |
| An email from GitHub says a run failed | One of the automatic checks after a publish or deploy did not pass | Open the link in the email; the last lines say what to do. See section 8 |
| "Port 3000 is in use" | The app is already running in another terminal | Use that one, or close it |
| A page shows "This page could not load" | The code for that page crashed | Read the terminal where `npm run dev` runs |
| Changes to `.env.local` do nothing | Settings are read once at start | Restart `npm run dev` |

## 8. Publish and deploy

There are three words, and each is one command. The full rules are in [docs/rules/WORKFLOW.md](docs/rules/WORKFLOW.md).

| Word | What it does | Command |
| --- | --- | --- |
| **Sync (get the latest from GitHub)** | Brings down anything on GitHub that this computer does not have | `npm run sync` |
| **Publish (save to GitHub)** | Saves your work as a new version and sends it to GitHub. The live site does not change | `npm run publish -- "what changed"` |
| **Deploy (deploy to Vercel)** | Makes the live site match what you last published | `npm run deploy` |

**Publish often. Deploy when it is ready.** Publishing is your save button and your backup. Deploying is what visitors see.

**You are always on `develop`.** The project has two branches (lines of versions): `develop`, where all work happens, and `main`, which the live site is built from. You never switch to `main`. The commands keep it up to date for you.

**GitHub checks your work after each one.** After a publish it checks and builds the code. After a deploy it also updates the live database and confirms the live site came up. You do not start these; see them at https://github.com/troygrossi/IAN_APP/actions. A green tick means all is well.

What to write after `npm run publish --`: a few plain words about what changed, in quotes. "Add a phone number to the sign-up form".

**First time only:** the project needs an address on GitHub, and Vercel needs to be connected to it. The steps are in [docs/setup/DEPLOY.md](docs/setup/DEPLOY.md).

| What you see | What to do |
| --- | --- |
| "You are on … All work happens on develop" | `git switch develop` |
| "The check failed, so nothing was published" | Read what it printed above. Fix it, or ask Claude to |
| "GitHub has changes that clash with yours" | Ask Claude: "help me sync develop with GitHub" |
| "Your latest version is not on GitHub yet" | `npm run publish`, then `npm run deploy` again |
| The live site did not change after a deploy | [docs/setup/DEPLOY.md](docs/setup/DEPLOY.md), "When a deploy fails" |

## 9. Good habits

The short list. The reasons are in [docs/rules/WORKFLOW.md](docs/rules/WORKFLOW.md).

- **Small and often.** Publish (save to GitHub) after each piece that works.
- **One thing at a time.** Ask your agent for one change, look at it, publish, then ask for the next.
- **Look before you publish.** Open the page you changed.
- **Deploy (deploy to Vercel) only what you have clicked through.**
- **Ask why.** If you do not understand what an agent did, ask it to explain.
- **Secrets stay in `.env.local`.** Never in a chat, a screenshot or a document.
- **Do not edit files on the GitHub website.**
- **Stuck for more than a few minutes? Stop and ask.** Paste the whole error.

## 10. Words you will hear

| Word | Meaning |
| --- | --- |
| Terminal | The window where you type commands |
| Double-click file | A file ending in `.cmd` at the top of the project that runs a command for you |
| Repository (repo) | This project folder, with its history, as git sees it |
| Version (git calls it a commit) | One saved state of the project, with a short description |
| Branch | A line of versions. You work on `develop`; the live site is built from `main` |
| Sync | Get the latest from GitHub: `npm run sync` |
| Publish | Save to GitHub: `npm run publish` |
| Route | An address in the app, like `/pricing` |
| API route | An address that returns data instead of a page, like `/api/notes` |
| Component | A reusable piece of a page, like a button |
| Server / client | Code that runs on the computer hosting the site / code that runs in the visitor's browser |
| Database | Where the app keeps data that must survive a restart |
| Schema | The list of tables and columns in the database |
| Migration | A file describing one change to the schema |
| Environment variable | A setting, often a secret, kept outside the code in `.env.local` |
| Placeholder | A stand-in that simulates a feature that is not built yet |
| Deploy | Deploy to Vercel, which makes the live site match what you published: `npm run deploy` |
| The live site | The app on the internet, as visitors see it |

## 11. Keeping the docs alive

The documents are only useful while they are true. These four are updated **in the same change** as the work that affects them:

| When you… | Update |
| --- | --- |
| Change what a newcomer has to install, sign up for, or set | [ONBOARDING.md](ONBOARDING.md), and the doctor check that points at that step |
| Finish a piece of work | Add an entry to [docs/work/LOG.md](docs/work/LOG.md) |
| Choose between two real options | Add a file to [docs/decisions/](docs/decisions/README.md) |
| Add or change a command | The Commands table in section 3 (`npm run check:docs` fails until you do). An everyday command also gets a double-click file |
| Make the app depend on something new: a tool, a setting, a service | Add a check to `scripts/doctor.mjs` and a line to `.env.example` |
| Change how work is published or deployed, or a word we use for it | [docs/rules/WORKFLOW.md](docs/rules/WORKFLOW.md) and `CLAUDE.md` |
| Change how the code is supposed to be written | The matching file in [docs/rules/](docs/README.md) |

If you work with Claude, it follows these rules by itself. They are in `CLAUDE.md`.
