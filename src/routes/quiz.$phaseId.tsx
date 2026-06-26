import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, X, Trophy, ArrowRight, RotateCcw } from "lucide-react";
import { getPhase, phases } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";

interface Question {
  q: string;
  options: string[];
  answer: number;
}

// A compact, phase-flavored question bank.
function buildQuestions(phaseId: string): Question[] {
  const generic: Record<string, Question[]> = {
    "digital-foundations": [
      { q: "Which command shows active network listeners on Linux?", options: ["ls -la", "ss -tulpn", "chmod 777", "cat /etc/passwd"], answer: 1 },
      { q: "What does the ARP protocol resolve?", options: ["Domain to IP", "IP to MAC", "Port to service", "Hash to text"], answer: 1 },
      { q: "Which file stores Linux user account info?", options: ["/etc/shadow", "/etc/hosts", "/etc/passwd", "/var/log/auth"], answer: 2 },
    ],
    "web-security": [
      { q: "A padding oracle attack targets which mode?", options: ["GCM", "CBC", "CTR", "ECB"], answer: 1 },
      { q: "Heartbleed was a vulnerability in?", options: ["OpenSSL", "OpenSSH", "WPA2", "Kerberos"], answer: 0 },
      { q: "Salting passwords primarily defends against?", options: ["Brute force", "Rainbow tables", "Phishing", "MITM"], answer: 1 },
    ],
    "defensive-security": [
      { q: "What does MTTD stand for?", options: ["Mean Time To Defend", "Mean Time To Detect", "Max Threat Threshold", "Managed Threat Detection"], answer: 1 },
      { q: "A P1 incident is best described as?", options: ["Informational", "Low priority", "Critical/severe", "A false positive"], answer: 2 },
      { q: "Sigma rules are used for?", options: ["Encryption", "Detection logic", "Password storage", "Load balancing"], answer: 1 },
    ],
    "ai-security": [
      { q: "Prompt injection primarily attacks?", options: ["The GPU", "Model guardrails/instructions", "The network", "The database index"], answer: 1 },
      { q: "Data poisoning targets which stage?", options: ["Inference only", "Training data", "TLS handshake", "DNS resolution"], answer: 1 },
      { q: "Membership inference tries to determine?", options: ["Model size", "If a sample was in training data", "GPU vendor", "Token cost"], answer: 1 },
    ],
  };
  const fallback: Question[] = [
    { q: `What best describes the focus of this phase?`, options: ["Marketing", "Hands-on security skills", "Accounting", "UI design"], answer: 1 },
    { q: "Reconnaissance comes before which step?", options: ["Exploitation", "Billing", "Onboarding", "Logout"], answer: 0 },
    { q: "Least privilege is a principle of?", options: ["Access control", "Graphic design", "Audio mixing", "Typography"], answer: 0 },
  ];
  return generic[phaseId] ?? fallback;
}

export const Route = createFileRoute("/quiz/$phaseId")({
  loader: ({ params }) => {
    if (!getPhase(params.phaseId)) throw notFound();
    return { phaseId: params.phaseId };
  },
  head: ({ loaderData }) => {
    const phase = loaderData ? getPhase(loaderData.phaseId) : null;
    return {
      meta: [
        { title: phase ? `${phase.title} Quiz — Vaelora` : "Quiz — Vaelora" },
        { name: "description", content: "Test your cybersecurity knowledge and earn XP with Vaelora's phase quizzes." },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="font-mono text-muted-foreground">Quiz not found.</p>
      <Link to="/courses" className="text-primary hover:underline">Back to curriculum</Link>
    </div>
  ),
  component: Quiz,
});

function Quiz() {
  const { phaseId } = Route.useParams();
  const phase = getPhase(phaseId)!;
  const { submitQuiz } = useProgress();
  const [questions] = useState(() => buildQuestions(phaseId));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[idx];

  const choose = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    if (i === q.answer) setScore((s) => s + 1);
  };

  const nextQ = async () => {
    if (idx < questions.length - 1) {
      setIdx(idx + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      const res = await submitQuiz(phaseId, score, questions.length);
      if (res && res.success && res.xp_earned > 0) {
        toast.success(`Quiz complete — +${res.xp_earned} XP`);
      } else {
        toast.success("Quiz complete!");
      }
      setDone(true);
    }
  };

  const restart = () => {
    setIdx(0); setSelected(null); setRevealed(false); setScore(0); setDone(false);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-[700px] flex-col items-center justify-center px-6 py-16 text-center">
        <Trophy className="h-14 w-14 text-primary" />
        <h1 className="mt-6 font-orbitron text-6xl tracking-wide text-foreground">{pct}%</h1>
        <p className="mt-2 text-muted-foreground">
          You scored {score} / {questions.length} on the {phase.title} quiz.
        </p>
        <p className="mt-1 font-mono text-sm text-primary">+{score * 20} XP earned</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button onClick={restart} className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border px-5 py-3 text-foreground hover:border-[var(--border-accent)]">
            <RotateCcw className="h-4 w-4" /> Retry
          </button>
          <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-primary px-5 py-3 font-medium text-primary-foreground hover:bg-[var(--accent-hover)]">
            View Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[700px] px-6 py-16">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{phase.code} Quiz</span>
      <div className="mt-4 flex items-center justify-between font-mono text-xs text-muted-foreground">
        <span>Question {idx + 1} of {questions.length}</span>
        <span>{Math.round(((idx) / questions.length) * 100)}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]">
        <div className="h-full bg-primary transition-all" style={{ width: `${((idx + (revealed ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>

      <h2 className="mt-8 text-2xl font-semibold text-foreground">{q.q}</h2>

      <div className="mt-6 space-y-3">
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answer;
          const isPicked = i === selected;
          let cls = "border-border text-muted-foreground hover:border-[var(--border-accent)] hover:text-foreground";
          if (revealed && isAnswer) cls = "border-[var(--status-success)] bg-[var(--status-success)]/10 text-foreground";
          else if (revealed && isPicked && !isAnswer) cls = "border-[var(--status-danger)] bg-[var(--status-danger)]/10 text-foreground";
          else if (isPicked) cls = "border-primary bg-[var(--accent-muted)] text-foreground";
          return (
            <button
              key={opt}
              onClick={() => choose(i)}
              className={`flex w-full items-center justify-between rounded-[var(--radius-md)] border px-5 py-4 text-left transition-colors ${cls}`}
            >
              <span>{opt}</span>
              {revealed && isAnswer && <Check className="h-5 w-5 text-[var(--status-success)]" />}
              {revealed && isPicked && !isAnswer && <X className="h-5 w-5 text-[var(--status-danger)]" />}
            </button>
          );
        })}
      </div>

      <button
        onClick={nextQ}
        disabled={!revealed}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-primary px-6 py-4 font-medium text-primary-foreground transition-all hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {idx < questions.length - 1 ? "Next Question" : "See Results"} <ArrowRight className="h-4 w-4" />
      </button>
    </main>
  );
}
