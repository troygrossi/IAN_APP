import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { Disclaimer } from "@/components/wheel/disclaimer";
import { requirePageSession } from "@/lib/auth/session";
import { formatPrice, formatSignedUsd, formatUsd } from "@/lib/wheel/format";
import type { Position } from "@/lib/wheel/ledger";
import { CORE_FOUR, RECORD_START_LABEL, SAMPLE_AS_OF } from "@/lib/wheel/sample-data";

export const metadata = { title: "P/L" };

/** Green for a gain, red for a loss; the sign in the number says the same for anyone who cannot see the color. */
const tone = (amount: number) => (Math.round(amount) > 0 ? "text-success" : Math.round(amount) < 0 ? "text-danger" : "");

function TickerPnl({ position }: { position: Position }) {
  const { ticker, name, priceUsd, premiumUsd, shares, unrealizedUsd, realizedUsd, profitUsd } = position;
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{ticker}</h2>
          <p className="text-sm text-muted-foreground">{name}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">P/L</p>
          <p className={`text-xl font-bold ${tone(profitUsd)}`}>{formatSignedUsd(profitUsd)}</p>
        </div>
      </header>
      <dl className="flex flex-col gap-2 border-t border-border pt-3 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Premium collected</dt>
          <dd className={`font-semibold ${tone(premiumUsd)}`}>{formatSignedUsd(premiumUsd)}</dd>
        </div>
        {shares ? (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">
              {shares.count.toLocaleString("en-US")} shares: paid {formatPrice(shares.costPerShareUsd)}, now {formatPrice(priceUsd)}
            </dt>
            <dd className={`shrink-0 font-semibold ${tone(unrealizedUsd)}`}>{formatSignedUsd(unrealizedUsd)}</dd>
          </div>
        ) : (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Shares</dt>
            <dd className="text-muted-foreground">None held</dd>
          </div>
        )}
        {Math.round(realizedUsd) !== 0 && (
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Shares already sold</dt>
            <dd className={`font-semibold ${tone(realizedUsd)}`}>{formatSignedUsd(realizedUsd)}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}

export default async function PnlPage() {
  await requirePageSession(); // docs/rules/AUTH.md: every page in (app) is its own gate
  const sum = (pick: (p: Position) => number) => CORE_FOUR.reduce((total, position) => total + pick(position), 0);
  const profitUsd = sum((p) => p.profitUsd);
  const premiumUsd = sum((p) => p.premiumUsd);
  const sharesUsd = sum((p) => p.unrealizedUsd + p.realizedUsd);
  const held = CORE_FOUR.filter((p) => p.shares);
  const heldCostUsd = held.reduce((total, p) => total + (p.shares?.count ?? 0) * (p.shares?.costPerShareUsd ?? 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Profit and loss</h1>
        <p className="text-muted-foreground">
          Each Core Four stock with its premium included, since {RECORD_START_LABEL}. Prices as of {SAMPLE_AS_OF}.
        </p>
      </div>

      <section className="grid gap-3 rounded-xl border border-border bg-card p-5 sm:grid-cols-3" aria-label="Totals">
        <div>
          <p className="text-sm text-muted-foreground">Total P/L</p>
          <p className={`text-3xl font-bold ${tone(profitUsd)}`}>{formatSignedUsd(profitUsd)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Premium collected</p>
          <p className={`text-xl font-semibold ${tone(premiumUsd)}`}>{formatSignedUsd(premiumUsd)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Shares, at today&rsquo;s prices</p>
          <p className={`text-xl font-semibold ${tone(sharesUsd)}`}>{formatSignedUsd(sharesUsd)}</p>
          <p className="text-sm text-muted-foreground">on {formatUsd(heldCostUsd)} of shares held</p>
        </div>
      </section>

      <PlaceholderNotice>
        Worked out from sample trades copied from The Harvester&rsquo;s tracker, with prices from {SAMPLE_AS_OF}. Live prices
        and trade entry are not built yet.
      </PlaceholderNotice>

      <div className="grid gap-4 sm:grid-cols-2">
        {CORE_FOUR.map((position) => (
          <TickerPnl key={position.ticker} position={position} />
        ))}
      </div>

      <section className="flex flex-col gap-2 rounded-xl bg-muted p-5 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">How this is counted</h2>
        <p>
          <span className="font-semibold text-foreground">P/L = premium collected + gain or loss on shares.</span> Shares
          count at the strike actually paid, and every premium counts on its own, so nothing is counted twice. (A
          tracker&rsquo;s &ldquo;effective price&rdquo; already takes the put&rsquo;s premium off the share price; adding the
          premium again would double it.)
        </p>
        <p>
          <span className="font-semibold text-foreground">Open options count at the premium collected.</span> Their value
          changes daily until they expire, and that is not tracked here.
        </p>
        <p>
          <span className="font-semibold text-foreground">The record starts {RECORD_START_LABEL}.</span> Options still open
          that day are included with their premium; trades that closed before it are not.
        </p>
      </section>

      <Disclaimer />
    </div>
  );
}
