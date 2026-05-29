import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FlaskConical, CheckCircle2, ChevronRight, BookOpen } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { phases, totalModules, totalLabs } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Curriculum — Vaelora Cybersecurity Phases & Labs" },
      { name: "description", content: "Explore Vaelora's full cybersecurity curriculum: 9 phases from Linux foundations to AI security, SOC operations, and career prep — with hands-on labs in every module." },
      { property: "og:title", content: "Vaelora Curriculum — 9 Phases, 20+ Labs" },
      { property: "og:description", content: "From foundations to AI security and SOC operations. Free, hands-on, lab-driven." },
    ],
  }),
  component: Courses,
});

const difficultyColor: Record<string, string> = {
  Beginner: "text-[var(--status-success)]",
  Intermediate: "text-[var(--status-warning)]",
  Advanced: "text-[var(--status-danger)]",
};

function Courses() {
  const { isComplete, progress } = useProgress();
  const [active, setActive] = useState(phases[0].id);

  return (
    <main className="grain">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Curriculum</span>
          <h1 className="mt-2 font-display text-5xl tracking-wide text-foreground md:text-7xl">
            The path to defender.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {phases.length} phases • {totalModules()} modules • {totalLabs()}+ hands-on labs.
            Read a little, do a lot. Every module ends in a lab.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Phases</p>
              <nav className="mt-4 space-y-1">
                {phases.map((p) => (
                  <a
                    key={p.id}
                    href={`#${p.id}`}
                    onClick={() => setActive(p.id)}
                    className={`flex items-center justify-between rounded-md border-l-2 px-3 py-2 text-sm transition-colors ${
                      active === p.id
                        ? "border-primary bg-[var(--accent-muted)] text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="truncate">{p.title}</span>
                    <span className="ml-2 rounded-full bg-[var(--bg-elevated)] px-2 py-0.5 font-mono text-[0.6rem] text-primary">
                      {p.modules.length}
                    </span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Phase sections */}
          <div className="space-y-16">
            {phases.map((phase) => {
              const done = phase.modules.filter((m) => isComplete(m.id)).length;
              return (
                <section key={phase.id} id={phase.id} className="scroll-mt-24">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{phase.code}</span>
                    <span className={`font-mono text-xs uppercase tracking-[0.15em] ${difficultyColor[phase.difficulty]}`}>
                      {phase.difficulty}
                    </span>
                  </div>
                  <h2 className="mt-2 text-3xl font-semibold text-foreground">{phase.title}</h2>
                  <p className="mt-2 max-w-2xl text-muted-foreground">{phase.description}</p>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-1 w-40 overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                      <div className="h-full bg-primary transition-all" style={{ width: `${(done / phase.modules.length) * 100}%` }} />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      {done}/{phase.modules.length} complete
                    </span>
                    <Link to="/quiz/$phaseId" params={{ phaseId: phase.id }} className="ml-auto font-mono text-xs text-primary hover:underline">
                      Take phase quiz →
                    </Link>
                  </div>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {phase.modules.map((m) => (
                      <Link
                        key={m.id}
                        to="/lesson/$phaseId/$moduleId"
                        params={{ phaseId: phase.id, moduleId: m.id }}
                        className="group flex flex-col rounded-[var(--radius-lg)] border border-border bg-[var(--bg-secondary)] p-5 transition-all hover:border-[var(--border-accent)] hover:shadow-[var(--shadow-glow)]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-[var(--text-muted)]">Module {m.code}</span>
                          {isComplete(m.id) ? (
                            <CheckCircle2 className="h-4 w-4 text-[var(--status-success)]" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <h3 className="mt-3 font-semibold text-foreground">{m.title}</h3>
                        <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{m.summary}</p>
                        <div className="mt-4 flex items-center justify-between">
                          {m.lab ? (
                            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-primary">
                              <FlaskConical className="h-3.5 w-3.5" /> Includes lab
                            </span>
                          ) : (
                            <span className="font-mono text-xs text-[var(--text-muted)]">Theory</span>
                          )}
                          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
      {progress.xp >= 0 && null}
      <Footer />
    </main>
  );
}
