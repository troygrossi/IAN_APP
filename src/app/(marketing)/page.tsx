import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { APP_NAME } from "@/components/nav/nav-items";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-semibold tracking-tight">{APP_NAME}</h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        One sentence about what this product does and who it is for goes here.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link href="/signup" className={buttonClass()}>
          Create account
        </Link>
        <Link href="/pricing" className={buttonClass("secondary")}>
          See pricing
        </Link>
      </div>
      <PlaceholderNotice>
        This is the starter. Sign-in and payment are simulated so you can click through the whole flow.
      </PlaceholderNotice>
    </div>
  );
}
