import { WHEEL_PHASES, type WheelPhase } from "@/lib/wheel/ledger";

/**
 * The four steps of the wheel as a segmented bar, with the current step filled.
 * The step is also written out in words, so color is never the only signal.
 */
export function CycleSteps({ phase }: { phase: WheelPhase }) {
  const index = WHEEL_PHASES.findIndex((step) => step.id === phase);
  return (
    <div className="flex flex-col gap-1.5">
      <ol className="grid grid-cols-4 gap-1" aria-hidden="true">
        {WHEEL_PHASES.map((step, i) => (
          <li key={step.id} className={`h-1.5 rounded-full ${i <= index ? "bg-primary" : "bg-muted"}`} />
        ))}
      </ol>
      <p className="text-sm text-muted-foreground">
        Step {index + 1} of 4: {WHEEL_PHASES[index].label.toLowerCase()}
      </p>
    </div>
  );
}
