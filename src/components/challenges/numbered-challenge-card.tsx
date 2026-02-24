import type { ReactNode } from "react";
import type { Challenge } from "@/lib/types";
import { OutcomeStatement } from "./outcome-statement";

interface NumberedChallengeCardProps {
  challenge: Challenge;
  index: number;
  visualization?: ReactNode;
}

export function NumberedChallengeCard({
  challenge,
  index,
  visualization,
}: NumberedChallengeCardProps) {
  const stepNumber = String(index + 1).padStart(2, "0");

  return (
    <div
      className="linear-card bg-gradient-to-br from-accent/5 to-background animate-fade-in p-6 space-y-4"
      style={{
        animationDelay: `${index * 80}ms`,
        animationDuration: "200ms",
      }}
    >
      <div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm font-medium text-primary/70 w-6 shrink-0 tabular-nums">
            {stepNumber}
          </span>
          <h3 className="text-lg font-semibold">{challenge.title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1 pl-[calc(1.5rem+0.75rem)]">
          {challenge.description}
        </p>
      </div>
      <div className="space-y-4">
        {visualization && <div>{visualization}</div>}
        <OutcomeStatement outcome={challenge.outcome ?? ""} index={index} />
      </div>
    </div>
  );
}
