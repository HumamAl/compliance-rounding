// src/components/proposal/proposal-cta.tsx
// Server Component — no hooks needed

interface ProposalCtaProps {
  heading: string;
  subtext: string;
  authorName: string;
}

export function ProposalCta({ heading, subtext, authorName }: ProposalCtaProps) {
  return (
    <section
      className="rounded-2xl overflow-hidden text-center"
      style={{ background: "oklch(0.10 0.02 var(--primary-h, 180))" }}
    >
      <div className="p-8 md:p-12 space-y-4">
        {/* Pulsing availability indicator */}
        <div className="flex items-center justify-center gap-2">
          <span className="relative inline-flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/75 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-emerald-300/90 text-sm">
            Currently available for new projects
          </span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-bold text-white">{heading}</h2>

        {/* Body */}
        <p className="text-white/70 max-w-lg mx-auto leading-relaxed">
          {subtext}
        </p>

        {/* Primary action — text, not a dead-end button */}
        <p className="text-lg font-semibold text-white pt-2">
          Reply on Upwork to start
        </p>

        {/* Secondary link */}
        <a
          href="/"
          className="inline-flex items-center gap-1 text-sm text-white/50 hover:text-white/70 transition-colors duration-100"
        >
          ← Back to the demo
        </a>

        {/* Signature */}
        <p className="pt-4 text-sm text-white/40 border-t border-white/10 mt-4">
          — {authorName}
        </p>
      </div>
    </section>
  );
}
