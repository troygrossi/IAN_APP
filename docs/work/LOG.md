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

## 2026-10-05 — Blended cost per stock on the Trades tab

**Summary:** The Trades tab now shows a blended cost card for each Core Four stock above the trade list: shares held, the average strike paid, the cost after this cycle's premium, and today's price. At Oct 5 prices that is MARA $13.00 → $12.42, RGTI $16.00 → $15.35, CIFR $17.10 → $16.46. IONQ shows no shares held.

**Why:** Ian asked for a blended cost per stock in the trade history.

**What changed:** `blendedCosts()` and `BlendedCost` in `src/lib/wheel/ledger.ts`. A "Blended cost per stock" section and a note in "How each trade's P/L is counted" on `src/app/(app)/dashboard/trades/page.tsx`.

**What was rejected:** Taking off every premium ever collected on the ticker. That would credit MARA's open Oct 16 puts against shares those puts did not buy ($10.68 instead of $12.42). Open puts are left out, and premium from before the stock last had no shares is left out too. Not showing "after premium" at all: Ian's tracker already uses that number.

**Checked:** `npm run check` passes. Looked at the page in a preview at phone and desktop width. The numbers match the tracker.

**Docs updated:** this log.

**Handoff:** If Ian wants only one of the two costs, drop the other column in `BlendedCostCard`.

## 2026-10-05 — Trade history replaces the P/L tab

**Summary:** The tab added an hour earlier is now **Trades** (`/dashboard/trades`): every option sold since Oct 1, newest first, each with its own P/L and what became of it (open, expired, assigned, called away), plus totals. The per-stock P/L page is gone.

**Why:** Ian preferred P/L on each trade to P/L per stock.

**What changed:** `tradeHistory()` in `src/lib/wheel/ledger.ts`: an assigned put carries the result of the shares it bought (held ones at today's price, called-away ones at their sale price, first in first out), so the rows add up to the same total as the positions. `/dashboard/pnl` removed; menu and tab bar say "Trades". NAVIGATION.md updated.

**What was rejected:** Keeping both tabs: two ways to read one number, and a sixth tab is too many for a phone.

**Checked:** `npm run check` passes. Opened at phone and desktop width on a test copy. The rows add up to the same −$570 at Oct 5 prices: MARA $13 puts −$500, RGTI −$60, CIFR $17.50 −$244, CIFR $17 −$736, MARA $11.50 +$513, IONQ +$272, MARA $10.50 +$185.

**Docs updated:** NAVIGATION.md, STRUCTURE.md.

**Handoff:** none

## 2026-10-05 — A P/L tab, and a trade record that starts Oct 1

**Summary:** A new P/L tab shows each Core Four stock's profit or loss with its premium included, and a total. Positions, alerts and P/L now all come from one list of trades, which starts on Oct 1, 2026.

**Why:** Ian asked for P/L per stock including premium. His tracker's history before October did not add up (MARA's August premium, and 600 shares called away against 500 bought), so he chose to start the app's record with the October trades.

**What changed:**
- `src/lib/wheel/ledger.ts`: the trade types, and functions that work out a position (phase, shares, open options, premium, realized and unrealized gain, P/L) and the alerts from a list of trades. The same functions will serve real trade entry later.
- `src/lib/wheel/sample-data.ts`: the trades from Oct 1, plus the five puts sold in September that were still open that day (carried in with their premium). Positions and alerts are worked out from them, so they can no longer disagree.
- `/dashboard/pnl` with a tab in the menu and the phone tab bar. The dashboard's premium total is now since Oct 1 ($2,037).
- How P/L is counted: shares at the strike actually paid, every premium on its own, open options at the premium collected. Explained on the page.

**What was rejected:** Using the tracker's "effective" share prices: they already include the put premium, which would then be counted twice. Fixing the pre-October history: Ian chose a clean start instead.

**Checked:** `npm run check` passes. Opened at phone and desktop width on a test copy. Figures checked by hand: MARA +$198 (premium $930, shares −$732), RGTI −$60, IONQ +$272, CIFR −$980, total −$570 at Oct 5 prices.

**Docs updated:** NAVIGATION.md, STRUCTURE.md.

**Handoff:** Trade entry can now save `Trade` rows and hand them to the same functions.

## 2026-10-05 — Core Four positions as of Oct 5

**Summary:** The dashboard and Alerts show The Harvester's positions as of Oct 5, 2026: the Oct 2 assignments (400 MARA, 300 RGTI, 1,000 CIFR), the first IONQ trade, and a third MARA put leg. Cards now show shares held and the premium collected in 2026.

**Why:** Ian asked for the app to show today's Core Four trades.

**What changed:**
- `src/lib/wheel/sample-data.ts`: copied from the Roth Wheel Tracker as last updated on Oct 5, 2026, with that day's prices. Positions gained `shares` and `next`; "premium this cycle" became "premium in 2026" ($2,764 in all), which is the number the tracker keeps. Five new alerts, and one that was missing (2 CIFR $17.50 puts, Sep 21).
- `position-card.tsx`: shows shares held, uses the gold badge for "Assigned", and says what The Harvester is waiting to do next.

**What was rejected:** Showing MARA as "Selling puts". It holds 400 assigned shares, so it is at "Assigned", and its open puts are listed under it.

**Checked:** `npm run check` passes. Dashboard and Alerts opened at phone and desktop width on a test copy; nothing scrolls sideways. Totals match the tracker: $2,764 premium, 16 open contracts.

**Docs updated:** none needed.

**Handoff:** This is still a copy by hand. Trade entry (backlog) is what makes it update itself.

## 2026-10-05 — Row Level Security on every table

**Summary:** `users`, `sessions` and `notes` have Row Level Security on, so Supabase's public web API can no longer read or change them, even with the project's public key. The app is unaffected.

**Why:** Supabase flagged the three tables as exposed. The app never uses that public route, but the door was open.

**What changed:** `.enableRLS()` on the three tables in `src/lib/db/schema.ts`, and the generated migration `drizzle/0001_row_level_security.sql` (three `ENABLE ROW LEVEL SECURITY` lines, nothing dropped). DATABASE.md: new rule, the old known gap removed. `package-lock.json` also carries the small correction Ian's Mac made on its first `npm install` (the project's name inside it).

**What was rejected:** Policies. With none, only the table owner gets in, which is exactly the app. Policies are needed only if the browser talks to Supabase directly. Also rejected: switching it on by hand in Supabase, which would skip the migration and leave Ian's local database without it.

**Checked:** `npm run check` passes. On a test database: after the migration the owner still read its rows, and a separate role with read permission saw none. On Supabase: the tables are owned by `postgres`, the role the app connects as. The live check after this deploy confirms the site still reaches its database.

**Docs updated:** DATABASE.md, backlog.

**Handoff:** A new table needs `.enableRLS()` too; the rule says so.

## 2026-10-05 — Follow-up: the live site reaches its database

**Summary:** https://harvest-the-wheel.vercel.app is up with its Supabase database connected, and the deploy pipeline's three jobs all pass. The tables `users`, `sessions` and `notes` exist in Supabase.

**Why:** The first deploys said "password authentication failed".

**What changed:** Nothing in the code. Ian reset the Supabase database password and saved it in GitHub and in Vercel; Vercel needed a rebuild to pick it up. Also: Vercel's Framework Preset was "Other", which made the first build fail with "No Output Directory named public" (DEPLOY.md, "When a deploy fails", item 5); it is now Next.js.

**What was rejected:** none

**Checked:** `/api/health` on the live site says the database is connected; GitHub's "Update the live database" and "Confirm the live site" jobs pass; Supabase lists the three tables. **Not checked:** signing up on the live site; Ian does that with his own account.

**Docs updated:** backlog (Row Level Security).

**Handoff:** Supabase warns that Row Level Security is off on all three tables. The app is not exposed (it never uses Supabase's public key), but a migration that turns it on is the safe default; it waits for Ian's yes.

## 2026-10-05 — Ian's and Troy's repositories stay in sync

**Summary:** Sync and Publish now keep `develop` the same in Ian's repository and Troy's. Sync brings in Troy's work; Publish brings it in, then sends to both. Deploy still only moves Ian's live site.

**Why:** Ian's interface work had not reached Troy's copy. Ian asked for a rule that keeps the two synced, and for his work to go to Troy's copy too.

**What changed:**
- `scripts/lib/git.mjs`: `mergePartnerWorkBranch()` (a merge, never a rebase) and `sendWorkBranchToPartner()` (never stops a publish). `npm run sync` and `npm run publish` call them.
- `upstream` on Ian's computer can now be sent to (it was read-only).
- Decision 10 replaces decision 07. WORKFLOW.md has the rule; HELP.md says what the two addresses are.

**What was rejected:** A fork with pull requests, and syncing `main` (decision 10).

**Checked:** `npm run check` passes. Sync and Publish were run against two practice copies on a test computer: Sync merged a change made in the "Troy" copy, and Publish sent the result to both copies, which then matched. **Not checked:** sending to Troy's real repository: Ian's GitHub account can only read it today.

**Docs updated:** HELP.md, WORKFLOW.md, decisions 07 (marked replaced) and 10, backlog.

**Handoff:** Troy adds Harvestthewheel as a collaborator on troygrossi/IAN_APP. The next Publish then sends Ian's work there. Troy's repository is public: anything sent to it can be read by anyone.

## 2026-10-05 — Brought in Troy's sign-in hardening

**Summary:** Troy's "Sign-in security" version from `upstream` is now in Ian's project, and the four new Harvest the Wheel pages follow its new rule.

**Why:** Ian asked to bring in Troy's latest changes ([decision 07](../decisions/07-own-repository-with-upstream.md)).

**What changed:**
- Merged `upstream/develop` (84745fb): protective headers in `next.config.ts`, a stricter `safeNextPath()`, a stricter Origin check in `src/proxy.ts`, and `requirePageSession()`.
- Two conflicts: `src/app/(app)/dashboard/page.tsx` kept the Harvest the Wheel dashboard; this log kept both sets of entries.
- Troy's rule says every page in `(app)` starts with `await requirePageSession()` (`docs/rules/AUTH.md`). The dashboard, Alerts, DRIP and Learn pages now do.

**What was rejected:** none

**Checked:** `npm run check` passes after the merge.

**Docs updated:** none needed; Troy's change carried its own.

**Handoff:** The live database still refuses the password saved in Vercel and GitHub ("First deploy to Ian's live site", below). Deploy once both hold the right one.

## 2026-10-05 — First deploy to Ian's live site

**Summary:** The project points at Ian's live site, https://harvest-the-wheel.vercel.app, which uses his Supabase project (free plan). This version is the first one sent to his GitHub and deployed from it.

**Why:** Ian set up Supabase and Vercel and asked to confirm the live site reaches its database.

**What changed:**
- `homepage` in `package.json` is Ian's site, so the doctor, the deploy check and the daily keep-awake job ask his site, not Troy's.
- Set up outside the code, by Ian and Claude together: Vercel project `harvest-the-wheel` (team harvester1) with `DATABASE_URL` and `NEXT_PUBLIC_APP_URL` for Production; GitHub secret `DATABASE_URL`; both hold the Supabase pooler addresses, and Ian typed the password himself.
- This project's git settings now sign new versions as Harvestthewheel. Vercel's free plan refuses to build a version whose author is not the account owner; the last version on GitHub was Troy's, so the first build was blocked.

**What was rejected:** Pasting the database password into the chat or a file. Ian entered it in Vercel and GitHub himself.

**Checked:** `npm run check` passes. Whether the live site and the migrations reach Supabase is confirmed by this deploy's pipeline run (see the next entry if it failed).

**Docs updated:** backlog.

**Handoff:** Ian installs Postgres.app so the app runs on his Mac too (backlog, "Needs Ian").

## 2026-10-05 — The live site gets Supabase's free plan; this computer keeps its own database

**Summary:** The project is ready for a live site on Supabase's free plan while Ian keeps building against Postgres.app on his Mac. The two databases never share data, and a daily job keeps the free plan from pausing.

**Why:** Ian found Supabase's free plan and wants the deployed app connected now, with local Postgres for development.

**What changed:**
- `.github/workflows/keep-awake.yml`: once a day, asks the live site's `/api/health` (one database query), so Supabase never pauses the project. It also has a "Run workflow" button.
- HELP.md section 5: two databases, and the Supabase part now says which address goes where (Transaction pooler to Vercel, Session pooler to GitHub) and to keep both out of `.env.local`.
- DEPLOY.md: the same, plus "The free Supabase plan" (pausing, no backups, 500 MB). WORKFLOW.md: the daily job in "What GitHub checks", Ian's Actions link. DATABASE.md: the old "one database for both" gap is gone; the free plan is the new one.
- The doctor's Accounts line now says Supabase holds the live site's database, not this computer's.
- Decision 09, backlog.

**What was rejected:** One Supabase database for both computer and live site; Supabase Pro now; no keep-awake job (decision 09). Setting up the Supabase, Vercel and GitHub accounts from here: they need Ian's own sign-in and passwords.

**Checked:** `npm run check` passes. The keep-awake workflow has not run; it needs to be on `main` and needs `homepage` to be Ian's live site. Nothing was connected to Supabase or Vercel yet.

**Docs updated:** HELP.md, DEPLOY.md, WORKFLOW.md, DATABASE.md, the doctor, decision 09, backlog.

**Handoff:** Ian does the four "Needs Ian" account steps in the backlog, then sends the live site's address. Then: set `homepage`, Publish (save to GitHub), Deploy (deploy to Vercel). The deploy creates the tables in Supabase and checks the live site's database.

## 2026-10-05 — A database on Ian's own computer

**Summary:** The app can run against Postgres on Ian's Mac (Postgres.app), so sign-in works without a Supabase account. The doctor now creates that database and its tables, and says plainly when Postgres is not running.

**Why:** Ian wants to test the app now and set up Supabase later, when the app is further along.

**What changed:**
- `scripts/doctor.mjs`: knows a `localhost` database from Supabase. With `--fix` it creates the database if missing and runs `npm run db:migrate` if the tables are missing. New red lines: "Postgres is not running on this computer" and "the app's database does not exist yet", each with its fix. The Accounts check says Supabase is not used yet instead of claiming it answers.
- Ian's `.env.local` was created, with `DATABASE_URL` pointing at `harvest_the_wheel` on his Mac. It holds no secret (Postgres.app needs no password on the same computer) and is never published.
- HELP.md section 5 now has "On your own computer" and "On Supabase". ONBOARDING.md step 11 points at the first. DATABASE.md, decision 08, backlog.

**What was rejected:** Homebrew, Docker and an in-app database (decision 08). Installing Postgres.app for Ian from here: Claude cannot type into Terminal on his Mac, and installing an app is a step he should see.

**Checked:** On a test copy with Postgres 16 set up like Postgres.app (no password, the Mac user name): `npm run doctor` reported the missing database; `npm run doctor -- --fix` created it and the tables; an account was created through `/signup` and landed on `/dashboard`, and its row was in `users`; signed out, `/dashboard` sends to `/login`; with Postgres stopped, the doctor said "Postgres is not running". `npm run check` passes. **Not checked:** Postgres.app itself on Ian's Mac.

**Docs updated:** HELP.md, ONBOARDING.md, DATABASE.md, the doctor, decision 08, backlog.

**Handoff:** Ian installs Postgres.app, presses Initialize, then double-clicks `Doctor.command` and `Start App.command`.

## 2026-10-05 — Harvest the Wheel: own repository, brand, and the four app screens

**Summary:** The app is now Harvest the Wheel, in Ian's GitHub. After sign-in there is a dashboard that explains what the app is and shows the Core Four positions, plus Alerts, DRIP and Learn pages, all in the new brand and usable on a phone.

**Why:** Ian took the app over from Troy and wanted the product he had designed in a mockup (positions, alerts, DRIP, the wheel explained) as real pages, with a brand of its own.

**What changed:**
- **GitHub:** `origin` is now Harvestthewheel/Harvest-The-Wheel, with `develop` and `main` sent there. Troy's repository is `upstream`, read-only ([decision 07](../decisions/07-own-repository-with-upstream.md)). This one-time setup used git directly, not `npm run publish`, because there was no `origin` to publish to yet.
- **Brand:** new colors in `src/app/globals.css` (cream, field green, wheat gold, with dark mode), a wagon-wheel mark in `src/components/brand/logo.tsx`, the name Harvest the Wheel everywhere, buttons and inputs at least 44px tall.
- **Navigation:** Dashboard, Alerts, DRIP and Learn in the header, and as a tab bar at the bottom on a phone. Notes, Billing and Settings moved to an account row.
- **Pages:** `/dashboard` rewritten (welcome panel that says what the app is and is not, totals, a card per Core Four ticker with its step in the wheel); new `/dashboard/alerts`, `/dashboard/drip`, `/dashboard/learn`; the home page now describes the product.
- **Data:** PLACEHOLDER sample data from The Harvester's tracker on Sep 30, 2026, in `src/lib/wheel/sample-data.ts`. Every screen that shows it says so.
- New small parts: `Badge` in `src/components/ui/`, `Disclaimer` and `CycleSteps` in `src/components/wheel/`.

**What was rejected:**
- Storing the sample positions in the database now. Trade entry is the real feature; a table for throwaway data would need a migration to undo.
- A separate display font. Geist is already loaded, and a second font is another download on every phone.
- Keeping Troy's repository as `origin` for reading and Ian's for sending: Deploy's checks would compare against the wrong repository.
- On the phone dashboard, the three feature cards in the welcome panel are hidden: the tab bar already links those sections, and they pushed the positions a full screen down.

**Checked:** `npm run check` passes. The pages were opened in a browser at 390px and 1280px wide (home, pricing, dashboard, alerts, DRIP, learn) on a copy of the project with a pretend signed-in user, because there is no database yet; no page scrolls sideways. **Not checked:** signing in for real (needs the database), dark mode in a browser, a real phone, `npm run build`, and any of it on Ian's Mac.

**Docs updated:** HELP.md (where things are, the two GitHub addresses, the Actions link), DEPLOY.md (Actions link), UI.md (brand section, colors, phone layout, known gaps), NAVIGATION.md (three new addresses, the tab bar), STRUCTURE.md (`src/lib/wheel/`), decision 07, backlog.

**Handoff:** Ian's next step is his own Supabase project (backlog, "Needs Ian"), so sign-in works on his computer. Then trade entry, which replaces the sample data.
## 2026-10-05 — Sign-in security check: two holes closed, two hardenings

**Summary:** Sign-in was attacked on purpose, in a browser and from the command line. Most of it held. Two real weaknesses were found and fixed, and two smaller things were tightened.

**Why:** Troy asked for the login to be checked in a browser and made secure.

**What changed:**
- **Fixed: a sign-in link could send someone to another website.** `/login?next=/%09/example.com` passed the old check, because a browser drops the hidden tab and reads what is left as `//example.com`. After a real sign-in the browser landed on example.com. `safeNextPath()` now refuses spaces, control characters and anything a browser would read as another site.
- **Fixed: a private page's output could be fetched without signing in.** With a made-up `session` cookie and an in-app navigation request, the Settings page's content came back, because only the layout checked the session and Next.js runs the page alongside it. Nothing private leaked, since no page loads data without a session yet. Every page inside `(app)` now starts with `requirePageSession()`.
- **Tightened:** a data-changing API request whose `Origin` is `null` or unreadable crashed the proxy (an error page, still refused). It is now refused cleanly with 403.
- **Tightened:** every response carries headers that forbid framing by other sites and type guessing, and no longer names the framework (`next.config.ts`).

**What was rejected:**
- Hiding the "Too many wrong passwords" message so a paused account cannot be told from an unknown email. The owner needs that message; it is listed under Known gaps in [AUTH.md](../rules/AUTH.md).
- A full content security policy. It needs per-request nonces and is a piece of work of its own; in the backlog.

**Checked:** Against a throwaway Postgres on this computer, with two test accounts, before and after the fixes:
- Signed out: private pages go to sign-in; `/api/notes` answers 401; a made-up cookie gets neither.
- Create account, sign in, sign out in the browser. Sign-out deleted the session row. The cookie is invisible to page scripts.
- The database holds a scrypt hash and a session fingerprint, never the password or the cookie's secret. The fingerprint does not work as a cookie. An expired session is refused.
- Account B could not see account A's notes, on the page or through the API. A note cannot be created for another user by sending a `userId`.
- A note containing HTML is shown as text, not run.
- Five wrong passwords paused the account; the right password was then refused for 15 minutes. Unknown email and wrong password give the same message. A too-short password is refused by the server even when the browser's own rule is removed.
- A request from another site is refused (403) with and without a valid session, here and on the live site.
- Twelve "next" addresses that try to leave the site; none does now.
- `npm run check` passes.
- **Not checked:** sign-in on the live site (it has no database yet, and test accounts are only made on this computer); the `Secure` flag on the live cookie (read in the code, not observed); how fast guessing can go from many addresses at once; the server-action path for the `/.//` look-alike (the page path was tested).

**Docs updated:** [AUTH.md](../rules/AUTH.md) (the page rule, the redirect rule, the headers, two known gaps) and the backlog.

**Handoff:** A new private page must start with `await requirePageSession()`. Nothing enforces it yet; the backlog has an item to make the check fail without it. These fixes are on this computer until the next Publish (save to GitHub) and Deploy (deploy to Vercel).

## 2026-10-05 — The project works from a Mac as well as Windows

**Summary:** Someone on a Mac can now follow the onboarding checklist, double-click the everyday commands, and get correct advice from the doctor. Nothing changed for Windows.

**Why:** Ian, who will take the app over, uses a Mac. The double-click files, two doctor messages and the onboarding steps were written for Windows only.

**What changed:**
- Six Mac double-click files beside the Windows ones: `Start App.command`, `Doctor.command`, `Sync.command`, `Publish.command`, `Deploy.command`, `Help.command`. Each does what its `.cmd` twin does.
- `.gitattributes` keeps `.command` files on Unix line endings, and git has them saved as runnable. A Mac needs both.
- **Doctor:** the "Git is not installed" fix names the Mac command; VS Code is found on a Mac by its app, not only by the `code` command; a Mac that cannot reach GitHub is pointed at `gh auth login`; and on a Mac it checks that the double-click files are runnable (`--fix` repairs it).
- `npm run check:docs` now expects every double-click file as a pair, and fails when a `.command` file has Windows line endings or is saved in git without its runnable mark.
- [ONBOARDING.md](../../ONBOARDING.md): "On a Mac" lines in steps 4, 6, 8, 9, 10 and 11, the restart, and the trouble table. No step was renumbered.
- `HELP.md`, `README.md`, [WORKFLOW.md](../rules/WORKFLOW.md) and [STRUCTURE.md](../rules/STRUCTURE.md) name both kinds of file.
- `npm run sync`, `npm run publish`, `npm run deploy` and `npm run help` needed no change: they are Node and git, which behave the same on both.

**What was rejected:**
- One file that works on both. Windows runs `.cmd` and a Mac runs `.command`; nothing double-clicks on both.
- A personal access token, or Git Credential Manager, for signing in to GitHub on a Mac. The GitHub CLI was chosen because it is one installer and one command with a browser sign-in. Say so if Ian already signs in another way.
- A separate onboarding file for Mac. Two files would drift apart; the doctor points at step numbers in one.

**Checked:** On Windows: `npm run check` and `npm run doctor` pass; each `.command` file passes a bash syntax check; `Help.command`, `Doctor.command`, `Sync.command`, and the "no" answer of `Deploy.command` were run under Git Bash with typed input fed in. **Not checked:** anything on a real Mac. No file was double-clicked in Finder, the Mac-only doctor lines never ran, and `Start App.command` and `Publish.command` were not run at all. Also done in this session, on a second Windows computer: the project was copied from GitHub, Node was updated from 16 to 24, and the app ran at http://localhost:3000 without a database.

**Docs updated:** HELP.md, ONBOARDING.md, README.md, the doctor, check:docs, WORKFLOW.md, STRUCTURE.md and the backlog. `CLAUDE.md` still names only `.cmd` files in two places; it asks to be asked first.

**Handoff:** Have Ian run the Mac lines of ONBOARDING.md and report the first step that does not match; the backlog has the item. The database address is still the first thing the app needs.

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
