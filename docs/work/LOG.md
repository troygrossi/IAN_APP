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
