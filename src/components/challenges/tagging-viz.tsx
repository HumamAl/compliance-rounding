"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

const beforeItems = [
  "Manually match deficiency to chapter in spreadsheet",
  "Look up EP number in printed standard binder",
  "Re-tag all deficiencies after every standard update",
  "No validation — missed EPs go undetected",
  "Single accreditation body only — no multi-agency support",
];

const afterItems = [
  "Hierarchical Standard → EP tree with search",
  "Auto-suggest relevant EPs based on deficiency text",
  "Version control flags changed EPs on next review",
  "Validation engine alerts on missing required EPs",
  "Agency-agnostic: Joint Commission, DNV, CMS in one system",
];

const metrics = [
  { label: "Tagging time per deficiency", before: 8, after: 3, unit: " min", status: "success" as const },
  { label: "Missed EP assignments", before: 12, after: 0, unit: "%", status: "success" as const },
  { label: "Re-tagging work per standard update", before: 95, after: 10, unit: "%", status: "success" as const },
];

export function TaggingViz() {
  const [showMetrics, setShowMetrics] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (showMetrics) {
      const t = setTimeout(() => setAnimated(true), 50);
      return () => clearTimeout(t);
    } else {
      setAnimated(false);
    }
  }, [showMetrics]);

  return (
    <div className="space-y-3">
      {/* Before/After grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Before */}
        <div
          className="rounded-lg p-3 space-y-2"
          style={{
            backgroundColor: "color-mix(in oklch, var(--destructive) 6%, transparent)",
            borderColor: "color-mix(in oklch, var(--destructive) 15%, transparent)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <p className="text-xs font-semibold text-[color:var(--destructive)]">
            Current: Spreadsheet-based
          </p>
          <ul className="space-y-1">
            {beforeItems.map((item) => (
              <li
                key={item}
                className="text-xs text-[color:var(--destructive)] flex items-start gap-1.5"
              >
                <X className="h-3 w-3 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        {/* After */}
        <div
          className="rounded-lg p-3 space-y-2"
          style={{
            backgroundColor: "color-mix(in oklch, var(--success) 6%, transparent)",
            borderColor: "color-mix(in oklch, var(--success) 15%, transparent)",
            borderWidth: "1px",
            borderStyle: "solid",
          }}
        >
          <p className="text-xs font-semibold text-[color:var(--success)]">
            Proposed: Hierarchical System
          </p>
          <ul className="space-y-1">
            {afterItems.map((item) => (
              <li
                key={item}
                className="text-xs text-[color:var(--success)] flex items-start gap-1.5"
              >
                <Check className="h-3 w-3 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Toggle metric bars */}
      <button
        onClick={() => setShowMetrics((v) => !v)}
        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-100 underline underline-offset-2"
      >
        {showMetrics ? "Hide improvement metrics" : "Show improvement metrics"}
      </button>

      {showMetrics && (
        <div className="space-y-3 pt-1">
          {metrics.map((m) => {
            const beforePct = Math.round((m.before / Math.max(m.before, 100)) * 100);
            const afterPct = Math.round((m.after / Math.max(m.before, 100)) * 100);
            return (
              <div key={m.label} className="space-y-1">
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground w-12 shrink-0">
                      Before
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[color:var(--destructive)] transition-all duration-150"
                        style={{ width: animated ? `${beforePct}%` : "0%" }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[color:var(--destructive)] w-12 text-right shrink-0">
                      {m.before}{m.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-muted-foreground w-12 shrink-0">
                      After
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-[color:var(--success)] transition-all duration-150"
                        style={{ width: animated ? `${afterPct}%` : "0%" }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[color:var(--success)] w-12 text-right shrink-0">
                      {m.after}{m.unit}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
