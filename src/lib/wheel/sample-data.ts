// PLACEHOLDER: sample data, copied from The Harvester's tracker and Schwab trade confirmations as of 2026-10-19.
// It is not live. Every screen that shows it carries a PlaceholderNotice (CLAUDE.md, rule 8).
// When trade entry is built, this file is replaced by a table, a service and hooks
// on the path in docs/rules/DATA_FLOW.md, and the screens read from those instead.

import { alertsFrom, type TickerInfo, type Trade } from "./ledger";

/** When the snapshot prices were taken. Used when live prices are not available (src/lib/services/prices.ts). */
export const SAMPLE_AS_OF = "Oct 28, 2026, 4:00 PM ET (close)";
/** The same moment as a date, for working out how many days a cycle has run. */
export const SAMPLE_AS_OF_ISO = "2026-10-28";

/** When the DRIP watchlist statuses were taken. They are refreshed separately from the Core Four prices. */
export const DRIP_AS_OF = "Oct 5, 2026";

/**
 * The record starts here. Options still open on this day are carried in with the premium they
 * brought; everything that closed before it is left out (docs/work/LOG.md, 2026-10-05).
 */
export const RECORD_START = "2026-10-01";
export const RECORD_START_LABEL = "Oct 1, 2026";

export const TICKERS: TickerInfo[] = [
  { ticker: "MARA", name: "Marathon Digital", priceUsd: 7.35, avg50Usd: 10.54, nextEarnings: "Nov 3", next: "All 14 Oct 16 puts were assigned: holding 1,800 shares, no options open yet." },
  { ticker: "RGTI", name: "Rigetti Computing", priceUsd: 12.40, avg50Usd: 14.84, nextEarnings: "Nov 9", next: "Holding 300 shares, no options open yet." },
  { ticker: "IONQ", name: "IonQ", priceUsd: 32.43, avg50Usd: 38.90, nextEarnings: "Nov 4", next: "The Oct 16 puts were assigned: holding 200 shares, no options open yet." },
  { ticker: "CIFR", name: "Cipher Mining", priceUsd: 8.87, avg50Usd: 14.67, nextEarnings: "Nov 2", next: "The Oct 16 covered calls expired: holding 1,000 shares, no options open yet." },
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
  { id: "t12", date: "2026-10-06", ticker: "CIFR", type: "sell-call", count: 10, strikeUsd: 16.5, expires: "2026-10-16", premiumUsd: 570 },
  // Oct 16 expiry: every put assigned (some early), the CIFR calls expired. From Schwab's confirmations.
  { id: "t13", date: "2026-10-12", ticker: "MARA", type: "assigned", closes: "t05", count: 1 },
  { id: "t14", date: "2026-10-14", ticker: "IONQ", type: "assigned", closes: "t10" },
  { id: "t15", date: "2026-10-14", ticker: "MARA", type: "assigned", closes: "t05", count: 5 },
  { id: "t16", date: "2026-10-15", ticker: "MARA", type: "assigned", closes: "t05" },
  { id: "t17", date: "2026-10-15", ticker: "MARA", type: "assigned", closes: "t11" },
  { id: "t18", date: "2026-10-16", ticker: "CIFR", type: "expired", closes: "t12" },
];

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
