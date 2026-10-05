import Link from "next/link";
import { Button, buttonClass } from "@/components/ui/button";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { completeDemoCheckout } from "@/lib/billing/actions";
import { getPlan } from "@/lib/billing/plans";

export const metadata = { title: "Checkout" };

// Stands in for the payment page that Stripe will host (docs/rules/PAYMENTS.md).
export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const plan = getPlan((await searchParams).plan ?? "pro");
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
      <PlaceholderNotice>This stands in for the Stripe payment page. No card is asked for or charged.</PlaceholderNotice>
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
        <p className="flex justify-between">
          <span>{plan.name} plan</span>
          <span className="font-semibold">${plan.pricePerMonthUsd} per month</span>
        </p>
        <form action={completeDemoCheckout} className="flex flex-wrap gap-3">
          <input type="hidden" name="plan" value={plan.id} />
          <Button>Pretend to pay ${plan.pricePerMonthUsd}</Button>
          <Link href="/pricing" className={buttonClass("secondary")}>
            Cancel
          </Link>
        </form>
      </section>
    </>
  );
}
