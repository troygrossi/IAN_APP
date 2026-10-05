#!/usr/bin/env node

/**
 * Publish (save to GitHub).   npm run publish -- "a few words about what changed"
 *
 * Saves your work as a new version and sends it to the develop branch on GitHub.
 * It does not change the live site; that is `npm run deploy`.
 * The workflow is described in docs/rules/WORKFLOW.md.
 *
 * In order: check the code, save a version, get anything new from GitHub, send.
 * It stops at the first problem and says what to do next.
 */
import { execSync } from "node:child_process";
import { ROOT } from "./lib/report.mjs";
import { LIVE_BRANCH, WORK_BRANCH, done, git, hasRemoteBranch, note, pullWorkBranch, refreshLiveBranch, requireWorkBranch, step, stop } from "./lib/git.mjs";

const message = process.argv.slice(2).join(" ").trim();

requireWorkBranch();

step("1. Checking the code (npm run check)");
try {
  execSync("npm run check", { cwd: ROOT, stdio: "inherit" });
} catch {
  stop("The check failed, so nothing was published", "Fix what it printed above (or ask Claude to), then publish again");
}

step("2. Saving a version on this computer");
if (git(["status", "--porcelain"]).out) {
  if (!message) stop("You have changes, and a version needs a short description", 'npm run publish -- "a few words about what changed"');
  git(["add", "--all"]);
  const staged = git(["diff", "--cached", "--name-only"]).out.split("\n");
  const secret = staged.find((file) => /(^|\/)\.env(\.|$)/.test(file) && !file.endsWith(".env.example"));
  if (secret) {
    git(["reset", "--quiet"]);
    stop(`${secret} holds secrets and must never be published`, `Add ${secret} to .gitignore, then publish again`);
  }
  if (!git(["commit", "--quiet", "-m", message]).ok) stop("Git could not save the version", 'Ask Claude: "git commit failed, help me"');
  note(`Saved: ${message}`);
} else {
  note("Nothing new to save. Sending what is already saved.");
}
if (!git(["rev-parse", "--verify", "--quiet", "HEAD"]).ok) stop("There is nothing to publish yet", "Make a change first");

step("3. Getting anything new from GitHub");
const received = pullWorkBranch();
note(received > 0 ? `Brought in ${received} change(s) from GitHub` : "Nothing new");

step("4. Sending to GitHub");
if (!git(["push", "--set-upstream", "origin", WORK_BRANCH], { show: true }).ok) {
  stop("GitHub did not accept the changes", 'Ask Claude: "git push failed, help me"');
}
// The very first publish also creates main, so GitHub and Vercel have a live branch to point at.
if (!hasRemoteBranch(LIVE_BRANCH) && git(["push", "origin", `${WORK_BRANCH}:${LIVE_BRANCH}`]).ok) {
  git(["fetch", "origin"]);
  note(`First publish: created ${LIVE_BRANCH} on GitHub`);
}
refreshLiveBranch();

done("Published (saved to GitHub)", "npm run deploy   when you want these changes on the live site (deploy to Vercel)");
