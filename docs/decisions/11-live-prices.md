# 11 — Live Core Four prices from Financial Modeling Prep

| | |
| --- | --- |
| Decided | 2026-10-09 |
| Decided by | Ian |
| Replaces | none |

## The question

Where do the Core Four prices come from, and how do the pages get them?

## The decision

The pages ask a service, `src/lib/services/prices.ts`, for prices from Financial Modeling Prep (FMP). The API key is `FMP_API_KEY`, set in Vercel. Each answer is reused for 5 minutes. Without a key, or when FMP does not answer, the pages show the snapshot saved in `src/lib/wheel/sample-data.ts` and say so.

## Why

- Ian already uses FMP for his trackers, so there is one account and one key.
- The pages are drawn on the server, so the key never reaches a browser.
- Reusing each answer for 5 minutes keeps a busy day well inside FMP's request limit, and the wheel does not need prices closer than that.
- The fallback means a down price feed shows older prices, never a broken page.
- All four prices or none: a page that mixed live and old prices would show totals that never existed.

This is the one place a page calls a service directly instead of going through a hook and an API route ([DATA_FLOW.md](../rules/DATA_FLOW.md)). The prices are read-only, need no user id, and are drawn on the server. A route and a hook would add a loading state on every page for no gain.

## What we did not choose

- A price API called from the browser: the key would be visible to anyone.
- Saving prices in the database on a schedule: more moving parts, and the free Vercel plan only runs scheduled jobs once a day.
- Updating the snapshot by hand: that is what "live" was asked to replace.

## When to look at this again

- Before paying users. FMP's terms decide whether its prices may be shown in an app that others pay for; a data display licence may be needed.
- If FMP's request limit is hit.
- If prices need to tick by the second.
