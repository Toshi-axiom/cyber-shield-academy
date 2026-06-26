import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Shield, Target, Zap } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [{ title: "About Us — Vaelora Academy" }],
  }),
  component: About,
});

function About() {
  return (
    <main className="grain min-h-screen bg-[#0A0A0A] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,59,59,0.05)_0%,_transparent_50%)] pointer-events-none" />
      
      <div className="mx-auto max-w-[1000px] px-6 py-24 relative z-10">
        <Reveal>
          <div className="flex flex-col items-center text-center mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#FF3B3B] flex items-center justify-center gap-3">
              <span className="w-8 h-[1px] bg-[#FF3B3B]/40"></span>
              OUR MISSION
              <span className="w-8 h-[1px] bg-[#FF3B3B]/40"></span>
            </span>
            <h1 className="mt-6 font-orbitron text-5xl md:text-6xl text-foreground drop-shadow-lg">
              Forging The <span className="text-[#FF3B3B]">Vanguard</span>
            </h1>
            <p className="mt-6 text-muted-foreground max-w-2xl text-lg leading-relaxed">
              Vaelora Academy was built to bridge the gap between theoretical knowledge and practical execution in cybersecurity. We don't just teach concepts; we forge elite operators capable of defending the next generation of enterprise infrastructure.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3 mb-24">
          <Reveal delay={0.1}>
            <div className="flex flex-col items-center text-center p-8 rounded border border-white/10 bg-black/40 backdrop-blur-sm">
              <div className="p-4 rounded-full bg-[#FF3B3B]/10 mb-6 text-[#FF3B3B]">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="font-orbitron text-xl text-white mb-3">Integrity</h3>
              <p className="text-muted-foreground text-sm">We believe in ethical disclosure and responsible operations. Our training emphasizes building defenses that withstand the test of time.</p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col items-center text-center p-8 rounded border border-white/10 bg-black/40 backdrop-blur-sm">
              <div className="p-4 rounded-full bg-[#FF3B3B]/10 mb-6 text-[#FF3B3B]">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="font-orbitron text-xl text-white mb-3">Intelligence</h3>
              <p className="text-muted-foreground text-sm">Staying ahead of the adversary requires continuous learning. Our curriculum evolves constantly with the threat landscape.</p>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex flex-col items-center text-center p-8 rounded border border-white/10 bg-black/40 backdrop-blur-sm">
              <div className="p-4 rounded-full bg-[#FF3B3B]/10 mb-6 text-[#FF3B3B]">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="font-orbitron text-xl text-white mb-3">Impact</h3>
              <p className="text-muted-foreground text-sm">Theory without execution is useless. We focus heavily on tactical labs, live environments, and real-world scenarios.</p>
            </div>
          </Reveal>
        </div>

      </div>
      <Footer />
    </main>
  );
}
