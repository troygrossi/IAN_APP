#!/usr/bin/env node

/**
 * help — prints HELP.md in the terminal.
 *
 *   npm run help               the list of sections
 *   npm run help -- 5          one section, by number
 *   npm run help -- database   one section, by a word in its title
 *   npm run help -- --all      everything
 *
 * The words live in HELP.md, not here. To change the help, edit HELP.md.
 */
import { icons, paint, read } from "./lib/report.mjs";

const arg = process.argv.slice(2).join(" ").trim();
const text = read("HELP.md");

// A section starts at a line like "## 5. Connecting the database".
const sections = text
  .split(/^(?=## \d+\. )/m)
  .filter((part) => /^## \d+\. /.test(part))
  .map((body) => {
    const [, number, title] = body.match(/^## (\d+)\. (.+)/);
    return { number, title: title.trim(), body: body.trimEnd() };
  });

function printList() {
  console.log(paint("bold", "\nHelp — pick a section:\n"));
  for (const s of sections) console.log(`  ${paint("cyan", s.number.padStart(2))}  ${s.title}`);
  console.log(paint("dim", `\n  ${icons.arrow} npm run help -- 3          (by number)`));
  console.log(paint("dim", `  ${icons.arrow} npm run help -- database   (by a word in the title)`));
  console.log(paint("dim", `  ${icons.arrow} npm run doctor             (check that this computer is ready)\n`));
}

if (arg === "" || arg === "--list") {
  printList();
} else if (arg === "--all") {
  console.log(text);
} else {
  const found = sections.find((s) => s.number === arg) ?? sections.find((s) => s.title.toLowerCase().includes(arg.toLowerCase()));
  if (found) {
    console.log(`\n${found.body}\n`);
  } else {
    console.log(paint("yellow", `\n${icons.warn} No help section matches "${arg}".`));
    printList();
    process.exitCode = 1;
  }
}
