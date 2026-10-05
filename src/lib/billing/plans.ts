// The plans shown on /pricing and /dashboard/billing (docs/rules/PAYMENTS.md).
// PLACEHOLDER prices. When Stripe is connected, each paid plan gains a Stripe price id.

export const PLANS = [
  {
    id: "free",
    name: "Free",
    pricePerMonthUsd: 0,
    features: ["Placeholder feature one", "Placeholder feature two"],
  },
  {
    id: "pro",
    name: "Pro",
    pricePerMonthUsd: 10,
    features: ["Everything in Free", "Placeholder feature three", "Placeholder feature four"],
  },
] as const;

export type Plan = (typeof PLANS)[number];
export type PlanId = Plan["id"];

export const PLAN_COOKIE = "demo_plan";

export function getPlan(id: unknown): Plan {
  return PLANS.find((plan) => plan.id === id) ?? PLANS[0];
}
