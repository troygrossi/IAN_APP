# Work log

One entry per finished piece of work, newest at the top. An entry is never rewritten; if it turns out to be wrong, say so in a new entry.

Write the entry before you commit. It can be short. Keep every heading, and write "none" when a heading has nothing under it. **What was rejected** and **Handoff** are the two a later reader needs most.

## Template

Copy this block to the top of the entries and fill it in.

```
## YYYY-MM-DD — Short title

**Summary:** One or two sentences. What can someone do now that they could not before?

**Why:** What prompted the work.

**What changed:**
- The files or areas touched, in plain words.

**What was rejected:** Things tried or considered and dropped, and why. "none" is fine.

**Checked:** What was run or clicked to confirm it works, and what was not checked.

**Docs updated:** Which of HELP.md, doctor, decisions, rules and backlog changed. "none needed" is fine.

**Handoff:** What the next person should know or do first.
```

---

## Entries

## 2026-10-05 — Follow-up: the pipeline ran, and the live branch is confirmed

**Summary:** The first pipeline run passed its check job. Publishing to `develop` produced a preview build on Vercel, not a live one, which confirms Vercel builds the live site from `main`.

**Why:** The entry below left both as unknowns.

**What changed:** The pipeline uses the current versions of GitHub’s checkout and Node actions (the first run warned that the old ones are being retired). The "check the production branch" item was removed from the backlog.

**What was rejected:** none

**Checked:** The run on GitHub, Vercel’s list of builds, and `/api/health` on the live site, which still reports the earlier version. This corrects the handoff below: the publish did not change the live site.

**Docs updated:** the backlog.

**Handoff:** Unchanged: the database address, in three places, comes first.

## 2026-10-05 — Real sign-in, and GitHub checks after publish and deploy

**Summary:** People now create an account with an email and password and sign in for real. Each person sees only their own notes. GitHub checks every publish, and after a deploy it also updates the live database and confirms the live site came up.

**Why:** Troy asked for a real, light, secure login modelled on his other app, and for a light pipeline that applies database changes and deploys.

**What changed:**
- **Login** ([AUTH.md](../rules/AUTH.md), [decision 05](../decisions/05-own-login.md)): `users` and `sessions` tables; passwords hashed with scrypt; a random session secret in a locked-down cookie with only its fingerprint stored; sign-out deletes the session; five wrong passwords pause an account for 15 minutes; one answer for "no account" and "wrong password".
- **Notes belong to a user.** `notes.userId`, and every notes query filters by it.
- **The proxy** now protects every page not listed as public (`isProtectedPath()`, which had been left as a `TODO(human)`; Claude wrote it), and refuses a data-changing API request that comes from another site.
- **The first migration was regenerated.** `drizzle/0000_initial.sql` replaces the earlier first migration. That one had been published but never applied to any database, so nothing was lost. From here on, migrations are only ever added.
- **Pipeline** ([decision 06](../decisions/06-what-github-checks.md)): `.github/workflows/ci.yml`. `/api/health` now reports which version is running, so the pipeline can tell when the new one is live.
- **Doctor:** the Login check now says whether sign-in can work; the Database check looks for the three tables.
- New error code `too-many-tries`. The Supabase login keys were removed from `.env.example`.
- The backlog was rewritten with every open item, including a section of things only Troy can do.

**What was rejected:** Supabase Auth, signed tokens, a password library and a login framework: see decision 05. Having the pipeline run the Vercel deploy itself: see decision 06. Storing the plan on the user now: payments are still a placeholder, so the cookie stays until Stripe is connected.

**Checked:** Against a throwaway Postgres on this computer, with the app running, in a browser:
- Created an account, landed on the dashboard, added a note, signed out.
- A signed-out visit to the notes page went to sign-in and, after signing in, came back to the notes page.
- A wrong password showed one message, kept the email, and emptied the password box.
- A second account saw no notes. The same email in different capitals was refused as already existing. A 5-character password was refused by the server, not only by the browser.
- The sixth attempt after five wrong passwords was refused for 15 minutes, even with the right password.
- After sign-out the `sessions` table was empty, and the API answered 401.
- The cookie cannot be read by page scripts. No password appears in the server log. The database holds `scrypt$…` hashes and 64-character fingerprints.
- A made-up cookie, a signed-out API call, and a cross-site `POST` were refused (307, 401, 403).
- `npm run check` and `npm run build` pass.

**Not checked:**
- Nothing ran against Supabase. `DATABASE_URL` is still not set on this computer, in Vercel or on GitHub, so **sign-in does not work on the live site yet**.
- The pipeline has never run. Its first run is this publish (the check job only). The two deploy jobs wait for the first deploy.
- The 15-minute pause was seen to start, not to end. Session expiry after 30 days was not waited for.
- There are no automated tests.

**Docs updated:** AUTH.md (rewritten), decisions 05 and 06, a note on 02, DATABASE.md, DATA_FLOW.md, ERRORS.md, NAVIGATION.md, PAYMENTS.md, STRUCTURE.md, WORKFLOW.md, DEPLOY.md, HELP.md, README.md, ONBOARDING.md, CLAUDE.md (first line, and a new firm rule 9 about not weakening sign-in), `.env.example`, the doctor, the backlog.

**Handoff:** The top section of the [backlog](BACKLOG.md) lists what only Troy can do; the database address comes first, in three places. If Vercel's production branch is `develop`, this publish has already put the new sign-in on the live site without a database; check that setting.

## 2026-10-05 — Onboarding checklist, tied to the doctor

**Summary:** A new person on a brand-new Windows computer has one checklist, [ONBOARDING.md](../../ONBOARDING.md), with 13 steps: three accounts, four programs, then the project. The doctor checks most of those steps and points each yellow or red line at the step that fixes it.

**Why:** Troy asked for a checklist for a friend who starts with nothing installed and needs GitHub, Vercel and Supabase accounts.

**What changed:**
- New `ONBOARDING.md` at the top of the project.
- The doctor: Git missing is now red with the download link; a new line for Git's name and email; check 8 "Tools" (VS Code, Claude Code, both optional); check 9 "Accounts" (whether this computer can reach the project on GitHub, whether the database answers, whether the live site answers).
- `package.json` has a `homepage` field with the live site's address; the doctor reads it.
- `npm run check:docs` fails if the doctor points at an onboarding step that does not exist.
- HELP.md, README.md, CLAUDE.md (firm rule 5, the Doctor line), docs/README.md and DEPLOY.md point at the checklist.

**What was rejected:**
- Having the doctor install Git, Node or VS Code by itself. Installing programs on someone's computer should be their own click; the doctor gives the link and the step.
- Checking the Vercel and Supabase accounts directly. That would need each person's login. The doctor checks what the accounts are for instead: the live site and the database.

**Checked:** `npm run check` passes. The doctor was run on Troy's computer, where everything is installed, in normal and `--quiet` modes. **Not checked:** the checklist has not been followed on a new computer, so the installer screens and the GitHub sign-in window in steps 4 to 9 are described from knowledge, not from a run. The doctor's "not installed" lines for Git, VS Code and Claude Code were not seen for real.

**Docs updated:** ONBOARDING.md (new), HELP.md, README.md, CLAUDE.md, docs/README.md, DEPLOY.md, the doctor, the docs check.

**Handoff:** Before the friend starts, Troy invites him to the GitHub repository and the Supabase organization. Vercel's free plan may not allow a second member; check that before promising him access. The first person through the checklist should note any step that did not match what they saw.

## 2026-10-05 — GitHub and Vercel connected

**Summary:** The project is on GitHub (`troygrossi/IAN_APP`, branches `develop` and `main`) and Vercel builds it. The database is not connected yet.

**Why:** Troy asked to get GitHub, Vercel and Supabase connected.

**What changed:**
- First Publish (save to GitHub): one version, on both branches.
- Vercel project `ian_app`: its Framework Preset was empty, so the first build failed with "No Output Directory named public". Set to Next.js. Added `NEXT_PUBLIC_APP_URL` for the live site. Rebuilt from `main`.
- [DEPLOY.md](../setup/DEPLOY.md): two new entries under "When a deploy fails".

**What was rejected:**
- Creating the tables through the Supabase connector. Drizzle would not know they exist, and the next `npm run db:migrate` would fail trying to create them again. The tables wait for `DATABASE_URL`, then `npm run db:migrate` creates them the normal way.
- Copying the database password into Vercel for Troy. A person adds secrets; an agent does not handle them (firm rule 3).

**Checked:** The rebuild from `main` finished. https://ianapp.vercel.app answers, and its `/api/health` reports the app as ok and the database as "not-configured". Sign-in and checkout were not clicked through on the live site. Supabase project `troygrossi's Project` exists, is healthy, and has no tables.

**Docs updated:** DEPLOY.md, this log, the backlog.

**Handoff:** Three things need a person, in this order. (1) Put the Supabase connection address in `.env.local` as `DATABASE_URL` (HELP.md section 5), then `npm run db:migrate`. (2) Add the same `DATABASE_URL` in Vercel under Settings → Environment Variables. (3) In Vercel, check that the production branch is `main` (Settings → Environments → Production). The first, failed build was made from `develop`, so it may be set to `develop`. The live site is https://ianapp.vercel.app and is open to anyone; Vercel's other addresses for it ask for a Vercel login.

## 2026-10-05 — Publish, Deploy, one working branch, and double-click files

**Summary:** Work now moves with three commands: `npm run sync`, `npm run publish` and `npm run deploy`. Everyone stays on `develop`; `main` follows the last deploy without being checked out. Everyday commands can be double-clicked instead of typed. The documents use one word per action.

**Why:** Troy asked for a workflow a beginner can follow without learning git or the terminal, with fixed words: Publish (save to GitHub) and Deploy (deploy to Vercel).

**What changed:**
- New commands in `scripts/`: `sync.mjs`, `publish.mjs`, `deploy.mjs`, sharing `scripts/lib/git.mjs`.
- Six double-click files at the top of the project: `Start App.cmd`, `Doctor.cmd`, `Sync.cmd`, `Publish.cmd`, `Deploy.cmd`, `Help.cmd`.
- New rule file [WORKFLOW.md](../rules/WORKFLOW.md): the words, the loop, double-click files, the branches, the rules and the good habits.
- `CLAUDE.md`: a workflow section, a table of words to say and not say, and firm rules 9, 10 and 11.
- `HELP.md`: sections 1, 2 and 8 rewritten, a double-click column in the Commands table, and section 9 is now "Good habits". The setup guide [DEPLOY.md](../setup/DEPLOY.md) was rewritten around the two commands.
- `npm run check:docs` now also fails when a living document says "push", uses Publish or Deploy without its descriptor, when git ignores `CLAUDE.md`, `AGENTS.md`, `HELP.md` or `.env.example`, or when a double-click file is missing or not in HELP.md.
- The doctor's Git check: red when not on `develop`, and it reports what is waiting to be published or deployed.
- The repository now starts on `develop`.

**What was rejected:**
- Moving `main` on every publish, and a branch per feature: see [decision 04](../decisions/04-publish-and-deploy.md).
- Real `.exe` programs for the double-click files. Troy asked for "exe files"; `.cmd` files were used instead because they double-click the same way, are readable text, need no build step, and are not blocked the way an unsigned `.exe` is. The reasoning is in WORKFLOW.md. Say so if real `.exe` files are wanted.
- Double-click files for the database commands. They are rare and can change data, so they stay in the terminal.

**Checked:**
- `npm run check` passes.
- Sync, Publish and Deploy were run end to end in a throwaway copy against a stand-in for GitHub (a second git folder on this computer): the first publish creates `main`; a later publish leaves `main` alone; deploy moves `main` up to `develop` on GitHub and on the computer; a second deploy says "Already deployed"; sync brings in a teammate's change; the copy never left `develop`. Publish refused on the wrong branch, with no GitHub address, and when a secrets file was about to be included.
- `Doctor.cmd`, `Help.cmd`, `Publish.cmd` and `Deploy.cmd` were run from a command window with typed input fed in.
- **Not checked:** the real GitHub and Vercel; neither is connected yet. `Start App.cmd` was not run, and no file was started by an actual double-click in File Explorer.

**Docs updated:** HELP.md, CLAUDE.md, README.md, the doctor, the docs check, a new rule file, STRUCTURE.md, decision 04, the backlog.

**Handoff:** Nothing has been published; the project has no saved version yet. Connect GitHub and Vercel with [DEPLOY.md](../setup/DEPLOY.md). `isProtectedPath()` in `src/lib/auth/config.ts` is still to be written.

## 2026-10-05 — The starter

**Summary:** The app runs. A visitor can go from the home page through sign-up, pricing and a simulated payment to a dashboard, and the Notes page saves to a database once one is connected.

**Why:** To have a sound structure in place before any product design, and to make the project easy to work in for someone new to coding.

**What changed:**
- Next.js 16 project with TypeScript and Tailwind.
- Pages in three groups: public `(marketing)`, sign-in `(auth)`, and signed-in `(app)`. Plus a stand-in `/checkout`.
- A database layer (Drizzle, two tables, first migration) and one complete example feature, Notes, that shows the data path end to end.
- One error type and one response shape for every API route.
- Placeholder login (a cookie) and placeholder payments (a cookie), each behind a small set of functions so the real service can replace the inside later.
- `npm run doctor`, `npm run help` and `npm run check`.
- Documents: `CLAUDE.md`, `HELP.md`, nine rule files, three decisions, this log and a backlog.

**What was rejected:**
- SQLite and Railway: see [decision 01](../decisions/01-stack.md).
- Connecting real login and Stripe now: see [decision 02](../decisions/02-placeholder-login-and-payments.md).
- A separate file per work entry, generated indexes, and branch tooling, as used in larger projects. One log file is enough for one or two people. Split it by year if it grows long.
- A test framework. Nothing here has logic worth a test yet. Add one with the first real business rule.

**Checked:**
- `npm run check` and `npm run build` pass.
- `npm run doctor` (plain, `--fix`, `--quiet`) and `npm run help` (list, by number, by word, no match) behave as described.
- Clicked through in a browser: a signed-out visit to the dashboard goes to sign-in; sign in; dashboard; billing; upgrade; simulated payment; billing shows Pro. The dashboard fits a 375px phone screen with no sideways scrolling.
- API answers: signed-out gets 401, an empty note title gets 400 with its message, no database gets 503, `/api/health` reports "not-configured".
- **Not checked:** anything against a real database. No Supabase project exists yet, so `npm run db:migrate`, saving a note, and the doctor's connection check have not been run for real. Deploying has not been tried.

**Docs updated:** All of them were created in this change.

**Handoff:** `isProtectedPath()` in `src/lib/auth/config.ts` is left for a person to write (marked `TODO(human)`); until then the layout gate still protects the dashboard, but sign-in does not return you to the page you asked for. Then start with the **Next** list in the [backlog](BACKLOG.md): connect Supabase, then deploy. The three decisions were proposed by Claude while building the starter; Troy and Ian should read them and replace any they disagree with.
