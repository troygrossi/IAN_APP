import { z } from "zod";

// What the sign-in and sign-up forms send (docs/rules/TYPES.md).

const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("That does not look like an email address. Check it and try again.").max(254, "That email address is too long."));

export const signInInput = z.object({
  email,
  // No length rule here: an old account must still be able to sign in if the rule changes.
  password: z.string().min(1, "Type your password.").max(200, "That password is too long."),
});

export const signUpInput = z.object({
  email,
  // Length beats complexity rules. The upper limit stops someone sending a huge
  // password just to keep the server busy hashing it.
  password: z.string().min(10, "Use at least 10 characters for your password.").max(200, "Keep your password under 200 characters."),
});

export type Credentials = z.infer<typeof signInInput>;
