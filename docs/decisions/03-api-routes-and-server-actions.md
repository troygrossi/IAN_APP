# 03 — API routes for data, server actions for redirects

| | |
| --- | --- |
| Decided | 2026-10-05 |
| Decided by | Proposed by Claude; not yet reviewed by Troy and Ian |
| Replaces | none |

## The question

Next.js offers two ways for the browser to ask the server to do something: API routes and server actions. Which do we use?

## The decision

**API routes for data.** Reading and writing data goes through `/api/*`, called with `api()`.
**Server actions for forms that end in a redirect.** Sign in, sign out and checkout.

## Why

- An API route has an address. It can be opened in a browser, tested alone, and later called by a phone app or by Stripe.
- Every route answers in one shape, so the screen handles every failure the same way ([ERRORS.md](../rules/ERRORS.md)).
- Login and checkout end by sending the user to another page and need to set cookies. A server action does that in a few lines and works before the page's JavaScript has loaded.

## What we did not choose

- **Server actions for everything.** Less code at first, but no addresses, and each action invents its own way to report an error.
- **API routes for everything.** Then login would need extra browser code just to follow a redirect.

## When to look at this again

If the rule "does it end in a redirect?" stops being easy to answer for new features.
