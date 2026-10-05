# Navigation

Addresses, menus and links.

## The addresses

| Address | Who can open it | What it is |
| --- | --- | --- |
| `/` | Everyone | Home |
| `/pricing` | Everyone | Plans |
| `/login`, `/signup` | Everyone | Sign in, create account |
| `/checkout`, `/checkout/success` | Everyone | Simulated payment |
| `/dashboard` | Signed in | Home after sign-in |
| `/dashboard/notes` | Signed in | The example feature |
| `/dashboard/billing` | Signed in | Current plan |
| `/dashboard/settings` | Signed in | Account |
| `/api/health` | Everyone | Says whether the app and database are up |

Add a row when you add a page.

## Rules

**The address names what you would bookmark, share, or press Back to.** A page, a chosen plan, a search. Everything else (an open menu, text being typed) is state inside a component.

**The folder decides who can see a page.** Public pages go in `(marketing)`, signed-in pages go in `(app)`. The `(app)` layout checks the session, so a page placed there is protected without more code ([AUTH.md](AUTH.md)).

**Menus are data.** Every menu link is one line in `src/components/nav/nav-items.ts`. Do not write menu links into a header by hand.

**Use `<Link>` to move between pages**, not `<a>`. It makes moving between pages instant. Use `redirect()` on the server, and `useRouter()` only when a click must run code first.

**The current page is marked in the menu**, with `aria-current="page"`.

**Never send a user to an address taken from the URL without checking it.** After sign-in, `?next=` is passed through `safeNextPath()`, which only allows addresses inside this app.

## Known gaps

- `/checkout` can be opened without signing in. Decide whether payment requires an account when Stripe is connected ([PAYMENTS.md](PAYMENTS.md)).
