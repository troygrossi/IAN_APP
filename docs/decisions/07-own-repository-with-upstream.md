# 07 — Ian's own repository, with Troy's as a read-only upstream

| | |
| --- | --- |
| Decided | 2026-10-05 |
| Decided by | Ian, with Claude |
| Replaces | none |

## The question

Ian takes the app over in his own GitHub account but still wants Troy's later changes. Which repository do Sync, Publish and Deploy talk to?

## The decision

`origin` is Ian's repository, Harvestthewheel/Harvest-The-Wheel. Sync, Publish (save to GitHub) and Deploy (deploy to Vercel) use it, and Ian's Vercel project watches it. Troy's repository, troygrossi/IAN_APP, stays as a second address called `upstream`, set so nothing can be sent to it. Troy's changes are brought in on request and then published to `origin` like any other work.

## Why

- The scripts in `scripts/` read and send through `origin` only. Keeping one repository behind that name means every command, check and message stays true.
- Ian owns the code, the history and the live site; Troy's account cannot be changed by accident.
- Troy's updates are still one step away.

## What we did not choose

- **`origin` reading from Troy and sending to Ian.** Deploy compares this computer with `origin/develop` before it moves `main`; with two repositories behind one name it would compare against the wrong one.
- **Keeping Troy's repository as the only one.** Ian could not own the live site or invite his own team.
- **A fork on GitHub.** It works, but GitHub makes a fork of a public repository public, and links it back to the original.

## When to look at this again

When Troy stops working on his copy, `upstream` can be removed. If Troy and Ian both keep changing the same files, a regular, scheduled merge from `upstream` may be worth a command of its own.
