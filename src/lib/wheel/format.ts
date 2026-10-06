/** "$1,580" — whole dollars for premium totals. */
export function formatUsd(amount: number) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

/** "$11.33" — cents for share prices and strikes. */
export function formatPrice(amount: number) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
}

/** "+$198" or "−$570": a gain or loss, always with its sign, so it never relies on color alone. */
export function formatSignedUsd(amount: number) {
  const whole = Math.round(amount);
  if (whole === 0) return "$0";
  return `${whole > 0 ? "+" : "−"}${formatUsd(Math.abs(whole))}`;
}
