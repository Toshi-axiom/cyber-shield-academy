import { createFileRoute } from "@tanstack/react-router";
import { Flag, Trophy, Target, ShieldAlert, Cpu, Lock } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [{ title: "Challenges — Vaelora CTF Arena" }],
  }),
  component: Challenges,
});

const MOCK_CHALLENGES = [
  { id: 1, title: "Phantom Endpoint", category: "Web", difficulty: "Medium", points: 250, solved: 142, icon: <Target className="w-5 h-5 text-blue-500" /> },
  { id: 2, title: "The Oracle's Padding", category: "Crypto", difficulty: "Hard", points: 500, solved: 38, icon: <Lock className="w-5 h-5 text-purple-500" /> },
  { id: 3, title: "Rogue Container", category: "Cloud", difficulty: "Hard", points: 500, solved: 51, icon: <Cpu className="w-5 h-5 text-cyan-500" /> },
  { id: 4, title: "Blind SQL Injection", category: "Web", difficulty: "Easy", points: 100, solved: 892, icon: <Target className="w-5 h-5 text-blue-500" /> },
  { id: 5, title: "Kernel Panic", category: "Pwn", difficulty: "Insane", points: 1000, solved: 4, icon: <ShieldAlert className="w-5 h-5 text-red-500" /> },
  { id: 6, title: "Leaky Bucket", category: "Cloud", difficulty: "Easy", points: 100, solved: 1205, icon: <Cpu className="w-5 h-5 text-cyan-500" /> },
];

function Challenges() {
  return (
    <main className="grain min-h-screen bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,59,59,0.05)_0%,_transparent_50%)] pointer-events-none" />
      
      <div className="mx-auto max-w-[1200px] px-6 py-20 relative z-10">
        <Reveal>
          <div className="flex flex-col items-start mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#FF3B3B] flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#FF3B3B]/40"></span>
              CTF ARENA
            </span>
            <h1 className="mt-4 font-orbitron text-5xl tracking-wide text-foreground md:text-6xl drop-shadow-lg flex items-center gap-4">
              Capture The <span className="text-[#FF3B3B]">Flag</span>
              <Flag className="w-10 h-10 text-[#FF3B3B] hidden md:block opacity-50" />
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl text-lg">
              Test your skills against isolated targets. Solve puzzles, exploit vulnerabilities, and submit the flag to climb the global leaderboard.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
          
          {/* Challenges List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="font-orbitron text-xl text-white">Active Targets</h2>
              <div className="flex gap-2 font-mono text-xs">
                <button className="px-3 py-1.5 rounded bg-[#FF3B3B]/10 text-[#FF3B3B] border border-[#FF3B3B]/30 hover:bg-[#FF3B3B]/20 transition-colors">All</button>
                <button className="px-3 py-1.5 rounded bg-white/5 text-muted-foreground border border-white/10 hover:text-white transition-colors">Web</button>
                <button className="px-3 py-1.5 rounded bg-white/5 text-muted-foreground border border-white/10 hover:text-white transition-colors">Crypto</button>
              </div>
            </div>

            {MOCK_CHALLENGES.map((challenge, i) => (
              <Reveal key={challenge.id} delay={i * 0.05}>
                <div className="group flex flex-col md:flex-row md:items-center justify-between p-5 rounded border border-white/10 bg-black/40 backdrop-blur-sm hover:border-[#FF3B3B]/40 hover:bg-black/60 transition-all cursor-pointer">
                  
                  <div className="flex items-center gap-5">
                    <div className="p-3 rounded bg-white/5 group-hover:bg-[#FF3B3B]/10 transition-colors">
                      {challenge.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-wide">{challenge.title}</h3>
                      <div className="flex items-center gap-3 mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                        <span className="text-white/60">{challenge.category}</span>
                        <span>•</span>
                        <span className={
                          challenge.difficulty === 'Easy' ? 'text-green-500' : 
                          challenge.difficulty === 'Medium' ? 'text-yellow-500' : 
                          challenge.difficulty === 'Hard' ? 'text-orange-500' : 'text-red-500'
                        }>{challenge.difficulty}</span>
                        <span>•</span>
                        <span>{challenge.solved} Solves</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                    <div className="text-right">
                      <div className="font-orbitron text-xl text-[#FF3B3B] font-bold">{challenge.points}</div>
                      <div className="font-mono text-[0.55rem] uppercase tracking-widest text-muted-foreground">Points</div>
                    </div>
                    <button className="px-5 py-2 rounded font-mono text-[0.7rem] uppercase tracking-wider bg-white/5 border border-white/10 text-white group-hover:bg-[#FF3B3B] group-hover:text-black group-hover:border-[#FF3B3B] transition-all">
                      Deploy
                    </button>
                  </div>

                </div>
              </Reveal>
            ))}
          </div>

          {/* Leaderboard Sidebar */}
          <aside>
            <Reveal delay={0.3}>
              <div className="sticky top-24 rounded border border-white/10 bg-black/40 backdrop-blur-md p-5">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-orbitron text-lg text-white tracking-wide">Top Operatives</h3>
                </div>

                <div className="space-y-4">
                  {[
                    { rank: 1, name: "0xNull", points: 14500 },
                    { rank: 2, name: "CyberGhost", points: 13200 },
                    { rank: 3, name: "ByteBandit", points: 12850 },
                    { rank: 4, name: "RootKit", points: 11000 },
                    { rank: 5, name: "Ph3nix", points: 9500 },
                  ].map((player) => (
                    <div key={player.rank} className="flex items-center justify-between group cursor-default">
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-xs ${player.rank <= 3 ? 'text-yellow-500 font-bold' : 'text-muted-foreground'}`}>
                          #{player.rank}
                        </span>
                        <span className="font-mono text-sm text-white group-hover:text-[#FF3B3B] transition-colors">{player.name}</span>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{player.points.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                <button className="mt-8 w-full py-2 rounded border border-white/10 font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground hover:bg-white/5 hover:text-white transition-all">
                  View Full Leaderboard
                </button>
              </div>
            </Reveal>
          </aside>

        </div>
      </div>
      <Footer />
    </main>
  );
}
