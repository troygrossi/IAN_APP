"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { LOGIN_PATH, SESSION_COOKIE, safeNextPath } from "./config";

// PLACEHOLDER login actions (docs/rules/AUTH.md). Forms that end in a redirect
// use a server action like these; everything else goes through /api/*.

export async function signInDemo(formData: FormData) {
  const email = z.email().safeParse(formData.get("email"));
  if (!email.success) redirect(`${LOGIN_PATH}?error=invalid-email`);

  (await cookies()).set(SESSION_COOKIE, email.data, { httpOnly: true, sameSite: "lax", path: "/" });
  redirect(safeNextPath(formData.get("next")));
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
