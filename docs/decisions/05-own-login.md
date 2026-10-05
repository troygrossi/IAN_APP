# 05 — Our own login: email, password, and sessions in the database

| | |
| --- | --- |
| Decided | 2026-10-05 |
| Decided by | Troy asked for a real, light login modelled on his other app; Claude chose the details, not yet reviewed |
| Replaces | The login half of [02](02-placeholder-login-and-payments.md). Payments in 02 still stand |

## The question

The placeholder login accepted any email. What replaces it?

## The decision

The app keeps its own accounts.

- A `users` table holds the email and a **hash** of the password, made with scrypt, which is built into Node.
- A `sessions` table holds one row per signed-in browser. The browser's cookie holds a random secret; the row holds only its fingerprint. Signing out deletes the row.
- Five wrong passwords in a row pause the account for 15 minutes.
- Nothing new was installed, and there is no new setting to configure.

## Why

- **No second service to set up.** A new person needs the database address and nothing else.
- **Sessions in the database can be ended.** Deleting a row signs that browser out at once. A signed token cannot be taken back before it expires.
- **No secret key to manage.** A signed-token design needs a signing secret in every environment, and everyone is signed out or exposed if it is lost or leaked. A random secret per session needs none.
- **A leaked database does not leak logins.** It holds hashes and fingerprints, not passwords or cookies.
- **The code is small enough to read.** About 150 lines in `src/lib/auth/` and two services.

## What we did not choose

- **Supabase Auth**, which decision 02 expected. It brings email verification and password reset for free, and is the better choice the day those are needed. It was not chosen now because Troy asked for a self-contained login like his other app, and because it adds two keys, two packages and a second way of talking to Supabase.
- **Signed tokens (JWT), as Troy's other app uses.** Lighter per request, since no database lookup is needed, but they cannot be ended early and need a signing secret.
- **A password library such as bcrypt or argon2.** Argon2 is the stronger choice on paper. scrypt is good, needs no installation, and has no native part that can fail to build on a new computer.
- **A login framework (Auth.js, Better Auth).** More features than this app needs yet, and harder for a newcomer to follow than code they can read top to bottom.

## When to look at this again

- The app needs "forgot password" or verified email addresses. That needs email sending; at that point compare building it with moving to Supabase Auth.
- Sign-in with Google or another provider is wanted.
- The known gaps in [AUTH.md](../rules/AUTH.md) start to matter, which they will before real users arrive.
