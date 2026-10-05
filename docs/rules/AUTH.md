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

**The session is read in one place,** `src/lib/auth/session.ts`. Private pages call `requirePageSession()`. API routes call `requireSession()`. A public page that only wants to know calls `getSession()`. Nothing else reads the session cookie.

**There are two gates, and the second is the one that counts.**

| Gate | File | What it does |
| --- | --- | --- |
| 1. Proxy | `src/proxy.ts` | Runs before the page. Sends visitors without a cookie to `/login` and remembers where they were going. Fast, but it only sees that a cookie exists |
| 2. Page | every `page.tsx` inside `src/app/(app)/` | Starts with `await requirePageSession()`, which looks the session up in the database and sends anyone without a real one to `/login` |

**Every page inside `(app)` starts with `await requirePageSession()`.** The layout does too, but the layout alone is not a gate: Next.js runs a page alongside its layout, and a request can ask for the page's output by itself. A page that skips the line can be read by anyone who sends a made-up cookie. This was tested: see the work log, 2026-10-05.

**Pages are private unless listed as public.** The list is `PUBLIC_PATHS` in `src/lib/auth/config.ts`. A new page is protected at the first gate by default; making one public is a deliberate one-line change.

**Every API route that returns or changes private data calls `requireSession()` first,** and passes `user.id` to its service.

**An id in the address proves nothing.** `/notes/123` does not mean the visitor may see note 123. Every service function that touches private data takes the user's id and filters by it. `src/lib/services/notes.ts` is the example.

**Passwords and session secrets are never stored, logged, or sent back.** The database holds hashes and fingerprints only. A form that fails is shown again with the email filled in and the password empty.

**Sign-in gives one answer for "no such account" and "wrong password".** Otherwise the form could be used to find out who has an account.

**Five wrong passwords in a row pause an account for 15 minutes.** The numbers are in `src/lib/auth/config.ts`.

**A request that changes data must come from our own pages.** The proxy refuses a `POST` to `/api/*` whose `Origin` is another site, or cannot be read as an address at all. Sign-in forms are server actions, which Next.js protects the same way.

**After sign-in, a visitor only ever lands on this site.** The address to return to travels in the link (`/login?next=…`), so anyone can write one. `safeNextPath()` in `src/lib/auth/config.ts` is the only thing that may turn it into a redirect. It refuses anything that is not a plain path here, including the look-alikes a browser reads as another site: `//evil.com`, `/\evil.com`, and a path with a tab or line break hidden in it.

**Every page is sent with a few protective headers,** set in `next.config.ts`: no other site may show our pages inside a frame, the browser may not guess file types, and other sites are not told which page a visitor came from.

**The cookie is locked down:** `httpOnly` (page scripts cannot read it), `secure` on the live site (https only), `sameSite: lax` (not sent when another site posts here).

**Secrets stay on the server.** Only variables starting with `NEXT_PUBLIC_` reach the browser. Never put a secret in one.

**Do not weaken these to make something work.** If a rule here is in the way, stop and ask.

## Changing how sign-in works

Pages and routes only call `requirePageSession()`, `requireSession()` and `getSession()`, so the inside can change without touching them. A new private page goes inside `src/app/(app)/` and starts with `await requirePageSession()`. To add a table that holds private data: give it a `userId` column that references `users.id`, and filter by it in every service function.

## Known gaps

- **No "forgot password".** It needs a way to send email, which the app does not have yet. Until then a forgotten password means a new account, or a fix by hand in the database.
- **Email addresses are not verified.** Anyone can create an account with an address they do not own.
- **The sign-up form says when an email already has an account.** Hiding that needs email verification.
- **A paused account says so.** After five wrong passwords the form answers "Too many wrong passwords", which an unknown email never gets, so it also shows that the account exists. Kept on purpose: the owner needs to know why the right password is refused.
- **There is no full content security policy.** The headers stop framing, but do not yet restrict which scripts a page may load. Next.js needs a per-request code (a nonce) for that.
- **The pause after wrong passwords is per account, not per visitor.** Someone can pause another person's account for 15 minutes by guessing, and can try many different emails without being slowed. A limit per visitor needs a shared counter or Vercel's firewall.
- **No two-step sign-in.**
- **Sessions last 30 days from sign-in** and are not extended by use. There is no "sign out everywhere" button, though deleting a user's rows in `sessions` does exactly that.
- **No automated tests** cover any of this. It was checked by hand in a browser (see the work log).
