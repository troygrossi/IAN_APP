import { Button } from "@/components/ui/button";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { cancelDemoPlan, startCheckout } from "@/lib/billing/actions";
import { getCurrentPlan } from "@/lib/billing/current-plan";

export const metadata = { title: "Billing" };

export default async function BillingPage() {
  const plan = await getCurrentPlan();
  const paid = plan.pricePerMonthUsd > 0;
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
      <PlaceholderNotice>No real payment is taken. Your plan is remembered in this browser only.</PlaceholderNotice>
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
        <p>
          Current plan: <span className="font-semibold">{plan.name}</span>{" "}
          <span className="text-muted-foreground">(${plan.pricePerMonthUsd} per month)</span>
        </p>
        {paid ? (
          <form action={cancelDemoPlan}>
            <Button variant="secondary">Switch to Free</Button>
          </form>
        ) : (
          <form action={startCheckout}>
            <input type="hidden" name="plan" value="pro" />
            <Button>Upgrade to Pro</Button>
          </form>
        )}
      </section>
    </div>
  );
}
