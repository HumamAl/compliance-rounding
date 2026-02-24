// src/components/proposal/proposal-hero.tsx
// Server Component — no hooks needed

interface HeroStat {
  value: string;
  label: string;
}

interface ProposalHeroProps {
  name: string;
  valueProp: string;
  badgeText: string;
  stats: HeroStat[];
}

export function ProposalHero({
  name,
  valueProp,
  badgeText,
  stats,
}: ProposalHeroProps) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl"
      style={{ background: "oklch(0.10 0.02 var(--primary-h, 180))" }}
    >
      {/* Subtle radial highlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 30%, oklch(0.55 0.14 180 / 0.12), transparent 65%)",
        }}
      />

      {/* Main hero content */}
      <div className="relative z-10 px-8 py-10 md:px-12 md:py-14 space-y-6">
        {/* "Built for you" badge */}
        <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-white/10 border border-white/10 text-white/80 px-3 py-1 rounded-full">
          <span className="relative inline-flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
          </span>
          {badgeText}
        </span>

        {/* Name + value prop */}
        <div className="space-y-2">
          <p className="font-mono text-xs tracking-widest uppercase text-white/40">
            Full-Stack Developer · Healthcare SaaS
          </p>
          <h1 className="text-4xl md:text-5xl tracking-tight leading-none">
            <span className="font-light text-white/80">Hi, I&apos;m </span>
            <span className="font-black text-white">{name}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
            {valueProp}
          </p>
        </div>
      </div>

      {/* Stats shelf */}
      <div className="relative z-10 border-t border-white/10 bg-white/5 px-8 py-5 md:px-12">
        <div className="grid grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
