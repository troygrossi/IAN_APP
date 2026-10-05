# Payments

Plans, checkout, and how Stripe will be connected.

## Today: a placeholder

No money moves. "Choose Pro" opens `/checkout`, a stand-in for Stripe's payment page. "Pretend to pay" sets a cookie named `demo_plan` and shows `/checkout/success`. Why: [decision 02](../decisions/02-placeholder-login-and-payments.md).

## Rules

These hold now and after Stripe is connected.

**Plans are defined once**, in `src/lib/billing/plans.ts`. The pricing page and the billing page both read from it.

**The current plan is read in one place:** `getCurrentPlan()` in `src/lib/billing/current-plan.ts`.

**The app never sees a card number.** Stripe hosts the payment page. We send the user there and they come back.

**The browser never decides that someone has paid.** The success page is only a thank-you. The plan changes when Stripe calls `/api/webhooks/stripe`, and only after that request's signature is verified.

**Prices on screen come with their unit:** "$10 per month".

**Test keys on your computer, live keys only in Vercel.** `npm run doctor` warns when a live key is in `.env.local`.

## Connecting Stripe

1. Create the product and price in the Stripe dashboard, in test mode.
2. Add the `stripe` package. Fill in the three `STRIPE_` variables in `.env.local`.
3. Add each paid plan's Stripe price id to `plans.ts`.
4. `startCheckout` in `src/lib/billing/actions.ts`: create a Stripe Checkout session and `redirect()` to its URL.
5. `src/app/api/webhooks/stripe/route.ts`: verify the signature, then set `plan` and `stripeCustomerId` on the user's `users` row.
6. `getCurrentPlan()`: read `users.plan` instead of the cookie.
7. Delete the stand-in `/checkout` page and `completeDemoCheckout`. Keep `/checkout/success`.
8. Update this file, the doctor's Payments check, and add a decision.

A payment has to belong to a user. Sign-in is real now ([AUTH.md](AUTH.md)), so the `users` table is ready for it.

## Known gaps

- Payments are a placeholder (see above).
- The plan is stored in a cookie, so it is per browser, not per account, and anyone can change it. `users.plan` exists but nothing writes it yet.
