"use client";

import type { ReactNode } from "react";
import type { Challenge } from "@/lib/types";
import { NumberedChallengeCard } from "./numbered-challenge-card";

interface ChallengeListProps {
  challenges: Challenge[];
  visualizations?: Record<string, ReactNode>;
}

export function ChallengeList({
  challenges,
  visualizations = {},
}: ChallengeListProps) {
  return (
    <div className="flex flex-col gap-4">
      {challenges.map((challenge, index) => (
        <NumberedChallengeCard
          key={challenge.id}
          challenge={challenge}
          index={index}
          visualization={visualizations[challenge.id]}
        />
      ))}
    </div>
  );
}
