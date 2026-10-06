import Link from "next/link";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { Disclaimer } from "@/components/wheel/disclaimer";
import { formatUsd } from "@/lib/wheel/format";
import { CORE_FOUR, RECORD_START_LABEL, SAMPLE_AS_OF } from "@/lib/wheel/sample-data";
import { PositionCard } from "./position-card";
import { requirePageSession } from "@/lib/auth/session";

export const metadata = { title: "Dashboard" };

const FEATURES = [
  {
    title: "Every position, in the open",
    body: "Where each Core Four stock sits in the wheel, its price, and the premium collected so far.",
    href: "#core-four",
  },
  {
    title: "An alert for every trade",
    body: "Sold a put, got assigned, sold a call, shares called away: you see it when it happens.",
    href: "/dashboard/alerts",
  },
  {
    title: "Learn the wheel",
    body: "How the strategy works step by step, the words it uses, and DRIP for cash that is not yet enough for 100 shares.",
    href: "/dashboard/learn",
  },
] as const;

export default async function DashboardPage() {
  await requirePageSession(); // docs/rules/AUTH.md: every page in (app) is its own gate
  const premiumUsd = CORE_FOUR.reduce((sum, position) => sum + position.premiumUsd, 0);
  const openContracts = CORE_FOUR.flatMap((position) => position.open).reduce((sum, contract) => sum + contract.count, 0);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4 rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider opacity-80">Welcome to Harvest the Wheel</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Follow one trader&rsquo;s options wheel, trade by trade.</h1>
        <p className="max-w-2xl text-base opacity-90">
          The Harvester runs the wheel strategy on four stocks, the Core Four: MARA, RGTI, IONQ and CIFR. This app shows
          those trades as they happen, explains why the wheel works the way it does, and keeps a running tally of the
          premium it brings in. You watch and learn; every decision stays yours.
        </p>
        {/* On a phone the tab bar already links these sections, so the cards wait for a wider screen. */}
        <ul className="hidden gap-3 sm:grid sm:grid-cols-3">
          {FEATURES.map((feature) => (
            <li key={feature.title}>
              <Link href={feature.href} className="flex h-full flex-col gap-1 rounded-xl bg-card/10 p-4 hover:bg-card/20">
                <span className="font-semibold">{feature.title}</span>
                <span className="text-sm opacity-90">{feature.body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="core-four" className="flex scroll-mt-24 flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight">The Harvester&rsquo;s Core Four</h2>
            <p className="text-sm text-muted-foreground">As of {SAMPLE_AS_OF}</p>
          </div>
          <dl className="flex gap-6 text-sm">
            <div>
              <dt className="text-muted-foreground">Premium collected</dt>
              <dd className="text-lg font-bold text-success">{formatUsd(premiumUsd)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Open contracts</dt>
              <dd className="text-lg font-bold">{openContracts}</dd>
            </div>
          </dl>
        </div>
        <PlaceholderNotice>
          Sample positions copied from The Harvester&rsquo;s tracker, with prices from {SAMPLE_AS_OF}. The record starts on{" "}
          {RECORD_START_LABEL}: options open that day count, earlier trades do not. Live positions appear here once trade entry
          is built.
        </PlaceholderNotice>
        <div className="grid gap-4 sm:grid-cols-2">
          {CORE_FOUR.map((position) => (
            <PositionCard key={position.ticker} position={position} />
          ))}
        </div>
      </section>

      <Disclaimer />
    </div>
  );
}
