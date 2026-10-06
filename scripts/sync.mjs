#!/usr/bin/env node

/**
 * Sync (get the latest from GitHub).   npm run sync
 *
 * Brings down anything on GitHub that this computer does not have yet, for both
 * develop and main, and merges in the partner's develop (upstream) when there is one. Run it at the start of a session. It never leaves develop.
 * The workflow is described in docs/rules/WORKFLOW.md.
 */
import { LIVE_BRANCH, PARTNER, WORK_BRANCH, done, git, mergePartnerWorkBranch, note, pullWorkBranch, refreshLiveBranch, requireWorkBranch, step } from "./lib/git.mjs";

requireWorkBranch();

step(`Getting the latest from GitHub`);
const before = git(["rev-parse", "--quiet", "--verify", "HEAD"]).out;
const fromOrigin = pullWorkBranch();
const fromPartner = mergePartnerWorkBranch();
const received = fromOrigin + fromPartner;
refreshLiveBranch();
note(received > 0 ? `${received} new change(s) on ${WORK_BRANCH}` : `${WORK_BRANCH} was already up to date`);
if (fromPartner > 0) note(`${fromPartner} of them came from the partner's copy (${PARTNER}). Publish to save them to your GitHub too.`);
note(`${LIVE_BRANCH} matches GitHub`);

const changed = received > 0 ? git(["diff", "--name-only", before, "HEAD"]).out.split("\n") : [];
const next = changed.includes("package-lock.json")
  ? "npm install   (the package list changed), then npm run dev"
  : changed.some((file) => file.startsWith("drizzle/"))
    ? "npm run db:migrate   (the database changed), then npm run dev"
    : "npm run dev";

done("Synced (got the latest from GitHub)", next);
