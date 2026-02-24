// src/components/proposal/how-i-work.tsx
// Server Component — no hooks needed

interface ApproachStep {
  step: string;
  title: string;
  description: string;
  timeline: string;
}

interface HowIWorkProps {
  steps: ApproachStep[];
}

export function HowIWork({ steps }: HowIWorkProps) {
  return (
    <section className="space-y-5">
      <div>
        <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
          Process
        </p>
        <h2 className="text-2xl font-bold tracking-tight">How I Work</h2>
        <p className="text-sm text-muted-foreground mt-1">
          No surprises. Visible progress. Short feedback loops.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step) => (
          <div key={step.step} className="linear-card p-5 flex gap-4">
            {/* Step number column */}
            <div className="shrink-0 pt-0.5">
              <span className="font-mono text-2xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent tabular-nums">
                {step.step}
              </span>
            </div>

            {/* Content column */}
            <div className="space-y-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold">{step.title}</h3>
                <span className="font-mono text-xs text-muted-foreground shrink-0">
                  {step.timeline}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
