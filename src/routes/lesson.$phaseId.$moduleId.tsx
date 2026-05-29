import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Circle,
  FlaskConical,
  Terminal,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
} from "lucide-react";
import { phases, findModule } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";

export const Route = createFileRoute("/lesson/$phaseId/$moduleId")({
  loader: ({ params }) => {
    const { phase, module } = findModule(params.phaseId, params.moduleId);
    if (!phase || !module) throw notFound();
    return { phaseId: params.phaseId, moduleId: params.moduleId };
  },
  head: ({ loaderData }) => {
    const found = loaderData ? findModule(loaderData.phaseId, loaderData.moduleId) : null;
    const title = found?.module ? `${found.module.title} — Vaelora` : "Lesson — Vaelora";
    return {
      meta: [
        { title },
        { name: "description", content: found?.module?.summary ?? "Hands-on cybersecurity lesson with an integrated lab." },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="font-mono text-muted-foreground">Lesson not found.</p>
      <Link to="/courses" className="text-primary hover:underline">Back to curriculum</Link>
    </div>
  ),
  component: Lesson,
});

function Lesson() {
  const { phaseId, moduleId } = Route.useParams();
  const navigate = useNavigate();
  const { isComplete, completeModule, XP_PER_MODULE } = useProgress();
  const { phase, module } = findModule(phaseId, moduleId)!;

  const [labSteps, setLabSteps] = useState<boolean[]>(
    () => (module?.lab ? module.lab.steps.map(() => false) : []),
  );

  const next = useMemo(() => {
    if (!phase || !module) return null;
    const idx = phase.modules.findIndex((m) => m.id === module.id);
    if (idx < phase.modules.length - 1) {
      return { phaseId: phase.id, moduleId: phase.modules[idx + 1].id, label: phase.modules[idx + 1].title };
    }
    const pIdx = phases.findIndex((p) => p.id === phase.id);
    if (pIdx < phases.length - 1) {
      const np = phases[pIdx + 1];
      return { phaseId: np.id, moduleId: np.modules[0].id, label: np.modules[0].title };
    }
    return null;
  }, [phase, module]);

  if (!phase || !module) return null;

  const labDone = module.lab ? labSteps.every(Boolean) : true;
  const completed = isComplete(module.id);

  const handleComplete = () => {
    const awarded = completeModule(module.id);
    if (awarded) {
      toast.success(`+${XP_PER_MODULE} XP — Module Complete`, {
        description: module.title,
      });
    }
    if (next) {
      navigate({ to: "/lesson/$phaseId/$moduleId", params: { phaseId: next.phaseId, moduleId: next.moduleId } });
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  return (
    <main className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[230px_1fr_360px]">
      {/* Left: module index */}
      <aside className="order-2 lg:order-1">
        <div className="sticky top-24 rounded-[var(--radius-lg)] border border-border bg-[var(--bg-secondary)] p-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{phase.code}</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{phase.title}</p>
          <nav className="mt-4 space-y-1">
            {phase.modules.map((m) => {
              const isCur = m.id === module.id;
              return (
                <Link
                  key={m.id}
                  to="/lesson/$phaseId/$moduleId"
                  params={{ phaseId: phase.id, moduleId: m.id }}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                    isCur ? "bg-[var(--accent-muted)] text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isComplete(m.id) ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--status-success)]" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span className="truncate">{m.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Center: lesson content */}
      <article className="order-1 min-w-0 lg:order-2">
        <Link to="/courses" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-3.5 w-3.5" /> Curriculum
        </Link>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">Module {module.code}</p>
        <h1 className="mt-2 font-display text-5xl tracking-wide text-foreground md:text-6xl">{module.title}</h1>
        <p className="mt-3 text-lg font-light text-muted-foreground">{module.summary}</p>

        <div className="mt-8 rounded-[var(--radius-md)] border-l-2 border-primary bg-[var(--bg-overlay)] p-5">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-primary">
            <Lightbulb className="h-4 w-4" /> Why this matters
          </div>
          <p className="mt-2 text-muted-foreground">
            This module is part of <strong className="text-foreground">{phase.title}</strong>. {phase.tagline} Read
            the essentials below, then jump straight into the lab on the right — that's where the skill actually sticks.
          </p>
        </div>

        <h2 className="mt-10 text-2xl font-semibold text-foreground">What you'll cover</h2>
        <div className="mt-2 h-0.5 w-16 bg-primary" />

        <div className="mt-6 space-y-5">
          {module.topics.map((t, i) => (
            <div key={t} className="rounded-[var(--radius-md)] border border-border bg-[var(--bg-secondary)] p-5">
              <div className="flex items-start gap-3">
                <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-semibold text-foreground">{t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Understand how <span className="text-foreground">{t.toLowerCase()}</span> works in the real world,
                    where it commonly fails, and how defenders detect and mitigate it.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile lab notice */}
        <div className="mt-8 lg:hidden">
          <LabPanel module={module} labSteps={labSteps} setLabSteps={setLabSteps} />
        </div>

        <button
          onClick={handleComplete}
          disabled={!labDone && !completed}
          className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-primary px-6 py-4 font-medium text-primary-foreground transition-all hover:bg-[var(--accent-hover)] hover:shadow-[var(--shadow-glow-lg)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {completed ? "Continue" : "Mark Complete & Continue"} <ArrowRight className="h-4 w-4" />
        </button>
        {!labDone && !completed && module.lab && (
          <p className="mt-2 text-center font-mono text-xs text-[var(--text-muted)]">
            Finish all lab steps to unlock completion.
          </p>
        )}
      </article>

      {/* Right: lab panel */}
      <aside className="order-3 hidden lg:block">
        <div className="sticky top-24">
          <LabPanel module={module} labSteps={labSteps} setLabSteps={setLabSteps} />
        </div>
      </aside>
    </main>
  );
}

function LabPanel({
  module,
  labSteps,
  setLabSteps,
}: {
  module: NonNullable<ReturnType<typeof findModule>["module"]>;
  labSteps: boolean[];
  setLabSteps: (v: boolean[]) => void;
}) {
  if (!module.lab) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-border bg-[var(--bg-secondary)] p-6">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
          <Terminal className="h-4 w-4" /> Concept Check
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          No lab in this module — review the topics, then mark complete to keep your streak alive.
        </p>
      </div>
    );
  }

  const done = labSteps.filter(Boolean).length;
  const toggle = (i: number) => {
    const copy = [...labSteps];
    copy[i] = !copy[i];
    setLabSteps(copy);
  };

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-accent)] bg-[var(--bg-secondary)]">
      <div className="flex items-center justify-between border-b border-border bg-[var(--bg-elevated)] px-5 py-3">
        <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
          <FlaskConical className="h-4 w-4" /> Lab
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {done}/{labSteps.length}
        </span>
      </div>

      {/* Faux terminal header */}
      <div className="border-b border-border bg-[#0d0d0d] px-5 py-3 font-mono text-xs text-[var(--status-success)]">
        <span className="text-muted-foreground">vaelora@lab</span>:<span className="text-info">~</span>${" "}
        <span className="text-foreground">start {module.code}</span>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-foreground">{module.lab.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{module.lab.description}</p>

        <ul className="mt-5 space-y-2">
          {module.lab.steps.map((s, i) => (
            <li key={s}>
              <button
                onClick={() => toggle(i)}
                className={`flex w-full items-start gap-3 rounded-md border p-3 text-left text-sm transition-colors ${
                  labSteps[i]
                    ? "border-[var(--status-success)]/40 bg-[var(--status-success)]/5 text-foreground"
                    : "border-border text-muted-foreground hover:border-[var(--border-accent)]"
                }`}
              >
                {labSteps[i] ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--status-success)]" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <span className={labSteps[i] ? "line-through opacity-70" : ""}>{s}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(done / labSteps.length) * 100}%` }} />
        </div>
        {done === labSteps.length && (
          <p className="mt-3 text-center font-mono text-xs text-[var(--status-success)]">Lab complete — nicely done.</p>
        )}
      </div>
    </div>
  );
}
