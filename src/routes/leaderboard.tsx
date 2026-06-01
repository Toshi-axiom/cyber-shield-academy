import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Trophy, Search, Flame, Target, Star, Shield, Cpu, Lock, Terminal, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Vaelora Global Rankings" },
      { name: "description", content: "View the global rankings of top Vaelora operatives. Track daily streaks, module completions, and XP scores." }
    ]
  }),
  component: LeaderboardPage
});

interface PlayerStats {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  xp: number;
  streak: number;
  isMock?: boolean;
}

// Vector avatar presets rendered in code for custom hacker identity
export function HackerAvatar({ name, className = "w-10 h-10" }: { name: string | null; className?: string }) {
  const normalized = name ? name.toLowerCase() : "";

  if (normalized.includes("phoenix")) {
    return (
      <div className={`rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center p-1.5 ${className}`}>
        <Flame className="w-full h-full text-orange-500 drop-shadow-[0_0_8px_#ff5a1f]" />
      </div>
    );
  }
  if (normalized.includes("ninja")) {
    return (
      <div className={`rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center p-1.5 ${className}`}>
        <Shield className="w-full h-full text-cyan-400 drop-shadow-[0_0_8px_#00cfff]" />
      </div>
    );
  }
  if (normalized.includes("root")) {
    return (
      <div className={`rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center p-1.5 ${className}`}>
        <Terminal className="w-full h-full text-purple-400 drop-shadow-[0_0_8px_#a855f7]" />
      </div>
    );
  }
  if (normalized.includes("crypto")) {
    return (
      <div className={`rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center p-1.5 ${className}`}>
        <Lock className="w-full h-full text-yellow-400 drop-shadow-[0_0_8px_#fbbf24]" />
      </div>
    );
  }
  if (normalized.includes("ai") || normalized.includes("brain")) {
    return (
      <div className={`rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center p-1.5 ${className}`}>
        <Cpu className="w-full h-full text-pink-400 drop-shadow-[0_0_8px_#ec4899]" />
      </div>
    );
  }
  // Fallback default avatar
  return (
    <div className={`rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center p-1.5 ${className}`}>
      <Star className="w-full h-full text-blue-400 drop-shadow-[0_0_8px_#3b82f6]" />
    </div>
  );
}

function LeaderboardPage() {
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock users to fill the board if database is newly initialized
  const MOCK_PLAYERS: PlayerStats[] = [
    { id: "mock-1", username: "0xnull", display_name: "Null Operative", avatar_url: "phoenix", xp: 14500, streak: 12, isMock: true },
    { id: "mock-2", username: "cyberghost", display_name: "Stealth Agent", avatar_url: "ninja", xp: 13200, streak: 8, isMock: true },
    { id: "mock-3", username: "bytebandit", display_name: "Byte Bandit", avatar_url: "root", xp: 12850, streak: 15, isMock: true },
    { id: "mock-4", username: "rootkit", display_name: "Root Kit", avatar_url: "crypto", xp: 11000, streak: 4, isMock: true },
    { id: "mock-5", username: "ph3nix", display_name: "Phoenix Ascended", avatar_url: "phoenix", xp: 9500, streak: 22, isMock: true },
    { id: "mock-6", username: "aimaster", display_name: "Neural Master", avatar_url: "ai", xp: 8200, streak: 3, isMock: true }
  ];

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        setLoading(true);
        // Query profiles joined with user_stats
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            id,
            username,
            display_name,
            avatar_url,
            user_stats (
              xp,
              current_streak
            )
          `);

        if (error) throw error;

        // Map database records to PlayerStats interface
        const dbPlayers: PlayerStats[] = (data || []).map((row: any) => {
          const stats = row.user_stats;
          return {
            id: row.id,
            username: row.username,
            display_name: row.display_name,
            avatar_url: row.avatar_url,
            xp: stats?.xp ?? 0,
            streak: stats?.current_streak ?? 0
          };
        });

        // Merge DB players with mock players, ensuring unique usernames (prioritizing DB users)
        const dbUsernames = new Set(dbPlayers.map((p) => p.username.toLowerCase()));
        const filteredMocks = MOCK_PLAYERS.filter((mp) => !dbUsernames.has(mp.username.toLowerCase()));
        
        const merged = [...dbPlayers, ...filteredMocks].sort((a, b) => b.xp - a.xp);
        setPlayers(merged);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
        // Fallback to mock players in case of network or database error
        setPlayers(MOCK_PLAYERS.sort((a, b) => b.xp - a.xp));
      } finally {
        setLoading(false);
      }
    }

    loadLeaderboard();
  }, []);

  const filteredPlayers = players.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.username.toLowerCase().includes(term) ||
      (p.display_name && p.display_name.toLowerCase().includes(term))
    );
  });

  // Split into Top 3 podium and rest
  const topThree = filteredPlayers.slice(0, 3);
  const remaining = filteredPlayers.slice(3);

  // Position slots for podium layout
  const podiumSlots = [
    { index: 1, position: "second", label: "Rank 02", height: "h-[180px]", glowColor: "border-cyan-500/30 shadow-[0_0_20px_rgba(0,207,255,0.08)]" },
    { index: 0, position: "first", label: "Rank 01", height: "h-[220px]", glowColor: "border-orange-500/40 shadow-[0_0_30px_rgba(255,90,31,0.12)]" },
    { index: 2, position: "third", label: "Rank 03", height: "h-[150px]", glowColor: "border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.08)]" }
  ];

  return (
    <main className="grain min-h-screen bg-[#0A0A0A] overflow-hidden text-white">
      {/* Abstract Grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,90,31,0.04)_0%,_transparent_60%)] pointer-events-none" />
      <div className="mx-auto max-w-[1200px] px-6 py-20 relative z-10">
        
        {/* Title Section */}
        <Reveal>
          <div className="flex flex-col items-center text-center mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary flex items-center gap-3">
              <span className="w-8 h-[1px] bg-primary/40"></span>
              GLOBAL LEADERBOARD
              <span className="w-8 h-[1px] bg-primary/40"></span>
            </span>
            <h1 className="mt-4 font-orbitron text-5xl tracking-wider text-foreground md:text-6xl drop-shadow-lg uppercase">
              Operative <span className="text-primary">Ranks</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl text-sm leading-relaxed font-light">
              Submit flags, solve challenges, and climb the global ranking grid. Only the elite secure their spot on the podium.
            </p>
          </div>
        </Reveal>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
            <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <p className="font-mono text-xs text-muted-foreground animate-pulse">Decrypting scoreboard matrix...</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium (Only render if there are players matching searches) */}
            {topThree.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[900px] mx-auto items-end mb-16">
                {podiumSlots
                  .filter((slot) => topThree[slot.index] !== undefined)
                  .map((slot) => {
                    const player = topThree[slot.index];
                    return (
                      <Reveal key={player.id} delay={slot.index * 0.1}>
                        <div className="flex flex-col items-center group">
                          {/* Crown/Star/Badge Icon above Avatar */}
                          <div className="mb-2 transition-transform duration-300 group-hover:-translate-y-1">
                            {slot.position === "first" ? (
                              <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_#f59e0b]" />
                            ) : slot.position === "second" ? (
                              <Shield className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_#00cfff]" />
                            ) : (
                              <Star className="w-6 h-6 text-purple-400 drop-shadow-[0_0_8px_#a855f7]" />
                            )}
                          </div>

                          {/* Avatar Frame with custom border glow */}
                          <div className="relative mb-4">
                            <HackerAvatar name={player.avatar_url} className="w-16 h-16" />
                            <span className={`absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-black font-mono text-[0.6rem] font-bold ${
                              slot.position === "first" ? "text-yellow-400" :
                              slot.position === "second" ? "text-cyan-400" : "text-purple-400"
                            }`}>
                              {slot.index === 0 ? "01" : slot.index === 1 ? "02" : "03"}
                            </span>
                          </div>

                          {/* Podium Block */}
                          <div className={`w-full ${slot.height} rounded border bg-black/40 backdrop-blur-md p-5 flex flex-col justify-between items-center text-center transition-all duration-300 group-hover:bg-black/60 ${slot.glowColor}`}>
                            <div className="mt-2">
                              <h3 className="font-orbitron font-bold text-sm tracking-wide text-white truncate max-w-[180px]">
                                {player.display_name || player.username}
                              </h3>
                              <p className="font-mono text-[0.6rem] text-muted-foreground/60 mt-0.5">
                                @{player.username}
                              </p>
                            </div>

                            <div className="mb-2">
                              <div className="font-orbitron text-xl font-bold text-primary tracking-wide">
                                {player.xp.toLocaleString()}
                              </div>
                              <div className="font-mono text-[0.55rem] uppercase tracking-widest text-muted-foreground/40 mt-0.5">
                                Total XP
                              </div>
                            </div>

                            {/* Streak badge */}
                            {player.streak > 0 && (
                              <div className="flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded font-mono text-[0.55rem] text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                                <Flame className="w-3.5 h-3.5" />
                                <span>{player.streak}d Streak</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
              </div>
            )}

            {/* Operative Search Matrix */}
            <Reveal delay={0.3}>
              <div className="max-w-[800px] mx-auto mb-8 flex gap-4">
                <div className="relative flex-grow flex items-center bg-black/40 border border-white/10 rounded-sm focus-within:border-primary/50 transition-colors">
                  <Search className="w-4 h-4 text-muted-foreground/50 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search operatives by alias..."
                    className="w-full bg-transparent border-0 text-white placeholder-white/20 px-3 py-3 text-xs font-mono focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </Reveal>

            {/* Rankings Grid Table */}
            <Reveal delay={0.4}>
              <div className="max-w-[800px] mx-auto border border-white/5 bg-black/20 backdrop-blur-md rounded overflow-hidden shadow-2xl">
                
                {/* Table Header */}
                <div className="grid grid-cols-[60px_1fr_120px_120px] items-center border-b border-white/10 bg-[#0d0d0d] px-6 py-4 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground/80">
                  <span className="text-center">Rank</span>
                  <span>Operative</span>
                  <span className="text-center">Streak</span>
                  <span className="text-right">Total XP</span>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5">
                  {filteredPlayers.length > 0 ? (
                    remaining.map((player, idx) => {
                      const rank = idx + 4; // Podium is 1-3
                      return (
                        <div
                          key={player.id}
                          className="grid grid-cols-[60px_1fr_120px_120px] items-center px-6 py-4 transition-all hover:bg-white/[0.02]"
                        >
                          {/* Rank */}
                          <span className="font-mono text-xs text-muted-foreground text-center font-bold">
                            #{rank}
                          </span>

                          {/* Profile */}
                          <div className="flex items-center gap-3 overflow-hidden">
                            <HackerAvatar name={player.avatar_url} className="w-8 h-8 shrink-0" />
                            <div className="truncate">
                              <span className="text-sm font-semibold text-white tracking-wide truncate block">
                                {player.display_name || player.username}
                              </span>
                              <span className="font-mono text-[0.6rem] text-muted-foreground/40 block">
                                @{player.username}
                              </span>
                            </div>
                          </div>

                          {/* Streak */}
                          <div className="flex justify-center items-center">
                            {player.streak > 0 ? (
                              <div className="flex items-center gap-1.5 font-mono text-xs text-red-500 bg-red-500/5 border border-red-500/10 px-2 py-0.5 rounded">
                                <Flame className="w-3.5 h-3.5 fill-current" />
                                <span>{player.streak}d</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground/20 font-mono text-xs">-</span>
                            )}
                          </div>

                          {/* XP */}
                          <span className="font-orbitron text-right font-bold text-white tracking-wider text-sm">
                            {player.xp.toLocaleString()}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
                      <ShieldAlert className="w-8 h-8 text-primary/40 animate-pulse" />
                      <p className="font-mono text-xs text-muted-foreground/60 uppercase tracking-widest">
                        No operatives matching credentials found.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </Reveal>
          </>
        )}

      </div>
      <Footer />
    </main>
  );
}
