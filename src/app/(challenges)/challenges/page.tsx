import { challenges, executiveSummary } from "@/data/challenges";

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold">My Approach</h1>
          <p className="text-sm text-muted-foreground mt-1">
            How I would tackle the key technical challenges in this project
          </p>
        </div>

        <div className="rounded-xl bg-primary/5 border border-primary/20 p-6">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {executiveSummary}
          </p>
        </div>

        <div className="space-y-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="rounded-xl bg-gradient-to-br from-accent/5 to-background shadow-lg border border-primary/10 p-6 space-y-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-200"
            >
              <div>
                <h2 className="text-lg font-semibold">{challenge.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {challenge.description}
                </p>
              </div>

              {/* TODO: Replace with actual visualization component — QA will reject gray placeholder boxes */}
              <div className="h-32 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-sm text-muted-foreground">
                {challenge.visualizationType} visualization
              </div>

              {/* Outcome statement */}
              {challenge.outcome && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-medium text-[color:var(--success)]">
                    {challenge.outcome}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Closer */}
        <div className="text-center py-8 border-t border-border">
          <p className="text-lg font-semibold">Ready to discuss the approach?</p>
          <p className="text-sm text-muted-foreground mt-1">
            Let&apos;s walk through how these solutions apply to your specific setup.
          </p>
        </div>
      </div>
    </div>
  );
}
