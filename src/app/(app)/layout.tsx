import { redirect } from "next/navigation";
import { AppHeader } from "@/components/nav/app-header";
import { LOGIN_PATH } from "@/lib/auth/config";
import { getSession } from "@/lib/auth/session";

// The second login gate (docs/rules/AUTH.md): every page in the (app) folder is
// wrapped by this layout, so none of them can render for a signed-out visitor.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect(LOGIN_PATH);

  return (
    <>
      <AppHeader email={session.user.email} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </>
  );
}
