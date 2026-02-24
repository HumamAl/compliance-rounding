// src/components/proposal/skills-grid.tsx
// Server Component — no hooks needed

interface SkillCategory {
  label: string;
  skills: string[];
}

interface SkillsGridProps {
  categories: SkillCategory[];
}

export function SkillsGrid({ categories }: SkillsGridProps) {
  return (
    <section className="space-y-5">
      <div>
        <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
          Stack
        </p>
        <h2 className="text-2xl font-bold tracking-tight">Relevant Skills</h2>
        <p className="text-sm text-muted-foreground mt-1">
          The tools that matter for this project.
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.label} className="linear-card p-5 space-y-3">
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
              {category.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-full border border-border/60 text-sm font-mono text-foreground/80 bg-muted/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
