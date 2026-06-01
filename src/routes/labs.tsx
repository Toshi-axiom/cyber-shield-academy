import { createFileRoute, Link } from "@tanstack/react-router";
import { Terminal, FlaskConical, ArrowRight, ShieldAlert } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { phases } from "@/data/curriculum";
import { useProgress } from "@/hooks/useProgress";

export const Route = createFileRoute("/labs")({
  head: () => ({
    meta: [{ title: "Labs — Vaelora Live Training Environments" }],
  }),
  component: Labs,
});

function Labs() {
  const { isComplete } = useProgress();

  // Flatten all modules that have labs
  const allLabs = phases.flatMap((phase) => 
    phase.modules
      .filter((m) => m.lab)
      .map((m) => ({ phase, module: m }))
  );

  return (
    <main className="grain min-h-screen bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,207,255,0.05)_0%,_transparent_50%)] pointer-events-none" />
      
      <div className="mx-auto max-w-[1200px] px-6 py-20 relative z-10">
        <Reveal>
          <div className="flex flex-col items-start mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-info flex items-center gap-3">
              <span className="w-8 h-[1px] bg-info/40"></span>
              LIVE ENVIRONMENTS
            </span>
            <h1 className="mt-4 font-orbitron text-5xl tracking-wide text-foreground md:text-6xl drop-shadow-lg flex items-center gap-4">
              Tactical <span className="text-info">Labs</span>
              <FlaskConical className="w-10 h-10 text-info hidden md:block opacity-50" />
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl text-lg">
              Direct access to all {allLabs.length} interactive training environments. Theory is useless without execution. Break into these instances and prove your skills.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {allLabs.map(({ phase, module }, index) => {
            const completed = isComplete(module.id);
            
            return (
              <Reveal key={module.id} delay={index * 0.05}>
                <div className={`group relative flex flex-col justify-between h-full rounded border bg-black/40 backdrop-blur-sm p-6 transition-all ${completed ? 'border-green-500/30 hover:border-green-500/60 shadow-[0_0_15px_rgba(34,197,94,0.05)]' : 'border-white/10 hover:border-info/50 hover:shadow-[0_0_20px_rgba(0,207,255,0.1)]'}`}>
                  
                  {/* Background Accents */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded" />
                  <div className="absolute top-0 right-0 w-24 h-24 bg-info/5 blur-3xl rounded-full group-hover:bg-info/10 transition-colors pointer-events-none" />

                  {/* Header */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground bg-white/5 px-2 py-1 rounded">
                        {phase.code} // {module.code}
                      </span>
                      {completed && (
                        <span className="font-mono text-[0.55rem] uppercase tracking-wider text-green-500 flex items-center gap-1.5 border border-green-500/20 px-2 py-0.5 rounded bg-green-500/5">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                          Clear
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-foreground group-hover:text-white transition-colors">{module.lab!.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{module.lab!.description}</p>
                  </div>

                  {/* Footer */}
                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                      <Terminal className="w-3.5 h-3.5" />
                      {module.lab!.steps.length} Vectors
                    </div>
                    
                    <Link 
                      to="/lesson/$phaseId/$moduleId" 
                      params={{ phaseId: phase.id, moduleId: module.id }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-muted-foreground group-hover:bg-info group-hover:text-black group-hover:border-info transition-all cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}
