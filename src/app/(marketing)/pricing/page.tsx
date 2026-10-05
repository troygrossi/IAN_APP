import { Button } from "@/components/ui/button";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { startCheckout } from "@/lib/billing/actions";
import { PLANS } from "@/lib/billing/plans";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
      <PlaceholderNotice>Plans and prices are examples. No real payment is taken.</PlaceholderNotice>
      <div className="grid gap-4 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <section key={plan.id} className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p>
              <span className="text-3xl font-semibold">${plan.pricePerMonthUsd}</span>
              <span className="text-muted-foreground"> per month</span>
            </p>
            <ul className="flex flex-1 list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            {plan.pricePerMonthUsd > 0 && (
              <form action={startCheckout}>
                <input type="hidden" name="plan" value={plan.id} />
                <Button>Choose {plan.name}</Button>
              </form>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
