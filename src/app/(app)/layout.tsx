import { AppHeader } from "@/components/nav/app-header";
import { requirePageSession } from "@/lib/auth/session";

// The second login gate (docs/rules/AUTH.md). This layout wraps every page in the (app)
// folder, but it does not stop a page from running, so each page asks the same question itself.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requirePageSession();

  return (
    <>
      <AppHeader email={session.user.email} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </>
  );
}
