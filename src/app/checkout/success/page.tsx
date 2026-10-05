import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { getPlan } from "@/lib/billing/plans";

export const metadata = { title: "Payment complete" };

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const plan = getPlan((await searchParams).plan);
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">You are on the {plan.name} plan</h1>
      <p className="text-muted-foreground">This was a simulated payment. Nothing was charged.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard" className={buttonClass()}>
          Open dashboard
        </Link>
        <Link href="/dashboard/billing" className={buttonClass("secondary")}>
          View billing
        </Link>
      </div>
    </>
  );
}
