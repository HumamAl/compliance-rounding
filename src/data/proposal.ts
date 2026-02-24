// src/data/proposal.ts

export interface PortfolioProject {
  name: string;
  description: string;
  outcome: string;
  tech: string[];
  url?: string; // omit if no live demo
}

export interface ApproachStep {
  step: string;
  title: string;
  description: string;
  timeline: string;
}

export interface SkillCategory {
  label: string;
  skills: string[];
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface ProposalData {
  hero: {
    name: string;
    valueProp: string;
    badgeText: string;
    stats: HeroStat[];
  };
  projects: PortfolioProject[];
  approachSteps: ApproachStep[];
  skillCategories: SkillCategory[];
  cta: {
    heading: string;
    subtext: string;
    authorName: string;
  };
}

export const proposalData: ProposalData = {
  hero: {
    name: "Humam",
    valueProp:
      "I build healthcare SaaS platforms with real compliance workflows — SAFER Matrix scoring, RBAC, offline rounding, and audit-ready reporting. Here's one I built for your project.",
    badgeText: "Built this demo for your project",
    stats: [
      { value: "24+", label: "projects shipped" },
      { value: "< 48hr", label: "demo turnaround" },
      { value: "15+", label: "industries served" },
    ],
  },
  projects: [
    {
      name: "Southfield Healthcare",
      description:
        "Healthcare operations platform with patient management, appointment scheduling, provider dashboards, and clinical analytics — built for a multi-department clinic.",
      outcome:
        "Consolidated patient scheduling and management into a single interface, replacing disconnected spreadsheet workflows",
      tech: ["Next.js", "TypeScript", "Tailwind", "Recharts", "shadcn/ui"],
      url: "https://southfield-healthcare.vercel.app",
    },
    {
      name: "Tinnitus Therapy SaaS",
      description:
        "Multi-clinic therapy management platform with patient intake, treatment protocols, session tracking, and outcome dashboards — full SaaS architecture supporting multiple locations.",
      outcome:
        "Multi-clinic SaaS covering the full patient journey — intake, protocol assignment, session tracking, and outcome dashboards",
      tech: ["Next.js", "TypeScript", "Tailwind", "Recharts", "shadcn/ui"],
      url: "https://tinnitus-therapy.vercel.app",
    },
    {
      name: "Fleet Maintenance SaaS",
      description:
        "6-module SaaS platform with asset tracking, work orders, preventive maintenance scheduling, inspections, parts inventory, and analytics — directly comparable to multi-module compliance platforms.",
      outcome:
        "6-module SaaS covering the full maintenance lifecycle — from asset registry to work orders to parts inventory",
      tech: ["Next.js", "TypeScript", "Recharts", "shadcn/ui"],
      // no url — omit ExternalLink icon
    },
    {
      name: "PayGuard — Transaction Monitor",
      description:
        "Compliance monitoring dashboard with real-time flagging, alert management, and enforcement tracking — demonstrating the RBAC and audit trail patterns needed for healthcare compliance.",
      outcome:
        "Compliance monitoring dashboard with transaction flagging, multi-account linking, and alert delivery tracking",
      tech: ["Next.js", "TypeScript", "Tailwind", "Recharts", "shadcn/ui"],
      url: "https://payment-monitor.vercel.app",
    },
  ],
  approachSteps: [
    {
      step: "01",
      title: "Understand",
      description:
        "Map your SAFER Matrix workflows, RBAC roles, and offline rounding requirements before touching code. One alignment call saves two weeks of rework.",
      timeline: "Day 1–2",
    },
    {
      step: "02",
      title: "Build",
      description:
        "Working mobile and web builds from day one — rounding flows, deficiency capture, and scoring visible within the first week. No dark periods.",
      timeline: "Week 1–2",
    },
    {
      step: "03",
      title: "Ship",
      description:
        "Production-ready with RBAC enforced, offline sync tested, and clean TypeScript you can hand off or extend without apologizing for.",
      timeline: "Week 2–3",
    },
    {
      step: "04",
      title: "Iterate",
      description:
        "Short feedback cycles — you review it, we refine it. Regulatory workflows evolve; the codebase should keep up without a full rewrite.",
      timeline: "Ongoing",
    },
  ],
  skillCategories: [
    {
      label: "Frontend & Mobile",
      skills: [
        "React Native",
        "Next.js",
        "React",
        "TypeScript",
        "Tailwind CSS",
        "shadcn/ui",
      ],
    },
    {
      label: "Backend & Auth",
      skills: [
        "Node.js",
        "REST APIs",
        "Role-Based Auth (RBAC)",
        "PostgreSQL",
        "Azure",
      ],
    },
    {
      label: "SaaS & Platform",
      skills: [
        "Multi-tenant architecture",
        "Offline sync",
        "Audit trails",
        "Recharts",
        "Vercel",
      ],
    },
  ],
  cta: {
    heading: "Let's build this together.",
    subtext:
      "I built this demo to show you exactly what I'd ship. The real product — with offline sync, SAFER scoring, and RBAC enforced end-to-end — will be even better.",
    authorName: "Humam",
  },
};

