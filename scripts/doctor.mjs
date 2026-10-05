#!/usr/bin/env node

/**
 * doctor — is this computer ready to run the app, and if not, what is the next command?
 *
 *   npm run doctor             report every check (never changes anything)
 *   npm run doctor -- --fix    also do what can be automated
 *   npm run doctor -- --quiet  print only red checks; skips the network
 *
 * Every red line names the command that fixes it. A red without a next step is a bug in this file.
 *
 * KEEP THIS FILE UPDATED (CLAUDE.md, firm rule 5). When the app starts to depend on
 * something new (a tool, an environment variable, a service), add a check here in the same change.
 *
 * Checks, in the order a fresh computer needs them:
 *   1. Node            — new enough for Next.js
 *   2. Packages        — node_modules is installed and current
 *   3. Settings        — .env.local exists and has every key .env.example has
 *   4. Database        — DATABASE_URL is set, connects, and the tables exist
 *                        (--fix creates a database on this computer, and its tables)
 *   5. Login           — accounts live in the database, so it needs one
 *   6. Payments        — placeholder or connected
 *   7. Git             — installed, knows who you are, on develop, and what is waiting to publish or deploy
 *   8. Tools           — the editor and the coding agent (optional); on a Mac, that the double-click files can run
 *   9. Accounts        — GitHub, Supabase and Vercel, as far as this computer can tell
 *
 * A yellow or red line that a newcomer can fix ends with the step of ONBOARDING.md that
 * explains it. `npm run check:docs` fails if a step cited here does not exist there.
 *
 * Exit code: 1 when a required check is red, else 0.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { ROOT, exists, fromRoot, icons, paint, read, readEnvFile } from "./lib/report.mjs";

const argv = process.argv.slice(2);
const isFix = argv.includes("--fix");
const quiet = argv.includes("--quiet");
// The project is worked on from Windows and from a Mac; a few checks and fixes differ between them.
const isWindows = process.platform === "win32";
const isMac = process.platform === "darwin";

// ---- reporting -------------------------------------------------------------

const results = []; // { n, title, worst, firstFix, lines }
let current;

function begin(n, title) {
  current = { n, title, lines: [], worst: "ok", firstFix: null };
  results.push(current);
}
const rank = (level) => ({ ok: 0, warn: 1, fail: 2 })[level];
function mark(level) {
  if (rank(level) > rank(current.worst)) current.worst = level;
}
const push = (line) => current.lines.push(line);

function ok(msg, detail) {
  push(paint("green", `  ${icons.ok} ${msg}`));
  if (detail) push(paint("dim", `    ${icons.arrow} ${detail}`));
}
const info = (msg) => push(paint("cyan", `  ${icons.info} ${msg}`));
/** Yellow: the app still runs, but something is worth knowing. */
function warn(msg, fix) {
  mark("warn");
  push(paint("yellow", `  ${icons.warn} ${msg}`));
  if (fix) push(paint("dim", `    ${icons.arrow} ${fix}`));
}
/** Red: the app will not run. `fix` is the one command or action that makes it green — required. */
function fail(msg, fix) {
  mark("fail");
  current.firstFix ??= fix;
  push(paint("red", `  ${icons.fail} ${msg}`));
  push(paint("bold", `    ${icons.arrow} ${fix}`));
}
function flush() {
  if (quiet && current.worst !== "fail") return;
  console.log(paint("blue", `\n${current.n}. ${current.title}`));
  for (const line of current.lines) console.log(line);
}

/** Points a fix at the step of ONBOARDING.md that explains it. */
const step = (n) => `(ONBOARDING.md step ${n})`;

function run(command, { timeoutMs } = {}) {
  try {
    // The env settings make git fail fast instead of opening a sign-in window in the middle of a check.
    const env = { ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "never", GIT_SSH_COMMAND: "ssh -o BatchMode=yes" };
    return execSync(command, { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"], timeout: timeoutMs, env }).toString().trim();
  } catch {
    return null;
  }
}

// ---- checks ----------------------------------------------------------------

function checkNode() {
  begin(1, "Node");
  const wanted = JSON.parse(read("package.json")).engines.node.replace(">=", "");
  const [wantMajor, wantMinor = 0] = wanted.split(".").map(Number);
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major > wantMajor || (major === wantMajor && minor >= wantMinor)) {
    ok(`Node ${process.versions.node}`, `needs ${wanted} or newer`);
  } else {
    fail(`Node ${process.versions.node} is too old — this app needs ${wanted} or newer`, `Install the LTS version from https://nodejs.org, then run this again  ${step(5)}`);
  }
  flush();
}

function checkPackages() {
  begin(2, "Packages");
  if (!exists("node_modules")) {
    if (isFix) {
      info("Installing packages (npm install)…");
      execSync("npm install", { cwd: ROOT, stdio: "inherit" });
      ok("Packages installed");
    } else {
      fail("Packages are not installed", "npm install");
    }
  } else if (
    exists("node_modules", ".package-lock.json") &&
    fs.statSync(fromRoot("package-lock.json")).mtimeMs > fs.statSync(fromRoot("node_modules", ".package-lock.json")).mtimeMs + 2000
  ) {
    warn("The package list changed since you last installed", "npm install");
  } else {
    ok("Packages are installed");
  }
  flush();
}

function checkSettings() {
  begin(3, "Settings (.env.local)");
  if (!exists(".env.local")) {
    if (isFix) {
      fs.copyFileSync(fromRoot(".env.example"), fromRoot(".env.local"));
      ok("Created .env.local from .env.example");
    } else {
      warn("There is no .env.local yet — the app runs, but nothing that needs a secret will work", `npm run doctor -- --fix   (copies .env.example for you)  ${step(10)}`);
      flush();
      return {};
    }
  } else {
    ok(".env.local exists");
  }
  const example = readEnvFile(".env.example");
  const local = readEnvFile(".env.local");
  const missing = Object.keys(example).filter((key) => !(key in local));
  if (missing.length > 0) {
    // Names only. This script never prints a value from .env.local.
    warn(`.env.local is missing: ${missing.join(", ")}`, "Copy those lines from .env.example into .env.local");
  } else {
    ok("Every setting in .env.example is present");
  }
  flush();
  return local;
}

/** True when DATABASE_URL points at Postgres on this computer (Postgres.app) rather than at Supabase. */
function isLocalDatabase(url) {
  try {
    return ["localhost", "127.0.0.1", "::1", "[::1]"].includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

/**
 * Postgres on this computer starts with only its own databases. --fix creates the app's one,
 * by connecting to the built-in "postgres" database. Returns true when it created it.
 */
async function createLocalDatabase(url, postgres) {
  const name = decodeURIComponent(new URL(url).pathname.slice(1));
  const admin = new URL(url);
  admin.pathname = "/postgres";
  const sql = postgres(admin.toString(), { max: 1, connect_timeout: 8, prepare: false, onnotice() {} });
  try {
    const [found] = await sql`select 1 from pg_database where datname = ${name}`;
    if (found) return false;
    await sql.unsafe(`create database "${name.replaceAll('"', '""')}"`);
    return true;
  } finally {
    await sql.end({ timeout: 2 }).catch(() => {});
  }
}

const tablesQuery = (sql) =>
  sql`select to_regclass('public.users') as users, to_regclass('public.sessions') as sessions, to_regclass('public.notes') as notes`;

async function checkDatabase(local) {
  begin(4, "Database");
  const url = local.DATABASE_URL;
  let connected = false;
  if (!url) {
    warn("DATABASE_URL is empty — pages load, but saving data says \"database is not connected yet\"", `Paste the database address into .env.local  ${step(11)}`);
    flush();
    return false;
  } else if (!/^postgres(ql)?:\/\//.test(url)) {
    fail("DATABASE_URL does not look like a Postgres address (it should start with postgresql://)", "npm run help -- 5   (where to copy it from)");
  } else if (quiet) {
    ok("DATABASE_URL is set");
  } else if (!exists("node_modules", "postgres")) {
    warn("Cannot test the connection until packages are installed", "npm install");
  } else {
    const { default: postgres } = await import("postgres");
    const isLocal = isLocalDatabase(url);
    if (isLocal && isFix) {
      try {
        if (await createLocalDatabase(url, postgres)) ok("Created the database on this computer");
      } catch {
        // Postgres is not running, most likely. The connection below says so with its fix.
      }
    }
    const sql = postgres(url, { max: 1, connect_timeout: 8, prepare: false, onnotice() {} });
    try {
      let [row] = await tablesQuery(sql);
      ok("Connected to the database", isLocal ? "Postgres on this computer (HELP.md, section 5)" : "Supabase");
      connected = true;
      if (!(row.users && row.sessions && row.notes) && isFix) {
        info("Creating the tables (npm run db:migrate)…");
        execSync("npm run db:migrate", { cwd: ROOT, stdio: "inherit" });
        [row] = await tablesQuery(sql);
      }
      if (row.users && row.sessions && row.notes) ok("Tables exist");
      else fail("Connected, but the tables have not been created yet", "npm run db:migrate");
    } catch (err) {
      if (isLocal && err?.code === "ECONNREFUSED") {
        fail("Postgres is not running on this computer", "Open Postgres.app and press Start (HELP.md, section 5)");
      } else if (isLocal && err?.code === "3D000") {
        fail("Postgres is running, but the app's database does not exist yet", "npm run doctor -- --fix   (creates it for you)");
      } else {
        const reason = err?.code === "28P01" ? "the password was rejected" : (err?.code ?? "no answer");
        const fix = isLocal ? "Check DATABASE_URL in .env.local (HELP.md, section 5)" : `Check DATABASE_URL in .env.local against Supabase  ${step(11)}`;
        fail(`Could not connect to the database (${reason})`, fix);
      }
    } finally {
      await sql.end({ timeout: 2 }).catch(() => {});
    }
  }
  flush();
  return connected;
}

function checkLogin(databaseConnected) {
  begin(5, "Login");
  // Accounts and sessions are rows in the database (docs/rules/AUTH.md); there is nothing else to configure.
  if (databaseConnected) ok("Sign-in is ready", "accounts are stored in the database");
  else warn("Nobody can sign in or create an account until the database is connected", `Connect the database  ${step(11)}`);
  flush();
}

function checkPayments(local) {
  begin(6, "Payments");
  if (local.STRIPE_SECRET_KEY) {
    ok("Stripe key is set");
    if (local.STRIPE_SECRET_KEY.startsWith("sk_live_")) warn("That is a LIVE Stripe key — real cards will be charged", "Use a test key (sk_test_…) on your own computer");
    if (!local.STRIPE_WEBHOOK_SECRET) warn("STRIPE_WEBHOOK_SECRET is empty — payments will not be recorded", "See docs/rules/PAYMENTS.md");
  } else {
    info("Placeholder checkout is in use (no money moves). See docs/rules/PAYMENTS.md to connect Stripe.");
  }
  flush();
}

function checkGit() {
  begin(7, "Git");
  let github = null; // true: reached the project on GitHub, false: tried and could not, null: not tried
  if (run("git --version") === null) {
    const install = isWindows
      ? "Install it from https://git-scm.com/download/win"
      : isMac
        ? "Run   xcode-select --install   in the Terminal and choose Install"
        : "Install it from https://git-scm.com/downloads";
    fail("Git is not installed — you cannot get, publish or deploy the project", `${install}, then run this again  ${step(4)}`);
  } else if (run("git rev-parse --is-inside-work-tree") !== "true") {
    warn("This folder is not a git project yet", "git init -b develop");
  } else {
    // All work happens on develop; main only moves on deploy (docs/rules/WORKFLOW.md).
    const branch = run("git branch --show-current");
    if (branch === "develop") ok("On the develop branch");
    else fail(`You are on "${branch || "no branch"}" — all work happens on develop`, "git switch develop");

    if (run("git config user.name") && run("git config user.email")) ok("Git knows your name and email");
    else warn("Git does not know who you are yet, so it cannot save a version", `git config --global user.name "Your Name"   and   git config --global user.email "you@example.com"  ${step(8)}`);

    if (run("git ls-files --error-unmatch .env.local") !== null) {
      fail(".env.local is saved in git — its secrets would be published", "git rm --cached .env.local");
    }
    if (run("git check-ignore CLAUDE.md HELP.md AGENTS.md")) {
      fail("CLAUDE.md, HELP.md or AGENTS.md is ignored by git, so a teammate would not receive it", "Remove that line from .gitignore");
    }

    if (!run("git remote")) {
      warn("No GitHub address yet — your work only exists on this computer", "npm run help -- 8   (first-time GitHub setup)");
    } else {
      ok("The project has a GitHub address");
      if (!quiet) github = run("git ls-remote --heads origin develop", { timeoutMs: 15000 }) !== null;
      // Compares against what this computer last heard from GitHub; `npm run sync` refreshes that.
      const waiting = run("git rev-list --count origin/develop..HEAD");
      const behind = run("git rev-list --count HEAD..origin/develop");
      const undeployed = run("git rev-list --count origin/main..origin/develop");
      if (waiting === null) warn("Nothing has been published yet", 'npm run publish -- "first version"   (save to GitHub)');
      else if (Number(waiting) > 0) info(`${waiting} saved version(s) not published yet — npm run publish (save to GitHub)`);
      if (Number(behind) > 0) warn(`GitHub has ${behind} change(s) this computer does not`, "npm run sync   (get the latest from GitHub)");
      if (Number(undeployed) > 0) info(`${undeployed} published version(s) not on the live site yet — npm run deploy (deploy to Vercel)`);
    }
    const unsaved = run("git status --porcelain");
    if (unsaved) info(`${unsaved.split("\n").length} file(s) changed since the last saved version`);
  }
  flush();
  return github;
}

function checkTools() {
  begin(8, "Tools (optional)");
  // On a Mac the `code` command only exists after an extra step inside VS Code, so look for the app too.
  const macApp = ["/Applications", path.join(os.homedir(), "Applications")].some((dir) => fs.existsSync(path.join(dir, "Visual Studio Code.app")));
  if (run("code --version") !== null || (isMac && macApp)) ok("VS Code is installed");
  else info(`VS Code (the editor) was not found. Get it from https://code.visualstudio.com  ${step(6)}`);
  if (run("claude --version") !== null) ok("Claude Code is installed");
  else info(`Claude Code (the coding agent) was not found. Get it from https://claude.com/claude-code  ${step(7)}`);

  // A Mac refuses to run a double-click file that is not marked as runnable (docs/rules/WORKFLOW.md, "Double-click files").
  if (isMac) {
    const launchers = fs.readdirSync(ROOT).filter((name) => name.endsWith(".command"));
    const blocked = launchers.filter((name) => (fs.statSync(fromRoot(name)).mode & 0o100) === 0);
    if (blocked.length > 0 && isFix) {
      for (const name of blocked) fs.chmodSync(fromRoot(name), 0o755);
      ok("The double-click files were marked as runnable");
    } else if (blocked.length > 0) {
      warn(`These double-click files are not marked as runnable: ${blocked.join(", ")}`, "npm run doctor -- --fix   (or: chmod +x *.command)");
    } else if (launchers.length > 0) {
      ok("The double-click files can run");
    }
  }
  flush();
}

async function checkAccounts(github, databaseConnected, usesLocalDatabase) {
  begin(9, "Accounts");
  if (github === true) ok("GitHub: this computer can reach the project");
  else if (github === false && isMac) warn("GitHub: could not reach the project from this computer", `Check that you accepted the invitation (https://github.com/notifications), then sign in with   gh auth login  ${step(4)}`);
  else if (github === false) warn("GitHub: could not reach the project from this computer", `Check that you accepted the invitation and are signed in — https://github.com/notifications  ${step(1)}`);
  else info(`GitHub: not checked. Account: https://github.com/signup  ${step(1)}`);

  if (usesLocalDatabase) info("Supabase: holds the live site's database, not this computer's. It is checked through the live site below (HELP.md, section 5)");
  else if (databaseConnected) ok("Supabase: the database answers");
  else info(`Supabase: not proven until the database connects. Account: https://supabase.com/dashboard  ${step(3)}`);

  // An account cannot be seen from here, but the site Vercel hosts can.
  const liveSite = JSON.parse(read("package.json")).homepage;
  if (!liveSite) {
    info(`Vercel: no live site address in package.json yet. Account: https://vercel.com/signup  ${step(2)}`);
  } else if (quiet) {
    info(`Vercel: the live site is ${liveSite}`);
  } else {
    try {
      const health = await (await fetch(`${liveSite}/api/health`, { signal: AbortSignal.timeout(8000) })).json();
      ok(`Vercel: the live site is up — ${liveSite}`, `its database is "${health.data.database}"`);
    } catch {
      warn(`Vercel: the live site did not answer — ${liveSite}`, "Open the project on https://vercel.com and read the newest deployment's log (docs/setup/DEPLOY.md)");
    }
    info(`Vercel: your own account cannot be checked from here. Sign in at https://vercel.com  ${step(2)}`);
  }
  flush();
}

// ---- main ------------------------------------------------------------------

checkNode();
checkPackages();
const local = checkSettings();
const databaseConnected = await checkDatabase(local);
checkLogin(databaseConnected);
checkPayments(local);
const github = checkGit();
checkTools();
await checkAccounts(github, databaseConnected, isLocalDatabase(local.DATABASE_URL ?? ""));

const reds = results.filter((r) => r.worst === "fail");
const yellows = results.filter((r) => r.worst === "warn");

if (reds.length > 0) {
  console.log(paint("red", `\n${icons.fail} ${reds.length} check(s) red: ${reds.map((r) => r.title).join(", ")}`));
  console.log(paint("bold", `  Next: ${reds[0].firstFix}`));
  process.exit(1);
}
if (!quiet) {
  const greens = results.length - yellows.length;
  const tail = yellows.length > 0 ? `, ${yellows.length} with warnings (the app still runs)` : "";
  console.log(paint("green", `\n${icons.ok} ready — ${greens}/${results.length} checks green${tail}`));
  console.log(paint("bold", "  Next: npm run dev   then open http://localhost:3000"));
  console.log(paint("dim", "  New here? The checklist is ONBOARDING.md.  Lost? npm run help"));
}
