import Link from "next/link";
import { SignInForm } from "../sign-in-form";

export const metadata = { title: "Sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
      <SignInForm submitLabel="Sign in" next={next} error={error} />
      <p className="text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/signup" className="text-foreground underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
