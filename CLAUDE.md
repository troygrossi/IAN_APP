# Working in this project

This is a starter web app: Next.js, Postgres on Supabase, hosted on Vercel. Sign-in is real (email and password, `docs/rules/AUTH.md`); payments are a placeholder. The person you are working with may be new to coding.

## Start of a session

1. Run `npm run sync` (get the latest from GitHub), then `npm run doctor`. Fix or report anything red before other work.
2. Read the newest entry in `docs/work/LOG.md`, especially **Handoff** and **What was rejected**.
3. Read the rule file for the area you are about to touch. The list is in `docs/README.md`. Read on demand; do not load them all.

## The workflow

Full version: `docs/rules/WORKFLOW.md`.

```
npm run sync                        Sync (get the latest from GitHub)
  work on develop, look at it with npm run dev
  write the entry in docs/work/LOG.md
npm run publish -- "what changed"   Publish (save to GitHub)
npm run deploy                      Deploy (deploy to Vercel)
```

- **You are always on `develop`.** Never check out `main`, never commit to it, never send to it directly. `npm run deploy` is the only thing that moves `main`, and it does so without leaving `develop`.
- **Publish and Deploy are different steps.** Publish often. Deploy only when the person asks for it or agrees to it.
- **Use the commands, not raw git, to move work.** Looking (`git status`, `git diff`, `git log`) is fine.
- **The person double-clicks; you type.** Each everyday command has a `.cmd` file at the top of the project (`Start App.cmd`, `Doctor.cmd`, `Sync.cmd`, `Publish.cmd`, `Deploy.cmd`, `Help.cmd`). When you tell the person what to do next, name the file to double-click first and the terminal command second.

## The words we use

Say these, with the descriptor the first time in a message or document. The person learned these words; other words for the same thing will confuse them.

| Say | Not |
| --- | --- |
| **Sync (get the latest from GitHub)** | pull, fetch, update |
| **Publish (save to GitHub)** | push, upload, ship |
| **Deploy (deploy to Vercel)** | release, go live, ship, push to production |
| **the live site** | production, prod |
| **a version** | a commit (explain it once if you must use it) |

## The firm rules

Short on purpose. Everything not on this list is a default you may depart from, out loud, with a reason.

1. **Data follows one path:** component → hook → `api()` → API route → service → database. Only `src/lib/services/` touches the database. (`docs/rules/DATA_FLOW.md`)
2. **Every API route** checks the session when the data is private, parses its input with a zod contract, and answers with `ok()` or `fail()`. (`docs/rules/ERRORS.md`)
3. **Secrets never leave `.env.local`.** Never publish it, print it, or quote a value from it. Every variable the code reads has a line in `.env.example`.
4. **The database changes only through migrations.** Never edit or delete one that has been applied. (`docs/rules/DATABASE.md`)
5. **Keep the four living documents true, in the same change as the work:**
   - **Work:** finished a piece of work → add an entry to the top of `docs/work/LOG.md`. Spotted something for later → one line in `docs/work/BACKLOG.md`.
   - **Decisions:** chose between real options that someone might later undo → a new numbered file in `docs/decisions/`.
   - **Help:** added or changed a command, a setup step, or where something lives → update `HELP.md`.
   - **Doctor:** the app now depends on a new tool, setting or service → add a check to `scripts/doctor.mjs`. Every red line must name the command that fixes it. If a newcomer must install or sign up for it, also add a step to `ONBOARDING.md` and point the check at it.
6. **A changed rule changes its document.** When the way code is written here changes, edit the file in `docs/rules/` in the same change, and list what does not yet comply under **Known gaps**.
7. **Work is not done until `npm run check` passes.** If it cannot pass, say so and say why. Do not call it done.
8. **A placeholder says it is a placeholder,** on screen (`PlaceholderNotice`) and in the code (a `PLACEHOLDER` comment). Never present simulated payment as real.
9. **Do not weaken sign-in to make something work.** Passwords and session secrets are never stored, logged or sent back; private data is always filtered by the user's id. If a rule in `docs/rules/AUTH.md` is in the way, stop and ask.
10. **Stay on `develop`, and never rewrite published history.** No force, no hard reset of published versions, no switching branches. (`docs/rules/WORKFLOW.md`)
11. **An everyday command gets a double-click file.** Add a new one as a `.cmd` file at the top of the project that only starts its `npm run` command, with a row in `HELP.md` and `docs/rules/WORKFLOW.md`. They are `.cmd` files on purpose, not `.exe`. (`docs/rules/WORKFLOW.md`, "Double-click files")
12. **Use the project's words.** See the table above. `npm run check:docs` enforces them in the documents; you enforce them in what you say.

## When the user and this file disagree

The user wins. Do not argue a rule for several turns, and do not quietly ignore it either. Name the rule you are thinking of, do what was asked, and offer to change this file so the next session agrees. A one-off exception goes in the log entry. The same exception twice means the rule is wrong: offer the change again.

## How to talk to the person you are working with

- **Plain English first.** Lead with what happened or what you need. Explain a technical word the first time you use it, or point to the list in `HELP.md` section 10.
- **One decision at a time.** Give the options, your recommendation, and what each one costs.
- **Give the next command.** End with what to run or open to see the result.
- **Say what you did not check.** "It compiles, but I have not clicked through it" is a useful sentence.
- **Teach a little.** When you use a pattern from `docs/rules/`, say which one and why in a sentence.
- **Say where the work is.** End a piece of work by stating which of these is true: only on this computer, published (saved to GitHub), or deployed (on the live site).

## Habits that pay off

- Read the neighbouring code and copy its shape. Notes is the reference feature.
- Check the Next.js docs in `node_modules/next/dist/docs/` before using an API from memory. This version differs from older ones (see below).
- Prefer the small change. Say so when a request is heading toward more machinery than the project needs.
- Comment the why, not the what. Cite a rule by full path: `docs/rules/AUTH.md`.
- Publish only when asked, or offer it when a piece of work is finished. Never deploy without a yes.
- Open the page you changed before calling it done. The good habits for people in `docs/rules/WORKFLOW.md` apply to you too.

## Commands

```
npm run sync          Sync (get the latest from GitHub)
npm run doctor        is this computer ready? (-- --fix to repair)
npm run help          the map of the project  (-- 5 for one section)
npm run dev           start the app at http://localhost:3000
npm run check         lint + typecheck + check:docs; run before saying "done"
npm run publish       Publish (save to GitHub); add -- "what changed"
npm run deploy        Deploy (deploy to Vercel)
npm run db:generate   write a migration after editing src/lib/db/schema.ts
npm run db:migrate    apply migrations
```

## Changing this file

Ask before editing this file. Keep it short: do not write down what can be learned by reading the code. This file is part of the project and is published with it; personal notes go in `CLAUDE.local.md`, which stays on your computer.

@AGENTS.md
