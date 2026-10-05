import Link from "next/link";
import { redirect } from "next/navigation";
import { signUp } from "@/lib/auth/actions";
import { AFTER_LOGIN_PATH } from "@/lib/auth/config";
import { getSession } from "@/lib/auth/session";
import { AuthForm } from "../auth-form";

export const metadata = { title: "Create account" };

export default async function SignupPage() {
  if (await getSession()) redirect(AFTER_LOGIN_PATH);

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="text-sm text-muted-foreground">
          Follow The Harvester&rsquo;s wheel trades on the Core Four, and learn how the strategy works.
        </p>
      </div>
      <AuthForm action={signUp} mode="sign-up" />
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-foreground underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
