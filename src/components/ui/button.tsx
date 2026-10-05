import type { ComponentProps } from "react";

// min-h-11 keeps every button at least 44px tall, a comfortable target for a thumb.
const base =
  "inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50";

const variants = {
  primary: "bg-primary text-primary-foreground",
  secondary: "border border-border bg-card text-foreground",
} as const;

type Variant = keyof typeof variants;

/** Use on a <Link> that should look like a button. */
export function buttonClass(variant: Variant = "primary") {
  return `${base} ${variants[variant]}`;
}

export function Button({ variant = "primary", ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button {...props} className={buttonClass(variant)} />;
}
