import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Layers, FlaskConical, Flame, ArrowRight, Lock, CheckCircle2, ShieldAlert } from "lucide-react";
import { Footer } from "@/components/Footer";
import { StatCard } from "@/components/StatCard";
import { phases, totalModules } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Track Your Vaelora Progress" },
      { name: "description", content: "Track your XP, completed labs, streak, and progress across all 9 Vaelora cybersecurity phases." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { progress, isComplete } = useProgress();
  const completedModules = progress.completedModules.length;
  const phasesDone = phases.filter((p) => p.modules.every((m) => isComplete(m.id))).length;

  // resume target = first incomplete module
  let resume: { phaseId: string; moduleId: string; title: string; phase: string } | null = null;
  for (const p of phases) {
    for (const m of p.modules) {
      if (!isComplete(m.id)) { resume = { phaseId: p.id, moduleId: m.id, title: m.title, phase: p.title }; break; }
    }
    if (resume) break;
  }

  return (
    <main className="grain">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Your Command Center</span>
        <h1 className="mt-2 font-display text-5xl tracking-wide text-foreground md:text-7xl">Dashboard</h1>

        {!user && (
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4 font-mono text-xs">
            <div className="flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-yellow-500 font-semibold uppercase tracking-wider">SECURITY WARNING: Guest Session Active</span>
                <p className="mt-1 text-muted-foreground">Your training records and XP are stored locally. Initialize a secure Agent ID to sync progress permanently.</p>
              </div>
            </div>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-1.5 rounded bg-yellow-500/10 border border-yellow-500/25 px-4 py-2 font-semibold text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors shrink-0 text-center uppercase tracking-wider"
            >
              Secure Account <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}

        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          <StatCard value={progress.xp} suffix=" XP" label="Total earned" />
          <StatCard value={phasesDone} suffix={`/${phases.length}`} label="Phases completed" />
          <StatCard value={completedModules} suffix={`/${totalModules()}`} label="Modules finished" />
          <StatCard value={progress.streak} suffix=" day" label="Current streak" />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Resume */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--border-accent)] bg-[var(--bg-secondary)] p-8">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
              <Flame className="h-4 w-4" /> {resume ? "Continue where you left off" : "All caught up"}
            </div>
            {resume ? (
              <>
                <p className="mt-4 font-mono text-xs text-muted-foreground">{resume.phase}</p>
                <h2 className="mt-1 text-3xl font-semibold text-foreground">{resume.title}</h2>
                <Link
                  to="/lesson/$phaseId/$moduleId"
                  params={{ phaseId: resume.phaseId, moduleId: resume.moduleId }}
                  className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] hover:shadow-[var(--shadow-glow-lg)]"
                >
                  Resume <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <>
                <h2 className="mt-4 text-3xl font-semibold text-foreground">You finished every module.</h2>
                <p className="mt-2 text-muted-foreground">Legend status. Revisit a phase quiz to keep your edge sharp.</p>
                <Link to="/courses" className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-[var(--accent-hover)]">
                  Review curriculum <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>

          {/* Quick stats */}
          <div className="space-y-4">
            {[
              { icon: Zap, label: "XP to next rank", value: `${100 - (progress.xp % 100)} XP` },
              { icon: Layers, label: "Phases unlocked", value: `${phases.length} / ${phases.length}` },
              { icon: FlaskConical, label: "Labs available", value: "20+" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-[var(--bg-secondary)] p-5">
                <s.icon className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                  <div className="font-display text-2xl text-foreground">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journey map */}
        <h2 className="mt-14 text-2xl font-semibold text-foreground">Your journey</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-9">
          {phases.map((p, i) => {
            const complete = p.modules.every((m) => isComplete(m.id));
            const started = p.modules.some((m) => isComplete(m.id));
            const locked = i > 0 && !phases[i - 1].modules.some((m) => isComplete(m.id)) && !started;
            return (
              <a
                key={p.id}
                href={`/courses#${p.id}`}
                className={`relative rounded-[var(--radius-md)] border p-4 text-center transition-colors ${
                  complete ? "border-[var(--status-success)]/40 bg-[var(--status-success)]/5"
                  : started ? "border-[var(--border-accent)] bg-[var(--accent-muted)]"
                  : "border-border bg-[var(--bg-secondary)]"
                }`}
              >
                <div className="flex justify-center">
                  {complete ? <CheckCircle2 className="h-5 w-5 text-[var(--status-success)]" />
                    : locked ? <Lock className="h-5 w-5 text-[var(--text-muted)]" />
                    : <span className="font-display text-xl text-primary">{p.num}</span>}
                </div>
                <div className="mt-2 font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground">{p.code}</div>
              </a>
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}
