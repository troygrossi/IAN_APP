#!/usr/bin/env node

/**
 * check-docs — do the documents still match the project?   (npm run check:docs)
 *
 * It checks only what a script can honestly judge (items 6 and 7 are described where they run):
 *   1. Every command in package.json is explained in HELP.md.
 *   2. Every `npm run <name>` written in a document is a real command.
 *   3. Every link from one document to another file points at a file that exists.
 *   4. Every environment variable the code reads has a line in .env.example.
 *   5. Every docs/... path cited in a code comment exists.
 *
 * Exit code: 1 when anything is wrong, else 0. Every problem names its fix.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ROOT, envKeysMentioned, exists, icons, paint, read } from "./lib/report.mjs";

const SKIP = new Set(["node_modules", ".next", ".git", "drizzle"]);

function walk(dir, wanted, found = []) {
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const rel = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel, wanted, found);
    else if (wanted.test(entry.name)) found.push(rel);
  }
  return found;
}

const problems = []; // { what, fix }
const problem = (what, fix) => problems.push({ what, fix });

// AGENTS.md is written by Next.js, not by us.
const docs = walk(".", /\.md$/).filter((file) => file !== "AGENTS.md");
const code = [...walk("src", /\.(ts|tsx|css)$/), ...walk("scripts", /\.mjs$/), "drizzle.config.ts"];
const scripts = Object.keys(JSON.parse(read("package.json")).scripts);

// 1. Every command is explained in HELP.md.
const help = read("HELP.md");
for (const name of scripts) {
  if (!help.includes(`npm run ${name}`)) problem(`HELP.md does not explain "npm run ${name}"`, "Add a row for it to the Commands table in HELP.md");
}

for (const file of docs) {
  const text = read(file);

  // 2. Every `npm run <name>` in a document is real.
  for (const [, name] of text.matchAll(/npm run ([a-z][a-z0-9:_-]*)/g)) {
    if (!scripts.includes(name)) problem(`${file} mentions "npm run ${name}", which does not exist`, "Fix the name, or add the command to package.json");
  }

  // 3. Links between documents resolve.
  for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const clean = target.split("#")[0];
    if (!fs.existsSync(path.join(ROOT, path.dirname(file), clean))) problem(`${file} links to "${target}", which does not exist`, "Fix the link, or restore the file");
  }
}

// 4. Environment variables the code reads are documented.
const documented = new Set(envKeysMentioned(".env.example"));
for (const file of code) {
  const text = read(file);
  for (const [, key] of text.matchAll(/process\.env\.([A-Z][A-Z0-9_]+)/g)) {
    if (key !== "NODE_ENV" && key !== "NO_COLOR" && !documented.has(key)) problem(`${file} reads ${key}, which is not in .env.example`, `Add a commented "${key}=" line to .env.example`);
  }
  // 5. Cited document paths exist.
  for (const [cited] of text.matchAll(/docs\/[A-Za-z0-9_\-/]+\.md/g)) {
    if (!exists(cited)) problem(`${file} cites ${cited}, which does not exist`, "Fix the path in the comment");
  }
}

// 6. One word per action (docs/rules/WORKFLOW.md, "The words we use").
// Ledgers (decisions, the log) are never rewritten, so they are not held to this.
const TERMS = [
  { word: /\bpublish/i, descriptor: "Publish (save to GitHub)" },
  { word: /\bdeploy/i, descriptor: "Deploy (deploy to Vercel)" },
];
const living = docs.filter((file) => !file.startsWith("docs/decisions/") && file !== "docs/work/LOG.md");
for (const file of living) {
  const text = read(file);
  for (const { word, descriptor } of TERMS) {
    // Command names inside code, like `npm run deploy`, are not prose.
    const prose = text.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
    if (word.test(prose) && !text.toLowerCase().includes(descriptor.toLowerCase())) {
      problem(`${file} uses the word "${descriptor.split(" ")[0]}" without its descriptor`, `Write "${descriptor}" the first time the word appears in that file`);
    }
  }
  if (file === "docs/rules/WORKFLOW.md" || file === "CLAUDE.md") continue; // the two places that name the words we do not use
  text.split(/\r?\n/).forEach((line, index) => {
    if (/\bpush(ed|es|ing)?\b/i.test(line) && !line.includes("git push")) {
      problem(`${file}:${index + 1} says "push"; this project's word is Publish`, 'Write "Publish (save to GitHub)", or "Deploy (deploy to Vercel)" if it is about the live site');
    }
  });
}

// 7. The files a teammate must receive are not ignored by git.
const ignored = spawnSync("git", ["check-ignore", "CLAUDE.md", "AGENTS.md", "HELP.md", ".env.example"], { cwd: ROOT, encoding: "utf8" }).stdout?.trim();
if (ignored) problem(`git ignores ${ignored.split(/\s+/).join(", ")}, so a teammate would not receive it`, "Remove that line from .gitignore");

// 8. Every everyday command has a double-click file (docs/rules/WORKFLOW.md, "Double-click files").
const LAUNCHERS = { "Start App.cmd": "dev", "Doctor.cmd": "doctor", "Sync.cmd": "sync", "Publish.cmd": "publish", "Deploy.cmd": "deploy", "Help.cmd": "help" };
for (const [file, script] of Object.entries(LAUNCHERS)) {
  if (!exists(file)) problem(`The double-click file "${file}" is missing`, `Restore it; it should run "npm run ${script}"`);
  else {
    if (!read(file).includes(`npm run ${script}`)) problem(`"${file}" does not run "npm run ${script}"`, "A double-click file only starts its npm command; put the logic in scripts/");
    if (!help.includes(file)) problem(`HELP.md does not mention "${file}"`, "Add it to the Commands table in HELP.md");
  }
}

if (problems.length === 0) {
  console.log(paint("green", `${icons.ok} docs match the project — ${docs.length} documents, ${scripts.length} commands checked`));
} else {
  for (const { what, fix } of problems) {
    console.log(paint("red", `${icons.fail} ${what}`));
    console.log(paint("bold", `    ${icons.arrow} ${fix}`));
  }
  console.log(paint("red", `\n${icons.fail} ${problems.length} problem(s) in the docs`));
  process.exit(1);
}
