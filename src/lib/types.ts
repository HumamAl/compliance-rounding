import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Sidebar navigation
// ---------------------------------------------------------------------------
export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// ---------------------------------------------------------------------------
// Challenge visualization types
// ---------------------------------------------------------------------------
export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

// ---------------------------------------------------------------------------
// Proposal types
// ---------------------------------------------------------------------------
export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

// ---------------------------------------------------------------------------
// Domain: Healthcare Compliance Rounding
// ---------------------------------------------------------------------------

// --- Facility ---

export type FacilityType = "Hospital" | "Ambulatory" | "Clinic" | "Long-Term Care";
export type FacilityStatus = "Active" | "Under Review" | "Accreditation Pending";

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  status: FacilityStatus;
  address: string;
  city: string;
  state: string;
  /** Overall compliance score 0-100 */
  complianceScore: number;
  /** Total deficiencies open at this facility */
  openDeficiencies: number;
  /** Most recent rounding date */
  lastRoundDate: string;
  /** Primary compliance officer name */
  complianceOfficer: string;
  /** Number of accredited beds (hospitals only) */
  beds?: number;
}

// --- User / Inspector ---

export type UserRole = "Admin" | "Inspector" | "Facility Manager" | "Compliance Officer";
export type UserStatus = "Active" | "Inactive" | "On Leave";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  facilityId?: string; // null for Admins / floating inspectors
  certifications: string[];
  roundsCompleted: number;
  lastActiveAt: string;
  avatarInitials: string;
}

// --- Compliance Round ---

export type RoundStatus = "Scheduled" | "In Progress" | "Completed" | "Cancelled";

export interface Round {
  id: string;
  facilityId: string;
  inspectorId: string;
  department: string;
  /** Planned or actual start datetime (ISO string) */
  startDate: string;
  /** Null while still in progress or scheduled */
  completedDate: string | null;
  status: RoundStatus;
  deficiencyCount: number;
  /** Compliance score for this round, 0-100 */
  score: number | null;
  notes?: string;
}

// --- SAFER Matrix ---

export type SaferScope = "Limited" | "Pattern" | "Widespread";
export type SaferLikelihood = "Low" | "Moderate" | "High";
/** Numeric SAFER score 1-9 derived from scope × likelihood grid */
export type SaferScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// --- Deficiency ---

export type DeficiencyStatus = "Open" | "In Progress" | "Resolved" | "Overdue";
export type DeficiencyPriority = "Critical" | "High" | "Medium" | "Low";

export interface Deficiency {
  id: string;
  roundId: string;
  facilityId: string;
  title: string;
  description: string;
  /** Joint Commission standard code e.g. "EC.02.06.01" */
  standardId: string;
  /** Element of Performance number */
  epNumber: string;
  saferScope: SaferScope;
  saferLikelihood: SaferLikelihood;
  /** Combined SAFER risk score 1-9 */
  saferScore: SaferScore;
  status: DeficiencyStatus;
  priority: DeficiencyPriority;
  /** User ID of the person assigned to remediate */
  assignedTo: string | null;
  department: string;
  dueDate: string;
  /** Null until resolved */
  resolvedDate: string | null;
  /** Whether this deficiency is a repeat finding from a prior round */
  isRepeatFinding: boolean;
  photoCount: number;
  correctionPlan?: string;
}

// --- Regulatory Standard ---

export type JCChapter = "EC" | "IC" | "MM" | "HR" | "LD" | "PC" | "RC" | "RI";

export interface Standard {
  id: string;
  /** e.g. "EC.02.06.01" */
  code: string;
  chapter: JCChapter;
  title: string;
  description: string;
  /** Total number of Elements of Performance in this standard */
  epCount: number;
  active: boolean;
}

// ---------------------------------------------------------------------------
// Chart / Analytics types
// ---------------------------------------------------------------------------

export interface ChartDataPoint {
  month: string;
  value: number;
  target?: number;
}

export interface MonthlyTrend {
  month: string;
  totalRounds: number;
  deficienciesFound: number;
  deficienciesResolved: number;
  complianceRate: number; // 0-100
}

export interface DepartmentStat {
  department: string;
  totalRounds: number;
  openDeficiencies: number;
  resolvedDeficiencies: number;
  complianceRate: number; // 0-100
  avgSaferScore: number; // 1-9
}

export interface SaferCell {
  scope: SaferScope;
  likelihood: SaferLikelihood;
  saferScore: SaferScore;
  deficiencyCount: number;
}

// ---------------------------------------------------------------------------
// Dashboard KPI summary
// ---------------------------------------------------------------------------

export interface DashboardStats {
  /** Overall network-wide compliance score */
  overallComplianceScore: number;
  complianceScoreChange: number; // % change vs prior period
  /** Total open deficiencies across all facilities */
  openDeficiencies: number;
  openDeficienciesChange: number; // % change
  /** Rounds completed in current period */
  roundsCompleted: number;
  roundsCompletedChange: number;
  /** Deficiencies resolved in current period */
  resolvedThisPeriod: number;
  resolvedThisPeriodChange: number;
  /** Average days to resolve a deficiency */
  avgResolutionDays: number;
  resolutionDaysChange: number;
  /** Critical open deficiencies */
  criticalOpenCount: number;
}
