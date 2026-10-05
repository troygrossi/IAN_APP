// Shared by the scripts in this folder: colors, icons, paths, and reading .env files.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const fromRoot = (...parts) => path.join(ROOT, ...parts);
export const exists = (...parts) => fs.existsSync(fromRoot(...parts));
export const read = (...parts) => fs.readFileSync(fromRoot(...parts), "utf8");

const ANSI = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
};
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
export const paint = (color, text) => (useColor ? `${ANSI[color]}${text}${ANSI.reset}` : text);
export const icons = { ok: "✓", fail: "✗", warn: "⚠", info: "ℹ", arrow: "→" };

/** Reads KEY=value lines from an env file. Returns {} when the file is missing. */
export function readEnvFile(...parts) {
  if (!exists(...parts)) return {};
  const values = {};
  for (const line of read(...parts).split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match) values[match[1]] = match[2].replace(/^(["'])(.*)\1$/, "$2");
  }
  return values;
}

/** Every key an env file mentions, including commented-out ones like `# STRIPE_SECRET_KEY=`. */
export function envKeysMentioned(...parts) {
  if (!exists(...parts)) return [];
  return [...read(...parts).matchAll(/^\s*#?\s*([A-Z][A-Z0-9_]+)=/gm)].map((m) => m[1]);
}
