# Workflow

How work moves from your computer to the live site, and the words we use for it.

## The words we use

One word per action. Use these words, with their descriptor the first time in any document, message or screen. Do not use other words for the same thing.

| Say | It means | The command |
| --- | --- | --- |
| **Sync (get the latest from GitHub)** | Bring down anything on GitHub that this computer does not have | `npm run sync` |
| **Publish (save to GitHub)** | Save your work as a new version and send it to GitHub. The live site does not change | `npm run publish -- "what changed"` |
| **Deploy (deploy to Vercel)** | Make the live site match what you last published | `npm run deploy` |

Words we do not use for these: "push", "ship", "release", "go live", "upload". `npm run check:docs` fails when a living document says "push" or uses Publish or Deploy without its descriptor.

Publish and Deploy are separate on purpose. You can Publish (save to GitHub) many times a day without touching the live site, and Deploy (deploy to Vercel) only when the work is ready for visitors.

## The loop

```
start of session     npm run sync       get the latest from GitHub
                     npm run doctor     green means go
work                 npm run dev        build and look at http://localhost:3000
a piece is finished  write the log entry in docs/work/LOG.md
                     npm run publish -- "what changed"     save to GitHub
ready for visitors   npm run deploy                        deploy to Vercel
```

## Double-click files

Everyday commands do not need a terminal. Each has a file at the top of the project folder that you double-click in File Explorer.

| Double-click | It runs | Use it to |
| --- | --- | --- |
| `Start App.cmd` | `npm run dev` | Start the app and open it in your browser |
| `Doctor.cmd` | `npm run doctor -- --fix` | Check this computer and repair what can be repaired |
| `Sync.cmd` | `npm run sync` | Sync (get the latest from GitHub) |
| `Publish.cmd` | `npm run publish` | Publish (save to GitHub). It asks what changed |
| `Deploy.cmd` | `npm run deploy` | Deploy (deploy to Vercel). It asks you to type yes first |
| `Help.cmd` | `npm run help` | Read the help |

**A command a person runs often gets a double-click file.** When you add an everyday command, add its `.cmd` file, a row here and a row in [HELP.md](../../HELP.md), in the same change. Rare or risky commands, like the database ones, stay in the terminal on purpose, so they are run deliberately.

**A double-click file only starts its npm command.** The logic lives in `scripts/`, so the double-click file and the terminal command can never behave differently.

**Every double-click file ends by waiting for a key,** so the window stays open and the result can be read.

**They are `.cmd` files, not `.exe` programs.** Windows runs both on a double-click. A `.cmd` file is a few lines of readable text that is published with the project. An `.exe` would have to be rebuilt after every change, cannot be read, and is often blocked by Windows security when it arrives from the internet. These files work on Windows only; on a Mac, use the terminal commands.

## Branches

A **branch** is a line of versions. This project has two, and you only ever stand on one.

| Branch | What it is | Who moves it |
| --- | --- | --- |
| `develop` | Where all work happens. You and your coding agents are always on it. | `npm run publish` |
| `main` | What the live site is built from. Always equal to the last deploy. | `npm run deploy`, and nothing else |

**Nobody checks out `main`.** Not you, not an agent. The commands keep it up to date on GitHub and on your computer without ever leaving `develop`. If `npm run doctor` says you are on another branch, it prints the command to get back.

**`main` only moves forward to where `develop` already is.** So the live site can never contain something that was not published first.

## Rules

**Use the three commands, not raw git, to move work.** They check the code, refuse to publish secrets, and stop with a next step when something is wrong. An agent may run `git status`, `git diff` and `git log` to look, and may save a version with `git commit` when asked, but sends work with `npm run publish`.

**Never work on `main`, never switch to it, never send to it directly.** Only `npm run deploy` moves it.

**Never rewrite published history.** No `git push --force`, no `git reset --hard` on published versions, no rebase of versions that are on GitHub. Fix a mistake with a new version.

**Never skip the check.** `npm run publish` runs `npm run check` first. If it fails, fix the cause; do not work around it.

**The log entry comes before the publish** ([LOG.md](../work/LOG.md)).

**Deploy only what you have looked at.** Run it and click through it with `npm run dev` before you Deploy (deploy to Vercel).

**A database change is deployed in two parts.** The migration is applied with `npm run db:migrate`, and the code with `npm run deploy`. Apply the migration first ([DATABASE.md](DATABASE.md)).

## Good habits

These are defaults, not laws. They are what keeps a project easy to work in.

- **Small and often.** Publish after each piece that works. A small version is easy to understand and easy to undo.
- **One thing at a time.** Finish and publish one change before starting the next. Ask your agent for one thing per request.
- **Describe the change in plain words.** "Add a phone number to the sign-up form", not "updates".
- **Look before you publish.** Open the page you changed. A check that passes proves the code fits together, not that the screen is right.
- **Ask why.** When an agent does something you do not understand, ask it to explain. That is how the project stays yours.
- **Write it down the same day.** A decision goes in [decisions](../decisions/README.md), an idea in the [backlog](../work/BACKLOG.md).
- **Secrets stay in `.env.local`.** Never paste one into a chat, a screenshot, or a document.
- **Do not edit files on the GitHub website.** Change them on your computer, so the two never disagree.
- **When stuck for more than a few minutes, stop and ask.** Paste the whole error and say what you did just before it.
- **Double-click before you type.** If a double-click file exists for the job, use it. It is the same command with fewer ways to mistype.
- **Leave it running.** End a session with the app working and `npm run check` passing, even if the feature is half built.

## What the commands do underneath

For the curious, and for agents. You do not need to type these.

| Command | Git underneath |
| --- | --- |
| `npm run sync` | `git pull --rebase origin develop`, then `git fetch origin main:main` |
| `npm run publish` | `npm run check`, `git add --all`, `git commit`, `git pull --rebase origin develop`, `git push origin develop` |
| `npm run deploy` | `git push origin develop:main`, then `git fetch origin main:main` |

`git fetch origin main:main` is what updates your computer's copy of `main` without checking it out. Vercel watches `main` on GitHub and rebuilds the live site when it moves. Vercel also builds a private preview address for each publish to `develop`.

## Known gaps

- The three commands have been run against error cases only (wrong branch, no GitHub address). The full path to GitHub and Vercel has not been run, because neither is connected yet.
- Nothing on GitHub stops a direct change to `main`. A branch protection rule would; add one if more people join.
