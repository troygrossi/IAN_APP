// How positions, alerts and P/L are worked out from a list of trades.
// The trades themselves live in sample-data.ts for now; these functions do not care where they come from,
// so they stay the same when trade entry moves the trades into the database (docs/rules/DATA_FLOW.md).

/** Where a position sits in the wheel. The order is the order of the cycle. */
export type WheelPhase = "selling-puts" | "assigned" | "selling-calls" | "called-away";

export const WHEEL_PHASES: { id: WheelPhase; label: string }[] = [
  { id: "selling-puts", label: "Selling puts" },
  { id: "assigned", label: "Assigned" },
  { id: "selling-calls", label: "Selling calls" },
  { id: "called-away", label: "Called away" },
];

/** One line of the record. Dates are YYYY-MM-DD. One contract stands for 100 shares. */
export type Trade =
  | { id: string; date: string; ticker: string; type: "sell-put" | "sell-call"; count: number; strikeUsd: number; expires: string; premiumUsd: number }
  /** A sold put was used: the shares are bought at its strike. `closes` is the put's id. */
  | { id: string; date: string; ticker: string; type: "assigned"; closes: string }
  /** A sold call was used: the shares are sold at its strike. `closes` is the call's id. */
  | { id: string; date: string; ticker: string; type: "called-away"; closes: string }
  /** A sold option ran out unused. `closes` is its id. */
  | { id: string; date: string; ticker: string; type: "expired"; closes: string };

type OptionTrade = Extract<Trade, { type: "sell-put" | "sell-call" }>;
const isOption = (trade: Trade): trade is OptionTrade => trade.type === "sell-put" || trade.type === "sell-call";

/** What is known about a ticker that is not a trade. */
export type TickerInfo = {
  ticker: string;
  name: string;
  priceUsd: number;
  nextEarnings: string;
  /** What The Harvester is waiting to do next, in plain words, if anything. */
  next: string | null;
};

export type OpenContract = { kind: "put" | "call"; count: number; strikeUsd: number; expires: string; premiumUsd: number };

export type Position = TickerInfo & {
  phase: WheelPhase | null;
  open: OpenContract[];
  shares: { count: number; costPerShareUsd: number; since: string } | null;
  /** Every premium collected on this ticker in the record, open options included. */
  premiumUsd: number;
  /** Gain or loss on shares already sold (called away). */
  realizedUsd: number;
  /** Gain or loss on shares still held, at today's price against what was paid. */
  unrealizedUsd: number;
  /** premium + realized + unrealized. */
  profitUsd: number;
};

const SHARES_PER_CONTRACT = 100;

/** "2026-10-02" → "Oct 2". */
export function shortDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

/** "2026-10-02" → "Oct 2, 2026". */
export function longDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/**
 * Works out one ticker's position from its trades, oldest first.
 * Shares count at the strike actually paid, and premium is counted on its own, so nothing is counted twice.
 */
export function positionFor(info: TickerInfo, trades: Trade[]): Position {
  const mine = trades.filter((trade) => trade.ticker === info.ticker).sort((a, b) => a.date.localeCompare(b.date));
  const options = new Map(mine.filter(isOption).map((t) => [t.id, t]));
  const closed = new Set<string>();
  let premiumUsd = 0;
  let shareCount = 0;
  let shareCostUsd = 0;
  let sharesSince = "";
  let realizedUsd = 0;

  for (const trade of mine) {
    if (isOption(trade)) {
      premiumUsd += trade.premiumUsd;
      continue;
    }
    closed.add(trade.closes);
    const option = options.get(trade.closes);
    if (!option || trade.type === "expired") continue;
    const shares = option.count * SHARES_PER_CONTRACT;
    if (trade.type === "assigned") {
      if (shareCount === 0) sharesSince = shortDate(trade.date);
      shareCount += shares;
      shareCostUsd += shares * option.strikeUsd;
    } else {
      // Called away: sold at the strike, against the average price paid.
      const averageUsd = shareCount > 0 ? shareCostUsd / shareCount : 0;
      realizedUsd += shares * (option.strikeUsd - averageUsd);
      shareCostUsd -= shares * averageUsd;
      shareCount -= shares;
    }
  }

  const open: OpenContract[] = [...options.values()]
    .filter((option) => !closed.has(option.id))
    .map((option) => ({
      kind: option.type === "sell-put" ? "put" : "call",
      count: option.count,
      strikeUsd: option.strikeUsd,
      expires: shortDate(option.expires),
      premiumUsd: option.premiumUsd,
    }));

  const unrealizedUsd = shareCount * info.priceUsd - shareCostUsd;
  const hasOpenCall = open.some((contract) => contract.kind === "call");
  const phase: WheelPhase | null =
    shareCount > 0 ? (hasOpenCall ? "selling-calls" : "assigned") : open.length > 0 ? "selling-puts" : null;

  return {
    ...info,
    phase,
    open,
    shares: shareCount > 0 ? { count: shareCount, costPerShareUsd: shareCostUsd / shareCount, since: sharesSince } : null,
    premiumUsd,
    realizedUsd,
    unrealizedUsd,
    profitUsd: premiumUsd + realizedUsd + unrealizedUsd,
  };
}

export type TradeAlert = {
  id: string;
  date: string;
  kind: "sold-put" | "sold-call" | "assigned" | "called-away" | "expired";
  headline: string;
  detail: string;
};

/**
 * Every trade on or after `fromIso`, newest first, worded as what The Harvester did,
 * never as what anyone else should do (docs/rules/UI.md, "The brand").
 */
export function alertsFrom(trades: Trade[], fromIso: string): TradeAlert[] {
  const options = new Map(trades.filter(isOption).map((t) => [t.id, t]));
  // "$17", "$10.50": cents only when there are some, and then always two digits.
  const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
  return trades
    .filter((trade) => trade.date >= fromIso)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .map((trade): TradeAlert => {
      const date = longDate(trade.date);
      if (isOption(trade)) {
        const kind = trade.type === "sell-put" ? "put" : "call";
        return {
          id: trade.id,
          date,
          kind: trade.type === "sell-put" ? "sold-put" : "sold-call",
          headline: `The Harvester sold ${trade.count} ${trade.ticker} ${money(trade.strikeUsd)} ${kind}${trade.count === 1 ? "" : "s"}`,
          detail: `Expire ${shortDate(trade.expires)} · ${money(trade.premiumUsd)} collected`,
        };
      }
      const option = options.get(trade.closes);
      const shares = (option?.count ?? 0) * SHARES_PER_CONTRACT;
      const strike = option ? money(option.strikeUsd) : "";
      if (trade.type === "assigned") {
        return { id: trade.id, date, kind: "assigned", headline: `The Harvester was assigned ${shares.toLocaleString("en-US")} ${trade.ticker} shares`, detail: `Bought at ${strike} a share, from the ${strike} puts` };
      }
      if (trade.type === "called-away") {
        return { id: trade.id, date, kind: "called-away", headline: `The Harvester's ${shares.toLocaleString("en-US")} ${trade.ticker} shares were called away`, detail: `Sold at ${strike} a share, from the ${strike} calls` };
      }
      return { id: trade.id, date, kind: "expired", headline: `The Harvester's ${trade.ticker} ${strike} options expired unused`, detail: "The whole premium is kept" };
    });
}

/** One option sold, with what became of it and what it made or lost so far. */
export type TradeResult = {
  id: string;
  ticker: string;
  kind: "put" | "call";
  count: number;
  strikeUsd: number;
  sold: string;
  expires: string;
  premiumUsd: number;
  outcome: "open" | "expired" | "assigned" | "called-away";
  /** When it expired, was assigned or was called away. */
  closed: string | null;
  /** Shares this put brought in, and how they have done: sold ones at their sale price, held ones at today's price. */
  shares: { count: number; paidUsd: number; nowUsd: number; resultUsd: number } | null;
  /** Premium plus the shares' result. */
  profitUsd: number;
};

/**
 * Every option sold, newest first, each with its own P/L. A put that was assigned carries the result of the
 * shares it bought (first in, first out when shares are called away), so the rows add up to the same total
 * as the positions and nothing is counted twice.
 */
export function tradeHistory(tickers: TickerInfo[], trades: Trade[]): TradeResult[] {
  const price = new Map(tickers.map((t) => [t.ticker, t.priceUsd]));
  const sorted = [...trades].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
  const options = new Map(sorted.filter(isOption).map((t) => [t.id, t]));
  const closedBy = new Map(sorted.filter((t) => !isOption(t)).map((t) => [(t as Exclude<Trade, OptionTrade>).closes, t]));
  // Lots of shares per ticker, oldest first: which put bought them, at what price, and how many were sold since.
  const lots = new Map<string, { putId: string; shares: number; paidUsd: number; soldShares: number; soldUsd: number }[]>();

  for (const trade of sorted) {
    if (isOption(trade)) continue;
    const option = options.get(trade.closes);
    if (!option) continue;
    const shares = option.count * SHARES_PER_CONTRACT;
    const list = lots.get(trade.ticker) ?? [];
    if (trade.type === "assigned") {
      list.push({ putId: option.id, shares, paidUsd: option.strikeUsd, soldShares: 0, soldUsd: 0 });
    } else if (trade.type === "called-away") {
      let left = shares;
      for (const lot of list) {
        const take = Math.min(left, lot.shares - lot.soldShares);
        lot.soldShares += take;
        lot.soldUsd += take * option.strikeUsd;
        left -= take;
        if (left === 0) break;
      }
    }
    lots.set(trade.ticker, list);
  }

  return [...options.values()]
    .map((option): TradeResult => {
      const closing = closedBy.get(option.id);
      const outcome = !closing ? "open" : closing.type === "assigned" ? "assigned" : closing.type === "called-away" ? "called-away" : "expired";
      const lot = (lots.get(option.ticker) ?? []).find((l) => l.putId === option.id);
      const nowUsd = price.get(option.ticker) ?? 0;
      const shares = lot
        ? {
            count: lot.shares,
            paidUsd: lot.paidUsd,
            nowUsd,
            resultUsd: lot.soldUsd + (lot.shares - lot.soldShares) * nowUsd - lot.shares * lot.paidUsd,
          }
        : null;
      return {
        id: option.id,
        ticker: option.ticker,
        kind: option.type === "sell-put" ? "put" : "call",
        count: option.count,
        strikeUsd: option.strikeUsd,
        sold: shortDate(option.date),
        expires: shortDate(option.expires),
        premiumUsd: option.premiumUsd,
        outcome,
        closed: closing ? shortDate(closing.date) : null,
        shares,
        profitUsd: option.premiumUsd + (shares?.resultUsd ?? 0),
      };
    })
    .reverse();
}

/** What the shares held in one stock cost on average, before and after the premium collected this cycle. */
export type BlendedCost = {
  ticker: string;
  name: string;
  priceUsd: number;
  /** Shares held now, or null when none are held. */
  shares: {
    count: number;
    /** Average strike actually paid across every assignment still held. */
    paidUsd: number;
    /** Premium from this cycle that counts against those shares. */
    premiumUsd: number;
    /** (What was paid − that premium) ÷ shares. */
    netUsd: number;
  } | null;
};

/**
 * Blended cost per stock. "Paid" is the average strike across the lots still held. "After premium" also takes
 * off every premium kept since the stock last had no shares (expired puts, the puts that assigned, calls sold
 * against the shares, open calls included). Open puts are left out: if they are assigned they buy new shares,
 * and their premium will count against those.
 */
export function blendedCosts(tickers: TickerInfo[], trades: Trade[]): BlendedCost[] {
  return tickers.map((info) => {
    const mine = trades.filter((t) => t.ticker === info.ticker).sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));
    const options = new Map(mine.filter(isOption).map((t) => [t.id, t]));
    const closed = new Set<string>();
    let count = 0;
    let costUsd = 0;
    let cycleStart = "";

    for (const trade of mine) {
      if (isOption(trade)) continue;
      closed.add(trade.closes);
      const option = options.get(trade.closes);
      if (!option || trade.type === "expired") continue;
      const shares = option.count * SHARES_PER_CONTRACT;
      if (trade.type === "assigned") {
        count += shares;
        costUsd += shares * option.strikeUsd;
      } else {
        const averageUsd = count > 0 ? costUsd / count : 0;
        costUsd -= shares * averageUsd;
        count -= shares;
        if (count <= 0) {
          count = 0;
          costUsd = 0;
          cycleStart = trade.date; // a new cycle starts once every share is gone
        }
      }
    }

    if (count === 0) return { ticker: info.ticker, name: info.name, priceUsd: info.priceUsd, shares: null };

    const premiumUsd = [...options.values()]
      .filter((o) => o.date >= cycleStart && !(o.type === "sell-put" && !closed.has(o.id)))
      .reduce((sum, o) => sum + o.premiumUsd, 0);
    return {
      ticker: info.ticker,
      name: info.name,
      priceUsd: info.priceUsd,
      shares: { count, paidUsd: costUsd / count, premiumUsd, netUsd: (costUsd - premiumUsd) / count },
    };
  });
}
