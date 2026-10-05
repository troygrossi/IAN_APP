import { Button } from "@/components/ui/button";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { signInDemo } from "@/lib/auth/actions";

/** The form shared by /login and /signup while login is a placeholder. */
export function SignInForm({ submitLabel, next, error }: { submitLabel: string; next?: string; error?: string }) {
  return (
    <form action={signInDemo} className="flex flex-col gap-4">
      <PlaceholderNotice>Type any email address. No password, and nothing is checked.</PlaceholderNotice>
      {next && <input type="hidden" name="next" value={next} />}
      <label className="flex flex-col gap-1 text-sm font-medium">
        Email
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="rounded-md border border-border bg-card px-3 py-2 text-base font-normal"
        />
      </label>
      {error === "invalid-email" && (
        <p role="alert" className="text-sm text-danger">
          That does not look like an email address. Check it and try again.
        </p>
      )}
      <Button>{submitLabel}</Button>
    </form>
  );
}
