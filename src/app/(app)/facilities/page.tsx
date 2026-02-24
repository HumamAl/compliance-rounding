"use client";

import { useState, useMemo } from "react";
import {
  facilities,
  getDeficienciesByFacility,
  getRoundsByFacility,
} from "@/data/mock-data";
import type { Facility, FacilityType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Building2,
  MapPin,
  AlertTriangle,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

function FacilityStatusBadge({ status }: { status: Facility["status"] }) {
  const config: Record<Facility["status"], { label: string; className: string }> = {
    Active: {
      label: "Active",
      className:
        "text-[color:var(--success)] bg-[color:var(--success)]/10 border-[color:var(--success)]/20",
    },
    "Under Review": {
      label: "Under Review",
      className:
        "text-[color:var(--warning)] bg-[color:var(--warning)]/10 border-[color:var(--warning)]/20",
    },
    "Accreditation Pending": {
      label: "Accreditation Pending",
      className: "text-destructive bg-destructive/10 border-destructive/20",
    },
  };
  const c = config[status];
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium rounded-full border", c.className)}
    >
      {c.label}
    </Badge>
  );
}

function ComplianceBar({ score }: { score: number }) {
  const colorClass =
    score >= 90
      ? "[&>div]:bg-[color:var(--success)]"
      : score >= 75
      ? "[&>div]:bg-[color:var(--warning)]"
      : "[&>div]:bg-destructive";
  const textClass =
    score >= 90
      ? "text-[color:var(--success)]"
      : score >= 75
      ? "text-[color:var(--warning)]"
      : "text-destructive";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Compliance Score</span>
        <span className={cn("font-mono text-sm font-bold tabular-nums", textClass)}>
          {score.toFixed(1)}%
        </span>
      </div>
      <Progress value={score} className={cn("h-1.5", colorClass)} />
    </div>
  );
}

function FacilityDetailPanel({ facility, onClose }: { facility: Facility; onClose: () => void }) {
  const deficiencies = getDeficienciesByFacility(facility.id);
  const rounds = getRoundsByFacility(facility.id);
  const openDefs = deficiencies.filter(
    (d) => d.status === "Open" || d.status === "In Progress" || d.status === "Overdue"
  );
  const criticalDefs = deficiencies.filter(
    (d) => d.priority === "Critical" && d.status !== "Resolved"
  );
  const completedRounds = rounds.filter((r) => r.status === "Completed");

  return (
    <div className="linear-card p-4 space-y-4 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{facility.name}</h3>
          <p className="text-sm text-muted-foreground">
            {facility.address}, {facility.city}, {facility.state}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors duration-100"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-muted/40 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Open Deficiencies</p>
          <p className={cn(
            "font-mono text-xl font-bold",
            openDefs.length > 10 ? "text-destructive" : openDefs.length > 5 ? "text-[color:var(--warning)]" : "text-[color:var(--success)]"
          )}>
            {openDefs.length}
          </p>
        </div>
        <div className="bg-muted/40 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Critical Open</p>
          <p className={cn(
            "font-mono text-xl font-bold",
            criticalDefs.length > 0 ? "text-destructive" : "text-[color:var(--success)]"
          )}>
            {criticalDefs.length}
          </p>
        </div>
        <div className="bg-muted/40 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Rounds (Total)</p>
          <p className="font-mono text-xl font-bold text-foreground">{rounds.length}</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Completed</p>
          <p className="font-mono text-xl font-bold text-[color:var(--success)]">{completedRounds.length}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Recent Open Deficiencies
        </p>
        {openDefs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No open deficiencies.</p>
        ) : (
          <div className="space-y-1.5">
            {openDefs.slice(0, 4).map((def) => (
              <div
                key={def.id}
                className="flex items-start justify-between gap-3 text-sm py-1.5 border-b border-border/60 last:border-0"
              >
                <span className="line-clamp-1 flex-1">{def.title}</span>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 text-xs rounded-full border-0",
                    def.priority === "Critical"
                      ? "text-destructive bg-destructive/10"
                      : def.priority === "High"
                      ? "text-[color:var(--warning)] bg-[color:var(--warning)]/10"
                      : "text-primary bg-primary/10"
                  )}
                >
                  {def.priority}
                </Badge>
              </div>
            ))}
            {openDefs.length > 4 && (
              <p className="text-xs text-muted-foreground pt-1">
                +{openDefs.length - 4} more deficiencies
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
        <span>Compliance Officer: {facility.complianceOfficer}</span>
        {facility.beds && <span>{facility.beds} beds</span>}
      </div>
    </div>
  );
}

type SortKey = "complianceScore" | "openDeficiencies" | "name";

export default function FacilitiesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("complianceScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    return facilities
      .filter((f) => {
        const matchSearch =
          search === "" ||
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.city.toLowerCase().includes(search.toLowerCase()) ||
          f.state.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "all" || f.type === typeFilter;
        return matchSearch && matchType;
      })
      .sort((a, b) => {
        let aVal: string | number;
        let bVal: string | number;
        if (sortKey === "complianceScore") {
          aVal = a.complianceScore;
          bVal = b.complianceScore;
        } else if (sortKey === "openDeficiencies") {
          aVal = a.openDeficiencies;
          bVal = b.openDeficiencies;
        } else {
          aVal = a.name;
          bVal = b.name;
        }
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, typeFilter, sortKey, sortDir]);

  function SortButton({ col, children }: { col: SortKey; children: React.ReactNode }) {
    return (
      <button
        onClick={() => handleSort(col)}
        className={cn(
          "flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-100",
          sortKey === col && "text-foreground"
        )}
      >
        {children}
        {sortKey === col ? (
          sortDir === "asc" ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )
        ) : null}
      </button>
    );
  }

  const facilityTypes: FacilityType[] = ["Hospital", "Ambulatory", "Clinic"];

  return (
    <div className="p-4 md:p-6 space-y-6 animate-tab-fade">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Facilities</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compliance overview across all monitored facilities. Click a card to view details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Add Facility
          </Button>
        </div>
      </div>

      {/* Filters + Sort */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {facilityTypes.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">Sort:</span>
          <SortButton col="complianceScore">Score</SortButton>
          <span className="text-muted-foreground/40">·</span>
          <SortButton col="openDeficiencies">Deficiencies</SortButton>
          <span className="text-muted-foreground/40">·</span>
          <SortButton col="name">Name</SortButton>
        </div>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {filtered.length} facilit{filtered.length !== 1 ? "ies" : "y"}
        </span>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full h-40 flex items-center justify-center text-sm text-muted-foreground">
            No facilities match the current filters.
          </div>
        ) : (
          filtered.map((facility, index) => (
            <Card
              key={facility.id}
              className={cn(
                "linear-card cursor-pointer animate-fade-in",
                selectedFacility?.id === facility.id &&
                  "border-primary/40 bg-primary/5"
              )}
              style={{
                animationDelay: `${index * 80}ms`,
                animationDuration: "200ms",
              }}
              onClick={() =>
                setSelectedFacility(
                  selectedFacility?.id === facility.id ? null : facility
                )
              }
            >
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold leading-tight line-clamp-1">
                      {facility.name}
                    </CardTitle>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="line-clamp-1">
                        {facility.city}, {facility.state}
                      </span>
                    </div>
                  </div>
                  <FacilityStatusBadge status={facility.status} />
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{facility.type}</span>
                  {facility.beds && (
                    <>
                      <span className="text-muted-foreground/40">·</span>
                      <span>{facility.beds} beds</span>
                    </>
                  )}
                </div>

                <ComplianceBar score={facility.complianceScore} />

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <AlertTriangle
                      className={cn(
                        "w-3.5 h-3.5",
                        facility.openDeficiencies > 10
                          ? "text-destructive"
                          : facility.openDeficiencies > 5
                          ? "text-[color:var(--warning)]"
                          : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "font-medium",
                        facility.openDeficiencies > 10
                          ? "text-destructive"
                          : facility.openDeficiencies > 5
                          ? "text-[color:var(--warning)]"
                          : "text-muted-foreground"
                      )}
                    >
                      {facility.openDeficiencies} open
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    <span>Last round {formatLastRound(facility.lastRoundDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Panel */}
      {selectedFacility && (
        <FacilityDetailPanel
          facility={selectedFacility}
          onClose={() => setSelectedFacility(null)}
        />
      )}
    </div>
  );
}

function formatLastRound(dateStr: string) {
  const diff = Math.round(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "today";
  if (diff === 1) return "1 day ago";
  return `${diff} days ago`;
}
