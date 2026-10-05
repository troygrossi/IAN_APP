import Link from "next/link";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth/actions";
import { safeNextPath } from "@/lib/auth/config";
import { getSession } from "@/lib/auth/session";
import { AuthForm } from "../auth-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getSession()) redirect(safeNextPath(next));

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <AuthForm action={signIn} mode="sign-in" next={next} />
      <p className="text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/signup" className="text-foreground underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
