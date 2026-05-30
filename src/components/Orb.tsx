import { cn } from "@/lib/utils";
import phoenix from "@/assets/phoenix_wireframe.png";

export function Orb({ 
  className, 
  size = 420,
  bootStage = 4
}: { 
  className?: string; 
  size?: number;
  bootStage?: number;
}) {
  return (
    <div
      className={cn("relative flex items-center justify-center select-none pointer-events-none", className)}
      style={{ width: size, height: size, perspective: 1200 }}
    >
      {/* Volumetric Outer Aura (Orange) - Fades in at stage 4 */}
      <div
        className="absolute inset-0 animate-orb-pulse rounded-full blur-3xl opacity-60 pointer-events-none transition-opacity duration-1000"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(255,107,0,0.25), rgba(255,107,0,0.05) 55%, transparent 75%)",
          opacity: bootStage >= 4 ? 0.6 : 0.15
        }}
      />

      {/* Holographic Scanning Grid Sphere */}
      <div
        className="absolute inset-[10%] rounded-full opacity-15 border border-primary/20 pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: "radial-gradient(circle, transparent 40%, rgba(255,107,0,0.15) 100%), linear-gradient(0deg, transparent 24%, rgba(255,107,0,0.05) 25%, rgba(255,107,0,0.05) 26%, transparent 27%, transparent 74%, rgba(255,107,0,0.05) 75%, rgba(255,107,0,0.05) 76%, transparent 77%), linear-gradient(90deg, transparent 24%, rgba(255,107,0,0.05) 25%, rgba(255,107,0,0.05) 26%, transparent 27%, transparent 74%, rgba(255,107,0,0.05) 75%, rgba(255,107,0,0.05) 76%, transparent 77%)",
          backgroundSize: "16px 16px",
          opacity: bootStage >= 1 ? 0.15 : 0
        }}
      />

      {/* Volumetric Core Glow behind the phoenix (Orange) */}
      <div 
        className="absolute w-[40%] h-[40%] rounded-full bg-primary/20 blur-2xl animate-pulse pointer-events-none transition-all duration-1000" 
        style={{
          opacity: bootStage >= 4 ? 1 : 0.2
        }}
      />

      {/* Holographic Scanning Line sweeping vertically - Active at boot stage 2+ */}
      {bootStage >= 2 && (
        <div className="absolute inset-[8%] overflow-hidden rounded-full border border-primary/10">
          <div 
            className="w-full h-[3px] bg-primary/80 shadow-[0_0_12px_#FF6B00] opacity-60 absolute"
            style={{
              animation: "hologram-sweep 5s linear infinite",
              top: 0
            }}
          />
        </div>
      )}

      {/* Core Flash/Pulse on complete boot */}
      {bootStage === 4 && (
        <div className="absolute inset-0 rounded-full animate-core-flash pointer-events-none z-30" />
      )}

      {/* The Phoenix Hologram Core (No box visible - Screen blended & processed) */}
      <div 
        className="absolute w-[78%] h-[78%] z-10 flex items-center justify-center transition-all duration-1000 ease-out"
        style={{
          transform: bootStage >= 4 ? "scale(1)" : "scale(0.82)",
          opacity: bootStage >= 4 ? 0.95 : 0.2,
          mixBlendMode: "screen"
        }}
      >
        <div 
          className={cn("w-full h-full flex items-center justify-center", bootStage >= 4 ? "animate-float-slow" : "animate-pulse")}
          style={{ mixBlendMode: "screen" }}
        >
          <img
            src={phoenix}
            alt="Phoenix Core"
            className="w-full h-full object-contain filter drop-shadow-[0_0_45px_rgba(255,107,0,0.95)] brightness-[1.05] contrast-[1.25]"
            style={{
              mixBlendMode: "screen", // Eliminate square boundary by filtering absolute black
              filter: "contrast(1.25) brightness(1.05) drop-shadow(0 0 45px rgba(255,107,0,0.95))"
            }}
          />
        </div>
      </div>

      {/* Advanced HUD Ring Layers - SVG-driven for high fidelity */}
      <svg className="absolute inset-0 w-full h-full z-20 pointer-events-none" viewBox="0 0 400 400">
        {/* Layer 1: Outer HUD Compass Ring (Slow Rotation) */}
        <g 
          className="animate-spin-slow origin-center transition-opacity duration-700" 
          style={{ 
            animationDuration: "40s",
            opacity: bootStage >= 1 ? 1 : 0
          }}
        >
          {/* Main Ring */}
          <circle cx="200" cy="200" r="195" fill="none" stroke="rgba(255, 107, 0, 0.15)" strokeWidth="1" />
          <circle cx="200" cy="200" r="195" fill="none" stroke="rgba(255, 107, 0, 0.4)" strokeWidth="1.5" strokeDasharray="15, 30, 5, 10, 45, 15" />
          <circle cx="200" cy="200" r="198" fill="none" stroke="rgba(255, 107, 0, 0.12)" strokeWidth="1" />
          
          {/* Compass Ticks */}
          <line x1="200" y1="12" x2="200" y2="20" stroke="rgba(255, 107, 0, 0.8)" strokeWidth="2" />
          <line x1="200" y1="380" x2="200" y2="388" stroke="rgba(255, 107, 0, 0.8)" strokeWidth="2" />
          <line x1="12" y1="200" x2="20" y2="200" stroke="rgba(255, 107, 0, 0.8)" strokeWidth="2" />
          <line x1="380" y1="200" x2="388" y2="200" stroke="rgba(255, 107, 0, 0.8)" strokeWidth="2" />

          <text x="200" y="32" fill="rgba(255, 107, 0, 0.6)" fontSize="7" fontFamily="monospace" textAnchor="middle" letterSpacing="1">N 00°</text>
          <text x="200" y="375" fill="rgba(255, 107, 0, 0.6)" fontSize="7" fontFamily="monospace" textAnchor="middle" letterSpacing="1">S 180°</text>
          <text x="362" y="202" fill="rgba(255, 107, 0, 0.6)" fontSize="7" fontFamily="monospace" textAnchor="middle" letterSpacing="1">E 90°</text>
          <text x="38" y="202" fill="rgba(255, 107, 0, 0.6)" fontSize="7" fontFamily="monospace" textAnchor="middle" letterSpacing="1">W 270°</text>
        </g>

        {/* Layer 2: Middle Dashed Target Ring (Counter-Rotation) */}
        <g 
          className="animate-spin-slow origin-center transition-opacity duration-700" 
          style={{ 
            animationDuration: "25s", 
            animationDirection: "reverse",
            opacity: bootStage >= 2 ? 1 : 0
          }}
        >
          <circle cx="200" cy="200" r="160" fill="none" stroke="rgba(255, 107, 0, 0.2)" strokeWidth="1" strokeDasharray="4, 12" />
          <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(245, 245, 245, 0.15)" strokeWidth="0.8" />
          
          {/* Diagonal Ticks */}
          <line x1="68" y1="68" x2="76" y2="76" stroke="rgba(245, 245, 245, 0.4)" strokeWidth="1" />
          <line x1="332" y1="332" x2="324" y2="324" stroke="rgba(245, 245, 245, 0.4)" strokeWidth="1" />
          <line x1="332" y1="68" x2="324" y2="76" stroke="rgba(245, 245, 245, 0.4)" strokeWidth="1" />
          <line x1="68" y1="332" x2="76" y2="324" stroke="rgba(245, 245, 245, 0.4)" strokeWidth="1" />
        </g>

        {/* Layer 3: Inner Diagnostic Tech HUD (Fast Rotation) */}
        <g 
          className="animate-spin-slow origin-center transition-opacity duration-700" 
          style={{ 
            animationDuration: "15s",
            opacity: bootStage >= 3 ? 1 : 0
          }}
        >
          <circle cx="200" cy="200" r="130" fill="none" stroke="rgba(0, 170, 255, 0.3)" strokeWidth="1" strokeDasharray="30, 10, 80, 20" />
          <path d="M 200 66 L 205 70 L 195 70 Z" fill="rgba(0, 170, 255, 0.6)" />
          <path d="M 200 334 L 205 330 L 195 330 Z" fill="rgba(0, 170, 255, 0.6)" />
        </g>

        {/* Layer 4: Target Crosshair Lines */}
        <line x1="200" y1="40" x2="200" y2="120" stroke="rgba(255, 107, 0, 0.12)" strokeWidth="1" />
        <line x1="200" y1="280" x2="200" y2="360" stroke="rgba(255, 107, 0, 0.12)" strokeWidth="1" />
        <line x1="40" y1="200" x2="120" y2="200" stroke="rgba(255, 107, 0, 0.12)" strokeWidth="1" />
        <line x1="280" y1="200" x2="360" y2="200" stroke="rgba(255, 107, 0, 0.12)" strokeWidth="1" />

        <circle cx="200" cy="200" r="122" fill="none" stroke="rgba(255, 107, 0, 0.05)" />

        {/* Large outer diagnostic orbits extending beyond standard HUD boundaries */}
        <circle cx="200" cy="200" r="215" fill="none" stroke="rgba(255, 107, 0, 0.05)" strokeWidth="0.8" strokeDasharray="4, 16" />
        <circle cx="200" cy="200" r="230" fill="none" stroke="rgba(255, 107, 0, 0.03)" strokeWidth="1.2" strokeDasharray="40, 180" className="animate-spin-slow origin-center" style={{ animationDuration: "50s" }} />
        <circle cx="200" cy="200" r="245" fill="none" stroke="rgba(0, 170, 255, 0.02)" strokeWidth="1" strokeDasharray="100, 200" className="animate-spin-slow origin-center" style={{ animationDuration: "35s", animationDirection: "reverse" }} />
      </svg>

      {/* Cyber Telemetry Metrics Overlaid on the HUD */}
      <div 
        className="absolute top-[12%] left-[-4%] font-mono text-[0.55rem] text-primary/80 tracking-wider flex flex-col gap-0.5 pointer-events-none select-none z-30 transition-all duration-700"
        style={{ opacity: bootStage >= 2 ? 1 : 0 }}
      >
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 bg-primary rounded-full animate-ping" />
          <span>PHOENIX_CORE: ACTIVE</span>
        </span>
        <span className="text-[#A0A0A0]/60">VAL: 0x9F4C2A</span>
      </div>

      <div 
        className="absolute bottom-[12%] right-[-4%] font-mono text-[0.55rem] text-[#F5F5F5]/85 tracking-wider flex flex-col items-end gap-0.5 pointer-events-none select-none z-30 transition-all duration-700"
        style={{ opacity: bootStage >= 2 ? 1 : 0 }}
      >
        <span>SYS_POWER: 100%</span>
        <span className="text-[#A0A0A0]/60">TEMP: 38.4°C</span>
      </div>

      <div 
        className="absolute top-[22%] right-[-8%] font-mono text-[0.5rem] text-info/85 tracking-widest pointer-events-none select-none hidden sm:flex flex-col gap-0.5 z-30 transition-all duration-700"
        style={{ opacity: bootStage >= 3 ? 1 : 0 }}
      >
        <span>DATA_CONNECT: 12ms</span>
        <span className="text-info/50">SECURE: IPSEC_AES256</span>
      </div>

      <div 
        className="absolute bottom-[22%] left-[-8%] font-mono text-[0.5rem] text-info/85 tracking-widest pointer-events-none select-none hidden sm:flex flex-col gap-0.5 z-30 transition-all duration-700"
        style={{ opacity: bootStage >= 3 ? 1 : 0 }}
      >
        <span>INTELLIGENCE: v4.2.8</span>
        <span className="text-info/50">STATUS: REBIRTH_ONLINE</span>
      </div>

      {/* Style block for animations */}
      <style>{`
        @keyframes hologram-sweep {
          0% { top: 8%; opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { top: 88%; opacity: 0; }
        }
        @keyframes core-flash {
          0% { transform: scale(0.6); opacity: 1; background: radial-gradient(circle, rgba(255,107,0,0.85) 0%, transparent 60%); }
          100% { transform: scale(1.6); opacity: 0; background: radial-gradient(circle, rgba(255,107,0,0) 0%, transparent 100%); }
        }
        .animate-core-flash {
          animation: core-flash 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
