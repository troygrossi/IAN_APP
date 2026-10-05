import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";
import { APP_NAME, appNav } from "./nav-items";
import { NavLinks } from "./nav-links";

/** The header on signed-in pages. */
export function AppHeader({ email }: { email: string }) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/dashboard" className="font-semibold">
            {APP_NAME}
          </Link>
          <NavLinks items={appNav} />
        </div>
        <form action={signOut} className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{email}</span>
          <Button variant="secondary">Sign out</Button>
        </form>
      </div>
    </header>
  );
}
