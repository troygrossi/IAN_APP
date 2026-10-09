import { z } from "zod";
import { env } from "@/lib/env";
import type { TickerInfo } from "@/lib/wheel/ledger";
import { SAMPLE_AS_OF, SAMPLE_AS_OF_ISO, TICKERS } from "@/lib/wheel/sample-data";

// Live prices for the Core Four, from Financial Modeling Prep (docs/decisions/11-live-prices.md).
// Without FMP_API_KEY, or if FMP does not answer, the pages fall back to the snapshot in sample-data.ts
// and say so. This never throws: a price feed being down must never take a page down with it.

/** How long one answer from FMP is reused, in seconds. Keeps a busy day inside FMP's request limit. */
export const PRICE_REFRESH_SECONDS = 300;

const FMP = "https://financialmodelingprep.com/stable";

const quotes = z.array(
  z.object({
    symbol: z.string(),
    price: z.number(),
    priceAvg50: z.number().optional(),
    timestamp: z.number(),
  }),
);
type Quote = z.infer<typeof quotes>[number];

export type PricedTickers = {
  tickers: TickerInfo[];
  /** True when the prices came from FMP just now, false for the saved snapshot. */
  live: boolean;
  /** "Oct 9, 2026, 12:05 PM ET": when the newest price was set. */
  asOf: string;
  /** The same day as YYYY-MM-DD, New York time. */
  asOfIso: string;
};

async function getQuotes(url: string): Promise<Quote[]> {
  try {
    const response = await fetch(url, { next: { revalidate: PRICE_REFRESH_SECONDS }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) return [];
    const parsed = quotes.safeParse(await response.json());
    return parsed.success ? parsed.data : [];
  } catch {
    return []; // Never log the URL: it carries the API key.
  }
}

async function fetchQuotes(symbols: string[], key: string): Promise<Quote[]> {
  const apikey = encodeURIComponent(key);
  // One request for all of them when the FMP plan allows batch quotes; otherwise one each.
  const batch = await getQuotes(`${FMP}/batch-quote?symbols=${symbols.join(",")}&apikey=${apikey}`);
  if (batch.length > 0) return batch;
  const each = await Promise.all(symbols.map((symbol) => getQuotes(`${FMP}/quote?symbol=${symbol}&apikey=${apikey}`)));
  return each.flat();
}

/** The Core Four with the latest prices, or the snapshot if live prices are not available. */
export async function coreFourPrices(): Promise<PricedTickers> {
  const snapshot: PricedTickers = { tickers: TICKERS, live: false, asOf: SAMPLE_AS_OF, asOfIso: SAMPLE_AS_OF_ISO };
  if (!env.FMP_API_KEY) return snapshot;

  const found = new Map((await fetchQuotes(TICKERS.map((t) => t.ticker), env.FMP_API_KEY)).map((q) => [q.symbol, q]));
  // All four or none: a page mixing live and old prices would add up to numbers that never existed together.
  if (!TICKERS.every((t) => found.has(t.ticker))) return snapshot;

  const newest = new Date(Math.max(...[...found.values()].map((q) => q.timestamp)) * 1000);
  const inNewYork = (options: Intl.DateTimeFormatOptions) => newest.toLocaleString("en-US", { timeZone: "America/New_York", ...options });
  return {
    tickers: TICKERS.map((info) => {
      const quote = found.get(info.ticker)!;
      return { ...info, priceUsd: quote.price, avg50Usd: quote.priceAvg50 ?? info.avg50Usd };
    }),
    live: true,
    asOf: `${inNewYork({ month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })} ET`,
    asOfIso: newest.toLocaleDateString("en-CA", { timeZone: "America/New_York" }),
  };
}
