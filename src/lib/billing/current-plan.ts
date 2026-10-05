import { cookies } from "next/headers";
import { PLAN_COOKIE, getPlan, type Plan } from "./plans";

/** PLACEHOLDER — reads the demo cookie. The real version reads `profiles.plan` from the database. */
export async function getCurrentPlan(): Promise<Plan> {
  return getPlan((await cookies()).get(PLAN_COOKIE)?.value);
}
