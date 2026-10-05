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
 *   5. Login           — placeholder or connected
 *   6. Payments        — placeholder or connected
 *   7. Git             — on develop, connected to GitHub, and what is waiting to publish or deploy
 *
 * Exit code: 1 when a required check is red, else 0.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import { ROOT, exists, fromRoot, icons, paint, read, readEnvFile } from "./lib/report.mjs";

const argv = process.argv.slice(2);
const isFix = argv.includes("--fix");
const quiet = argv.includes("--quiet");

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

function run(command) {
  try {
    return execSync(command, { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
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
    fail(`Node ${process.versions.node} is too old — this app needs ${wanted} or newer`, "Install the LTS version from https://nodejs.org, then run this again");
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
      warn("There is no .env.local yet — the app runs, but nothing that needs a secret will work", "npm run doctor -- --fix   (copies .env.example for you)");
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

async function checkDatabase(local) {
  begin(4, "Database");
  const url = local.DATABASE_URL;
  if (!url) {
    warn("DATABASE_URL is empty — pages load, but saving data says \"database is not connected yet\"", "npm run help -- 5   (how to connect Supabase)");
  } else if (!/^postgres(ql)?:\/\//.test(url)) {
    fail("DATABASE_URL does not look like a Postgres address (it should start with postgresql://)", "npm run help -- 5   (where to copy it from)");
  } else if (quiet) {
    ok("DATABASE_URL is set");
  } else if (!exists("node_modules", "postgres")) {
    warn("Cannot test the connection until packages are installed", "npm install");
  } else {
    const { default: postgres } = await import("postgres");
    const sql = postgres(url, { max: 1, connect_timeout: 8, prepare: false, onnotice() {} });
    try {
      const [row] = await sql`select to_regclass('public.notes') as notes, to_regclass('public.profiles') as profiles`;
      ok("Connected to the database");
      if (row.notes && row.profiles) ok("Tables exist");
      else fail("Connected, but the tables have not been created yet", "npm run db:migrate");
    } catch (err) {
      const reason = err?.code === "28P01" ? "the password was rejected" : (err?.code ?? "no answer");
      fail(`Could not connect to the database (${reason})`, "Check DATABASE_URL in .env.local against Supabase — npm run help -- 5");
    } finally {
      await sql.end({ timeout: 2 }).catch(() => {});
    }
  }
  flush();
}

function checkLogin(local) {
  begin(5, "Login");
  if (local.NEXT_PUBLIC_SUPABASE_URL && local.NEXT_PUBLIC_SUPABASE_ANON_KEY) ok("Supabase login keys are set");
  else info("Placeholder login is in use (any email signs in). See docs/rules/AUTH.md to connect the real one.");
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
  if (run("git --version") === null) {
    warn("Git is not installed — you cannot save history or deploy", "Install it from https://git-scm.com");
  } else if (run("git rev-parse --is-inside-work-tree") !== "true") {
    warn("This folder is not a git project yet", "git init -b develop");
  } else {
    // All work happens on develop; main only moves on deploy (docs/rules/WORKFLOW.md).
    const branch = run("git branch --show-current");
    if (branch === "develop") ok("On the develop branch");
    else fail(`You are on "${branch || "no branch"}" — all work happens on develop`, "git switch develop");

    if (run("git ls-files --error-unmatch .env.local") !== null) {
      fail(".env.local is saved in git — its secrets would be published", "git rm --cached .env.local");
    }
    if (run("git check-ignore CLAUDE.md HELP.md AGENTS.md")) {
      fail("CLAUDE.md, HELP.md or AGENTS.md is ignored by git, so a teammate would not receive it", "Remove that line from .gitignore");
    }

    if (!run("git remote")) {
      warn("No GitHub address yet — your work only exists on this computer", "npm run help -- 8   (first-time GitHub setup)");
    } else {
      ok("Connected to GitHub");
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
}

// ---- main ------------------------------------------------------------------

checkNode();
checkPackages();
const local = checkSettings();
await checkDatabase(local);
checkLogin(local);
checkPayments(local);
checkGit();

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
  console.log(paint("dim", "  Lost? npm run help"));
}
