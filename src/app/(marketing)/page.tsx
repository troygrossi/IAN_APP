import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { buttonClass } from "@/components/ui/button";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";

const CORE_FOUR = ["MARA", "RGTI", "IONQ", "CIFR"] as const;

const WHAT_YOU_GET = [
  {
    title: "Live positions",
    body: "See where each Core Four stock sits in the wheel, the price, and the premium collected.",
  },
  {
    title: "Trade alerts",
    body: "Know when The Harvester sells a put or a call, gets assigned, or has shares called away.",
  },
  {
    title: "Learn as you watch",
    body: "Plain-English lessons on how the wheel works, the words it uses, and DRIP for smaller accounts.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex flex-col gap-14">
      <section className="flex flex-col gap-6">
        <LogoMark className="size-14" />
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Harvest premium. Watch the wheel turn.
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Harvest the Wheel follows one trader, The Harvester, running the options wheel strategy on four stocks. Every
          trade is shown as it happens, with the reasoning behind the strategy explained along the way.
        </p>
        <ul className="flex flex-wrap gap-2" aria-label="The Core Four">
          {CORE_FOUR.map((ticker) => (
            <li key={ticker} className="rounded-full bg-accent-soft px-3 py-1 text-sm font-bold text-accent">
              {ticker}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <Link href="/signup" className={buttonClass()}>
            Create account
          </Link>
          <Link href="/pricing" className={buttonClass("secondary")}>
            See pricing
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {WHAT_YOU_GET.map((item) => (
          <div key={item.title} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-sm text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3 rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight">Transparency, not advice</h2>
        <p className="max-w-2xl opacity-90">
          You see what The Harvester did, never what you should do. Nothing here is a recommendation to buy or sell, and
          options carry real risk. Every decision stays yours.
        </p>
      </section>

      <PlaceholderNotice>
        Accounts are real. Payment is simulated, and the positions inside are sample data until trade entry is built.
      </PlaceholderNotice>
    </div>
  );
}
