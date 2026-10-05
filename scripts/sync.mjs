#!/usr/bin/env node

/**
 * Sync (get the latest from GitHub).   npm run sync
 *
 * Brings down anything on GitHub that this computer does not have yet, for both
 * develop and main. Run it at the start of a session. It never leaves develop.
 * The workflow is described in docs/rules/WORKFLOW.md.
 */
import { LIVE_BRANCH, WORK_BRANCH, done, git, note, pullWorkBranch, refreshLiveBranch, requireWorkBranch, step } from "./lib/git.mjs";

requireWorkBranch();

step(`Getting the latest from GitHub`);
const before = git(["rev-parse", "--quiet", "--verify", "HEAD"]).out;
const received = pullWorkBranch();
refreshLiveBranch();
note(received > 0 ? `${received} new change(s) on ${WORK_BRANCH}` : `${WORK_BRANCH} was already up to date`);
note(`${LIVE_BRANCH} matches GitHub`);

const changed = received > 0 ? git(["diff", "--name-only", before, "HEAD"]).out.split("\n") : [];
const next = changed.includes("package-lock.json")
  ? "npm install   (the package list changed), then npm run dev"
  : changed.some((file) => file.startsWith("drizzle/"))
    ? "npm run db:migrate   (the database changed), then npm run dev"
    : "npm run dev";

done("Synced (got the latest from GitHub)", next);
