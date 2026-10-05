# Backlog

What is left to do. One line per item. Delete a line when it is done; the [log](LOG.md) is the record of finished work.

Add ideas freely. An item needs no detail until someone starts it.

## Needs Troy (nobody else can do these)

- [ ] Put `DATABASE_URL` in `.env.local` (`npm run help -- 5`), then run `npm run db:migrate`
- [ ] Add `DATABASE_URL` in Vercel (Settings → Environment Variables) and as a GitHub secret ([DEPLOY.md](../setup/DEPLOY.md), part 3)
- [ ] Decide whether the GitHub repository should be private (it is public)
- [ ] Decide GitHub's default branch: keep `develop` (a plain clone lands on it) or switch to `main` as DEPLOY.md says. Then make the guide match
- [ ] Invite Ian to the GitHub repository and the Supabase organization. Check whether Vercel's free plan allows a second member
- [ ] Read decisions 01 to 06 and replace any you disagree with. All six were proposed by Claude

## Next

- [ ] Run the first Deploy (deploy to Vercel) with the database connected, and watch the three GitHub jobs pass for the first time
- [ ] Follow ONBOARDING.md on a computer that has nothing installed, and fix any step that does not match
- [ ] Confirm `npm run db:migrate` works through Supabase's Transaction pooler address. It has only been run against a local database; the Session pooler address may be needed
- [ ] Write one sentence that says what the product is, and replace the placeholder text on the home page
- [ ] Choose the app's name and set `APP_NAME` in `src/components/nav/nav-items.ts`

## Later

- [ ] "Forgot password", which needs a way to send email ([AUTH.md](../rules/AUTH.md), Known gaps)
- [ ] Verify email addresses at sign-up
- [ ] Limit sign-in attempts per visitor, not only per account
- [ ] Automated tests, starting with sign-in and "one user cannot see another's notes"
- [ ] Let a signed-in user change their email and password, and sign out everywhere
- [ ] Connect Stripe, and store the plan on the user instead of in a cookie ([PAYMENTS.md](../rules/PAYMENTS.md))
- [ ] A separate Supabase project for development, so testing never touches live data
- [ ] An error tracker for the live site
- [ ] A protection rule on `main` in GitHub, so only a deploy can move it

## Ideas

- [ ] Onboarding step 13 has the newcomer tick boxes in the shared ONBOARDING.md and publish it. Give them something else to change if the ticks become a nuisance
- [ ] Double-click files for Mac (`.command`), if someone on a Mac joins
- [ ] A switch for light and dark mode
