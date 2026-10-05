# Auth

Who can see what, and how login will be connected.

## Today: a placeholder

Login is simulated. Typing any email on `/login` sets a cookie named `demo_session`, and the app treats you as that person. There is no password and nothing is checked. **It must not go live with real users or real data.** Why it is built this way: [decision 02](../decisions/02-placeholder-login-and-payments.md).

## Rules

These hold now and after real login is connected.

**The session is read in one place.** Pages call `getSession()`. API routes call `requireSession()`. Both are in `src/lib/auth/session.ts`. Nothing else reads the session cookie.

**There are two gates, and the second is the one that counts.**

| Gate | File | What it does |
| --- | --- | --- |
| 1. Proxy | `src/proxy.ts` | Runs before the page. Sends signed-out visitors to `/login` and remembers where they were going. Fast, but it only checks that a cookie exists. |
| 2. Layout | `src/app/(app)/layout.tsx` | Runs with the page. Reads the real session. A page inside `(app)` cannot render without one. |

**Every API route that returns or changes private data calls `requireSession()` first.** The proxy does not cover API routes.

**An id in the address proves nothing.** `/notes/123` does not mean the visitor may see note 123. The service must check that the row belongs to the signed-in user.

**Secrets stay on the server.** Only variables starting with `NEXT_PUBLIC_` reach the browser. Never put a secret key in one.

## Connecting real login (Supabase Auth)

1. Turn on a sign-in method in the Supabase project.
2. Add `@supabase/supabase-js` and `@supabase/ssr`. Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Rewrite the inside of `getSession()` to ask Supabase. Keep its return shape and add the user's `id`.
4. Rewrite `signInDemo` and `signOut` in `src/lib/auth/actions.ts`.
5. In `src/proxy.ts`, refresh the Supabase session as their Next.js guide describes.
6. Create a `profiles` row when a user signs up, and add a `userId` column to tables that hold private data.
7. Update this file, the doctor's Login check, and add a decision.

Pages and routes do not change, because they only call `getSession()` and `requireSession()`.

## Known gaps

- Login is a placeholder (see above).
- Notes are shared by everyone; there is no per-user data yet.
