import { PRICE_REFRESH_SECONDS, type PricedTickers } from "@/lib/services/prices";

/** One sentence saying where the prices on a page came from: live, or the saved snapshot. */
export function PriceSource({ prices }: { prices: Pick<PricedTickers, "live" | "asOf"> }) {
  return prices.live ? (
    <>
      Prices are live from Financial Modeling Prep, at most {PRICE_REFRESH_SECONDS / 60} minutes old (last trade{" "}
      {prices.asOf}).
    </>
  ) : (
    <>Prices are a snapshot from {prices.asOf}; live prices are not connected right now.</>
  );
}
