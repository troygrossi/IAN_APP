# 10 — Keep Ian's and Troy's repositories in sync

| | |
| --- | --- |
| Decided | 2026-10-05 |
| Decided by | Ian, with Claude |
| Replaces | [07](07-own-repository-with-upstream.md) |

## The question

Decision 07 made Troy's repository read-only from Ian's computer. Then Ian's interface work existed only in his copy while Troy kept working in his. How do the two stay the same?

## The decision

Both repositories keep the same `develop`. `origin` is still Ian's and still the one the live site is built from. `upstream` is Troy's, and it is no longer read-only:

- **Sync (get the latest from GitHub)** also merges Troy's `develop` into this one.
- **Publish (save to GitHub)** also merges Troy's `develop` first, then sends `develop` to Ian's repository and then to Troy's.
- **Deploy (deploy to Vercel)** touches only Ian's `main`. Troy's `main`, and whatever live site he builds from it, stays his to move.

## Why

- The same work in two places drifts apart quickly; a rule nobody runs by hand is soon forgotten. Folding it into the commands means it happens every time.
- Troy's versions are already published, so they come in with a merge, never a rebase (WORKFLOW.md, "Never rewrite published history").
- Sending to Troy never blocks a publish: Ian's work is already safe on his own GitHub, and Troy's copy can catch up on the next publish.

## What we did not choose

- **Keep Troy's copy read-only (decision 07).** Ian's work then never reaches Troy.
- **A fork and pull requests.** A cleaner review step, but every change would wait for Troy to accept it, and a fork of a public repository is public too.
- **Syncing `main` as well.** Each of them deploys his own live site when he chooses.

## When to look at this again

When one of them stops working on the project, remove `upstream` (`git remote remove upstream`). If the two often clash, switch to pull requests.

## Needs before it works

Troy's repository must accept Ian's GitHub account: Troy adds **Harvestthewheel** under Settings → Collaborators with write access. Until then Publish says the partner's copy did not accept it, and carries on. Troy's repository is also public today, so anything sent there can be read by anyone.
