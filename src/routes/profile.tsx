import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
  Shield, 
  Flame, 
  Trophy, 
  Target, 
  Cpu, 
  Star, 
  Mail, 
  Calendar, 
  Key, 
  User, 
  Edit3, 
  Lock, 
  ArrowRight,
  ShieldAlert,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProgress } from "@/hooks/useProgress";
import { Footer } from "@/components/Footer";
import { HackerAvatar } from "@/routes/leaderboard";
import { toast } from "sonner";
import { phases, totalModules } from "@/data/curriculum";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Operative Dossier — Cyber Shield Academy" },
      { name: "description", content: "View your Vaelora security clearance, training metrics, streaks, and decrypted achievements." }
    ]
  }),
  component: ProfilePage
});

interface ProfileData {
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  username: string;
  created_at: string;
}

interface UserStatsData {
  xp: number;
  current_streak: number;
  longest_streak: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-flag', title: 'First Blood', description: 'Captured your first cyber training flag.', icon: 'target' },
  { id: 'streak-5', title: 'Consistent Hacker', description: 'Maintained a 5-day active hack streak.', icon: 'flame' },
  { id: 'quiz-master', title: 'Decrypted Mind', description: 'Scored 100% on any security phase quiz.', icon: 'cpu' },
  { id: 'level-5', title: 'Elite Agent', description: 'Reached operative status Level 5.', icon: 'shield' },
  { id: 'curriculum-half', title: 'Midway Access', description: 'Decrypted progress in 6 or more phases.', icon: 'trophy' }
];

function ProfilePage() {
  const { user, signOut } = useAuth();
  const { progress, isComplete } = useProgress();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<UserStatsData | null>(null);
  const [earnedAchievements, setEarnedAchievements] = useState<Array<{ achievement_id: string; earned_at: string }>>([]);
  
  // Customization states
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("phoenix");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadProfileData() {
      try {
        setLoading(true);
        // 1. Fetch Profile
        const { data: profileData, error: profileErr } = await supabase
          .from("profiles")
          .select("display_name, bio, avatar_url, username, created_at")
          .eq("id", user!.id)
          .maybeSingle();

        if (profileErr) throw profileErr;

        if (profileData) {
          setProfile(profileData);
          setDisplayName(profileData.display_name || "");
          setBio(profileData.bio || "");
          setAvatar(profileData.avatar_url || "phoenix");
        }

        // 2. Fetch Stats
        const { data: statsData, error: statsErr } = await supabase
          .from("user_stats")
          .select("xp, current_streak, longest_streak")
          .eq("user_id", user!.id)
          .maybeSingle();

        if (statsErr) throw statsErr;
        if (statsData) {
          setStats(statsData);
        }

        // 3. Fetch Earned Achievements
        const { data: achievementsData, error: achErr } = await supabase
          .from("user_achievements")
          .select("achievement_id, earned_at")
          .eq("user_id", user!.id);

        if (achErr) throw achErr;
        if (achievementsData) {
          setEarnedAchievements(achievementsData);
        }

      } catch (err) {
        console.error("Error loading dossier data:", err);
        toast.error("Failed to load operative credentials.");
      } finally {
        setLoading(false);
      }
    }

    loadProfileData();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
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

      setProfile(prev => prev ? {
        ...prev,
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
        avatar_url: avatar || "phoenix"
      } : null);

      toast.success("Operative identity synchronized successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to sync identity credentials.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOutClick = async () => {
    await signOut();
    toast.success("Secure session closed.");
    navigate({ to: "/" });
  };

  // Helper values
  const completedModules = progress.completedModules.length;
  const phasesDone = phases.filter((p) => p.modules.every((m) => isComplete(m.id))).length;
  const xp = stats?.xp ?? progress?.xp ?? 0;
  const currentStreak = stats?.current_streak ?? progress?.streak ?? 0;
  const longestStreak = stats?.longest_streak ?? currentStreak;
  const userLevel = Math.floor(xp / 100) + 1;

  // Connection metadata
  const provider = user?.app_metadata?.provider || user?.identities?.[0]?.provider || "passphrase";
  const formattedProvider = provider === "google" ? "Google OAuth" : "Cryptographic Key";
  
  const registrationDate = profile?.created_at 
    ? new Date(profile.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
    : "Unknown Date";

  const renderIcon = (iconName: string, active: boolean) => {
    const cls = active 
      ? "w-8 h-8 text-primary drop-shadow-[0_0_8px_#ff5a1f]" 
      : "w-8 h-8 text-muted-foreground/30";
    switch (iconName) {
      case 'target': return <Target className={cls} />;
      case 'flame': return <Flame className={cls} />;
      case 'cpu': return <Cpu className={cls} />;
      case 'shield': return <Shield className={cls} />;
      case 'trophy': return <Trophy className={cls} />;
      default: return <Star className={cls} />;
    }
  };

  // Set of earned achievement IDs
  const earnedSet = new Set(earnedAchievements.map(ea => ea.achievement_id));

  if (!user) {
    return (
      <main className="grain min-h-[calc(100vh-4rem)] flex flex-col justify-between">
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="max-w-md w-full border border-yellow-500/20 bg-yellow-500/5 p-8 rounded-lg text-center font-mono relative overflow-hidden shadow-glow">
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-yellow-500/50" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-yellow-500/50" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-yellow-500/50" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-yellow-500/50" />
            
            <ShieldAlert className="h-12 w-12 text-yellow-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-orbitron uppercase text-yellow-500 tracking-wider">Access Restricted</h2>
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              No authenticated agent session was detected. You are currently in a local Guest Session.
            </p>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Please verification-authenticate at the security gate to initialize your profile dossier.
            </p>
            <div className="mt-6">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center gap-2 w-full rounded bg-yellow-500 text-black font-semibold px-4 py-2.5 hover:bg-yellow-400 transition-colors uppercase tracking-wider text-xs"
              >
                Authenticate Identity <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="grain min-h-[calc(100vh-4rem)] flex flex-col justify-between text-white">
      <div className="mx-auto max-w-[1280px] w-full px-6 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="font-mono text-xs text-muted-foreground animate-pulse">Decrypting dossier files...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Page Header */}
            <div>
              <span className="font-mono text-[0.65rem] tracking-[0.3em] text-primary uppercase">
                SECURITY COMPLIANCE STATUS // CONFIDENTIAL
              </span>
              <h1 className="mt-2 font-orbitron text-4xl tracking-wider text-foreground uppercase md:text-5xl">
                Operative Dossier
              </h1>
            </div>

            {/* Dossier Card */}
            <div className="border border-white/5 bg-black/20 p-6 rounded relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/45" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/45" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/45" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/45" />
              <div className="absolute inset-0 opacity-[0.01] mix-blend-screen pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)", backgroundSize: "16px 16px" }} />
              
              <HackerAvatar name={profile?.avatar_url || "phoenix"} className="w-20 h-20 shrink-0 select-none" />
              
              <div className="text-center md:text-left flex-1 space-y-3">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h2 className="text-2xl font-bold tracking-wide font-orbitron">
                    {profile?.display_name || user.email?.split("@")[0] || "Agent"}
                  </h2>
                  <div className="flex gap-2">
                    <span className="font-mono text-[0.6rem] uppercase tracking-wider bg-primary/10 border border-primary/25 text-primary px-2 py-0.5 rounded">
                      Level {userLevel}
                    </span>
                    <span className="font-mono text-[0.6rem] uppercase tracking-wider bg-white/5 border border-white/10 text-muted-foreground px-2 py-0.5 rounded">
                      @{profile?.username || "agent"}
                    </span>
                  </div>
                </div>
                
                <p className="font-mono text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  {profile?.bio || "Dossier bio is currently empty. Edit credentials to sync target specializations."}
                </p>

                <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="font-mono text-[0.65rem] uppercase tracking-wider border border-border bg-black/40 hover:bg-white/5 text-foreground px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-primary" /> 
                    {isEditing ? "Hide Panel" : "Edit Credentials"}
                  </button>
                  <button 
                    onClick={handleSignOutClick}
                    className="font-mono text-[0.65rem] uppercase tracking-wider border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 text-destructive px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" /> Close Session (Sign Out)
                  </button>
                </div>
              </div>
            </div>

            {/* Main grid */}
            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Left Column: Stats & Meta */}
              <div className="space-y-6">
                
                {/* Credentials Panel */}
                <div className="border border-white/5 bg-[#0e121e]/40 p-6 rounded relative">
                  <h3 className="font-orbitron text-sm uppercase tracking-wider text-primary border-b border-white/5 pb-3 mb-4">
                    Security Credentials
                  </h3>
                  <div className="space-y-4 font-mono text-[0.7rem]">
                    <div className="flex justify-between items-center py-1.5 border-b border-white/[0.03]">
                      <span className="text-muted-foreground uppercase">Agent ID</span>
                      <span className="text-foreground tracking-wide select-all text-right max-w-[200px] truncate">{user.id}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-white/[0.03]">
                      <span className="text-muted-foreground uppercase">Linked Email</span>
                      <span className="text-foreground tracking-wide text-right select-all">{user.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-white/[0.03]">
                      <span className="text-muted-foreground uppercase">Decryption Date</span>
                      <span className="text-foreground tracking-wide">{registrationDate}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-muted-foreground uppercase">Gate Protocol</span>
                      <span className="text-primary font-medium tracking-wider">{formattedProvider}</span>
                    </div>
                  </div>
                </div>

                {/* Performance HUD */}
                <div className="border border-white/5 bg-[#0e121e]/40 p-6 rounded">
                  <h3 className="font-orbitron text-sm uppercase tracking-wider text-primary border-b border-white/5 pb-3 mb-4">
                    Performance Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-4 font-mono">
                    <div className="bg-black/30 border border-white/5 p-4 rounded text-center">
                      <span className="text-muted-foreground text-[0.6rem] uppercase tracking-wider block">Decrypted Intel</span>
                      <span className="text-2xl font-orbitron text-foreground block mt-1">{xp}</span>
                      <span className="text-primary text-[0.55rem] uppercase tracking-widest block mt-0.5">Total XP</span>
                    </div>
                    <div className="bg-black/30 border border-white/5 p-4 rounded text-center">
                      <span className="text-muted-foreground text-[0.6rem] uppercase tracking-wider block">Training Streak</span>
                      <span className="text-2xl font-orbitron text-foreground block mt-1">{currentStreak}</span>
                      <span className="text-primary text-[0.55rem] uppercase tracking-widest block mt-0.5">Active Days</span>
                    </div>
                    <div className="bg-black/30 border border-white/5 p-4 rounded text-center">
                      <span className="text-muted-foreground text-[0.6rem] uppercase tracking-wider block">Streaks Record</span>
                      <span className="text-xl font-orbitron text-foreground block mt-1">{longestStreak} days</span>
                    </div>
                    <div className="bg-black/30 border border-white/5 p-4 rounded text-center">
                      <span className="text-muted-foreground text-[0.6rem] uppercase tracking-wider block">Curriculum Complete</span>
                      <span className="text-xl font-orbitron text-foreground block mt-1">
                        {Math.round((completedModules / totalModules()) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Customize Inline Panel */}
              <div className="space-y-6">
                
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="border border-primary/20 bg-[#0e121e]/40 p-6 rounded relative space-y-4 animate-in slide-in-from-top-4 duration-300">
                    <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t border-r border-primary" />
                    <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b border-l border-primary" />
                    
                    <h3 className="font-orbitron text-sm uppercase tracking-wider text-primary border-b border-white/5 pb-3">
                      Synchronize Dossier Settings
                    </h3>
                    
                    <div className="space-y-2 font-mono text-xs">
                      <label className="text-muted-foreground uppercase tracking-widest text-[0.6rem] block">Operative Alias</label>
                      <input 
                        type="text" 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Agent Alias"
                        maxLength={24}
                        className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                        required
                      />
                    </div>

                    <div className="space-y-2 font-mono text-xs">
                      <label className="text-muted-foreground uppercase tracking-widest text-[0.6rem] block">Intel Dossier Bio</label>
                      <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Target specializations, security certifications, encryption logs..."
                        rows={4}
                        maxLength={150}
                        className="w-full bg-black/60 border border-white/10 rounded px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50 resize-none font-sans"
                      />
                    </div>

                    <div className="space-y-2 font-mono text-xs">
                      <label className="text-muted-foreground uppercase tracking-widest text-[0.6rem] block">Hacker Avatar Preset</label>
                      <div className="grid grid-cols-5 gap-2">
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
                              <HackerAvatar name={av} className="w-8 h-8" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                      <button 
                        type="submit"
                        disabled={saving}
                        className="flex-1 py-2.5 font-mono text-xs uppercase tracking-wider bg-primary text-black font-semibold rounded hover:bg-[#FF8C00] hover:shadow-[0_0_15px_rgba(255,107,0,0.4)] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {saving ? "Syncing..." : "Sync Credentials"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="py-2.5 px-4 font-mono text-xs uppercase tracking-wider border border-border rounded hover:bg-white/5 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="border border-white/5 bg-[#0e121e]/40 p-6 rounded flex flex-col justify-center items-center text-center h-full min-h-[300px]">
                    <Shield className="w-12 h-12 text-primary/30 mb-4" />
                    <h4 className="font-orbitron text-sm uppercase text-foreground tracking-widest">Dossier Locked</h4>
                    <p className="mt-2 text-xs text-muted-foreground max-w-xs leading-relaxed font-mono">
                      Your current security identity is synchronized. Click "Edit Credentials" to configure operative dossier settings.
                    </p>
                  </div>
                )}

              </div>

            </div>

            {/* Achievements Section */}
            <div className="border border-white/5 bg-black/20 p-6 rounded relative">
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/45" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/45" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/45" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/45" />

              <h3 className="font-orbitron text-lg uppercase tracking-wider text-foreground border-b border-white/5 pb-3 mb-6">
                Decrypted Achievements
              </h3>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ALL_ACHIEVEMENTS.map((ach) => {
                  const earned = earnedSet.has(ach.id);
                  const earningInfo = earnedAchievements.find(ea => ea.achievement_id === ach.id);
                  const earnedDate = earningInfo?.earned_at
                    ? new Date(earningInfo.earned_at).toLocaleDateString("en-US", { month: '2-digit', day: '2-digit', year: 'numeric' })
                    : null;

                  return (
                    <div 
                      key={ach.id}
                      className={`border p-4 rounded font-mono text-xs relative flex items-start gap-4 transition-all ${
                        earned 
                          ? "border-primary/30 bg-[#FF5A1F]/5 shadow-[0_0_15px_rgba(255,90,31,0.05)]" 
                          : "border-white/5 bg-black/40 opacity-60"
                      }`}
                    >
                      <div className="shrink-0">
                        {renderIcon(ach.icon, earned)}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className={`font-bold tracking-wide ${earned ? "text-white" : "text-muted-foreground"}`}>
                            {ach.title}
                          </h4>
                          {!earned && <Lock className="w-3 h-3 text-muted-foreground/50 shrink-0" />}
                        </div>
                        <p className="text-[0.65rem] text-muted-foreground leading-normal">
                          {ach.description}
                        </p>
                        {earned && earnedDate && (
                          <span className="inline-block text-[0.55rem] text-primary uppercase tracking-widest mt-1">
                            Decrypted: {earnedDate}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
