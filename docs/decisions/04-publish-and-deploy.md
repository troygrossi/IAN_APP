# 04 — Publish and Deploy, on one working branch

| | |
| --- | --- |
| Decided | 2026-10-05 |
| Decided by | Troy (the words, the two branches, never leaving `develop`); Claude proposed how `main` moves, not yet reviewed |
| Replaces | none |

## The question

How does work get from a computer to GitHub and to the live site, in a way that someone new to coding can follow without learning git?

## The decision

- Two words, each with a fixed descriptor: **Publish (save to GitHub)** and **Deploy (deploy to Vercel)**. A third, **Sync (get the latest from GitHub)**, covers the opposite direction.
- Everyone, people and coding agents, works on the `develop` branch and never switches off it.
- `main` is what the live site is built from. It moves only when `npm run deploy` runs, and it is updated on GitHub and on the computer without being checked out.
- Each word is one command: `npm run sync`, `npm run publish`, `npm run deploy`.

## Why

- **One word per action** means the person, the documents and the agents all say the same thing. The descriptor makes the word explain itself.
- **One branch to stand on** removes the most common way to get lost in git: being on the wrong branch.
- **Publish and Deploy as separate steps** lets work be saved many times a day without changing what visitors see.
- **`main` equals the last deploy**, so it always answers "what is live right now?". It only ever moves forward to a point `develop` has already reached, so the live site cannot contain unpublished work.
- **Commands instead of git** lets each step check the code, refuse to publish secrets, and end by saying what to do next.

## What we did not choose

- **Move `main` on every publish.** Then `main` would always equal `develop`, and with Vercel building from `main`, Publish and Deploy would be the same step.
- **Work directly on `main`.** One branch fewer, but every save would change the live site.
- **A branch per feature, with pull requests.** The usual choice for a team. For one person and their agents it adds switching, merging and reviewing with nobody to review.
- **Deploying from Vercel's dashboard or its command-line tool.** It works, but `main` would no longer say what is live.
- **Sync as a hidden part of other commands only.** Publish does bring in changes from GitHub, but a session should start from the latest version, so it also has its own command.

## When to look at this again

- A second person works on the project at the same time → consider a branch per person, and a protection rule on `main`.
- A deploy needs a review or a test stage before it reaches visitors.
