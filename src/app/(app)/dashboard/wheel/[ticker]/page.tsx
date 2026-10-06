import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { CycleSteps } from "@/components/wheel/cycle-steps";
import { Disclaimer } from "@/components/wheel/disclaimer";
import { requirePageSession } from "@/lib/auth/session";
import { formatPrice, formatSignedUsd, formatUsd } from "@/lib/wheel/format";
import { wheelCycles, type CycleStep, type WheelCycle } from "@/lib/wheel/ledger";
import { CORE_FOUR, RECORD_START_LABEL, SAMPLE_AS_OF, SAMPLE_AS_OF_ISO, TICKERS, TRADES } from "@/lib/wheel/sample-data";

type Props = { params: Promise<{ ticker: string }> };

export async function generateMetadata({ params }: Props) {
  const { ticker } = await params;
  return { title: `${ticker.toUpperCase()} wheel cycle` };
}

/** Green for a gain, red for a loss; the sign in the number says the same for anyone who cannot see the color. */
const tone = (amount: number) => (amount > 0.005 ? "text-success" : amount < -0.005 ? "text-danger" : "");
const percent = (pct: number) => `${pct > 0.05 ? "+" : pct < -0.05 ? "−" : ""}${Math.abs(pct).toFixed(1)}%`;

const STEP: Record<CycleStep["kind"], { letter: string; label: string; tone: BadgeTone }> = {
  "sold-put": { letter: "P", label: "Put sold", tone: "success" },
  "sold-call": { letter: "C", label: "Call sold", tone: "success" },
  assigned: { letter: "A", label: "Assigned", tone: "accent" },
  "called-away": { letter: "S", label: "Called away", tone: "accent" },
  expired: { letter: "E", label: "Expired", tone: "neutral" },
};

function StepRow({ step, last }: { step: CycleStep; last: boolean }) {
  const kind = STEP[step.kind];
  return (
    <li className="flex gap-3">
      <div className="flex flex-col items-center">
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            kind.tone === "accent" ? "bg-accent text-primary-foreground" : kind.tone === "neutral" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
          }`}
          aria-hidden="true"
        >
          {kind.letter}
        </span>
        {!last && <span className="w-0.5 flex-1 bg-border" aria-hidden="true" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 pb-5">
        <div className="flex flex-wrap items-start justify-between gap-2 pt-1">
          <div className="min-w-0">
            <p className="font-semibold">{step.title}</p>
            <p className="text-sm text-muted-foreground">
              {step.date} · {step.detail}
            </p>
          </div>
          <Badge tone={kind.tone}>{kind.label}</Badge>
        </div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-lg bg-muted px-3 py-2 text-sm sm:grid-cols-4">
          {step.premiumUsd !== null && (
            <div>
              <dt className="text-muted-foreground">Premium</dt>
              <dd className="font-semibold text-success">+{formatUsd(step.premiumUsd)}</dd>
            </div>
          )}
          {step.annualizedPct !== null && (
            <div>
              <dt className="text-muted-foreground">Annualized</dt>
              <dd className="font-semibold">{step.annualizedPct.toFixed(1)}%</dd>
            </div>
          )}
          {step.realizedUsd !== null && (
            <div>
              <dt className="text-muted-foreground">Shares result</dt>
              <dd className={`font-semibold ${tone(step.realizedUsd)}`}>{formatSignedUsd(step.realizedUsd)}</dd>
            </div>
          )}
          <div>
            <dt className="text-muted-foreground">Premium so far</dt>
            <dd className="font-semibold">{formatUsd(step.premiumToDateUsd)}</dd>
          </div>
          {step.shares ? (
            <div className="col-span-2 sm:col-span-4">
              <dt className="sr-only">Shares held</dt>
              <dd>
                Holding <span className="font-semibold">{step.shares.count.toLocaleString("en-US")}</span> shares · blended{" "}
                <span className="font-semibold">{formatPrice(step.shares.paidUsd)}</span>, after premium{" "}
                <span className="font-semibold text-primary">{formatPrice(step.shares.netUsd)}</span>
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </li>
  );
}

function CycleSection({ cycle, priceUsd }: { cycle: WheelCycle; priceUsd: number }) {
  const premiumOnlyPct = cycle.capitalUsd > 0 ? (cycle.premiumUsd / cycle.capitalUsd) * 100 * (365 / cycle.days) : 0;
  return (
    <section className="flex flex-col gap-4" aria-labelledby={`cycle-${cycle.number}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id={`cycle-${cycle.number}`} className="text-lg font-semibold">
          Cycle {cycle.number}
        </h2>
        <p className="text-sm text-muted-foreground">
          {cycle.started} – {cycle.ended ?? "still going"} · {cycle.days} day{cycle.days === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-4">
        <div>
          <p className="text-sm text-muted-foreground">Cycle profit</p>
          <p className={`text-2xl font-bold ${tone(cycle.profitUsd)}`}>{formatSignedUsd(cycle.profitUsd)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Annual return</p>
          <p className={`text-2xl font-bold ${tone(cycle.annualizedPct)}`}>{percent(cycle.annualizedPct)}</p>
          <p className="text-xs text-muted-foreground">premium alone {percent(premiumOnlyPct)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Premium</p>
          <p className="text-xl font-semibold text-success">+{formatUsd(cycle.premiumUsd)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Shares</p>
          <p className={`text-xl font-semibold ${tone(cycle.realizedUsd + cycle.unrealizedUsd)}`}>
            {formatSignedUsd(cycle.realizedUsd + cycle.unrealizedUsd)}
          </p>
          <p className="text-xs text-muted-foreground">{cycle.ended ? "sold" : `held, at ${formatPrice(priceUsd)}`}</p>
        </div>
        {cycle.shares && (
          <div className="col-span-2 border-t border-border pt-3 text-sm sm:col-span-4">
            {cycle.shares.count.toLocaleString("en-US")} shares · blended cost{" "}
            <span className="font-semibold">{formatPrice(cycle.shares.paidUsd)}</span> · after premium{" "}
            <span className="font-semibold text-primary">{formatPrice(cycle.shares.netUsd)}</span> · now{" "}
            <span className={`font-semibold ${tone(priceUsd - cycle.shares.netUsd)}`}>{formatPrice(priceUsd)}</span>
          </div>
        )}
        <p className="col-span-2 text-xs text-muted-foreground sm:col-span-4">
          On {formatUsd(cycle.capitalUsd)} tied up at most ({percent(cycle.returnPct)} over {cycle.days} day
          {cycle.days === 1 ? "" : "s"}).
        </p>
      </div>

      <ol className="flex flex-col">
        {cycle.steps.map((step, index) => (
          <StepRow key={step.id} step={step} last={index === cycle.steps.length - 1} />
        ))}
      </ol>
    </section>
  );
}

export default async function WheelCyclePage({ params }: Props) {
  await requirePageSession(); // docs/rules/AUTH.md: every page in (app) is its own gate
  const { ticker: raw } = await params;
  const ticker = raw.toUpperCase();
  const info = TICKERS.find((t) => t.ticker === ticker);
  if (!info) notFound();
  if (raw !== ticker) redirect(`/dashboard/wheel/${ticker}`); // one address per stock
  const position = CORE_FOUR.find((p) => p.ticker === ticker);
  const cycles = wheelCycles(info, TRADES, SAMPLE_AS_OF_ISO).reverse();

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Core Four" className="flex flex-wrap gap-2">
        {TICKERS.map((t) => (
          <Link
            key={t.ticker}
            href={`/dashboard/wheel/${t.ticker}`}
            aria-current={t.ticker === ticker ? "page" : undefined}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              t.ticker === ticker ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-muted"
            }`}
          >
            {t.ticker}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-bold tracking-tight">{ticker} wheel cycle</h1>
          <p className="text-sm text-muted-foreground">
            {info.name} · {formatPrice(info.priceUsd)} as of {SAMPLE_AS_OF}
          </p>
        </div>
        {position?.phase && <CycleSteps phase={position.phase} />}
      </div>

      <PlaceholderNotice>
        Sample trades copied from The Harvester&rsquo;s tracker since {RECORD_START_LABEL}, with prices from {SAMPLE_AS_OF}.
      </PlaceholderNotice>

      {cycles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card p-6 text-muted-foreground">
          No trades on {ticker} yet. When The Harvester sells a put, the cycle starts here.
        </p>
      ) : (
        cycles.map((cycle) => <CycleSection key={cycle.number} cycle={cycle} priceUsd={info.priceUsd} />)
      )}

      <section className="flex flex-col gap-2 rounded-xl bg-muted p-5 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">How these numbers are worked out</h2>
        <p>
          <span className="font-semibold text-foreground">A cycle</span> runs from the first put sold until every share is
          called away. Then the next put starts a new one.
        </p>
        <p>
          <span className="font-semibold text-foreground">Annualized, on each option:</span> premium ÷ (strike × shares),
          scaled to a year over the days until it expires. The Harvester passes on anything under 100%.
        </p>
        <p>
          <span className="font-semibold text-foreground">Annual return, for the cycle:</span> cycle profit (premium, plus
          what the shares did at today&rsquo;s price) ÷ the most money tied up at once (shares at what was paid, plus cash
          set aside for open puts), scaled to a year. A cycle still going runs until its last open option expires, since
          that premium is already counted. Short cycles swing a lot when scaled to a year, and held shares can move it
          either way until they are sold.
        </p>
        <p>
          <span className="font-semibold text-foreground">Blended cost</span> is the average strike paid for the shares
          held. &ldquo;After premium&rdquo; takes off the cycle&rsquo;s premium, except puts still open, whose premium
          will count against the shares they buy.
        </p>
      </section>

      <Disclaimer />
    </div>
  );
}
