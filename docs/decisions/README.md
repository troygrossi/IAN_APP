# Decisions

A decision records a choice between real options, and why, so nobody undoes it later by accident.

## What earns a file

A choice that shapes the app and that someone might later be tempted to reverse: a tool, a service, a pattern. Small choices made while building go under **What was rejected** in [the work log](../work/LOG.md).

## How they are kept

- One file per decision, named `NN-short-name.md`, with the next free number. Start from [TEMPLATE.md](TEMPLATE.md).
- **A decision is never rewritten.** When it changes, write a new one and set its "Replaces" line. Add "Replaced by NN" to the top of the old file; change nothing else in it.
- Add a row to the table below.

## The list

| # | The question it settled | Decided |
| --- | --- | --- |
| [01](01-stack.md) | What is the app built with, and where does it run? | 2026-10-05 |
| [02](02-placeholder-login-and-payments.md) | Do we connect login and Stripe now, or simulate them? | 2026-10-05 |
| [03](03-api-routes-and-server-actions.md) | How does the browser ask the server to do something? | 2026-10-05 |
| [04](04-publish-and-deploy.md) | How does work get to GitHub and to the live site? | 2026-10-05 |
| [05](05-own-login.md) | What replaces the placeholder login? | 2026-10-05 |
| [06](06-what-github-checks.md) | What runs by itself after a publish or a deploy? | 2026-10-05 |
