import { Badge, type BadgeTone } from "@/components/ui/badge";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { Disclaimer } from "@/components/wheel/disclaimer";
import { requirePageSession } from "@/lib/auth/session";
import { formatPrice, formatSignedUsd } from "@/lib/wheel/format";
import { blendedCosts, tradeHistory, type BlendedCost, type TradeResult } from "@/lib/wheel/ledger";
import { RECORD_START_LABEL, SAMPLE_AS_OF, TICKERS, TRADES } from "@/lib/wheel/sample-data";

export const metadata = { title: "Trades" };

/** Green for a gain, red for a loss; the sign in the number says the same for anyone who cannot see the color. */
const tone = (amount: number) => (Math.round(amount) > 0 ? "text-success" : Math.round(amount) < 0 ? "text-danger" : "");

const OUTCOME: Record<TradeResult["outcome"], { label: string; tone: BadgeTone }> = {
  open: { label: "Open", tone: "success" },
  expired: { label: "Expired", tone: "neutral" },
  assigned: { label: "Assigned", tone: "accent" },
  "called-away": { label: "Called away", tone: "accent" },
};

function TradeRow({ trade }: { trade: TradeResult }) {
  const { ticker, kind, count, strikeUsd, sold, expires, premiumUsd, outcome, closed, shares, profitUsd } = trade;
  const when =
    outcome === "open"
      ? `Sold ${sold} · expires ${expires}`
      : `Sold ${sold} · ${OUTCOME[outcome].label.toLowerCase()} ${closed}`;
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <p className="font-semibold">
            {ticker} · {count} × {formatPrice(strikeUsd)} {kind}
            {count === 1 ? "" : "s"}
          </p>
          <p className="text-sm text-muted-foreground">{when}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className={`text-lg font-bold ${tone(profitUsd)}`}>{formatSignedUsd(profitUsd)}</p>
          <Badge tone={OUTCOME[outcome].tone}>{OUTCOME[outcome].label}</Badge>
        </div>
      </div>
      <dl className="flex flex-col gap-1.5 border-t border-border pt-3 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Premium {outcome === "open" ? "collected (option still open)" : "kept"}</dt>
          <dd className={`shrink-0 font-semibold ${tone(premiumUsd)}`}>{formatSignedUsd(premiumUsd)}</dd>
        </div>
        {shares && (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">
              {shares.count.toLocaleString("en-US")} shares bought at {formatPrice(shares.paidUsd)}, now{" "}
              {formatPrice(shares.nowUsd)}
            </dt>
            <dd className={`shrink-0 font-semibold ${tone(shares.resultUsd)}`}>{formatSignedUsd(shares.resultUsd)}</dd>
          </div>
        )}
      </dl>
    </li>
  );
}

function BlendedCostCard({ stock }: { stock: BlendedCost }) {
  const { ticker, priceUsd, shares } = stock;
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-semibold">{ticker}</p>
        <p className="text-sm text-muted-foreground">
          {shares ? `${shares.count.toLocaleString("en-US")} shares` : "No shares held"}
        </p>
      </div>
      {shares ? (
        <dl className="grid grid-cols-3 gap-2 text-sm">
          <div>
            <dt className="text-muted-foreground">Paid</dt>
            <dd className="font-semibold">{formatPrice(shares.paidUsd)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">After premium</dt>
            <dd className="font-semibold text-primary">{formatPrice(shares.netUsd)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Now</dt>
            <dd className={`font-semibold ${priceUsd > shares.netUsd ? "text-success" : priceUsd < shares.netUsd ? "text-danger" : ""}`}>{formatPrice(priceUsd)}</dd>
          </div>
        </dl>
      ) : (
        <p className="text-sm text-muted-foreground">Now {formatPrice(priceUsd)}. Only puts so far, so no cost to blend.</p>
      )}
    </li>
  );
}

export default async function TradesPage() {
  await requirePageSession(); // docs/rules/AUTH.md: every page in (app) is its own gate
  const history = tradeHistory(TICKERS, TRADES);
  const blended = blendedCosts(TICKERS, TRADES);
  const profitUsd = history.reduce((sum, t) => sum + t.profitUsd, 0);
  const premiumUsd = history.reduce((sum, t) => sum + t.premiumUsd, 0);
  const sharesUsd = history.reduce((sum, t) => sum + (t.shares?.resultUsd ?? 0), 0);
  const open = history.filter((t) => t.outcome === "open").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Trade history</h1>
        <p className="text-muted-foreground">
          Every option The Harvester sold since {RECORD_START_LABEL}, newest first, each with its own P/L. Prices as of{" "}
          {SAMPLE_AS_OF}.
        </p>
      </div>

      <section className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-4" aria-label="Totals">
        <div className="col-span-2 sm:col-span-1">
          <p className="text-sm text-muted-foreground">Total P/L</p>
          <p className={`text-3xl font-bold ${tone(profitUsd)}`}>{formatSignedUsd(profitUsd)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Premium</p>
          <p className={`text-xl font-semibold ${tone(premiumUsd)}`}>{formatSignedUsd(premiumUsd)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Shares</p>
          <p className={`text-xl font-semibold ${tone(sharesUsd)}`}>{formatSignedUsd(sharesUsd)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Trades</p>
          <p className="text-xl font-semibold">
            {history.length} <span className="text-sm font-normal text-muted-foreground">({open} open)</span>
          </p>
        </div>
      </section>

      <PlaceholderNotice>
        Sample trades copied from The Harvester&rsquo;s tracker, with prices from {SAMPLE_AS_OF}. Live prices and trade entry
        are not built yet.
      </PlaceholderNotice>

      <section className="flex flex-col gap-3" aria-labelledby="blended-cost">
        <div className="flex flex-col gap-1">
          <h2 id="blended-cost" className="text-lg font-semibold">
            Blended cost per stock
          </h2>
          <p className="text-sm text-muted-foreground">
            The average price paid for the shares held, then the same after taking off this cycle&rsquo;s premium.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {blended.map((stock) => (
            <BlendedCostCard key={stock.ticker} stock={stock} />
          ))}
        </ul>
      </section>

      <h2 className="-mb-3 text-lg font-semibold">Every trade</h2>

      {history.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card p-6 text-muted-foreground">
          No trades yet. When The Harvester sells an option, it shows up here with its result.
        </p>
      ) : (
        <ol className="flex flex-col gap-3">
          {history.map((trade) => (
            <TradeRow key={trade.id} trade={trade} />
          ))}
        </ol>
      )}

      <section className="flex flex-col gap-2 rounded-xl bg-muted p-5 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">How each trade&rsquo;s P/L is counted</h2>
        <p>
          <span className="font-semibold text-foreground">Premium + what the shares did.</span> A put that was assigned
          carries the shares it bought, at the strike actually paid: valued at today&rsquo;s price while held, at the sale
          price once called away. The premium counts once, on its own line, so nothing is counted twice.
        </p>
        <p>
          <span className="font-semibold text-foreground">An open option counts at its full premium.</span> Its value
          changes daily until it expires, and that is not tracked here.
        </p>
        <p>
          <span className="font-semibold text-foreground">Blended cost.</span> &ldquo;Paid&rdquo; is the average strike
          across the shares still held. &ldquo;After premium&rdquo; also takes off every premium kept since the stock last
          had no shares: expired puts, the puts that assigned, and calls sold against the shares. Open puts are left
          out, because if assigned they buy new shares and their premium counts against those.
        </p>
        <p>
          <span className="font-semibold text-foreground">The record starts {RECORD_START_LABEL}.</span> Options still open
          that day are included; trades that closed before it are not.
        </p>
      </section>

      <Disclaimer />
    </div>
  );
}
