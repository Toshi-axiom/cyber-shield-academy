import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Compass } from "lucide-react";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [{ title: "Guides — Vaelora Academy" }],
  }),
  component: Guides,
});

function Guides() {
  return (
    <main className="grain min-h-screen bg-[#0A0A0A] overflow-hidden">
      <div className="mx-auto max-w-[800px] px-6 py-24 relative z-10 text-center">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#FF3B3B] flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-[#FF3B3B]/40"></span>
            FIELD MANUALS
            <span className="w-8 h-[1px] bg-[#FF3B3B]/40"></span>
          </span>
          <h1 className="mt-6 font-orbitron text-4xl md:text-5xl text-foreground">
            Step-by-Step Guides
          </h1>
          <p className="mt-6 text-muted-foreground text-lg mb-12">
            Deep dives into specific tools, exploits, and defensive techniques.
          </p>
          <div className="p-12 rounded border border-white/10 bg-black/40 flex flex-col items-center">
            <Compass className="w-12 h-12 text-[#FF3B3B]/50 mb-4" />
            <h3 className="font-orbitron text-xl text-white mb-2">Guides offline</h3>
            <p className="text-muted-foreground text-sm">We are currently migrating our field manuals to the new platform.</p>
          </div>
        </Reveal>
      </div>
      <Footer />
    </main>
  );
}
