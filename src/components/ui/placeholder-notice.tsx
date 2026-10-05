/** Marks a screen that only simulates a feature, so nobody mistakes it for the real thing. */
export function PlaceholderNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-md border border-dashed border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">Placeholder.</span> {children}
    </p>
  );
}
