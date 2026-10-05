/** "$1,580" — whole dollars for premium totals. */
export function formatUsd(amount: number) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

/** "$11.33" — cents for share prices and strikes. */
export function formatPrice(amount: number) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}
