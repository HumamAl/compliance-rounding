import { profile, portfolioProjects } from "@/data/proposal";

export default function ProposalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            Built this demo for your project
          </div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{profile.tagline}</p>
          <p className="text-sm mt-4 leading-relaxed max-w-2xl mx-auto">
            {profile.bio}
          </p>
        </div>

        {/* Proof of Work — Relevant Projects */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Relevant Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioProjects.map((project, index) => (
              <div
                key={project.id}
                className="rounded-xl bg-gradient-to-br from-accent/5 to-background shadow-lg border border-primary/10 p-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                style={{ animationDelay: `${index * 100}ms`, animationDuration: '400ms' }}
              >
                <h3 className="font-medium">{project.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {project.description}
                </p>
                {project.relevance && (
                  <p className="text-xs text-primary font-medium mt-2">
                    {project.relevance}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-xs rounded-md bg-primary/10 text-primary"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How I Work */}
        <div>
          <h2 className="text-lg font-semibold mb-4">How I Work</h2>
          <div className="space-y-3">
            {profile.approach.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Skills</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.skillCategories.map((category) => (
              <div key={category.name} className="rounded-xl border bg-card p-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                <h3 className="text-sm font-medium mb-2">{category.name}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-xs rounded-md bg-primary/10 text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-8 rounded-xl bg-primary/5 border border-primary/20">
          <h2 className="text-lg font-semibold">Let&apos;s build this together</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            This demo is just the starting point. I can have the production version scoped and started within days.
          </p>
          <p className="text-sm font-medium text-primary mt-4">— Humam</p>
        </div>
      </div>
    </div>
  );
}
