// Shared by sync, publish and deploy (docs/rules/WORKFLOW.md).
import { spawnSync } from "node:child_process";
import { ROOT, icons, paint } from "./report.mjs";

/** The branch all work happens on. Nobody ever needs to leave it. */
export const WORK_BRANCH = "develop";
/** The branch the live site is built from. Only `npm run deploy` moves it. */
export const LIVE_BRANCH = "main";

/** Runs git. `show: true` lets its output through to the terminal. */
export function git(args, { show = false } = {}) {
  const result = spawnSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: show ? "inherit" : ["ignore", "pipe", "pipe"] });
  return { ok: result.status === 0, out: (result.stdout ?? "").trim() };
}

export const step = (text) => console.log(paint("blue", `\n${text}`));
export const note = (text) => console.log(paint("dim", `  ${text}`));

/** Red ending. `fix` is the one command or action to take next — required. */
export function stop(what, fix) {
  console.log(paint("red", `\n${icons.fail} ${what}`));
  console.log(paint("bold", `  Next: ${fix}`));
  process.exit(1);
}

/** Green ending: what happened, and what to run next. */
export function done(what, next) {
  console.log(paint("green", `\n${icons.ok} ${what}`));
  if (next) console.log(paint("bold", `  Next: ${next}`));
}

export const hasRemoteBranch = (branch) => git(["rev-parse", "--verify", "--quiet", `refs/remotes/origin/${branch}`]).ok;
export const count = (range) => Number(git(["rev-list", "--count", range]).out || 0);

/** Every workflow command starts here: right branch, and a GitHub address to talk to. */
export function requireWorkBranch() {
  if (!git(["rev-parse", "--is-inside-work-tree"]).ok) stop("This folder is not a git project yet", "git init -b develop");
  const branch = git(["branch", "--show-current"]).out;
  if (branch !== WORK_BRANCH) {
    stop(`You are on "${branch || "no branch"}". All work happens on ${WORK_BRANCH}.`, `git switch ${WORK_BRANCH}`);
  }
  if (!git(["remote", "get-url", "origin"]).ok) {
    stop("This project has no GitHub address yet, so there is nowhere to save to", "npm run help -- 8   (first-time GitHub setup)");
  }
}

/** Brings GitHub's copy of develop into this one. Stops, changing nothing, if the two clash. */
export function pullWorkBranch() {
  if (!git(["fetch", "origin"]).ok) stop("Could not reach GitHub", "Check your internet connection, then run this again");
  if (!hasRemoteBranch(WORK_BRANCH) || !git(["rev-parse", "--verify", "--quiet", "HEAD"]).ok) return 0;
  const behind = count(`HEAD..origin/${WORK_BRANCH}`);
  if (behind > 0 && !git(["pull", "--rebase", "--autostash", "origin", WORK_BRANCH]).ok) {
    git(["rebase", "--abort"]);
    stop("GitHub has changes that clash with yours. Nothing was changed.", `Ask Claude: "help me sync ${WORK_BRANCH} with GitHub"`);
  }
  return behind;
}

/** Moves this computer's copy of main to match GitHub's. Works without ever checking main out. */
export function refreshLiveBranch() {
  if (hasRemoteBranch(LIVE_BRANCH)) git(["fetch", "origin", `${LIVE_BRANCH}:${LIVE_BRANCH}`]);
}
