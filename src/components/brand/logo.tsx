import { APP_NAME } from "@/components/nav/nav-items";

/**
 * The Harvest the Wheel mark: a wagon wheel in field green with a wheat-gold hub.
 * The wheel is the strategy (it turns: sell a put, get assigned, sell a call, repeat);
 * the gold hub is the premium it harvests on every turn.
 */
export function LogoMark({ className = "size-7" }: { className?: string }) {
  const spokes = [0, 45, 90, 135];
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <circle cx="16" cy="16" r="13" className="stroke-primary" strokeWidth="2.5" />
      {spokes.map((angle) => (
        <line
          key={angle}
          x1="16"
          y1="4"
          x2="16"
          y2="28"
          className="stroke-primary"
          strokeWidth="1.75"
          strokeLinecap="round"
          transform={`rotate(${angle} 16 16)`}
        />
      ))}
      <circle cx="16" cy="16" r="4.25" className="fill-accent" />
    </svg>
  );
}

/** The mark and the name together, used in every header. */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      <span className="text-base font-bold tracking-tight">{APP_NAME}</span>
    </span>
  );
}
