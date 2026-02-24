"use client";

import { useState } from "react";
import {
  ClipboardCheck,
  AlertTriangle,
  ShieldCheck,
  Building2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  dashboardStats,
  monthlyTrends,
  deficiencies,
  getFacilityById,
} from "@/data/mock-data";

// ---------------------------------------------------------------------------
// Custom Tooltip
// ---------------------------------------------------------------------------
interface TooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-background p-3 shadow-sm">
      <p className="text-sm font-medium mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-sm text-muted-foreground">
          <span
            className="inline-block w-2 h-2 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          />
          {entry.name}: <span className="font-medium text-foreground">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Status badge helper
// ---------------------------------------------------------------------------
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    Open: {
      bg: "color-mix(in oklch, var(--warning) 15%, transparent)",
      color: "var(--warning)",
    },
    "In Progress": {
      bg: "color-mix(in oklch, var(--primary) 15%, transparent)",
      color: "var(--primary)",
    },
    Resolved: {
      bg: "color-mix(in oklch, var(--success) 15%, transparent)",
      color: "var(--success)",
    },
    Overdue: {
      bg: "color-mix(in oklch, var(--destructive) 15%, transparent)",
      color: "var(--destructive)",
    },
  };
  const s = styles[status] ?? styles["Open"];
  return (
    <Badge
      className="rounded-full text-xs font-medium"
      style={{ backgroundColor: s.bg, color: s.color, border: "none" }}
    >
      {status}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Priority badge helper
// ---------------------------------------------------------------------------
function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, { bg: string; color: string }> = {
    Critical: {
      bg: "color-mix(in oklch, var(--destructive) 15%, transparent)",
      color: "var(--destructive)",
    },
    High: {
      bg: "color-mix(in oklch, var(--warning) 18%, transparent)",
      color: "var(--warning)",
    },
    Medium: {
      bg: "color-mix(in oklch, var(--primary) 12%, transparent)",
      color: "var(--primary)",
    },
    Low: {
      bg: "color-mix(in oklch, var(--muted-foreground) 12%, transparent)",
      color: "var(--muted-foreground)",
    },
  };
  const s = styles[priority] ?? styles["Low"];
  return (
    <Badge
      className="rounded-full text-xs font-medium"
      style={{ backgroundColor: s.bg, color: s.color, border: "none" }}
    >
      {priority}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard Page
// ---------------------------------------------------------------------------
export default function DashboardPage() {
  const [chartRange, setChartRange] = useState<"6M" | "12M">("12M");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Chart data filtered by range
  const chartData =
    chartRange === "6M" ? monthlyTrends.slice(-6) : monthlyTrends;

  // Recent deficiencies — non-resolved, sorted by dueDate proximity, limited to 8
  const recentDeficiencies = deficiencies
    .filter((d) =>
      statusFilter === "All"
        ? true
        : d.status === statusFilter
    )
    .slice(0, 8);

  const statusOptions = ["All", "Open", "In Progress", "Overdue", "Resolved"];

  const stats = [
    {
      title: "Rounds Completed",
      value: dashboardStats.roundsCompleted.toString(),
      description: `${dashboardStats.roundsCompletedChange > 0 ? "+" : ""}${dashboardStats.roundsCompletedChange}% · ${dashboardStats.roundsCompleted} rounds this period across 6 facilities`,
      icon: ClipboardCheck,
      change: dashboardStats.roundsCompletedChange,
    },
    {
      title: "Open Deficiencies",
      value: dashboardStats.openDeficiencies.toString(),
      description: `${dashboardStats.criticalOpenCount} critical · ${Math.abs(dashboardStats.openDeficienciesChange)}% fewer than prior period`,
      icon: AlertTriangle,
      change: dashboardStats.openDeficienciesChange,
      criticalCount: dashboardStats.criticalOpenCount,
    },
    {
      title: "Compliance Rate",
      value: `${dashboardStats.overallComplianceScore}%`,
      description: `+${dashboardStats.complianceScoreChange}pp · Network-wide target: 90% · Trending up`,
      icon: ShieldCheck,
      change: dashboardStats.complianceScoreChange,
    },
    {
      title: "Active Facilities",
      value: "6",
      description: `${dashboardStats.resolvedThisPeriod} deficiencies resolved this period · Avg ${dashboardStats.avgResolutionDays}d resolution`,
      icon: Building2,
      change: 0,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Compliance Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Network-wide rounding activity, deficiency trends, and accreditation readiness
        </p>
      </div>

      {/* Stat Cards — 4 KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card
            key={stat.title}
            className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg animate-fade-in"
            style={{
              animationDelay: `${index * 80}ms`,
              animationDuration: "200ms",
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-primary/70" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
              {stat.change !== 0 && (
                <div className="flex items-center gap-1 mt-2">
                  {stat.change > 0 ? (
                    <TrendingUp className="w-3 h-3 text-[var(--success)]" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-[var(--destructive)]" />
                  )}
                  <span
                    className="text-xs font-medium"
                    style={{
                      color:
                        stat.change > 0
                          ? "var(--success)"
                          : "var(--destructive)",
                    }}
                  >
                    {stat.change > 0 ? "+" : ""}
                    {stat.change}%
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interactive Chart — Deficiency Trends */}
      <Card className="linear-card p-0">
        <CardHeader className="px-6 pt-6 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold">
                Deficiency Trends
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Deficiencies found vs. resolved over time
              </p>
            </div>
            {/* Interactive date range toggle */}
            <div className="flex gap-1 shrink-0">
              {(["6M", "12M"] as const).map((range) => (
                <Button
                  key={range}
                  variant={chartRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartRange(range)}
                  className="h-7 text-xs px-3 transition-all duration-150"
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillFound" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
                <linearGradient id="fillResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                strokeOpacity={0.5}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
              />
              <Area
                type="monotone"
                dataKey="deficienciesFound"
                name="Found"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#fillFound)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="deficienciesResolved"
                name="Resolved"
                stroke="var(--chart-2)"
                strokeWidth={2}
                fill="url(#fillResolved)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Department Compliance Bar Chart — secondary panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Compliance rate by month — small sparkline panel */}
        <Card className="linear-card p-0 lg:col-span-2">
          <CardHeader className="px-6 pt-6 pb-2">
            <CardTitle className="text-lg font-semibold">
              Compliance Rate
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Monthly network-wide score
            </p>
          </CardHeader>
          <CardContent className="px-2 pb-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={chartData}
                margin={{ top: 4, right: 12, left: 0, bottom: 0 }}
                barSize={18}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  strokeOpacity={0.5}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[70, 100]}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="complianceRate"
                  name="Compliance %"
                  fill="var(--chart-3)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Summary stats panel */}
        <Card className="linear-card p-0 lg:col-span-3">
          <CardHeader className="px-6 pt-6 pb-2">
            <CardTitle className="text-lg font-semibold">
              Resolution Summary
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Current period performance at a glance
            </p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="grid grid-cols-2 gap-4 mt-2">
              {[
                {
                  label: "Avg Resolution Time",
                  value: `${dashboardStats.avgResolutionDays}d`,
                  sub: `${Math.abs(dashboardStats.resolutionDaysChange)}% faster than prior period`,
                  positive: dashboardStats.resolutionDaysChange < 0,
                },
                {
                  label: "Resolved This Period",
                  value: dashboardStats.resolvedThisPeriod.toString(),
                  sub: `+${dashboardStats.resolvedThisPeriodChange}% vs prior period`,
                  positive: dashboardStats.resolvedThisPeriodChange > 0,
                },
                {
                  label: "Critical Open",
                  value: dashboardStats.criticalOpenCount.toString(),
                  sub: "Require immediate corrective action",
                  positive: false,
                  warn: true,
                },
                {
                  label: "Network Compliance",
                  value: `${dashboardStats.overallComplianceScore}%`,
                  sub: `+${dashboardStats.complianceScoreChange}pp vs prior period`,
                  positive: true,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-border/60 p-4 bg-muted/30"
                >
                  <p className="text-xs text-muted-foreground font-medium">
                    {item.label}
                  </p>
                  <p
                    className="text-2xl font-bold mt-1"
                    style={{
                      color: item.warn
                        ? "var(--destructive)"
                        : item.positive
                        ? "var(--success)"
                        : "var(--foreground)",
                    }}
                  >
                    {item.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deficiencies Table with status filter */}
      <Card className="linear-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg font-semibold">
                Recent Deficiencies
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Latest findings across all facilities
              </p>
            </div>
            <div className="flex gap-1 flex-wrap">
              {statusOptions.map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                  className="h-7 text-xs px-2.5 transition-all duration-150"
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground pl-6">
                  Finding
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Facility
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Department
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground text-center">
                  SAFER
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Priority
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="bg-muted/50 text-xs font-medium text-muted-foreground text-right pr-6">
                  Due Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentDeficiencies.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-sm text-muted-foreground py-8"
                  >
                    No deficiencies match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                recentDeficiencies.map((def) => {
                  const facility = getFacilityById(def.facilityId);
                  const dueDate = new Date(def.dueDate);
                  const today = new Date();
                  const isOverdue = def.status !== "Resolved" && dueDate < today;
                  return (
                    <TableRow
                      key={def.id}
                      className="transition-colors duration-100 hover:bg-muted/30 cursor-pointer"
                    >
                      <TableCell className="pl-6 max-w-[240px]">
                        <div>
                          <p className="text-sm font-medium truncate">
                            {def.title}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {def.standardId} · EP {def.epNumber}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {facility?.name ?? def.facilityId}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {def.department}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold font-mono"
                          style={{
                            backgroundColor:
                              def.saferScore >= 7
                                ? "color-mix(in oklch, var(--destructive) 15%, transparent)"
                                : def.saferScore >= 4
                                ? "color-mix(in oklch, var(--warning) 15%, transparent)"
                                : "color-mix(in oklch, var(--success) 15%, transparent)",
                            color:
                              def.saferScore >= 7
                                ? "var(--destructive)"
                                : def.saferScore >= 4
                                ? "var(--warning)"
                                : "var(--success)",
                          }}
                        >
                          {def.saferScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={def.priority} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={def.status} />
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <span
                          className="text-xs font-mono tabular-nums"
                          style={{
                            color: isOverdue
                              ? "var(--destructive)"
                              : "var(--muted-foreground)",
                          }}
                        >
                          {dueDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          {isOverdue && (
                            <span className="ml-1 font-semibold">!</span>
                          )}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Proposal Banner */}
      <div className="mt-8 linear-card p-4 border-primary/15 bg-gradient-to-r from-primary/5 to-transparent flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">
            This is a live demo built for your project
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Humam · Full-Stack Developer · Available now
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/challenges"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-100"
          >
            My approach →
          </a>
          <a
            href="/proposal"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors duration-100"
          >
            Work with me
          </a>
        </div>
      </div>
    </div>
  );
}
