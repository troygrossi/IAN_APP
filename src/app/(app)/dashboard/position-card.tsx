import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CycleSteps } from "@/components/wheel/cycle-steps";
import { formatPrice, formatUsd } from "@/lib/wheel/format";
import { WHEEL_PHASES, type Position } from "@/lib/wheel/ledger";

/** One Core Four ticker: where it sits in the wheel, its price, shares held, and what is open on it. */
export function PositionCard({ position }: { position: Position }) {
  const { ticker, name, phase, priceUsd, premiumUsd, shares, open, next, nextEarnings } = position;
  const phaseLabel = phase ? WHEEL_PHASES.find((step) => step.id === phase)?.label : undefined;

  return (
    <article
      className={`flex flex-col gap-4 rounded-xl border bg-card p-5 ${phase ? "border-border" : "border-dashed border-border"}`}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold tracking-tight">{ticker}</h3>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
        {phaseLabel ? <Badge tone={phase === "assigned" ? "accent" : "success"}>{phaseLabel}</Badge> : <Badge>Watching</Badge>}
      </header>

      {phase && <CycleSteps phase={phase} />}

      <dl className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">Price</dt>
          <dd className="text-base font-semibold">{formatPrice(priceUsd)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Premium collected</dt>
          <dd className={`text-base font-semibold ${premiumUsd > 0 ? "text-success" : ""}`}>
            {formatUsd(premiumUsd)}
          </dd>
        </div>
        {shares && (
          <div className="col-span-2">
            <dt className="text-muted-foreground">Shares held</dt>
            <dd className="text-base font-semibold">
              {shares.count.toLocaleString("en-US")} at {formatPrice(shares.costPerShareUsd)}
              <span className="text-sm font-normal text-muted-foreground"> · since {shares.since}</span>
            </dd>
          </div>
        )}
      </dl>

      {open.length > 0 ? (
        <ul className="flex flex-col gap-1.5 border-t border-border pt-3 text-sm">
          {open.map((contract) => (
            <li key={`${contract.kind}-${contract.strikeUsd}-${contract.expires}`} className="flex justify-between gap-3">
              <span>
                {contract.count} × {formatPrice(contract.strikeUsd)} {contract.kind}
                {contract.count === 1 ? "" : "s"}, expire {contract.expires}
              </span>
              <span className="font-medium text-success">{formatUsd(contract.premiumUsd)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-t border-border pt-3 text-sm text-muted-foreground">No options open on {ticker} right now.</p>
      )}

      {next && <p className="text-sm">{next}</p>}

      <p className="text-sm text-muted-foreground">Next earnings: {nextEarnings}. The Harvester never holds options through earnings.</p>

      <Link href={`/dashboard/wheel/${ticker}`} className="text-sm font-semibold text-primary underline underline-offset-2">
        See the full {ticker} wheel cycle
      </Link>
    </article>
  );
}
