"use client";

import { useState, useMemo } from "react";
import {
  deficiencies,
  getFacilityById,
  getUserById,
} from "@/data/mock-data";
import type {
  Deficiency,
  DeficiencyStatus,
  DeficiencyPriority,
} from "@/lib/types";
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
  AlertTriangle,
  ChevronRight,
  Camera,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SortKey = "dueDate" | "saferScore" | "title" | "priority" | "status";

function StatusBadge({ status }: { status: DeficiencyStatus }) {
  const config: Record<DeficiencyStatus, { label: string; className: string }> =
    {
      Open: {
        label: "Open",
        className:
          "text-[color:var(--warning)] bg-[color:var(--warning)]/10 border-[color:var(--warning)]/20",
      },
      "In Progress": {
        label: "In Progress",
        className: "text-primary bg-primary/10 border-primary/20",
      },
      Resolved: {
        label: "Resolved",
        className:
          "text-[color:var(--success)] bg-[color:var(--success)]/10 border-[color:var(--success)]/20",
      },
      Overdue: {
        label: "Overdue",
        className: "text-destructive bg-destructive/10 border-destructive/20",
      },
    };
  const c = config[status];
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium rounded-full border-0", c.className)}
    >
      {c.label}
    </Badge>
  );
}

function PriorityBadge({ priority }: { priority: DeficiencyPriority }) {
  const config: Record<
    DeficiencyPriority,
    { label: string; className: string }
  > = {
    Critical: {
      label: "Critical",
      className: "text-destructive bg-destructive/10",
    },
    High: {
      label: "High",
      className:
        "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
    },
    Medium: {
      label: "Medium",
      className: "text-primary bg-primary/10",
    },
    Low: {
      label: "Low",
      className: "text-muted-foreground bg-muted",
    },
  };
  const c = config[priority];
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium rounded-full border-0", c.className)}
    >
      {c.label}
    </Badge>
  );
}

function SaferScoreDot({ score }: { score: number }) {
  const colorClass =
    score >= 7
      ? "text-destructive"
      : score >= 4
      ? "text-[color:var(--warning)]"
      : "text-[color:var(--success)]";
  return (
    <span className={cn("font-mono text-sm font-semibold tabular-nums", colorClass)}>
      {score}
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

function isPastDue(dateStr: string) {
  return new Date(dateStr) < new Date();
}

function DeficiencyDetail({ deficiency }: { deficiency: Deficiency }) {
  const assignee = deficiency.assignedTo
    ? getUserById(deficiency.assignedTo)
    : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Description
          </p>
          <p className="text-sm leading-relaxed">{deficiency.description}</p>
        </div>
        {deficiency.correctionPlan && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Correction Plan
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {deficiency.correctionPlan}
            </p>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Standard / EP
            </p>
            <p className="font-mono text-sm text-primary">
              {deficiency.standardId}
            </p>
            <p className="text-xs text-muted-foreground">{deficiency.epNumber}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              SAFER Risk
            </p>
            <p className="text-sm">
              Score{" "}
              <span className="font-mono font-semibold">
                {deficiency.saferScore}
              </span>{" "}
              / 9
            </p>
            <p className="text-xs text-muted-foreground">
              {deficiency.saferScope} · {deficiency.saferLikelihood} likelihood
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Assigned To
            </p>
            <p className="text-sm">
              {assignee ? assignee.name : "Unassigned"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Photos
            </p>
            <div className="flex items-center gap-1 text-sm">
              <Camera className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{deficiency.photoCount} attached</span>
            </div>
          </div>
        </div>
        {deficiency.isRepeatFinding && (
          <div className="flex items-center gap-1.5 text-xs text-[color:var(--warning)] bg-[color:var(--warning)]/10 rounded-md px-2.5 py-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            Repeat finding from prior round — escalated review required.
          </div>
        )}
        {deficiency.resolvedDate && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Resolved Date
            </p>
            <p className="text-sm font-medium text-[color:var(--success)]">
              {formatDate(deficiency.resolvedDate)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeficienciesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const departments = useMemo(
    () => Array.from(new Set(deficiencies.map((d) => d.department))).sort(),
    []
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    return deficiencies
      .filter((d) => {
        const matchSearch =
          search === "" ||
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.description.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || d.status === statusFilter;
        const matchPriority =
          priorityFilter === "all" || d.priority === priorityFilter;
        const matchScope =
          scopeFilter === "all" || d.saferScope === scopeFilter;
        const matchDept =
          departmentFilter === "all" || d.department === departmentFilter;
        return matchSearch && matchStatus && matchPriority && matchScope && matchDept;
      })
      .sort((a, b) => {
        const priorityOrder: Record<DeficiencyPriority, number> = {
          Critical: 0,
          High: 1,
          Medium: 2,
          Low: 3,
        };
        let aVal: string | number;
        let bVal: string | number;
        if (sortKey === "priority") {
          aVal = priorityOrder[a.priority];
          bVal = priorityOrder[b.priority];
        } else if (sortKey === "saferScore") {
          aVal = a.saferScore;
          bVal = b.saferScore;
        } else if (sortKey === "dueDate") {
          aVal = a.dueDate;
          bVal = b.dueDate;
        } else if (sortKey === "title") {
          aVal = a.title;
          bVal = b.title;
        } else {
          aVal = a.status;
          bVal = b.status;
        }
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [search, statusFilter, priorityFilter, scopeFilter, departmentFilter, sortKey, sortDir]);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 animate-tab-fade">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deficiencies</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All compliance findings across facilities — filter, sort, and expand rows to review details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={scopeFilter} onValueChange={setScopeFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="SAFER Scope" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scopes</SelectItem>
            <SelectItem value="Limited">Limited</SelectItem>
            <SelectItem value="Pattern">Pattern</SelectItem>
            <SelectItem value="Widespread">Widespread</SelectItem>
          </SelectContent>
        </Select>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
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
                  onClick={() => handleSort("title")}
                >
                  <div className="flex items-center gap-1">
                    Title
                    <SortIcon col="title" />
                  </div>
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Facility
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Dept
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none"
                  onClick={() => handleSort("saferScore")}
                >
                  <div className="flex items-center gap-1">
                    SAFER
                    <SortIcon col="saferScore" />
                  </div>
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Scope
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
                  className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none"
                  onClick={() => handleSort("priority")}
                >
                  <div className="flex items-center gap-1">
                    Priority
                    <SortIcon col="priority" />
                  </div>
                </TableHead>
                <TableHead
                  className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none"
                  onClick={() => handleSort("dueDate")}
                >
                  <div className="flex items-center gap-1">
                    Due Date
                    <SortIcon col="dueDate" />
                  </div>
                </TableHead>
                <TableHead className="bg-muted/50 w-8" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="h-32 text-center text-sm text-muted-foreground"
                  >
                    No deficiencies match the current filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.flatMap((def) => {
                  const facility = getFacilityById(def.facilityId);
                  const isExpanded = expandedRow === def.id;
                  const pastDue =
                    def.status !== "Resolved" && isPastDue(def.dueDate);
                  return [
                    <TableRow
                      key={def.id}
                      className={cn(
                        "cursor-pointer transition-colors duration-100",
                        isExpanded ? "bg-muted/40" : "hover:bg-muted/30"
                      )}
                      onClick={() =>
                        setExpandedRow(isExpanded ? null : def.id)
                      }
                    >
                      <TableCell className="py-2 px-3 font-medium text-sm max-w-[260px]">
                        <div className="flex items-start gap-1.5">
                          {def.isRepeatFinding && (
                            <AlertTriangle className="w-3.5 h-3.5 text-[color:var(--warning)] mt-0.5 shrink-0" />
                          )}
                          <span className="line-clamp-2">{def.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 px-3 text-sm text-muted-foreground whitespace-nowrap">
                        {facility?.name ?? def.facilityId}
                      </TableCell>
                      <TableCell className="py-2 px-3 text-sm text-muted-foreground whitespace-nowrap">
                        {def.department}
                      </TableCell>
                      <TableCell className="py-2 px-3 text-center">
                        <SaferScoreDot score={def.saferScore} />
                      </TableCell>
                      <TableCell className="py-2 px-3 text-sm text-muted-foreground">
                        {def.saferScope}
                      </TableCell>
                      <TableCell className="py-2 px-3">
                        <StatusBadge status={def.status} />
                      </TableCell>
                      <TableCell className="py-2 px-3">
                        <PriorityBadge priority={def.priority} />
                      </TableCell>
                      <TableCell
                        className={cn(
                          "py-2 px-3 font-mono text-sm tabular-nums whitespace-nowrap",
                          pastDue
                            ? "text-destructive font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {formatDate(def.dueDate)}
                      </TableCell>
                      <TableCell className="py-2 px-3">
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 text-muted-foreground transition-transform duration-150",
                            isExpanded && "rotate-90"
                          )}
                        />
                      </TableCell>
                    </TableRow>,
                    isExpanded ? (
                      <TableRow key={`${def.id}-detail`} className="bg-muted/20 hover:bg-muted/20">
                        <TableCell colSpan={9} className="px-4 pb-4 pt-1">
                          <DeficiencyDetail deficiency={def} />
                        </TableCell>
                      </TableRow>
                    ) : null,
                  ].filter(Boolean);
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
