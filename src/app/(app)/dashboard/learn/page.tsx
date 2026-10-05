import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { requirePageSession } from "@/lib/auth/session";

export const metadata = { title: "Learn the wheel" };

const STEPS = [
  {
    title: "Sell a cash-secured put",
    body: "Pick a strike price you would be glad to own the stock at, and set aside the cash to buy 100 shares at that price. You are paid a premium up front, just for agreeing to the deal.",
  },
  {
    title: "The put expires",
    body: "If the stock stays above your strike, the put expires worthless: you keep the whole premium and sell another put. If it falls below, you are assigned: you buy the 100 shares at the strike, with the cash you set aside.",
  },
  {
    title: "Sell a covered call",
    body: "Now holding shares, sell a call above what you paid for them. It is the put in reverse: you are paid a premium for agreeing to sell the shares if they reach that price.",
  },
  {
    title: "The call expires",
    body: "If the stock stays below the strike, you keep the shares and the premium, and sell another call. If it rises above, the shares are called away at a gain, you keep every premium collected along the way, and the wheel starts again at step one.",
  },
] as const;

const GLOSSARY = [
  {
    term: "Cash-secured put (CSP)",
    meaning: "An agreement to buy 100 shares at a set price, backed by cash already set aside. Nothing is borrowed.",
  },
  {
    term: "Covered call (CC)",
    meaning: "An agreement to sell 100 shares you already own at a set price. The shares are in hand, not borrowed.",
  },
  { term: "Strike", meaning: "The price the shares change hands at if the option is used." },
  { term: "Premium", meaning: "What the buyer of the option pays you up front. It is yours to keep either way." },
  {
    term: "Assignment",
    meaning: "When an option you sold is used: a put hands you the shares, a call takes them away.",
  },
  {
    term: "OTM / ITM",
    meaning:
      "Out of the money: the option would not be used at today's price. In the money: it would. An option still OTM at expiry expires worthless.",
  },
  {
    term: "Annualized yield",
    meaning:
      "The premium scaled up to a full year, so a one-week trade and a one-month trade can be compared fairly. The Harvester passes on anything under 100%.",
  },
] as const;

const RULES = [
  "Only the Core Four: MARA, RGTI, IONQ and CIFR.",
  "100% annualized yield or more, or pass.",
  "Never hold options through an earnings date.",
  "No idle cash: after an assignment, put the money back to work within a week.",
] as const;

export default async function LearnPage() {
  await requirePageSession(); // docs/rules/AUTH.md: every page in (app) is its own gate
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">How the wheel works</h1>
        <p className="max-w-2xl text-muted-foreground">
          The wheel is a repeating options strategy on one stock at a time. You collect a premium at every turn; the
          only question each cycle is whether you end up holding shares or cash.
        </p>
      </div>

      <ol className="flex flex-col">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                {index + 1}
              </span>
              {index < STEPS.length - 1 && <span className="w-0.5 flex-1 bg-border" aria-hidden="true" />}
            </div>
            <div className="flex flex-col gap-1 pb-6">
              <h2 className="pt-1.5 text-lg font-semibold">{step.title}</h2>
              <p className="max-w-2xl text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">The Harvester&rsquo;s rules</h2>
        <ul className="flex list-disc flex-col gap-1 pl-5">
          {RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Words you will see</h2>
        <dl className="grid gap-3 sm:grid-cols-2">
          {GLOSSARY.map((entry) => (
            <div key={entry.term} className="rounded-xl border border-border bg-card p-4">
              <dt className="font-semibold">{entry.term}</dt>
              <dd className="text-sm text-muted-foreground">{entry.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-3 rounded-xl bg-accent-soft p-5">
        <h2 className="text-lg font-semibold">What can go wrong</h2>
        <p className="text-sm">
          The premium is small next to the stock. If a stock you were assigned keeps falling, the premiums do not make up
          the loss on the shares, and the cash is tied up until it recovers. This page explains the mechanics; it is not a
          recommendation to use the strategy.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard" className={buttonClass()}>
          See the Core Four
        </Link>
        <Link href="/dashboard/drip" className={buttonClass("secondary")}>
          What is DRIP?
        </Link>
      </div>
    </div>
  );
}
