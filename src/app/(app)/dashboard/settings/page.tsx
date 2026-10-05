import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { getSession } from "@/lib/auth/session";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await getSession();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <PlaceholderNotice>Account settings will go here once login is connected.</PlaceholderNotice>
      <dl className="rounded-lg border border-border bg-card p-6 text-sm">
        <dt className="text-muted-foreground">Email</dt>
        <dd>{session?.user.email}</dd>
      </dl>
    </div>
  );
}
