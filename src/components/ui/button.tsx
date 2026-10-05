import type { ComponentProps } from "react";

const base =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50";

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
