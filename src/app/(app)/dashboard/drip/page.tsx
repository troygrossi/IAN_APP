import { Badge } from "@/components/ui/badge";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { DRIP_FUNDS, SAMPLE_AS_OF } from "@/lib/wheel/sample-data";

export const metadata = { title: "DRIP" };

export default function DripPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">DRIP: put spare cash to work</h1>
        <p className="text-muted-foreground">For money that is not yet enough to start a wheel position.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">What DRIP means</h2>
          <p>
            DRIP stands for dividend reinvestment plan. Instead of paying a fund&rsquo;s dividend out as cash, your broker
            uses it to buy more shares of the same fund, even a fraction of one. Those new shares earn their own dividend
            next time, which buys more shares again. Small, steady, and it compounds on its own.
          </p>
        </section>
        <section className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">Not enough for 100 shares?</h2>
          <p>
            The wheel trades in lots of 100 shares: one options contract stands for 100 of them, so starting a position
            takes real money. If you have spare cash but not a full lot yet, an income fund lets it start earning right
            away through dividends and DRIP, instead of sitting idle, while it grows toward your first wheel position.
          </p>
        </section>
      </div>

      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">The Harvester&rsquo;s DRIP watchlist</h2>
          <p className="text-sm text-muted-foreground">As of {SAMPLE_AS_OF}</p>
        </div>
        <PlaceholderNotice>
          A sample of the funds The Harvester tracks, with their status on {SAMPLE_AS_OF}. Live prices are not connected
          yet.
        </PlaceholderNotice>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DRIP_FUNDS.map((fund) => (
            <li key={fund.ticker} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">{fund.ticker}</h3>
                  <p className="text-sm text-muted-foreground">{fund.name}</p>
                </div>
                {fund.isAboveTrend ? <Badge tone="success">DRIP on</Badge> : <Badge>DRIP off</Badge>}
              </div>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Yield</dt>
                  <dd className="text-base font-semibold">{fund.yieldLabel}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Pays</dt>
                  <dd className="text-base font-semibold">{fund.payout}</dd>
                </div>
              </dl>
              {fund.isHighReturnOfCapital && (
                <div>
                  <Badge tone="accent">High return of capital</Badge>
                </div>
              )}
            </li>
          ))}
        </ul>
        <dl className="flex flex-col gap-2 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
          <div>
            <dt className="inline font-semibold text-foreground">DRIP on / off: </dt>
            <dd className="inline">
              on when the price is above its average of the last 50 trading days, off when it is below. It is a trend
              signal The Harvester uses, not a prediction.
            </dd>
          </div>
          <div>
            <dt className="inline font-semibold text-foreground">High return of capital: </dt>
            <dd className="inline">
              part of each payout is the fund handing back your own money, not profit. A big yield can sit beside a
              shrinking share price.
            </dd>
          </div>
          <div>
            <dt className="inline font-semibold text-foreground">Not advice: </dt>
            <dd className="inline">this is a watchlist, not a recommendation to buy or sell any fund.</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
