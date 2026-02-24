// src/components/proposal/proof-of-work.tsx
// Server Component — no hooks needed

import { ExternalLink, TrendingUp } from "lucide-react";

interface PortfolioProject {
  name: string;
  description: string;
  outcome: string;
  tech: string[];
  url?: string;
}

interface ProofOfWorkProps {
  projects: PortfolioProject[];
}

export function ProofOfWork({ projects }: ProofOfWorkProps) {
  return (
    <section className="space-y-5">
      <div>
        <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
          Proof of Work
        </p>
        <h2 className="text-2xl font-bold tracking-tight">Relevant Projects</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Built for real clients, shipped to production.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.name} className="linear-card p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-semibold leading-snug">
                {project.name}
              </h3>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-muted-foreground hover:text-primary transition-colors duration-100"
                  aria-label={`View ${project.name} live demo`}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {project.description}
            </p>

            {/* Outcome statement */}
            <div
              className="flex items-start gap-2 rounded-md px-3 py-2"
              style={{
                backgroundColor:
                  "color-mix(in oklch, var(--success) 6%, transparent)",
                borderColor:
                  "color-mix(in oklch, var(--success) 15%, transparent)",
                borderWidth: "1px",
                borderStyle: "solid",
              }}
            >
              <TrendingUp className="h-3.5 w-3.5 mt-0.5 shrink-0 text-[color:var(--success)]" />
              <p className="text-xs font-medium text-[color:var(--success)]">
                {project.outcome}
              </p>
            </div>

            {/* Tech tags — only render if tech array exists */}
            {project.tech && project.tech.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
