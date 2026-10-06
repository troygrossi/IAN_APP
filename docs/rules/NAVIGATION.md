# Navigation

Addresses, menus and links.

## The addresses

| Address | Who can open it | What it is |
| --- | --- | --- |
| `/` | Everyone | Home |
| `/pricing` | Everyone | Plans |
| `/login`, `/signup` | Everyone | Sign in, create account |
| `/checkout`, `/checkout/success` | Everyone | Simulated payment |
| Any address not in this table | Signed in | Pages are private unless listed as public |
| `/dashboard` | Signed in | Home after sign-in: what the app is, and the Core Four positions |
| `/dashboard/alerts` | Signed in | The Harvester's trades, newest first |
| `/dashboard/trades` | Signed in | Trade history: every option sold since the record started, each with its P/L |
| `/dashboard/drip` | Signed in | What DRIP means, and the DRIP watchlist |
| `/dashboard/learn` | Signed in | How the wheel works, the rules, the words |
| `/dashboard/notes` | Signed in | The example feature |
| `/dashboard/billing` | Signed in | Current plan |
| `/dashboard/settings` | Signed in | Account |
| `/api/health` | Everyone | Says whether the app and database are up |

Add a row when you add a page.

## Rules

**The address names what you would bookmark, share, or press Back to.** A page, a chosen plan, a search. Everything else (an open menu, text being typed) is state inside a component.

**The folder decides who can see a page.** Public pages go in `(marketing)`, signed-in pages go in `(app)`. The `(app)` layout checks the session, so a page placed there is protected without more code ([AUTH.md](AUTH.md)).

**A new public page must also be added to `PUBLIC_PATHS`** in `src/lib/auth/config.ts`. Until it is, signed-out visitors are sent to sign in. This is on purpose: forgetting the list hides a page, it never exposes one.

**Menus are data.** Every menu link is one line in `src/components/nav/nav-items.ts`. Do not write menu links into a header by hand. `appNav` holds the main sections: in the header from the small breakpoint up, and as the tab bar at the bottom on a phone, so keep it to four or five short labels. `accountNav` holds the account pages.

**Use `<Link>` to move between pages**, not `<a>`. It makes moving between pages instant. Use `redirect()` on the server, and `useRouter()` only when a click must run code first.

**The current page is marked in the menu**, with `aria-current="page"`.

**Never send a user to an address taken from the URL without checking it.** After sign-in, `?next=` is passed through `safeNextPath()`, which only allows addresses inside this app.

## Known gaps

- `/checkout` can be opened without signing in. Decide whether payment requires an account when Stripe is connected ([PAYMENTS.md](PAYMENTS.md)).
