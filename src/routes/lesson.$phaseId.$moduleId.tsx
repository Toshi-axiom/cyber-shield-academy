import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Circle,
  FlaskConical,
  Terminal,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Shield,
  LogIn,
} from "lucide-react";
import { phases, findModule } from "@/data/curriculum";
import { TopicLectures } from "@/data/lectures";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import ReactMarkdown from "react-markdown";
import { CyberTerminal } from "@/components/CyberTerminal";

export const Route = createFileRoute("/lesson/$phaseId/$moduleId")({
  loader: async ({ params }) => {
    const { phase, module } = findModule(params.phaseId, params.moduleId);
    if (!phase || !module) throw notFound();

    let lectureContent: TopicLectures[] | null = null;
    try {
      // Dynamic import with explicit extension for Vite glob matching
      const data = await import(`../data/lectures/${params.moduleId}.ts`);
      lectureContent = data.lectures;
    } catch (error) {
      // Fallback: Dynamically import makePlaceholders to keep initial chunks clean
      const { makePlaceholders } = await import("@/data/lectures");
      lectureContent = makePlaceholders(module.id, module.topics);
    }

    return {
      phaseId: params.phaseId,
      moduleId: params.moduleId,
      lectureContent,
    };
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
  const { lectureContent } = Route.useLoaderData();
  const navigate = useNavigate();
  const { isComplete, completeModule, XP_PER_MODULE } = useProgress();
  const { user, loading: authLoading } = useAuth();
  const [expandedTopicIdx, setExpandedTopicIdx] = useState<number | null>(0);
  const [activeLectureIdxs, setActiveLectureIdxs] = useState<Record<number, number>>({});
  const [completedTopicIdxs, setCompletedTopicIdxs] = useState<Set<number>>(new Set());
  const { phase: rawPhase, module: rawModule } = findModule(phaseId, moduleId);
  const phase = rawPhase!;
  const module = rawModule!;

  const completed = isComplete(module.id);

  const [labSteps, setLabSteps] = useState<boolean[]>(
    () => (module?.lab ? module.lab.steps.map(() => completed) : []),
  );

  useEffect(() => {
    setActiveLectureIdxs({});
    setCompletedTopicIdxs(new Set());
  }, [moduleId]);

  // Helper: navigate to a specific lecture within a topic, marking complete if last
  const goToLecture = (topicIdx: number, lectureIdx: number, totalInTopic: number) => {
    setActiveLectureIdxs((prev) => ({ ...prev, [topicIdx]: lectureIdx }));
    if (lectureIdx === totalInTopic - 1) {
      setCompletedTopicIdxs((prev) => new Set(prev).add(topicIdx));
    }
  };

  // If completion state shifts, update checklist items
  useEffect(() => {
    if (completed && module?.lab) {
      setLabSteps(module.lab.steps.map(() => true));
    } else if (!completed && module?.lab) {
      setLabSteps(module.lab.steps.map(() => false));
    }
  }, [completed, module]);

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

  if (authLoading) {
    return (
      <main className="mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <p className="font-mono text-xs text-muted-foreground animate-pulse">Decrypting authorization token...</p>
      </main>
    );
  }

  if (!phase || !module) return null;

  const labDone = module.lab ? labSteps.every(Boolean) : true;

  const handleComplete = async () => {
    // If not already completed (concept checks), complete it now.
    // If it was already completed (labs), this is a no-op that just continues.
    if (!completed) {
      const awarded = await completeModule(module.id);
      if (awarded) {
        toast.success(`+${XP_PER_MODULE} XP — Module Complete`, {
          description: module.title,
        });
      }
    }
    if (next) {
      navigate({ to: "/lesson/$phaseId/$moduleId", params: { phaseId: next.phaseId, moduleId: next.moduleId } });
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  const showCtaGate = !user && moduleId !== "intro-1";

  return (
    <main className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-4 py-8 lg:grid-cols-[230px_1fr_360px]">
      {/* Left: module index + chapter nav */}
      <aside className="order-2 lg:order-1">
        <div className="sticky top-24 space-y-3 max-h-[calc(100vh-7rem)] overflow-y-auto pr-0.5">

          {/* Module list */}
          <div className="rounded-[var(--radius-lg)] border border-border bg-[var(--bg-secondary)] p-4">
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

          {/* Chapters (topics) nav for the current module */}
          {module.topics.length > 0 && (
            <div className="rounded-[var(--radius-lg)] border border-border bg-[var(--bg-secondary)] p-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Chapters</p>
              <p className="mt-0.5 text-[0.7rem] text-muted-foreground/50 font-mono">{module.title}</p>
              <nav className="mt-3 space-y-0.5">
                {module.topics.map((topic, tIdx) => {
                  const isActive = expandedTopicIdx === tIdx;
                  const isDone = completedTopicIdxs.has(tIdx);
                  const lecCount = lectureContent?.find((l) => l.topic === topic)?.lectures.length ?? 0;
                  const currentLecIdx = activeLectureIdxs[tIdx] ?? 0;
                  return (
                    <button
                      key={tIdx}
                      onClick={() => {
                        setExpandedTopicIdx(isActive ? null : tIdx);
                      }}
                      className={`group w-full flex items-start gap-2.5 rounded-md px-3 py-2.5 text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-[var(--accent-muted)] text-primary"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      }`}
                    >
                      {/* Tick / circle icon */}
                      {isDone ? (
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--status-success)]" />
                      ) : (
                        <Circle className={`mt-0.5 h-3.5 w-3.5 shrink-0 transition-colors ${isActive ? "text-primary" : ""}`} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium leading-snug truncate">{topic}</p>
                        {lecCount > 1 && (
                          <div className="mt-1.5 flex gap-0.5">
                            {Array.from({ length: lecCount }).map((_, lIdx) => (
                              <span
                                key={lIdx}
                                className={`h-0.5 flex-1 rounded-full transition-colors ${
                                  isDone || lIdx < currentLecIdx
                                    ? "bg-[var(--status-success)]/60"
                                    : lIdx === currentLecIdx && isActive
                                    ? "bg-primary"
                                    : "bg-white/10"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-[0.6rem] text-muted-foreground/40 shrink-0 mt-0.5">
                        {String(tIdx + 1).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          )}

        </div>
      </aside>

      {showCtaGate ? (
        <div className="order-1 lg:order-2 lg:col-span-2 flex flex-col items-center justify-center min-h-[60vh] border border-white/5 bg-black/40 backdrop-blur-md rounded-[var(--radius-lg)] p-8 md:p-12 text-center relative overflow-hidden">
          {/* Cyberpunk corner details */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/45" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/45" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/45" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/45" />
          
          {/* Radial glow background */}
          <div className="absolute w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none animate-orb-pulse" />

          {/* Emblem */}
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-primary/5 shadow-[0_0_30px_rgba(255,107,0,0.15)]">
            <div className="absolute inset-0 rounded-full border border-primary/20 border-dashed animate-spin-slow" style={{ animationDuration: "25s" }} />
            <Shield className="h-10 w-10 text-primary drop-shadow-[0_0_12px_#FF6B00]" />
          </div>

          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary mb-2">
            SECURE GATE ACCESS REQUIRED
          </span>
          
          <h2 className="font-orbitron text-3xl font-bold tracking-wide text-white md:text-4xl uppercase">
            Be the Next <span className="text-primary">Defender</span>
          </h2>
          
          <p className="mt-4 max-w-lg text-sm text-muted-foreground leading-relaxed">
            Interested in learning more? Initialize your agent profile to unlock this module, gain access to live sandboxes, capture flags, and trace your progress on the global grid.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link
              to="/auth"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-primary px-8 py-4 font-mono text-[0.75rem] uppercase tracking-widest font-bold text-[#0A0A0A] hover:bg-[#FF8C00] hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-all cursor-pointer"
            >
              Initialize Agent ID <LogIn className="h-4 w-4" />
            </Link>
            <Link
              to="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded border border-white/10 bg-white/5 hover:bg-white/10 px-8 py-4 font-mono text-[0.75rem] uppercase tracking-widest font-bold text-foreground transition-all cursor-pointer"
            >
              Back to Curriculum
            </Link>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-12 pt-6 border-t border-white/5 w-full max-w-md flex justify-around text-center">
            <div>
              <div className="font-orbitron text-xl font-bold text-white">20+</div>
              <div className="font-mono text-[0.55rem] uppercase tracking-widest text-muted-foreground mt-0.5">Live Labs</div>
            </div>
            <div>
              <div className="font-orbitron text-xl font-bold text-white">12.8K</div>
              <div className="font-mono text-[0.55rem] uppercase tracking-widest text-primary mt-0.5">Active Agents</div>
            </div>
            <div>
              <div className="font-orbitron text-xl font-bold text-white">Free</div>
              <div className="font-mono text-[0.55rem] uppercase tracking-widest text-muted-foreground mt-0.5">Secure Forever</div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Center: lesson content */}
          <article className="order-1 min-w-0 lg:order-2">
            <Link to="/courses" className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-3.5 w-3.5" /> Curriculum
            </Link>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-primary">Module {module.code}</p>
            <h1 className="mt-2 font-orbitron text-5xl tracking-wide text-foreground md:text-6xl">{module.title}</h1>
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

            {/* Chapter header — driven by sidebar selection */}
            {(() => {
              const activeTopicIdx = expandedTopicIdx ?? 0;
              const t = module.topics[activeTopicIdx];
              if (!t) return null;
              const lectureTopic = lectureContent?.find((l) => l.topic === t);
              const activeIdx = activeLectureIdxs[activeTopicIdx] || 0;

              return (
                <div className="mt-6">
                  {/* Chapter title bar */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <span className="font-mono text-sm text-primary shrink-0">
                      {String(activeTopicIdx + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-orbitron text-xl font-semibold text-foreground tracking-wide">{t}</h2>
                    {completedTopicIdxs.has(activeTopicIdx) && (
                      <CheckCircle2 className="h-4 w-4 text-[var(--status-success)] shrink-0 ml-auto" />
                    )}
                  </div>

                  {lectureTopic ? (
                    <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                      {/* Sub-lecture pill tabs */}
                      {lectureTopic.lectures.length > 1 && (
                        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
                          {lectureTopic.lectures.map((lec, idx) => {
                            const isActive = activeIdx === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() => goToLecture(activeTopicIdx, idx, lectureTopic.lectures.length)}
                                className={`px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-wider rounded border transition-all cursor-pointer ${
                                  isActive
                                    ? "bg-primary/10 border-primary/40 text-primary shadow-[0_0_10px_rgba(255,107,0,0.15)]"
                                    : "bg-transparent border-white/5 text-muted-foreground hover:border-white/20 hover:text-foreground"
                                }`}
                              >
                                {lec.title}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {(() => {
                        const activeLecture = lectureTopic.lectures[activeIdx] || lectureTopic.lectures[0];
                        if (!activeLecture) return null;
                        const totalLecs = lectureTopic.lectures.length;

                        return (
                          <div className="space-y-4 mt-2">
                            <div className="markdown-content">
                              <ReactMarkdown>{activeLecture.theory}</ReactMarkdown>
                            </div>

                            <div className="my-3">
                              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[#FF5A1F]/80 block mb-1.5">Technical Intel / Log Output</span>
                              <pre className="bg-[#07090E] border border-white/5 rounded p-4 text-[0.7rem] text-primary font-mono overflow-x-auto whitespace-pre shadow-inner">
                                <code>{activeLecture.example}</code>
                              </pre>
                            </div>

                            <div className="flex items-start gap-2.5 bg-green-500/5 border border-green-500/15 p-3.5 rounded text-xs text-green-400 font-mono">
                              <span className="font-bold shrink-0">🛡️ REMEDIATION:</span>
                              <div className="markdown-content flex-grow">
                                <ReactMarkdown>{activeLecture.mitigation}</ReactMarkdown>
                              </div>
                            </div>

                            {/* ── Bottom lecture navigation ── */}
                            {totalLecs > 1 && (
                              <div className="mt-6 pt-4 border-t border-white/5">
                                {/* Progress pip strip */}
                                <div className="flex gap-1 mb-4 justify-center">
                                  {lectureTopic.lectures.map((_, pipIdx) => (
                                    <button
                                      key={pipIdx}
                                      onClick={() => goToLecture(activeTopicIdx, pipIdx, totalLecs)}
                                      className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                                        pipIdx === activeIdx
                                          ? "w-6 bg-primary shadow-[0_0_6px_rgba(255,107,0,0.6)]"
                                          : pipIdx < activeIdx
                                          ? "w-3 bg-primary/40"
                                          : "w-3 bg-white/10"
                                      }`}
                                    />
                                  ))}
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                  {/* Prev */}
                                  <button
                                    onClick={() => goToLecture(activeTopicIdx, activeIdx - 1, totalLecs)}
                                    disabled={activeIdx === 0}
                                    className="flex items-center gap-2 rounded border border-white/10 bg-white/5 px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground transition-all hover:border-white/25 hover:text-foreground hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                                  >
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                    Prev Lecture
                                  </button>

                                  {/* Counter */}
                                  <span className="font-mono text-[0.65rem] text-muted-foreground/60 tabular-nums">
                                    {activeIdx + 1} / {totalLecs}
                                  </span>

                                  {/* Next */}
                                  <button
                                    onClick={() => goToLecture(activeTopicIdx, activeIdx + 1, totalLecs)}
                                    disabled={activeIdx === totalLecs - 1}
                                    className="flex items-center gap-2 rounded border border-primary/30 bg-primary/5 px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-wider text-primary transition-all hover:border-primary/60 hover:bg-primary/10 hover:shadow-[0_0_12px_rgba(255,107,0,0.15)] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
                                  >
                                    Next Lecture
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>
                        Understand how <strong className="text-foreground">{t.toLowerCase()}</strong> works in the real world,
                        where it commonly fails, and how defenders detect and mitigate it.
                      </p>
                      <div className="flex items-start gap-2 bg-primary/5 border border-primary/10 p-3 rounded text-xs text-primary font-mono">
                        <span>🛡️ Mitigation: Implement strict validation and restrict network routing.</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Mobile lab notice */}
            <div className="mt-8 lg:hidden">
              <LabPanel module={module} labSteps={labSteps} setLabSteps={setLabSteps} />
            </div>

            <button
              onClick={handleComplete}
              /* TEMPORARILY DISABLED: Bypass lab progress checks during lecture mapping phase */
              /* disabled={!completed && (module.lab ? true : !labDone)} */
              disabled={false}
              className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-primary px-6 py-4 font-medium text-primary-foreground transition-all hover:bg-[var(--accent-hover)] hover:shadow-[var(--shadow-glow-lg)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {completed ? "Continue" : "Mark Complete & Continue"} <ArrowRight className="h-4 w-4" />
            </button>
            {!completed && module.lab && (
              <p className="mt-2 text-center font-mono text-xs text-[var(--text-muted)]">
                Solve the lab and submit the flag to unlock completion.
              </p>
            )}
            {!completed && !module.lab && !labDone && (
              <p className="mt-2 text-center font-mono text-xs text-[var(--text-muted)]">
                Finish all review steps to unlock completion.
              </p>
            )}
          </article>

          {/* Right: lab panel */}
          <aside className="order-3 hidden lg:block">
            <div className="sticky top-24">
              <LabPanel module={module} labSteps={labSteps} setLabSteps={setLabSteps} />
            </div>
          </aside>
        </>
      )}
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
  const { isComplete, submitFlag } = useProgress();
  const [flagInput, setFlagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const completed = isComplete(module.id);

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
    // If already complete, checklist shouldn't be toggleable
    if (completed) return;
    const copy = [...labSteps];
    copy[i] = !copy[i];
    setLabSteps(copy);
  };

  const handleFlagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorState(false);
    setServerMessage("");

    try {
      const res = await submitFlag(module.id, flagInput);
      if (res && res.success) {
        toast.success(`+${res.xp_earned || 100} XP — Lab Complete`, {
          description: "Flag verified and accepted successfully!",
        });
        setLabSteps(module.lab!.steps.map(() => true));
      } else {
        setErrorState(true);
        setServerMessage(res.message || "Incorrect flag value.");
        setTimeout(() => setErrorState(false), 500);
      }
    } catch (err) {
      console.error(err);
      setErrorState(true);
      setServerMessage("Verification server offline.");
      setTimeout(() => setErrorState(false), 500);
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Interactive terminal sandbox */}
      <div className="p-4 border-b border-border bg-black/40">
        <CyberTerminal 
          moduleId={module.id} 
          completedSteps={labSteps}
          onStepComplete={(stepIdx) => {
            if (completed) return;
            const copy = [...labSteps];
            copy[stepIdx] = true;
            setLabSteps(copy);
          }} 
        />
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-foreground">{module.lab.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{module.lab.description}</p>

        <ul className="mt-5 space-y-2">
          {module.lab.steps.map((s, i) => (
            <li key={s}>
              <button
                onClick={() => toggle(i)}
                disabled={completed}
                className={`flex w-full items-start gap-3 rounded-md border p-3 text-left text-sm transition-colors ${
                  labSteps[i]
                    ? "border-[var(--status-success)]/40 bg-[var(--status-success)]/5 text-foreground"
                    : "border-border text-muted-foreground hover:border-[var(--border-accent)] disabled:cursor-default"
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
          <p className="mt-3 text-center font-mono text-xs text-[var(--status-success)]">Lab steps complete.</p>
        )}

        {/* Flag Submission HUD */}
        <div className="mt-6 border-t border-white/5 pt-5">
          <h4 className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#FF5A1F] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] animate-pulse" />
            SYSTEM AUTHENTICATION
          </h4>
          
          {completed ? (
            <div className="border border-green-500/20 bg-green-500/5 p-4 rounded text-center">
              <span className="font-mono text-xs text-green-500 uppercase tracking-widest block font-bold">
                ✓ ACCESS GRANTED // SOLVED
              </span>
              <p className="mt-1 font-mono text-[0.6rem] text-muted-foreground/60">
                The encrypted module hash has been verified and registered on the server.
              </p>
            </div>
          ) : (
            <div className={`space-y-3 ${errorState ? 'animate-shake' : ''}`}>
              <p className="text-[0.65rem] text-muted-foreground font-mono leading-relaxed">
                Deploy target, locate the flag format <code className="text-[#FF5A1F] font-bold">{"FLAG{...}"}</code>, and submit it below to authorize.
              </p>
              
              <form onSubmit={handleFlagSubmit} className="flex gap-2 font-mono">
                <div className="relative flex-grow flex items-center bg-black/60 border border-white/10 rounded overflow-hidden focus-within:border-[#FF5A1F]/50 transition-colors">
                  <span className="text-[0.6rem] text-[#FF5A1F] pl-3 pr-1 select-none opacity-80 shrink-0">
                    vaelora@lab:~#
                  </span>
                  <input 
                    type="text"
                    value={flagInput}
                    onChange={(e) => setFlagInput(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="FLAG{...}"
                    className="w-full bg-transparent border-0 text-white placeholder-white/20 px-1 py-2 text-xs focus:outline-none focus:ring-0 shrink"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSubmitting || !flagInput.trim()}
                  className="px-4 py-2 font-mono text-[0.7rem] uppercase tracking-wider bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-[#FF5A1F] hover:bg-[#FF5A1F] hover:text-black hover:shadow-[0_0_15px_rgba(255,90,31,0.4)] transition-all rounded disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {isSubmitting ? "Verifying..." : "Submit"}
                </button>
              </form>
              
              {serverMessage && (
                <p className="font-mono text-[0.6rem] text-red-500 uppercase tracking-wider pl-1 animate-pulse">
                  ✗ {serverMessage}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
