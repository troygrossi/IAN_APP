import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";
import { APP_NAME, marketingNav } from "./nav-items";
import { NavLinks } from "./nav-links";

/** The header on public pages. */
export async function SiteHeader() {
  const session = await getSession();
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/" className="font-semibold">
            {APP_NAME}
          </Link>
          <NavLinks items={marketingNav} />
        </div>
        {session ? (
          <Link href="/dashboard" className={buttonClass()}>
            Open dashboard
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className={buttonClass("secondary")}>
              Sign in
            </Link>
            <Link href="/signup" className={buttonClass()}>
              Create account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
