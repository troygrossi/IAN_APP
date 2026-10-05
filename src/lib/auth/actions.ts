"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { signInInput, signUpInput } from "@/lib/contracts/auth";
import { AppError } from "@/lib/errors";
import { createSession, deleteSession } from "@/lib/services/sessions";
import { checkCredentials, createUser } from "@/lib/services/users";
import { SESSION_COOKIE, safeNextPath } from "./config";
import { clearSessionCookie, setSessionCookie } from "./session";

// Sign-up, sign-in and sign-out (docs/rules/AUTH.md). Forms that end in a redirect
// use a server action like these; everything else goes through /api/*.

/** What a form gets back when it must be shown again. The password is never sent back. */
export type AuthFormState = { error?: string; email?: string };

async function run(formData: FormData, work: () => Promise<{ id: string }>): Promise<AuthFormState> {
  try {
    const user = await work();
    const { token, expiresAt } = await createSession(user.id);
    await setSessionCookie(token, expiresAt);
  } catch (err) {
    const email = String(formData.get("email") ?? "");
    if (err instanceof ZodError) return { email, error: err.issues[0]?.message };
    if (err instanceof AppError) return { email, error: err.message };
    console.error("[auth action]", err);
    return { email, error: "Something went wrong on our side. Please try again." };
  }
  // redirect() works by throwing, so it must stay outside the try above.
  redirect(safeNextPath(formData.get("next")));
}

export async function signUp(_previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
  return run(formData, async () => createUser(signUpInput.parse(Object.fromEntries(formData))));
}

export async function signIn(_previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
  return run(formData, async () => checkCredentials(signInInput.parse(Object.fromEntries(formData))));
}

export async function signOut() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  // Deleting the row is what ends the session; a copied cookie stops working too.
  if (token) await deleteSession(token).catch((err) => console.error("[signOut]", err)); // still clear the cookie below
  await clearSessionCookie();
  redirect("/");
}
