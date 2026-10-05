#!/usr/bin/env node

/**
 * Deploy (deploy to Vercel).   npm run deploy
 *
 * Makes the live site match what you last published. It moves the main branch on
 * GitHub up to develop; Vercel sees main change and rebuilds the live site.
 * You stay on develop the whole time. The workflow is described in docs/rules/WORKFLOW.md.
 *
 * It only sends what is already published, so publish first.
 */
import { LIVE_BRANCH, WORK_BRANCH, count, done, git, hasRemoteBranch, note, refreshLiveBranch, requireWorkBranch, step, stop } from "./lib/git.mjs";

requireWorkBranch();

step("1. Checking that everything is published");
if (git(["status", "--porcelain"]).out) stop("You have changes that are not published yet", 'npm run publish -- "a few words about what changed"');
if (!git(["fetch", "origin"]).ok) stop("Could not reach GitHub", "Check your internet connection, then run this again");
if (!hasRemoteBranch(WORK_BRANCH) || count(`origin/${WORK_BRANCH}..HEAD`) > 0) stop("Your latest version is not on GitHub yet", "npm run publish");
if (count(`HEAD..origin/${WORK_BRANCH}`) > 0) stop("GitHub has newer changes than this computer", "npm run sync");

const liveExists = hasRemoteBranch(LIVE_BRANCH);
const sending = liveExists ? count(`origin/${LIVE_BRANCH}..HEAD`) : count("HEAD");
if (liveExists && sending === 0) {
  refreshLiveBranch();
  done("Already deployed. The live site has everything you published.");
  process.exit(0);
}
if (liveExists && count(`HEAD..origin/${LIVE_BRANCH}`) > 0) {
  stop(`${LIVE_BRANCH} has changes that ${WORK_BRANCH} does not, so it cannot simply move forward`, `Ask Claude: "${LIVE_BRANCH} has commits that ${WORK_BRANCH} lacks, help me bring them into ${WORK_BRANCH}"`);
}
const databaseChanged = liveExists && git(["diff", "--name-only", `origin/${LIVE_BRANCH}`, "HEAD", "--", "drizzle"]).out !== "";

step(`2. Moving ${LIVE_BRANCH} up to ${WORK_BRANCH} on GitHub`);
if (!git(["push", "origin", `${WORK_BRANCH}:${LIVE_BRANCH}`], { show: true }).ok) {
  stop("GitHub did not accept the change", 'Ask Claude: "npm run deploy failed at the push, help me"');
}
git(["fetch", "origin"]);
refreshLiveBranch();
note(`${sending} version(s) sent`);
if (databaseChanged) note("This deploy includes a database change. If the live database has not had it yet: npm run db:migrate");

done("Deployed (deploy to Vercel). Vercel is building the live site now; it takes about two minutes.", "Open your project on https://vercel.com to watch it finish");
