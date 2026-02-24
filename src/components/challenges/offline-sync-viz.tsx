"use client";

import { useState } from "react";
import {
  WifiOff,
  Wifi,
  DatabaseZap,
  ListChecks,
  ArrowRight,
  GitMerge,
  Server,
  ArrowDown,
} from "lucide-react";

export function OfflineSyncViz() {
  const [mode, setMode] = useState<"offline" | "online">("offline");

  const offlineSteps = [
    {
      id: "capture",
      label: "Capture Locally",
      description: "Write to IndexedDB",
      icon: ListChecks,
      highlight: false,
    },
    {
      id: "queue",
      label: "Sync Queue",
      description: "Pending operations",
      icon: DatabaseZap,
      highlight: true,
    },
    {
      id: "conflict",
      label: "Conflict Check",
      description: "Timestamp merge",
      icon: GitMerge,
      highlight: true,
    },
    {
      id: "server",
      label: "Server Sync",
      description: "Offline — waiting",
      icon: WifiOff,
      highlight: false,
      muted: true,
    },
  ];

  const onlineSteps = [
    {
      id: "capture",
      label: "Capture Locally",
      description: "Write to IndexedDB",
      icon: ListChecks,
      highlight: false,
    },
    {
      id: "queue",
      label: "Sync Queue",
      description: "Flushing queue",
      icon: DatabaseZap,
      highlight: false,
    },
    {
      id: "conflict",
      label: "Conflict Check",
      description: "Priority merge wins",
      icon: GitMerge,
      highlight: false,
    },
    {
      id: "server",
      label: "Server Sync",
      description: "Synced successfully",
      icon: Server,
      highlight: true,
    },
  ];

  const steps = mode === "offline" ? offlineSteps : onlineSteps;

  return (
    <div className="space-y-3">
      {/* Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
          Simulate mode:
        </span>
        <div className="flex rounded-md border border-border/60 overflow-hidden text-xs">
          <button
            onClick={() => setMode("offline")}
            className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors duration-100 ${
              mode === "offline"
                ? "bg-primary/10 text-primary font-medium"
                : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            <WifiOff className="h-3 w-3" />
            Offline
          </button>
          <button
            onClick={() => setMode("online")}
            className={`px-3 py-1.5 flex items-center gap-1.5 border-l border-border/60 transition-colors duration-100 ${
              mode === "online"
                ? "bg-primary/10 text-primary font-medium"
                : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            <Wifi className="h-3 w-3" />
            Back Online
          </button>
        </div>
      </div>

      {/* Flow */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-all duration-150 ${
                step.highlight
                  ? "border-primary bg-primary/10"
                  : "muted" in step && step.muted
                  ? "border-border/40 bg-muted/40 opacity-50"
                  : "border-border/60 bg-card"
              }`}
            >
              <step.icon
                className={`w-4 h-4 shrink-0 ${
                  step.highlight
                    ? "text-primary"
                    : "muted" in step && step.muted
                    ? "text-muted-foreground/50"
                    : "text-muted-foreground"
                }`}
              />
              <div>
                <p className="text-xs font-medium">{step.label}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {step.description}
                </p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
                <ArrowDown className="w-4 h-4 text-muted-foreground shrink-0 sm:hidden" />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Status hint */}
      <p className="text-[10px] font-mono text-muted-foreground">
        {mode === "offline"
          ? "Inspector is in an MRI suite — data writes to local queue, sync resumes when signal returns."
          : "Signal restored — queue flushed, conflict resolution applied, server updated."}
      </p>
    </div>
  );
}
