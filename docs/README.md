# Documents

Four folders. Each answers one question and is kept in its own way.

| Folder | The question it answers | How it is kept |
| --- | --- | --- |
| [rules/](rules/) | How do we write code here? | **Source of truth.** Present tense. Rewritten in place when the rule changes. |
| [decisions/](decisions/README.md) | Why did we choose this? | **Ledger.** Numbered. Never rewritten; a new decision replaces an old one. |
| [work/](work/LOG.md) | What was done, and what is left? | The **log** is a ledger: add to the top, never rewrite. The **backlog** is a working list: delete lines when done. |
| [setup/](setup/DEPLOY.md) | How do I get it running or online? | **Source of truth.** Rewritten in place. |

Day-to-day commands are in [HELP.md](../HELP.md) at the top of the project.

## The rules

| File | Covers |
| --- | --- |
| [WORKFLOW.md](rules/WORKFLOW.md) | Sync, Publish (save to GitHub), Deploy (deploy to Vercel), branches, and good habits |
| [STRUCTURE.md](rules/STRUCTURE.md) | Where files go and how they are named |
| [DATA_FLOW.md](rules/DATA_FLOW.md) | How data travels between the screen and the database |
| [TYPES.md](rules/TYPES.md) | How we describe the shape of data |
| [ERRORS.md](rules/ERRORS.md) | What happens when something fails |
| [UI.md](rules/UI.md) | Colors, wording, and the four states of every screen |
| [NAVIGATION.md](rules/NAVIGATION.md) | Addresses, menus and links |
| [AUTH.md](rules/AUTH.md) | Who can see what, and how login will be connected |
| [DATABASE.md](rules/DATABASE.md) | Tables and migrations |
| [PAYMENTS.md](rules/PAYMENTS.md) | Plans, checkout, and how Stripe will be connected |

Every rules file ends with **Known gaps**: the places where the code does not yet follow the rule. An honest gap is better than a rule nobody believes.

## Which one am I writing?

| Situation | Where it goes |
| --- | --- |
| An idea, or something to fix later | One line in [work/BACKLOG.md](work/BACKLOG.md) |
| I finished a piece of work | An entry at the top of [work/LOG.md](work/LOG.md) |
| I chose between real options, and someone might later be tempted to undo it | A new file in [decisions/](decisions/README.md) |
| I tried something and dropped it | "What was rejected" in the log entry |
| From now on we always do it this way | The matching file in [rules/](rules/) |
| A change to how work is published or deployed | [rules/WORKFLOW.md](rules/WORKFLOW.md) and a decision |
| A new command, setting or service | [HELP.md](../HELP.md), `.env.example` and `scripts/doctor.mjs` |

## Citing documents from code

A code comment may point at a rule by its full path from the top of the project, for example `docs/rules/ERRORS.md`. `npm run check:docs` fails when a cited file does not exist, so the pointers stay true.
