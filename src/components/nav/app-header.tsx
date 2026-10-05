import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth/actions";
import { accountNav, appNav } from "./nav-items";
import { NavLinks } from "./nav-links";
import { TabBar } from "./tab-bar";

/**
 * The header on signed-in pages. From the small breakpoint up the sections sit here;
 * on a phone they move to the tab bar at the bottom, and the account links get their own row.
 */
export function AppHeader({ email }: { email: string }) {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" aria-label="Harvest the Wheel dashboard">
              <Logo />
            </Link>
            <div className="hidden sm:block">
              <NavLinks items={appNav} label="Sections" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="hidden md:block">
              <NavLinks items={accountNav} label="Account" />
            </div>
            <form action={signOut} className="flex items-center gap-3">
              <span className="hidden text-sm text-muted-foreground lg:inline">{email}</span>
              <Button variant="secondary">Sign out</Button>
            </form>
          </div>
        </div>
        <div className="border-t border-border px-4 py-2 md:hidden">
          <NavLinks items={accountNav} label="Account" />
        </div>
      </header>
      <TabBar items={appNav} />
    </>
  );
}
