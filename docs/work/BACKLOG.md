# Backlog

What is left to do. One line per item. Delete a line when it is done; the [log](LOG.md) is the record of finished work.

Add ideas freely. An item needs no detail until someone starts it.

## Needs Ian (now that the app lives in his GitHub)

These need his own accounts and passwords, so only he can do them. The steps are in `HELP.md` section 5 and [DEPLOY.md](../setup/DEPLOY.md).

- [ ] Install Postgres.app, press Initialize, then double-click `Doctor.command`. `.env.local` already points at it
- [ ] On GitHub, check the default branch of Harvestthewheel/Harvest-The-Wheel (it is `main`)
- [ ] ONBOARDING.md steps 3 and 11 still say to ask Troy for the Supabase project and address. Rewrite them for Ian's own project
- [ ] Before the first paying user: Supabase Pro for backups, and Vercel Pro (the free Hobby plan is for non-commercial use)

## Needs Troy (nobody else can do these)

- [ ] Add **Harvestthewheel** as a collaborator (write) on troygrossi/IAN_APP, so Publish (save to GitHub) can send to both copies ([decision 10](../decisions/10-keep-both-repositories-in-sync.md))
- [ ] Put `DATABASE_URL` in `.env.local` (`npm run help -- 5`), then run `npm run db:migrate`
- [ ] Add `DATABASE_URL` in Vercel (Settings → Environment Variables) and as a GitHub secret ([DEPLOY.md](../setup/DEPLOY.md), part 3)
- [ ] Decide whether the GitHub repository should be private (it is public)
- [ ] Decide GitHub's default branch: keep `develop` (a plain clone lands on it) or switch to `main` as DEPLOY.md says. Then make the guide match
- [ ] Invite Ian to the GitHub repository and the Supabase organization. Check whether Vercel's free plan allows a second member
- [ ] Read decisions 01 to 06 and replace any you disagree with. All six were proposed by Claude

## Next

- [ ] Run the first Deploy (deploy to Vercel) with the database connected, and watch the three GitHub jobs pass for the first time
- [ ] Follow ONBOARDING.md on a computer that has nothing installed, and fix any step that does not match
- [ ] On a real Mac: follow the "On a Mac" lines of ONBOARDING.md and double-click each `.command` file. None of it has been run on a Mac yet
- [ ] Confirm `npm run db:migrate` works through Supabase's Transaction pooler address. It has only been run against a local database; the Session pooler address may be needed

- [ ] Trade entry: a table for The Harvester's trades, a service, an API route and hooks, so Positions and Alerts show real data instead of `src/lib/wheel/sample-data.ts`
- [x] Live prices for the Core Four, from Financial Modeling Prep ([decision 11](../decisions/11-live-prices.md))
- [ ] Live prices and trend status for the DRIP watchlist
- [ ] Check FMP's terms for showing its prices to paying users, before Billing goes live
- [ ] Send alerts by email or to a phone when a trade is entered

## Later

- [ ] "Forgot password", which needs a way to send email ([AUTH.md](../rules/AUTH.md), Known gaps)
- [ ] Verify email addresses at sign-up
- [ ] Limit sign-in attempts per visitor, not only per account
- [ ] A full content security policy, which needs a per-request nonce ([AUTH.md](../rules/AUTH.md), Known gaps)
- [ ] `POST /api/notes` with a body that is not JSON answers "something went wrong" (500). It should answer "bad input" (400)
- [ ] Make `npm run check` fail when a page inside `src/app/(app)/` does not call `requirePageSession()`
- [ ] Automated tests, starting with sign-in and "one user cannot see another's notes"
- [ ] Let a signed-in user change their email and password, and sign out everywhere
- [ ] Connect Stripe, and store the plan on the user instead of in a cookie ([PAYMENTS.md](../rules/PAYMENTS.md))
- [ ] A separate Supabase project for development, so testing never touches live data
- [ ] An error tracker for the live site
- [ ] A protection rule on `main` in GitHub, so only a deploy can move it

## Ideas

- [ ] Onboarding step 13 has the newcomer tick boxes in the shared ONBOARDING.md and Publish (save to GitHub) it. Give them something else to change if the ticks become a nuisance
- [ ] A switch for light and dark mode
