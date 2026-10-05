// Shown while a dashboard page is being prepared (docs/rules/UI.md, "Four states").
export default function DashboardLoading() {
  return (
    <div className="flex animate-pulse flex-col gap-4" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-48 rounded-md bg-muted" />
      <div className="h-24 rounded-lg bg-muted" />
    </div>
  );
}
