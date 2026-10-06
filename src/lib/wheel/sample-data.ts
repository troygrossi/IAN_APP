// PLACEHOLDER: sample data, copied from The Harvester's tracker as of 2026-10-05.
// It is not live. Every screen that shows it carries a PlaceholderNotice (CLAUDE.md, rule 8).
// When trade entry is built, this file is replaced by a table, a service and hooks
// on the path in docs/rules/DATA_FLOW.md, and the screens read from those instead.

/** The date the sample numbers were taken, shown on screen beside them. */
export const SAMPLE_AS_OF = "Oct 5, 2026";

/** Where a position sits in the wheel. The order is the order of the cycle. */
export type WheelPhase = "selling-puts" | "assigned" | "selling-calls" | "called-away";

export const WHEEL_PHASES: { id: WheelPhase; label: string }[] = [
  { id: "selling-puts", label: "Selling puts" },
  { id: "assigned", label: "Assigned" },
  { id: "selling-calls", label: "Selling calls" },
  { id: "called-away", label: "Called away" },
];

export type OpenContract = {
  kind: "put" | "call";
  count: number;
  strikeUsd: number;
  expires: string;
  premiumUsd: number;
};

/** Shares held after an assignment, at their cost after the premium is taken off. */
export type SharesHeld = { count: number; costPerShareUsd: number; since: string };

export type Position = {
  ticker: string;
  name: string;
  /** null means the ticker is on the Core Four list but nothing is open on it. */
  phase: WheelPhase | null;
  priceUsd: number;
  /** Every premium collected on this ticker this year, closed trades included. */
  premiumThisYearUsd: number;
  shares: SharesHeld | null;
  open: OpenContract[];
  /** What The Harvester is waiting to do next, in his own words, if anything. */
  next: string | null;
  nextEarnings: string;
};

export const CORE_FOUR: Position[] = [
  {
    ticker: "MARA",
    name: "Marathon Digital",
    phase: "assigned",
    priceUsd: 11.17,
    premiumThisYearUsd: 1523,
    shares: { count: 400, costPerShareUsd: 12.42, since: "Oct 2" },
    open: [
      { kind: "put", count: 9, strikeUsd: 11.5, expires: "Oct 16", premiumUsd: 513 },
      { kind: "put", count: 5, strikeUsd: 10.5, expires: "Oct 16", premiumUsd: 185 },
    ],
    next: "Holding the assigned shares and still selling puts below them.",
    nextEarnings: "Nov 3",
  },
  {
    ticker: "RGTI",
    name: "Rigetti Computing",
    phase: "assigned",
    priceUsd: 15.15,
    premiumThisYearUsd: 329,
    shares: { count: 300, costPerShareUsd: 15.35, since: "Oct 2" },
    open: [],
    next: "Waiting for a good strike to sell covered calls.",
    nextEarnings: "Nov 9",
  },
  {
    ticker: "IONQ",
    name: "IonQ",
    phase: "selling-puts",
    priceUsd: 42.97,
    premiumThisYearUsd: 272,
    shares: null,
    open: [{ kind: "put", count: 2, strikeUsd: 42, expires: "Oct 16", premiumUsd: 272 }],
    next: null,
    nextEarnings: "Nov 4",
  },
  {
    ticker: "CIFR",
    name: "Cipher Mining",
    phase: "assigned",
    priceUsd: 15.48,
    premiumThisYearUsd: 640,
    shares: { count: 1000, costPerShareUsd: 16.46, since: "Oct 2" },
    open: [],
    next: "Waiting for a good strike to sell covered calls.",
    nextEarnings: "Nov 2",
  },
];

export type TradeAlert = {
  id: string;
  date: string;
  kind: "sold-put" | "sold-call" | "assigned" | "called-away" | "expired";
  headline: string;
  detail: string;
};

/** Newest first. Worded as what The Harvester did, never as what anyone else should do. */
export const ALERTS: TradeAlert[] = [
  { id: "a11", date: "Oct 5, 2026", kind: "sold-put", headline: "The Harvester sold 5 MARA $10.50 puts", detail: "Expire Oct 16 · $185 collected" },
  { id: "a10", date: "Oct 5, 2026", kind: "sold-put", headline: "The Harvester sold 2 IONQ $42 puts", detail: "Expire Oct 16 · $272 collected · first IONQ position" },
  { id: "a9", date: "Oct 2, 2026", kind: "assigned", headline: "The Harvester was assigned 1,000 CIFR shares", detail: "From the $17.50 and $17 puts · $16.46 a share after premium" },
  { id: "a8", date: "Oct 2, 2026", kind: "assigned", headline: "The Harvester was assigned 300 RGTI shares", detail: "From the $16 puts · $15.35 a share after premium" },
  { id: "a7", date: "Oct 2, 2026", kind: "assigned", headline: "The Harvester was assigned 400 MARA shares", detail: "From the $13 puts · $12.42 a share after premium" },
  { id: "a6", date: "Sep 30, 2026", kind: "sold-put", headline: "The Harvester sold 9 MARA $11.50 puts", detail: "Expire Oct 16 · $513 collected" },
  { id: "a5", date: "Sep 25, 2026", kind: "sold-put", headline: "The Harvester sold 8 CIFR $17 puts", detail: "Expired Oct 2 · $480 collected" },
  { id: "a4", date: "Sep 21, 2026", kind: "sold-put", headline: "The Harvester sold 3 RGTI $16 puts", detail: "Expired Oct 2 · $195 collected" },
  { id: "a3b", date: "Sep 21, 2026", kind: "sold-put", headline: "The Harvester sold 2 CIFR $17.50 puts", detail: "Expired Oct 2 · $160 collected" },
  { id: "a3", date: "Sep 21, 2026", kind: "sold-put", headline: "The Harvester sold 4 MARA $13 puts", detail: "Expired Oct 2 · $232 collected" },
  { id: "a2", date: "Sep 18, 2026", kind: "called-away", headline: "The Harvester's 600 MARA shares were called away at $10", detail: "The cycle closed with a $252 gain on the shares, plus every premium along the way" },
  { id: "a1", date: "Aug 10, 2026", kind: "sold-call", headline: "The Harvester sold 6 MARA $10 calls", detail: "Expire Sep 18 · $651 collected" },
];

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
