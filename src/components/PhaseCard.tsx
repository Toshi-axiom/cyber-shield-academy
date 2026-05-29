import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import type { Phase } from "@/data/curriculum";

const accentLabel: Record<Phase["accent"], string> = {
  offense: "OFFENSE",
  defense: "DEFENSE",
  ai: "AI SECURITY",
  cloud: "CLOUD",
  foundation: "CORE",
};

export function PhaseCard({ phase }: { phase: Phase }) {
  const labCount = phase.modules.filter((m) => m.lab).length;
  return (
    <Link
      to="/courses"
      hash={phase.id}
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-[var(--bg-secondary)] p-6 transition-all duration-300 hover:border-[var(--border-accent)] hover:shadow-[var(--shadow-glow)]"
    >
      <span className="absolute left-0 top-6 h-8 w-1 bg-primary opacity-70 transition-all group-hover:h-12" />
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{phase.code}</span>
        <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-primary">
          {accentLabel[phase.accent]}
        </span>
      </div>
      <h3 className="mt-5 text-xl font-semibold leading-snug text-foreground">{phase.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{phase.tagline}</p>
      <div className="mt-5 flex items-center justify-between">
        <span className="font-mono text-xs text-[var(--text-muted)]">
          {phase.modules.length} Modules • {labCount} Labs
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-primary transition-transform group-hover:translate-x-1">
          <Play className="h-3 w-3 fill-primary" /> Start
        </span>
      </div>
    </Link>
  );
}
