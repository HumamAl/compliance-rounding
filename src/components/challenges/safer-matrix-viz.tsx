"use client";

import { useState } from "react";

type Scope = "Limited" | "Pattern" | "Widespread";
type Likelihood = "Low" | "Moderate" | "High";

interface CellData {
  score: number;
  severity: "low" | "medium" | "high" | "critical";
  examples: string[];
}

const MATRIX: Record<Scope, Record<Likelihood, CellData>> = {
  Limited: {
    Low: {
      score: 1,
      severity: "low",
      examples: [
        "One blocked exit sign in a storage closet",
        "Single missing sharps label on one unit",
      ],
    },
    Moderate: {
      score: 2,
      severity: "low",
      examples: [
        "Outdated fire drill record for one department",
        "Single hand hygiene observation gap",
      ],
    },
    High: {
      score: 3,
      severity: "medium",
      examples: [
        "Expired medication in one patient room",
        "Single missing crash cart log",
      ],
    },
  },
  Pattern: {
    Low: {
      score: 2,
      severity: "low",
      examples: [
        "Multiple doors propped open on same floor",
        "Recurring late maintenance logs across a wing",
      ],
    },
    Moderate: {
      score: 4,
      severity: "medium",
      examples: [
        "Hand hygiene gaps repeated across a unit",
        "Inconsistent fall risk signage in one pod",
      ],
    },
    High: {
      score: 6,
      severity: "high",
      examples: [
        "Medication storage errors across multiple units",
        "Repeated missing ID checks in one department",
      ],
    },
  },
  Widespread: {
    Low: {
      score: 3,
      severity: "medium",
      examples: [
        "Facility-wide outdated emergency contacts",
        "Missing signage across all floors",
      ],
    },
    Moderate: {
      score: 6,
      severity: "high",
      examples: [
        "Systemic gap in hand hygiene monitoring",
        "Facility-wide equipment log deficiency",
      ],
    },
    High: {
      score: 9,
      severity: "critical",
      examples: [
        "Pervasive infection control failures",
        "Widespread missing restraint order documentation",
      ],
    },
  },
};

const scopes: Scope[] = ["Limited", "Pattern", "Widespread"];
const likelihoods: Likelihood[] = ["Low", "Moderate", "High"];

function severityStyle(severity: CellData["severity"]) {
  switch (severity) {
    case "low":
      return {
        bg: "color-mix(in oklch, var(--success) 10%, transparent)",
        border: "color-mix(in oklch, var(--success) 20%, transparent)",
        text: "var(--success)",
      };
    case "medium":
      return {
        bg: "color-mix(in oklch, var(--warning) 10%, transparent)",
        border: "color-mix(in oklch, var(--warning) 20%, transparent)",
        text: "var(--warning)",
      };
    case "high":
      return {
        bg: "color-mix(in oklch, var(--destructive) 8%, transparent)",
        border: "color-mix(in oklch, var(--destructive) 18%, transparent)",
        text: "var(--destructive)",
      };
    case "critical":
      return {
        bg: "color-mix(in oklch, var(--destructive) 15%, transparent)",
        border: "color-mix(in oklch, var(--destructive) 30%, transparent)",
        text: "var(--destructive)",
      };
  }
}

export function SaferMatrixViz() {
  const [selected, setSelected] = useState<{
    scope: Scope;
    likelihood: Likelihood;
  } | null>(null);

  const selectedCell =
    selected ? MATRIX[selected.scope][selected.likelihood] : null;

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
        Click a cell to see example deficiencies at that risk level
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="text-left pb-2 pr-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground w-24">
                Scope ↓ / Likelihood →
              </th>
              {likelihoods.map((l) => (
                <th
                  key={l}
                  className="pb-2 px-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground text-center"
                >
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scopes.map((scope) => (
              <tr key={scope}>
                <td className="pr-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground align-middle">
                  {scope}
                </td>
                {likelihoods.map((likelihood) => {
                  const cell = MATRIX[scope][likelihood];
                  const style = severityStyle(cell.severity);
                  const isSelected =
                    selected?.scope === scope &&
                    selected?.likelihood === likelihood;
                  return (
                    <td key={likelihood} className="px-1 py-1">
                      <button
                        onClick={() =>
                          setSelected(
                            isSelected ? null : { scope, likelihood }
                          )
                        }
                        className="w-full rounded-md p-2 text-center transition-all duration-100 cursor-pointer ring-offset-1"
                        style={{
                          backgroundColor: style.bg,
                          border: `1px solid ${isSelected ? style.text : style.border}`,
                          outline: isSelected
                            ? `2px solid ${style.text}`
                            : "none",
                          outlineOffset: "2px",
                        }}
                      >
                        <span
                          className="font-mono font-bold text-sm block"
                          style={{ color: style.text }}
                        >
                          {cell.score}
                        </span>
                        <span className="text-[9px] text-muted-foreground capitalize">
                          {cell.severity}
                        </span>
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Selected cell detail */}
      {selectedCell && selected && (
        <div
          className="rounded-md p-3 space-y-1 transition-all duration-100"
          style={{
            backgroundColor: severityStyle(selectedCell.severity).bg,
            borderColor: severityStyle(selectedCell.severity).border,
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <p
            className="text-xs font-semibold"
            style={{ color: severityStyle(selectedCell.severity).text }}
          >
            SAFER score {selectedCell.score} — {selected.scope} scope /{" "}
            {selected.likelihood} likelihood
          </p>
          <ul className="space-y-0.5">
            {selectedCell.examples.map((ex) => (
              <li
                key={ex}
                className="text-xs text-muted-foreground flex gap-1.5"
              >
                <span className="shrink-0">&#x2023;</span>
                {ex}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
