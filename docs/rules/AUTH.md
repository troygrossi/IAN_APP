# Auth

Who can see what, and how sign-in works. The app keeps its own accounts: an email and a password, stored in its own database. Why not a login service: [decision 05](../decisions/05-own-login.md).

## How it works

| Step | What happens | Where |
| --- | --- | --- |
| Create account | The password is turned into a **hash**: a one-way scramble that can check a password but cannot be turned back into one. Only the hash is stored | `src/lib/auth/password.ts`, `src/lib/services/users.ts` |
| Sign in | The typed password is hashed and compared. If it matches, a **session** starts: a long random secret is put in a cookie, and its fingerprint is stored in the `sessions` table | `src/lib/services/sessions.ts` |
| Every request | The cookie's secret is fingerprinted and looked up. A row that exists and has not expired means "signed in as this user" | `src/lib/auth/session.ts` |
| Sign out | The row is deleted. The cookie, and any copy of it, stops working at once | `src/lib/auth/actions.ts` |

## Rules

**The session is read in one place.** Pages call `getSession()`. API routes call `requireSession()`. Nothing else reads the session cookie.

**There are two gates, and the second is the one that counts.**

| Gate | File | What it does |
| --- | --- | --- |
| 1. Proxy | `src/proxy.ts` | Runs before the page. Sends visitors without a cookie to `/login` and remembers where they were going. Fast, but it only sees that a cookie exists |
| 2. Layout | `src/app/(app)/layout.tsx` | Runs with the page. Looks the session up in the database. A page inside `(app)` cannot render without a real one |

**Pages are private unless listed as public.** The list is `PUBLIC_PATHS` in `src/lib/auth/config.ts`. A new page is protected at the first gate by default; making one public is a deliberate one-line change.

**Every API route that returns or changes private data calls `requireSession()` first,** and passes `user.id` to its service.

**An id in the address proves nothing.** `/notes/123` does not mean the visitor may see note 123. Every service function that touches private data takes the user's id and filters by it. `src/lib/services/notes.ts` is the example.

**Passwords and session secrets are never stored, logged, or sent back.** The database holds hashes and fingerprints only. A form that fails is shown again with the email filled in and the password empty.

**Sign-in gives one answer for "no such account" and "wrong password".** Otherwise the form could be used to find out who has an account.

**Five wrong passwords in a row pause an account for 15 minutes.** The numbers are in `src/lib/auth/config.ts`.

**A request that changes data must come from our own pages.** The proxy refuses a `POST` to `/api/*` whose `Origin` is another site. Sign-in forms are server actions, which Next.js protects the same way.

**The cookie is locked down:** `httpOnly` (page scripts cannot read it), `secure` on the live site (https only), `sameSite: lax` (not sent when another site posts here).

**Secrets stay on the server.** Only variables starting with `NEXT_PUBLIC_` reach the browser. Never put a secret in one.

**Do not weaken these to make something work.** If a rule here is in the way, stop and ask.

## Changing how sign-in works

Pages and routes only call `getSession()` and `requireSession()`, so the inside can change without touching them. To add a table that holds private data: give it a `userId` column that references `users.id`, and filter by it in every service function.

## Known gaps

- **No "forgot password".** It needs a way to send email, which the app does not have yet. Until then a forgotten password means a new account, or a fix by hand in the database.
- **Email addresses are not verified.** Anyone can create an account with an address they do not own.
- **The sign-up form says when an email already has an account.** Hiding that needs email verification.
- **The pause after wrong passwords is per account, not per visitor.** Someone can pause another person's account for 15 minutes by guessing, and can try many different emails without being slowed. A limit per visitor needs a shared counter or Vercel's firewall.
- **No two-step sign-in.**
- **Sessions last 30 days from sign-in** and are not extended by use. There is no "sign out everywhere" button, though deleting a user's rows in `sessions` does exactly that.
- **No automated tests** cover any of this. It was checked by hand in a browser (see the work log).
