"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { AuthFormState } from "@/lib/auth/actions";

type Props = {
  action: (previous: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  mode: "sign-in" | "sign-up";
  next?: string;
};

const inputClass =
  "min-h-11 rounded-lg border border-border bg-card px-3 py-2 text-base font-normal focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary";

/** The form on /login and /signup. The server action decides; this only shows the result. */
export function AuthForm({ action, mode, next }: Props) {
  const [state, formAction, pending] = useActionState(action, {});
  const signUp = mode === "sign-up";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}
      <label className="flex flex-col gap-1 text-sm font-medium">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          defaultValue={state.email}
          placeholder="you@example.com"
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Password
        <input
          type="password"
          name="password"
          required
          minLength={signUp ? 10 : undefined}
          maxLength={200}
          // These hints let a password manager offer to create or fill the password.
          autoComplete={signUp ? "new-password" : "current-password"}
          className={inputClass}
        />
        {signUp && <span className="font-normal text-muted-foreground">At least 10 characters. A few random words work well.</span>}
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      )}
      <Button disabled={pending}>{pending ? "One moment…" : signUp ? "Create account" : "Sign in"}</Button>
    </form>
  );
}
