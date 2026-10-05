/**
 * The line that keeps the app on the right side of advice (see docs/rules/UI.md, "Wording"):
 * it shows one person's own trades, it never tells anyone what to do.
 */
export function Disclaimer() {
  return (
    <p className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
      These are The Harvester&rsquo;s personal positions, shown for education. Not financial advice: nothing here
      is a recommendation to buy or sell. Options carry real risk, including being assigned shares that keep falling.
    </p>
  );
}
