// PLACEHOLDER: sample data, copied from The Harvester's tracker as of 2026-10-05.
// It is not live. Every screen that shows it carries a PlaceholderNotice (CLAUDE.md, rule 8).
// When trade entry is built, this file is replaced by a table, a service and hooks
// on the path in docs/rules/DATA_FLOW.md, and the screens read from those instead.

import { alertsFrom, positionFor, type TickerInfo, type Trade } from "./ledger";

/** When the Core Four prices were taken, shown on screen beside them. */
export const SAMPLE_AS_OF = "Oct 6, 2026, 11:14 am ET";

/** When the DRIP watchlist statuses were taken. They are refreshed separately from the Core Four prices. */
export const DRIP_AS_OF = "Oct 5, 2026";

/**
 * The record starts here. Options still open on this day are carried in with the premium they
 * brought; everything that closed before it is left out (docs/work/LOG.md, 2026-10-05).
 */
export const RECORD_START = "2026-10-01";
export const RECORD_START_LABEL = "Oct 1, 2026";

export const TICKERS: TickerInfo[] = [
  { ticker: "MARA", name: "Marathon Digital", priceUsd: 11.18, nextEarnings: "Nov 3", next: "Holding the assigned shares and still selling puts below them." },
  { ticker: "RGTI", name: "Rigetti Computing", priceUsd: 15.28, nextEarnings: "Nov 9", next: "Waiting for a good strike to sell covered calls." },
  { ticker: "IONQ", name: "IonQ", priceUsd: 43.75, nextEarnings: "Nov 4", next: null },
  { ticker: "CIFR", name: "Cipher Mining", priceUsd: 15.64, nextEarnings: "Nov 2", next: "Waiting for a good strike to sell covered calls." },
];

/** Oldest first. The September trades are the puts still open on Oct 1. */
export const TRADES: Trade[] = [
  // Open on Oct 1 (carried in)
  { id: "t01", date: "2026-09-21", ticker: "MARA", type: "sell-put", count: 4, strikeUsd: 13, expires: "2026-10-02", premiumUsd: 232 },
  { id: "t02", date: "2026-09-21", ticker: "RGTI", type: "sell-put", count: 3, strikeUsd: 16, expires: "2026-10-02", premiumUsd: 195 },
  { id: "t03", date: "2026-09-21", ticker: "CIFR", type: "sell-put", count: 2, strikeUsd: 17.5, expires: "2026-10-02", premiumUsd: 160 },
  { id: "t04", date: "2026-09-25", ticker: "CIFR", type: "sell-put", count: 8, strikeUsd: 17, expires: "2026-10-02", premiumUsd: 480 },
  { id: "t05", date: "2026-09-30", ticker: "MARA", type: "sell-put", count: 9, strikeUsd: 11.5, expires: "2026-10-16", premiumUsd: 513 },
  // October
  { id: "t06", date: "2026-10-02", ticker: "MARA", type: "assigned", closes: "t01" },
  { id: "t07", date: "2026-10-02", ticker: "RGTI", type: "assigned", closes: "t02" },
  { id: "t08", date: "2026-10-02", ticker: "CIFR", type: "assigned", closes: "t03" },
  { id: "t09", date: "2026-10-02", ticker: "CIFR", type: "assigned", closes: "t04" },
  { id: "t10", date: "2026-10-05", ticker: "IONQ", type: "sell-put", count: 2, strikeUsd: 42, expires: "2026-10-16", premiumUsd: 272 },
  { id: "t11", date: "2026-10-05", ticker: "MARA", type: "sell-put", count: 5, strikeUsd: 10.5, expires: "2026-10-16", premiumUsd: 185 },
];

export const CORE_FOUR = TICKERS.map((info) => positionFor(info, TRADES));
export const ALERTS = alertsFrom(TRADES, RECORD_START);

export type DripFund = {
  ticker: string;
  name: string;
  yieldLabel: string;
  payout: "Weekly" | "Monthly" | "Quarterly";
  /** True when the price is above its 50-day average, which is when the tracker turns DRIP on. */
  isAboveTrend: boolean;
  /** Part of the payout is the fund handing back your own money (return of capital). */
  isHighReturnOfCapital: boolean;
};

export const DRIP_FUNDS: DripFund[] = [
  { ticker: "QQQT", name: "Nasdaq 100 Income Target", yieldLabel: "about 20%", payout: "Monthly", isAboveTrend: true, isHighReturnOfCapital: true },
  { ticker: "NVDY", name: "NVDA Option Income", yieldLabel: "about 40%", payout: "Weekly", isAboveTrend: true, isHighReturnOfCapital: true },
  { ticker: "AMZY", name: "AMZN Option Income", yieldLabel: "about 31%", payout: "Weekly", isAboveTrend: false, isHighReturnOfCapital: true },
  { ticker: "GOOY", name: "GOOGL Option Income", yieldLabel: "about 31%", payout: "Weekly", isAboveTrend: false, isHighReturnOfCapital: true },
  { ticker: "JEPI", name: "Equity Premium Income", yieldLabel: "8.3%", payout: "Monthly", isAboveTrend: false, isHighReturnOfCapital: false },
  { ticker: "VOO", name: "S&P 500", yieldLabel: "about 1.3%", payout: "Quarterly", isAboveTrend: false, isHighReturnOfCapital: false },
];
