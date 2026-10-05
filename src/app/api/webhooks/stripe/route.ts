import { fail } from "@/lib/api/response";
import { AppError } from "@/lib/errors";

// PLACEHOLDER — Stripe will call this address after a payment (docs/rules/PAYMENTS.md).
// The real version must verify the Stripe signature before trusting anything in the request.
export async function POST() {
  return fail(new AppError("service-down", "Payments are not connected yet."), "POST /api/webhooks/stripe");
}
