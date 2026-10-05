# 02 — Placeholder login and payments

> The login half of this decision was replaced by [05](05-own-login.md). The payments half still stands.

| | |
| --- | --- |
| Decided | 2026-10-05 |
| Decided by | Proposed by Claude; not yet reviewed by Troy and Ian |
| Replaces | none |

## The question

Do we connect real login and Stripe before the product is designed, or simulate them?

## The decision

Simulate both. Login accepts any email and stores it in a cookie. Checkout is a stand-in page that sets a cookie. Every simulated screen says so.

## Why

- The whole flow (visit, sign up, pay, use the app) can be clicked through today, which is what product design needs.
- The real services need accounts, keys and decisions (which sign-in methods, which prices) that depend on the product.
- The seams are already in place. Pages only call `getSession()` and `getCurrentPlan()`, so connecting the real services changes the inside of a few files in `src/lib/auth/` and `src/lib/billing/`, not the pages.

## What we did not choose

- **Connect both now.** More setup before anything is visible, and likely to be redone once the product is known.
- **Leave both out.** Then pages for signed-in users and paid plans could not be designed or tested.

## When to look at this again

Before any real user or real data touches the app. The steps are in [AUTH.md](../rules/AUTH.md) and [PAYMENTS.md](../rules/PAYMENTS.md). Login comes first, because a payment must belong to a user.
