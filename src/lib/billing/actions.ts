"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PLAN_COOKIE, getPlan } from "./plans";

// PLACEHOLDER payment actions (docs/rules/PAYMENTS.md). No money moves.
// The real startCheckout will create a Stripe Checkout session and redirect to Stripe;
// the real plan change will arrive through /api/webhooks/stripe, not from the browser.

export async function startCheckout(formData: FormData) {
  redirect(`/checkout?plan=${getPlan(formData.get("plan")).id}`);
}

export async function completeDemoCheckout(formData: FormData) {
  const plan = getPlan(formData.get("plan"));
  (await cookies()).set(PLAN_COOKIE, plan.id, { httpOnly: true, sameSite: "lax", path: "/" });
  redirect(`/checkout/success?plan=${plan.id}`);
}

export async function cancelDemoPlan() {
  (await cookies()).delete(PLAN_COOKIE);
  redirect("/dashboard/billing");
}
