"use client";

import { useState, useMemo } from "react";
import { standards } from "@/data/mock-data";
import type { JCChapter, Standard } from "@/lib/types";
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
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Search, BookOpen, ChevronDown, ChevronUp, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const CHAPTER_LABELS: Record<JCChapter, string> = {
  EC: "Environment of Care",
  IC: "Infection Control",
  MM: "Medication Management",
  HR: "Human Resources",
  LD: "Leadership",
  PC: "Patient Care",
  RC: "Record of Care",
  RI: "Rights & Responsibilities",
};

const CHAPTER_COLORS: Record<JCChapter, string> = {
  EC: "text-primary bg-primary/10",
  IC: "text-[color:var(--success)] bg-[color:var(--success)]/10",
  MM: "text-[color:var(--warning)] bg-[color:var(--warning)]/10",
  HR: "text-primary bg-primary/8",
  LD: "text-muted-foreground bg-muted",
  PC: "text-[color:var(--success)] bg-[color:var(--success)]/8",
  RC: "text-muted-foreground bg-muted",
  RI: "text-muted-foreground bg-muted",
};

type SortKey = "code" | "chapter" | "title" | "epCount";

export default function StandardsPage() {
  const [search, setSearch] = useState("");
  const [chapterFilter, setChapterFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [groupByChapter, setGroupByChapter] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  // Track active/inactive toggles locally (keyed by standard id)
  const [activeOverrides, setActiveOverrides] = useState<Record<string, boolean>>({});
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const getIsActive = (std: Standard) =>
    activeOverrides[std.id] !== undefined ? activeOverrides[std.id] : std.active;

  const toggleActive = (id: string, currentValue: boolean) => {
    setActiveOverrides((prev) => ({ ...prev, [id]: !currentValue }));
  };

  const handleSaveChanges = () => {
    setSavedFeedback("Changes saved");
    setTimeout(() => setSavedFeedback(null), 2000);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const chapters = useMemo(
    () =>
      (Array.from(new Set(standards.map((s) => s.chapter))) as JCChapter[]).sort(),
    []
  );

  const filtered = useMemo(() => {
    return standards
      .filter((s) => {
        const matchSearch =
          search === "" ||
          s.code.toLowerCase().includes(search.toLowerCase()) ||
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.description.toLowerCase().includes(search.toLowerCase());
        const matchChapter =
          chapterFilter === "all" || s.chapter === chapterFilter;
        const isActive = getIsActive(s);
        const matchActive =
          activeFilter === "all" ||
          (activeFilter === "active" && isActive) ||
          (activeFilter === "inactive" && !isActive);
        return matchSearch && matchChapter && matchActive;
      })
      .sort((a, b) => {
        let aVal: string | number;
        let bVal: string | number;
        if (sortKey === "epCount") {
          aVal = a.epCount;
          bVal = b.epCount;
        } else if (sortKey === "code") {
          aVal = a.code;
          bVal = b.code;
        } else if (sortKey === "chapter") {
          aVal = a.chapter;
          bVal = b.chapter;
        } else {
          aVal = a.title;
          bVal = b.title;
        }
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, chapterFilter, activeFilter, sortKey, sortDir, activeOverrides]);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  }

  const changedCount = Object.keys(activeOverrides).length;

  // Group by chapter if enabled
  const groupedChapters = useMemo(() => {
    if (!groupByChapter) return null;
    const groups: Record<string, Standard[]> = {};
    filtered.forEach((s) => {
      if (!groups[s.chapter]) groups[s.chapter] = [];
      groups[s.chapter].push(s);
    });
    return groups;
  }, [filtered, groupByChapter]);

  const tableContent = (rows: Standard[]) =>
    rows.map((std) => {
      const isActive = getIsActive(std);
      return (
        <TableRow
          key={std.id}
          className={cn(
            "transition-colors duration-100",
            !isActive && "opacity-50",
            "hover:bg-muted/30"
          )}
        >
          <TableCell className="py-2 px-3 font-mono text-sm text-primary font-medium whitespace-nowrap">
            {std.code}
          </TableCell>
          <TableCell className="py-2 px-3">
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-medium rounded-full border-0",
                CHAPTER_COLORS[std.chapter] ?? "text-muted-foreground bg-muted"
              )}
            >
              {std.chapter}
            </Badge>
          </TableCell>
          <TableCell className="py-2 px-3 text-sm max-w-[320px]">
            <div>
              <p className="font-medium line-clamp-1">{std.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {std.description}
              </p>
            </div>
          </TableCell>
          <TableCell className="py-2 px-3 text-right font-mono text-sm tabular-nums text-muted-foreground">
            {std.epCount}
          </TableCell>
          <TableCell className="py-2 px-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={isActive}
                onCheckedChange={() => toggleActive(std.id, isActive)}
                className="scale-90"
              />
              <span
                className={cn(
                  "text-xs",
                  isActive
                    ? "text-[color:var(--success)]"
                    : "text-muted-foreground"
                )}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </TableCell>
        </TableRow>
      );
    });

  return (
    <div className="p-4 md:p-6 space-y-6 animate-tab-fade">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Standards</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Joint Commission regulatory standards tracked in this system. Toggle to enable or disable enforcement.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1.5" />
            Export
          </Button>
          {changedCount > 0 && (
            <Button
              size="sm"
              onClick={handleSaveChanges}
              className={cn(
                "transition-all duration-150",
                savedFeedback && "bg-[color:var(--success)] hover:bg-[color:var(--success)]"
              )}
            >
              {savedFeedback ?? `Save ${changedCount} Change${changedCount !== 1 ? "s" : ""}`}
            </Button>
          )}
        </div>
      </div>

      {/* Chapter overview chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {chapters.map((ch) => {
          const chStandards = standards.filter((s) => s.chapter === ch);
          return (
            <button
              key={ch}
              onClick={() => setChapterFilter(chapterFilter === ch ? "all" : ch)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors duration-100",
                chapterFilter === ch
                  ? "border-primary/30 bg-primary/8 text-primary"
                  : "border-border/60 bg-background text-muted-foreground hover:bg-muted/50"
              )}
            >
              <BookOpen className="w-3 h-3" />
              {ch}
              <span className="font-mono">{chStandards.length}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by code or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={activeFilter} onValueChange={setActiveFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Active status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Standards</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">Group by chapter</span>
          <Switch
            checked={groupByChapter}
            onCheckedChange={setGroupByChapter}
            className="scale-90"
          />
        </div>
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {filtered.length} standard{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {groupByChapter && groupedChapters ? (
        <div className="space-y-6">
          {Object.entries(groupedChapters).map(([chapter, rows]) => (
            <div key={chapter}>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-sm font-semibold text-foreground">
                  {chapter} —{" "}
                  <span className="text-muted-foreground font-normal">
                    {CHAPTER_LABELS[chapter as JCChapter] ?? chapter}
                  </span>
                </h2>
                <span className="font-mono text-xs text-muted-foreground">
                  ({rows.length})
                </span>
              </div>
              <Card className="linear-card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <StandardsTableHeader
                        sortKey={sortKey}
                        sortDir={sortDir}
                        handleSort={handleSort}
                        SortIcon={SortIcon}
                      />
                    </TableHeader>
                    <TableBody>{tableContent(rows)}</TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <Card className="linear-card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <StandardsTableHeader
                  sortKey={sortKey}
                  sortDir={sortDir}
                  handleSort={handleSort}
                  SortIcon={SortIcon}
                />
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-sm text-muted-foreground"
                    >
                      No standards match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  tableContent(filtered)
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
}

function StandardsTableHeader({
  sortKey,
  sortDir,
  handleSort,
  SortIcon,
}: {
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  handleSort: (key: SortKey) => void;
  SortIcon: React.ComponentType<{ col: SortKey }>;
}) {
  return (
    <TableRow>
      <TableHead
        className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none"
        onClick={() => handleSort("code")}
      >
        <div className="flex items-center gap-1">
          Code
          <SortIcon col="code" />
        </div>
      </TableHead>
      <TableHead
        className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none"
        onClick={() => handleSort("chapter")}
      >
        <div className="flex items-center gap-1">
          Chapter
          <SortIcon col="chapter" />
        </div>
      </TableHead>
      <TableHead
        className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none"
        onClick={() => handleSort("title")}
      >
        <div className="flex items-center gap-1">
          Title / Description
          <SortIcon col="title" />
        </div>
      </TableHead>
      <TableHead
        className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide cursor-pointer select-none text-right"
        onClick={() => handleSort("epCount")}
      >
        <div className="flex items-center justify-end gap-1">
          EPs
          <SortIcon col="epCount" />
        </div>
      </TableHead>
      <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        Active
      </TableHead>
    </TableRow>
  );
}
