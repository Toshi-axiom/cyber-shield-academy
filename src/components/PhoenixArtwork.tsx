import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { EmberSparks } from "./EmberSparks";
import phoenixBg from "@/assets/phoenix_cinematic.png";

export function PhoenixArtwork() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const yHUD = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);

  return (
    <div ref={ref} className="absolute inset-0 w-full h-[110vh] overflow-hidden pointer-events-none select-none z-0">
      
      {/* Layer 2: 16:9 Phoenix Artwork with Parallax */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          backgroundImage: `url('${phoenixBg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          y: yBackground,
          WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 75% 50%, black 40%, transparent 100%)",
          maskImage: "radial-gradient(ellipse 70% 80% at 75% 50%, black 40%, transparent 100%)"
        }}
      />

      {/* Layer 3: Gradient Blend Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent w-[55%] z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,_rgba(255,90,31,0.08),_transparent_60%)] z-10 animate-pulse mix-blend-screen" />

      {/* Layer 5: Lightweight Motion Effects */}
      <div className="absolute inset-0 z-10" style={{ maskImage: "radial-gradient(ellipse 60% 60% at 75% 50%, black 40%, transparent 100%)", WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 75% 50%, black 40%, transparent 100%)" }}>
        <EmberSparks />
      </div>

      {/* Layer 4: HUD SVG Graphics */}
      <motion.div 
        className="absolute inset-0 z-20 flex items-center justify-center mix-blend-screen opacity-70"
        style={{ y: yHUD }}
      >
        <div className="absolute right-[-5%] lg:right-[5%] top-[50%] -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px]">
           {/* HUD Elements */}
           <svg className="absolute inset-0 w-full h-full animate-spin-slow opacity-30" viewBox="0 0 400 400" style={{ animationDuration: '60s' }}>
             <circle cx="200" cy="200" r="180" fill="none" stroke="var(--color-info)" strokeWidth="1" strokeDasharray="4 12" />
             <circle cx="200" cy="200" r="195" fill="none" stroke="var(--color-info)" strokeWidth="0.5" />
             <path d="M 200 10 L 200 30 M 200 370 L 200 390 M 10 200 L 30 200 M 370 200 L 390 200" stroke="var(--color-info)" strokeWidth="1" />
           </svg>
           {/* Additional non-rotating HUD */}
           <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 400">
             <circle cx="200" cy="200" r="160" fill="none" stroke="var(--color-primary)" strokeWidth="1" />
             <circle cx="200" cy="200" r="140" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeDasharray="40 100" />
             {/* Crosshairs */}
             <path d="M 200 180 L 200 220 M 180 200 L 220 200" stroke="var(--color-primary)" strokeWidth="0.5" />
             <path d="M 120 120 L 125 120 M 120 120 L 120 125 M 280 120 L 275 120 M 280 120 L 280 125 M 120 280 L 125 280 M 120 280 L 120 275 M 280 280 L 275 280 M 280 280 L 280 275" stroke="var(--color-info)" strokeWidth="1" />
           </svg>
           
           <div className="absolute top-[20%] left-[15%] font-mono text-[0.55rem] text-[#00CFFF]/80 tracking-widest bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-[#00CFFF]/20">
             <div className="animate-pulse">SYS.OP.01 // SECURE</div>
             <div className="text-[#00CFFF]/50">COORD: 84.992.11</div>
           </div>
           
           <div className="absolute bottom-[20%] right-[15%] font-mono text-[0.55rem] text-[#FF5A1F]/80 tracking-widest text-right bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-[#FF5A1F]/20">
             <div className="flex items-center gap-2 justify-end">
                <span className="w-1.5 h-1.5 bg-[#FF5A1F] rounded-full animate-ping" />
                PHX.CORE.ACTIVE
             </div>
             <div className="text-[#FF5A1F]/50">TEMP: NOMINAL</div>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
