import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { CheckCircle2, Lock, ArrowRight, ShieldCheck, Cpu, Cloud, Database, Network, Globe, Smartphone, Brain, Activity, Terminal } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { phases, totalModules } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [{ title: "Roadmap — Vaelora Curriculum Timeline" }],
  }),
  component: Roadmap,
});

function Roadmap() {
  const { isComplete, progress } = useProgress();

  const getIconForPhase = (accent: string) => {
    switch (accent) {
      case "foundation": return <Network className="w-5 h-5" />;
      case "offense": return <Terminal className="w-5 h-5" />;
      case "defense": return <ShieldCheck className="w-5 h-5" />;
      case "cloud": return <Cloud className="w-5 h-5" />;
      case "ai": return <Brain className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getBorderColor = (accent: string) => {
    switch (accent) {
      case "foundation": return "border-blue-500/50";
      case "offense": return "border-[#FF5A1F]/50";
      case "defense": return "border-green-500/50";
      case "cloud": return "border-cyan-500/50";
      case "ai": return "border-purple-500/50";
      default: return "border-primary/50";
    }
  };
  
  const getGlowColor = (accent: string) => {
    switch (accent) {
      case "foundation": return "shadow-[0_0_15px_rgba(59,130,246,0.3)]";
      case "offense": return "shadow-[0_0_15px_rgba(255,90,31,0.3)]";
      case "defense": return "shadow-[0_0_15px_rgba(34,197,94,0.3)]";
      case "cloud": return "shadow-[0_0_15px_rgba(6,182,212,0.3)]";
      case "ai": return "shadow-[0_0_15px_rgba(168,85,247,0.3)]";
      default: return "shadow-[0_0_15px_rgba(255,107,0,0.3)]";
    }
  };

  const getTextColor = (accent: string) => {
    switch (accent) {
      case "foundation": return "text-blue-500";
      case "offense": return "text-[#FF5A1F]";
      case "defense": return "text-green-500";
      case "cloud": return "text-cyan-500";
      case "ai": return "text-purple-500";
      default: return "text-primary";
    }
  };

  return (
    <main className="grain min-h-screen bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,107,0,0.05)_0%,_transparent_50%)] pointer-events-none" />
      
      <div className="mx-auto max-w-[1000px] px-6 py-20 relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary flex items-center justify-center gap-3">
              <span className="w-12 h-[1px] bg-primary/40"></span>
              TACTICAL ROADMAP
              <span className="w-12 h-[1px] bg-primary/40"></span>
            </span>
            <h1 className="mt-4 font-orbitron text-5xl tracking-wide text-foreground md:text-6xl drop-shadow-lg">
              The Path to <span className="text-primary">Ascension</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Follow the strict progression sequence. Complete phases to unlock advanced modules. No skipping, no shortcuts.
            </p>
          </div>
        </Reveal>

        <div className="relative mt-20">
          {/* Main vertical timeline line */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10 -translate-x-1/2">
            <div 
              className="absolute top-0 left-0 w-full bg-primary shadow-[0_0_10px_#FF6B00]" 
              style={{ height: `${Math.min(((progress.completedModules.length) / totalModules()) * 100, 100)}%` }}
            />
          </div>

          <div className="space-y-12">
            {phases.map((phase, index) => {
              const isEven = index % 2 === 0;
              const phaseModules = phase.modules.length;
              const completedModules = phase.modules.filter(m => isComplete(m.id)).length;
              const isFullyComplete = completedModules === phaseModules;
              const isUnlocked = index === 0 || phases[index - 1].modules.every(m => isComplete(m.id));
              
              const accentBorder = getBorderColor(phase.accent);
              const accentGlow = getGlowColor(phase.accent);
              const accentText = getTextColor(phase.accent);

              return (
                <Reveal key={phase.id} delay={index * 0.1}>
                  <div className={`relative flex flex-col md:flex-row items-start md:items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* Center Node */}
                    <div className="absolute left-[28px] md:left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full border-2 bg-[#0A0A0A] z-10"
                         style={{ borderColor: isFullyComplete ? '#22c55e' : isUnlocked ? '#FF6B00' : '#333' }}>
                      {isFullyComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : !isUnlocked ? (
                        <Lock className="w-4 h-4 text-[#555]" />
                      ) : (
                        <div className={`w-3 h-3 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#FF6B00]`} />
                      )}
                    </div>

                    {/* Content Card */}
                    <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                      <div className={`relative p-6 rounded border bg-black/40 backdrop-blur-md transition-all ${isUnlocked ? `border-white/10 hover:${accentBorder} hover:${accentGlow}` : 'border-white/5 opacity-50 grayscale'}`}>
                        
                        <div className={`flex items-center gap-3 mb-2 ${isEven ? 'md:justify-end' : ''}`}>
                          <div className={`p-2 rounded bg-white/5 ${accentText}`}>
                            {getIconForPhase(phase.accent)}
                          </div>
                          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{phase.code}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-foreground tracking-wide">{phase.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{phase.tagline}</p>
                        
                        <div className="mt-6 flex flex-wrap gap-2">
                          {phase.modules.map(m => (
                            <div key={m.id} className={`w-2 h-2 rounded-full ${isComplete(m.id) ? 'bg-primary shadow-[0_0_5px_#FF6B00]' : 'bg-white/10'}`} title={m.title} />
                          ))}
                        </div>

                        {isUnlocked && (
                          <Link to="/courses" hash={phase.id} className={`mt-6 inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-widest ${accentText} hover:text-white transition-colors`}>
                            {isFullyComplete ? 'Review Phase' : 'Enter Phase'} <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                        
                        {/* Decorative corner */}
                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/10" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/10" />
                      </div>
                    </div>

                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
