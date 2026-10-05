import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

// Passwords are never stored. What is stored is a hash: a one-way scramble that
// can check a password but cannot be turned back into one (docs/rules/AUTH.md).
// scrypt is built into Node and is slow on purpose, so guessing is expensive.

// The cost settings are saved inside each hash, so they can be raised later
// without breaking existing accounts.
const COST = { N: 2 ** 15, r: 8, p: 1 };
const KEY_BYTES = 32;

function derive(password: string, salt: Buffer, cost: typeof COST): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // maxmem: scrypt at this cost needs about 32 MB, just over Node's default limit.
    scrypt(password, salt, KEY_BYTES, { ...cost, maxmem: 64 * 1024 * 1024 }, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

/** Returns "scrypt$N$r$p$salt$hash". The salt is random, so equal passwords get different hashes. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, COST);
  return ["scrypt", COST.N, COST.r, COST.p, salt.toString("base64"), key.toString("base64")].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, N, r, p, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const actual = await derive(password, Buffer.from(salt, "base64"), { N: Number(N), r: Number(r), p: Number(p) });
  // timingSafeEqual takes the same time whether the first or the last byte differs.
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
