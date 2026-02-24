"use client";

import { useState, useMemo } from "react";
import { rounds, getFacilityById, getUserById, facilities } from "@/data/mock-data";
import type { RoundStatus } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Card } from "@/components/ui/card";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SortKey = "startDate" | "score" | "deficiencyCount" | "status";

function StatusBadge({ status }: { status: RoundStatus }) {
  const config: Record<RoundStatus, { label: string; className: string; icon: React.ReactNode }> = {
    Scheduled: {
      label: "Scheduled",
      className: "text-muted-foreground bg-muted",
      icon: <Calendar className="w-3 h-3" />,
    },
    "In Progress": {
      label: "In Progress",
      className: "text-primary bg-primary/10",
      icon: <Clock className="w-3 h-3" />,
    },
    Completed: {
      label: "Completed",
      className: "text-[color:var(--success)] bg-[color:var(--success)]/10",
      icon: <CheckCircle2 className="w-3 h-3" />,
    },
    Cancelled: {
      label: "Cancelled",
      className: "text-destructive bg-destructive/10",
      icon: <AlertCircle className="w-3 h-3" />,
    },
  };
  const c = config[status];
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium rounded-full border-0 flex items-center gap-1 w-fit", c.className)}
    >
      {c.icon}
      {c.label}
    </Badge>
  );
}

function ScoreCell({ score }: { score: number | null }) {
  if (score === null) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }
  const colorClass =
    score >= 90
      ? "text-[color:var(--success)]"
      : score >= 75
      ? "text-[color:var(--warning)]"
      : "text-destructive";
  return (
    <span className={cn("font-mono text-sm font-semibold tabular-nums", colorClass)}>
      {score.toFixed(1)}
    </span>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RoundsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [facilityFilter, setFacilityFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("startDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    return rounds
      .filter((r) => {
        const facility = getFacilityById(r.facilityId);
        const inspector = getUserById(r.inspectorId);
        const matchSearch =
          search === "" ||
          (facility?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
          r.department.toLowerCase().includes(search.toLowerCase()) ||
          (inspector?.name ?? "").toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || r.status === statusFilter;
        const matchFacility =
          facilityFilter === "all" || r.facilityId === facilityFilter;
        return matchSearch && matchStatus && matchFacility;
      })
      .sort((a, b) => {
        let aVal: string | number;
        let bVal: string | number;
        if (sortKey === "startDate") {
          aVal = a.startDate;
          bVal = b.startDate;
        } else if (sortKey === "score") {
          aVal = a.score ?? -1;
          bVal = b.score ?? -1;
        } else if (sortKey === "deficiencyCount") {
          aVal = a.deficiencyCount;
          bVal = b.deficiencyCount;
        } else {
          aVal = a.status;
          bVal = b.status;
        }
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, statusFilter, facilityFilter, sortKey, sortDir]);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  }

  // Summary counts
  const completedCount = rounds.filter((r) => r.status === "Completed").length;
  const inProgressCount = rounds.filter((r) => r.status === "In Progress").length;
  const scheduledCount = rounds.filter((r) => r.status === "Scheduled").length;

  return (
    <div className="p-4 md:p-6 space-y-6 animate-tab-fade">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rounds</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compliance rounding history and scheduled inspections across all facilities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            Export
          </Button>
          <Button size="sm">
            <Calendar className="w-4 h-4 mr-1.5" />
            Schedule Round
          </Button>
        </div>
      </div>

      {/* Summary stat chips */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setStatusFilter("all")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors duration-100",
            statusFilter === "all"
              ? "border-primary/30 bg-primary/8 text-primary"
              : "border-border/60 bg-background text-muted-foreground hover:bg-muted/50"
          )}
        >
          All
          <span className="font-mono text-xs">{rounds.length}</span>
        </button>
        <button
          onClick={() => setStatusFilter("Completed")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors duration-100",
            statusFilter === "Completed"
              ? "border-[color:var(--success)]/30 bg-[color:var(--success)]/8 text-[color:var(--success)]"
              : "border-border/60 bg-background text-muted-foreground hover:bg-muted/50"
          )}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Completed
          <span className="font-mono text-xs">{completedCount}</span>
        </button>
        <button
          onClick={() => setStatusFilter("In Progress")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors duration-100",
            statusFilter === "In Progress"
              ? "border-primary/30 bg-primary/8 text-primary"
              : "border-border/60 bg-background text-muted-foreground hover:bg-muted/50"
          )}
        >
          <Clock className="w-3.5 h-3.5" />
          In Progress
          <span className="font-mono text-xs">{inProgressCount}</span>
        </button>
        <button
          onClick={() => setStatusFilter("Scheduled")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors duration-100",
            statusFilter === "Scheduled"
              ? "border-border bg-muted text-foreground"
              : "border-border/60 bg-background text-muted-foreground hover:bg-muted/50"
          )}
        >
          <Calendar className="w-3.5 h-3.5" />
          Scheduled
          <span className="font-mono text-xs">{scheduledCount}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by facility, department, or inspector..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={facilityFilter} onValueChange={setFacilityFilter}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Facility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Facilities</SelectItem>
            {facilities.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <Card className="linear-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none"
                  onClick={() => handleSort("startDate")}
                >
                  <div className="flex items-center gap-1">
                    Date
                    <SortIcon col="startDate" />
                  </div>
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Facility
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Department
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Inspector
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <SortIcon col="status" />
                  </div>
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none text-right"
                  onClick={() => handleSort("deficiencyCount")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Deficiencies
                    <SortIcon col="deficiencyCount" />
                  </div>
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none text-right"
                  onClick={() => handleSort("score")}
                >
                  <div className="flex items-center justify-end gap-1">
                    Score
                    <SortIcon col="score" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No rounds match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((round) => {
                  const facility = getFacilityById(round.facilityId);
                  const inspector = getUserById(round.inspectorId);
                  return (
                    <TableRow key={round.id} className="hover:bg-muted/30 transition-colors duration-100">
                      <TableCell className="py-2 px-3 font-mono text-sm tabular-nums text-muted-foreground whitespace-nowrap">
                        {formatDate(round.startDate)}
                      </TableCell>
                      <TableCell className="py-2 px-3 text-sm font-medium whitespace-nowrap">
                        {facility?.name ?? round.facilityId}
                      </TableCell>
                      <TableCell className="py-2 px-3 text-sm text-muted-foreground">
                        {round.department}
                      </TableCell>
                      <TableCell className="py-2 px-3 text-sm text-muted-foreground whitespace-nowrap">
                        {inspector?.name ?? round.inspectorId}
                      </TableCell>
                      <TableCell className="py-2 px-3">
                        <StatusBadge status={round.status} />
                      </TableCell>
                      <TableCell className="py-2 px-3 text-right">
                        {round.deficiencyCount > 0 ? (
                          <span className="font-mono text-sm tabular-nums text-[color:var(--warning)] font-medium">
                            {round.deficiencyCount}
                          </span>
                        ) : (
                          <span className="font-mono text-sm tabular-nums text-[color:var(--success)]">
                            0
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-2 px-3 text-right">
                        <ScoreCell score={round.score} />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
