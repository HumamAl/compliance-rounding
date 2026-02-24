import type { Challenge } from "@/lib/types";

export interface ExecutiveSummaryData {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export const executiveSummary: ExecutiveSummaryData = {
  commonApproach:
    "Most developers build compliance tools that assume reliable connectivity — inspectors walk into a basement or MRI suite and data simply disappears. They also treat SAFER scoring as a lookup table and regulatory standards as a static import.",
  differentApproach:
    "I build for the real hospital environment: offline-first data capture that queues and syncs when signal returns, a configurable SAFER scoring engine that handles the full 3×3 risk matrix, and a hierarchical tagging system that stays current as standards evolve.",
  accentWord: "offline-first",
};

export const challenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Offline-First Data Capture with Conflict-Free Sync",
    description:
      "Inspectors routinely lose connectivity in basements, MRI suites, and shielded areas. A standard REST-on-submit approach drops data silently — unacceptable for regulatory evidence.",
    visualizationType: "flow",
    outcome:
      "Could eliminate data loss during inspections and reduce sync failures by 90%+ compared to a network-required approach.",
  },
  {
    id: "challenge-2",
    title: "SAFER Matrix Scoring Engine",
    description:
      "CMS and Joint Commission SAFER scoring combines scope (Limited / Pattern / Widespread) with likelihood (Low / Moderate / High) to produce a 1-9 risk score. Manual matrix lookups introduce scoring inconsistency across inspectors.",
    visualizationType: "risk-matrix",
    outcome:
      "Could reduce manual scoring errors by 85% and ensure consistent risk categorization across all facilities and inspectors.",
  },
  {
    id: "challenge-3",
    title: "Multi-Standard Regulatory Tagging System",
    description:
      "Accreditation bodies update chapters and Elements of Performance frequently. A flat spreadsheet-based tagging approach breaks on every revision cycle and can't support multiple agencies simultaneously.",
    visualizationType: "before-after",
    outcome:
      "Could cut standard tagging time by 60% and ensure zero missed EP assignments during surveys — even as standards are revised mid-cycle.",
  },
];
