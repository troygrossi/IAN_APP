/** A small rounded label, for a status like "Selling puts" or "DRIP on". Always carries words, never color alone. */
const tones = {
  success: "bg-success-soft text-success",
  accent: "bg-accent-soft text-accent",
  neutral: "bg-muted text-muted-foreground",
  danger: "bg-danger-soft text-danger",
} as const;

export type BadgeTone = keyof typeof tones;

export function Badge({ tone = "neutral", children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-sm font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
