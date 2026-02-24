// src/app/(proposal)/proposal/page.tsx
// Server Component — no "use client" needed

import { ProposalHero } from "@/components/proposal/proposal-hero";
import { ProofOfWork } from "@/components/proposal/proof-of-work";
import { HowIWork } from "@/components/proposal/how-i-work";
import { SkillsGrid } from "@/components/proposal/skills-grid";
import { ProposalCta } from "@/components/proposal/proposal-cta";
import { proposalData } from "@/data/proposal";

export const metadata = { title: "Work With Me | Compliance Rounding Demo" };

export default function ProposalPage() {
  const { hero, projects, approachSteps, skillCategories, cta } = proposalData;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 md:px-6 space-y-10">
        {/* Section 1: Hero — project-first, dark panel */}
        <ProposalHero
          name={hero.name}
          valueProp={hero.valueProp}
          badgeText={hero.badgeText}
          stats={hero.stats}
        />

        {/* Section 2: Proof of Work — 4 healthcare-relevant projects */}
        <ProofOfWork projects={projects} />

        {/* Section 3: How I Work — 4-step process tailored to compliance SaaS */}
        <HowIWork steps={approachSteps} />

        {/* Section 4: Skills Grid — relevant tech only */}
        <SkillsGrid categories={skillCategories} />

        {/* Section 5: CTA — dark panel, pulsing availability, "Reply on Upwork" */}
        <ProposalCta
          heading={cta.heading}
          subtext={cta.subtext}
          authorName={cta.authorName}
        />
      </div>
    </div>
  );
}
