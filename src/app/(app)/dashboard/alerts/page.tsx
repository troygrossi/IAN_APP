import { Badge, type BadgeTone } from "@/components/ui/badge";
import { PlaceholderNotice } from "@/components/ui/placeholder-notice";
import { Disclaimer } from "@/components/wheel/disclaimer";
import type { TradeAlert } from "@/lib/wheel/ledger";
import { ALERTS, RECORD_START_LABEL } from "@/lib/wheel/sample-data";
import { requirePageSession } from "@/lib/auth/session";

export const metadata = { title: "Alerts" };

const KIND: Record<TradeAlert["kind"], { label: string; tone: BadgeTone }> = {
  "sold-put": { label: "Sold put", tone: "success" },
  "sold-call": { label: "Sold call", tone: "success" },
  assigned: { label: "Assigned", tone: "accent" },
  "called-away": { label: "Called away", tone: "accent" },
  expired: { label: "Expired", tone: "neutral" },
};

export default async function AlertsPage() {
  await requirePageSession(); // docs/rules/AUTH.md: every page in (app) is its own gate
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
        <p className="text-muted-foreground">What The Harvester did, as it happens. Never a signal to act on.</p>
      </div>
      <PlaceholderNotice>
        Sample alerts from The Harvester&rsquo;s tracker, starting {RECORD_START_LABEL}. Sending alerts by email or to your
        phone is not built yet.
      </PlaceholderNotice>

      {ALERTS.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-card p-6 text-muted-foreground">
          No trades yet. When The Harvester sells an option or gets assigned, it shows up here.
        </p>
      ) : (
        <ol className="flex flex-col gap-3">
          {ALERTS.map((alert) => (
            <li key={alert.id} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-start sm:gap-4">
              <div className="sm:w-32 sm:shrink-0">
                <Badge tone={KIND[alert.kind].tone}>{KIND[alert.kind].label}</Badge>
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="font-semibold">{alert.headline}</p>
                <p className="text-sm text-muted-foreground">{alert.detail}</p>
              </div>
              <time className="text-sm text-muted-foreground sm:shrink-0">{alert.date}</time>
            </li>
          ))}
        </ol>
      )}

      <Disclaimer />
    </div>
  );
}
