import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Layers, FlaskConical, Flame, ArrowRight, Lock, CheckCircle2, ShieldAlert, Shield } from "lucide-react";
import { Footer } from "@/components/Footer";
import { StatCard } from "@/components/StatCard";
import { phases, totalModules } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HackerAvatar } from "@/routes/leaderboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Track Your Vaelora Progress" },
      { name: "description", content: "Track your XP, completed labs, streak, and progress across all 9 Vaelora cybersecurity phases." },
    ],
  }),
  component: Dashboard,
});

interface ProfileData {
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

function Dashboard() {
  const { user } = useAuth();
  const { progress, isComplete } = useProgress();
  const completedModules = progress.completedModules.length;
  const phasesDone = phases.filter((p) => p.modules.every((m) => isComplete(m.id))).length;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [openSettings, setOpenSettings] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saving, setSaving] = useState(false);

  // Fetch operative profile info
  useEffect(() => {
    if (!user) return;
    const userId = user.id;
    async function loadProfile() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("display_name, bio, avatar_url")
          .eq("id", userId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setProfile(data);
          setDisplayName(data.display_name || "");
          setBio(data.bio || "");
          setAvatar(data.avatar_url || "phoenix");
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    }
    loadProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim() || null,
          bio: bio.trim() || null,
          avatar_url: avatar || "phoenix",
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile({
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatar || "phoenix"
      });
      toast.success("Hacker credentials successfully updated!");
      setOpenSettings(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update credentials.");
    } finally {
      setSaving(false);
    }
  };

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
        
        {/* Header HUD section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Your Command Center</span>
            <h1 className="mt-2 font-orbitron text-5xl tracking-wide text-foreground md:text-7xl">Dashboard</h1>
          </div>
          {user && (
            <Dialog open={openSettings} onOpenChange={setOpenSettings}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 rounded border border-primary/20 bg-primary/5 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-primary hover:bg-primary hover:text-black hover:shadow-[0_0_15px_rgba(255,90,31,0.3)] transition-all cursor-pointer">
                  Customize Identity
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-[#0A0A0A] border border-white/10 text-white font-sans">
                <DialogHeader>
                  <DialogTitle className="font-orbitron text-xl uppercase tracking-wider text-primary flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" /> Customize Identity
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4 font-mono text-xs">
                  <div className="space-y-1">
                    <label className="text-muted-foreground uppercase tracking-widest text-[0.6rem]">Operative Alias</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Agent Alias"
                      maxLength={24}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-muted-foreground uppercase tracking-widest text-[0.6rem]">Intel Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="System credentials or target specializations..."
                      rows={3}
                      maxLength={150}
                      className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50 resize-none font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-muted-foreground uppercase tracking-widest text-[0.6rem] block">Select Avatar Preset</label>
                    <div className="grid grid-cols-5 gap-3">
                      {["phoenix", "ninja", "root", "crypto", "ai"].map((av) => {
                        const active = avatar === av;
                        return (
                          <button
                            key={av}
                            type="button"
                            onClick={() => setAvatar(av)}
                            className={`relative rounded p-1 border hover:border-primary/45 transition-colors flex items-center justify-center cursor-pointer ${
                              active ? "border-[#FF5A1F] bg-[#FF5A1F]/10" : "border-white/5 bg-black/40"
                            }`}
                          >
                            <HackerAvatar name={av} className="w-10 h-10" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full py-2.5 font-mono text-xs uppercase tracking-wider bg-primary text-black font-semibold rounded hover:bg-[#FF8C00] hover:shadow-[0_0_15px_rgba(255,107,0,0.4)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Syncing Credentials..." : "Secure Identity"}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Dynamic Operative Welcome Card */}
        {user && profile && (
          <div className="mt-8 flex flex-col md:flex-row items-center md:items-start gap-5 border border-white/5 bg-black/20 p-6 rounded relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02] mix-blend-screen pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)", backgroundSize: "16px 16px" }} />
            
            <HackerAvatar name={profile.avatar_url} className="w-16 h-16 shrink-0" />
            <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-2.5">
                <h2 className="text-2xl font-bold tracking-wide text-white font-orbitron">
                  {profile.display_name || user.email?.split("@")[0] || "Agent"}
                </h2>
                <span className="font-mono text-[0.65rem] uppercase tracking-wider bg-primary/10 border border-primary/25 text-primary px-2.5 py-0.5 rounded shadow-[0_0_10px_rgba(255,90,31,0.1)]">
                  Level {Math.floor((progress?.xp ?? 0) / 100) + 1}
                </span>
              </div>
              <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground/60 leading-relaxed max-w-xl">
                {profile.bio || "Secure dossier link active. Update your Operative Intel Bio."}
              </p>
            </div>
          </div>
        )}

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
                  <div className="font-orbitron text-2xl text-foreground">{s.value}</div>
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
                    : <span className="font-orbitron text-xl text-primary">{p.num}</span>}
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
