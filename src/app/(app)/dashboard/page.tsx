import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getCurrentPlan } from "@/lib/billing/current-plan";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [session, plan] = await Promise.all([getSession(), getCurrentPlan()]);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">Signed in as {session?.user.email}.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/notes" className="rounded-lg border border-border bg-card p-5 hover:bg-muted">
          <h2 className="font-semibold">Notes</h2>
          <p className="text-sm text-muted-foreground">The example feature. It saves to the database.</p>
        </Link>
        <Link href="/dashboard/billing" className="rounded-lg border border-border bg-card p-5 hover:bg-muted">
          <h2 className="font-semibold">Billing</h2>
          <p className="text-sm text-muted-foreground">You are on the {plan.name} plan.</p>
        </Link>
      </div>
    </div>
  );
}
