"use client";

import type { ReactNode } from "react";
import type { Challenge } from "@/lib/types";
import { ChallengeList } from "./challenge-list";
import { OfflineSyncViz } from "./offline-sync-viz";
import { SaferMatrixViz } from "./safer-matrix-viz";
import { TaggingViz } from "./tagging-viz";

interface ChallengePageContentProps {
  challenges: Challenge[];
}

export function ChallengePageContent({ challenges }: ChallengePageContentProps) {
  const visualizations: Record<string, ReactNode> = {
    "challenge-1": <OfflineSyncViz />,
    "challenge-2": <SaferMatrixViz />,
    "challenge-3": <TaggingViz />,
  };

  return <ChallengeList challenges={challenges} visualizations={visualizations} />;
}
