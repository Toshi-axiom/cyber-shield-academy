import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { 
  ArrowRight, 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Cloud, 
  Brain, 
  Globe, 
  Lock, 
  Activity, 
  Compass, 
  ChevronRight,
  Flame,
  Binary,
  Layers,
  Radio,
  Play
} from "lucide-react";
import { Orb } from "@/components/Orb";
import { Reveal } from "@/components/Reveal";
import { Footer } from "@/components/Footer";
import { EmberSparks } from "@/components/EmberSparks";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import systemGateway from "@/assets/system_gateway.png";
import logo from "@/assets/vaelora-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vaelora — Cybersecurity & Technology Mastery System" },
      { name: "description", content: "Enter the Vaelora intelligence system. An advanced, free, hands-on intelligence ecosystem for cybersecurity, programming, AI, and cloud technology explorers." },
      { property: "og:title", content: "Vaelora — Advanced Cybersecurity Intelligence System" },
      { property: "og:description", content: "An advanced, hands-on cybersecurity intelligence ecosystem powered by the Phoenix. Free, secure, and built for agents of the AI era." },
    ],
  }),
  component: Index,
});

function Index() {
  const { user } = useAuth();
  const { progress } = useProgress();

  const [bootStage, setBootStage] = useState(0);
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [showAiNotice, setShowAiNotice] = useState(false);
  
  const [bootOverlayStage, setBootOverlayStage] = useState(0);
  const [showBootOverlay, setShowBootOverlay] = useState(true);

  // Simulation of Operating System boot sequences post-preloader
  useEffect(() => {
    const initTimeout = setTimeout(() => {
      setBootStage(1);
      setBootLogs((prev) => [...prev, "INITIALIZING FIREWALL DEFENSES..."]);
    }, 1800);

    const stage2Timeout = setTimeout(() => {
      setBootStage(2);
      setBootLogs((prev) => [...prev, "ESTABLISHING SHIELD INTEGRATION..."]);
    }, 2800);

    const stage3Timeout = setTimeout(() => {
      setBootStage(3);
      setBootLogs((prev) => [...prev, "PHOENIX CORE CONNECTED // LOADING DATA..."]);
    }, 3800);

    const stage4Timeout = setTimeout(() => {
      setBootStage(4);
      setBootLogs((prev) => [...prev, "SYSTEM ONLINE // CHANNELS SECURED."]);
    }, 4800);

    return () => {
      clearTimeout(initTimeout);
      clearTimeout(stage2Timeout);
      clearTimeout(stage3Timeout);
      clearTimeout(stage4Timeout);
    };
  }, []);

  // Post-preloader boot screen sequence
  useEffect(() => {
    // Lock scroll on index mount if overlay is visible
    document.body.style.overflow = "hidden";

    const t1 = setTimeout(() => setBootOverlayStage(1), 1000);
    const t2 = setTimeout(() => setBootOverlayStage(2), 2000);
    const t3 = setTimeout(() => setBootOverlayStage(3), 3000);
    const t4 = setTimeout(() => setBootOverlayStage(4), 4000);
    const t5 = setTimeout(() => {
      setShowBootOverlay(false);
      document.body.style.overflow = "";
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      document.body.style.overflow = "";
    };
  }, []);

  const completedCount = progress?.completedModules?.length ?? 0;
  let rankTitle = "Rising Explorer";
  let rankNum = 14;
  let progressVal = 7250;
  let maxProgress = 12000;
  let activeLogs = [
    { name: "SQL Injection Lab", status: "Completed", points: "+250 Progress" },
    { name: "Burp Suite Basics", status: "Completed", points: "+200 Progress" },
    { name: "Linux Fundamentals", status: "In Progress", points: "+150 Progress" },
    { name: "XSS Challenge", status: "Completed", points: "+300 Progress" }
  ];

  if (user) {
    rankNum = Math.floor((progress?.xp ?? 0) / 100) + 1;
    progressVal = (progress?.xp ?? 0) % 100;
    maxProgress = 100;
    
    if (completedCount === 0) {
      rankTitle = "Initiate Explorer";
    } else if (completedCount <= 2) {
      rankTitle = "Active Operative";
    } else if (completedCount <= 6) {
      rankTitle = "Senior Scholar";
    } else {
      rankTitle = "Ascendant Scholar";
    }

    activeLogs = progress.completedModules.slice(-4).map((mId) => ({
      name: mId.toUpperCase().replace("-", " "),
      status: "Completed",
      points: "+50 Progress"
    }));
    
    if (activeLogs.length < 4) {
      const fillers = [
        { name: "System Boot Diagnostics", status: "Completed", points: "+100 Progress" },
        { name: "Sandbox Handshake Check", status: "Completed", points: "+50 Progress" },
        { name: "Agent Credential Match", status: "Completed", points: "+50 Progress" }
      ];
      activeLogs = [...activeLogs, ...fillers].slice(0, 4);
    }
  }

  // 6 Domain configuration
  const domains = [
    {
      title: "Cyber Security",
      desc: "Hunt vulnerabilities. Protect systems.",
      paths: "32 Paths",
      icon: ShieldCheck,
      color: "red",
      hash: "soc"
    },
    {
      title: "Penetration Testing",
      desc: "Build & secure. Break & secure.",
      paths: "24 Paths",
      icon: Terminal,
      color: "orange",
      hash: "offense-fundamentals"
    },
    {
      title: "Web Development",
      desc: "Build modern web apps. From zero to pro.",
      paths: "28 Paths",
      icon: Globe,
      color: "blue",
      hash: "web"
    },
    {
      title: "Programming",
      desc: "Master code. Solve real problems.",
      paths: "36 Paths",
      icon: Cpu,
      color: "light-blue",
      hash: "foundations"
    },
    {
      title: "AI & Machine Learning",
      desc: "Build intelligent systems. Shape the future.",
      paths: "18 Paths",
      icon: Brain,
      color: "purple-blue",
      hash: "ai-security"
    },
    {
      title: "Cloud & DevOps",
      desc: "Deploy. Scale. Automate everything.",
      paths: "22 Paths",
      icon: Cloud,
      color: "blue-cyan",
      hash: "cloud"
    }
  ];

  return (
    <main className="grain relative overflow-hidden bg-[#0A0A0A] text-[#F5F5F5] min-h-screen">
      
      <AnimatePresence>
        {showBootOverlay && (
          <motion.div
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#0A0A0A] font-mono text-[#F5F5F5] select-none"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {/* Cyber background grid */}
            <div 
              className="absolute inset-0 z-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255, 107, 0, 0.08) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 107, 0, 0.08) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px"
              }}
            />
            {/* Scanning line animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
              <div 
                className="w-full h-[2px] bg-primary/40 shadow-[0_0_10px_#FF6B00] opacity-40 absolute"
                style={{
                  animation: "hologram-sweep 4s linear infinite",
                  top: 0
                }}
              />
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-6">
              {/* Concentric rotating radar graphics */}
              <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border border-primary/20 border-dashed animate-spin-slow" style={{ animationDuration: "25s" }} />
                {/* Middle ring */}
                <div className="absolute inset-4 rounded-full border border-info/20 animate-spin-slow" style={{ animationDuration: "15s", animationDirection: "reverse" }} />
                {/* Inner target ring */}
                <div className="absolute inset-8 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5 shadow-[0_0_20px_rgba(255,107,0,0.1)]">
                  <span className="h-4 w-4 bg-primary rounded-full animate-ping" />
                </div>
                
                {/* Core label */}
                <div className="absolute -bottom-2 font-mono text-[0.6rem] text-primary/80 tracking-[0.25em] bg-[#0A0A0A] px-2.5 py-0.5 border border-primary/20 rounded">
                  SYS_INIT: PHOENIX
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-64 h-[2px] bg-muted/20 border border-white/5 rounded-full overflow-hidden mb-8 relative">
                <motion.div 
                  className="h-full bg-primary shadow-[0_0_12px_#FF6B00]"
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: 
                      bootOverlayStage === 0 ? "10%" :
                      bootOverlayStage === 1 ? "35%" :
                      bootOverlayStage === 2 ? "60%" :
                      bootOverlayStage === 3 ? "85%" : "100%"
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>

              {/* Sequential diagnostics list */}
              <div className="w-80 space-y-2 border border-primary/10 bg-black/60 p-5 rounded font-mono text-xs text-[#A0A0A0] relative">
                {/* Corner crosshairs decoration */}
                <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-primary/30" />
                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-primary/30" />
                
                <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-2">
                  <span className="text-[0.6rem] text-primary/80 tracking-widest uppercase font-bold">SYSTEM BOOT DIAGNOSTICS</span>
                  <span className="text-[0.6rem] text-[#F5F5F5]/40">{bootOverlayStage * 25}%</span>
                </div>

                <div className="space-y-1.5 text-[0.7rem]">
                  <div className="flex items-center gap-2 transition-all duration-300">
                    {bootOverlayStage >= 1 ? (
                      <>
                        <span className="text-primary font-bold">✓</span>
                        <span className="text-[#F5F5F5]">PHOENIX CORE ONLINE</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[#A0A0A0]/30 animate-pulse">■</span>
                        <span className="text-[#A0A0A0]/30">STANDBY // PHOENIX CORE</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 transition-all duration-300">
                    {bootOverlayStage >= 2 ? (
                      <>
                        <span className="text-primary font-bold">✓</span>
                        <span className="text-[#F5F5F5]">INITIALIZING NEURAL CHANNELS</span>
                      </>
                    ) : bootOverlayStage === 1 ? (
                      <>
                        <span className="text-info animate-ping">▶</span>
                        <span className="text-info font-medium">INITIALIZING NEURAL CHANNELS...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[#A0A0A0]/30">■</span>
                        <span className="text-[#A0A0A0]/30">STANDBY // NEURAL CHANNELS</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 transition-all duration-300">
                    {bootOverlayStage >= 3 ? (
                      <>
                        <span className="text-primary font-bold">✓</span>
                        <span className="text-[#F5F5F5]">ESTABLISHING SECURE LINKS</span>
                      </>
                    ) : bootOverlayStage === 2 ? (
                      <>
                        <span className="text-info animate-ping">▶</span>
                        <span className="text-info font-medium">ESTABLISHING SECURE LINKS...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[#A0A0A0]/30">■</span>
                        <span className="text-[#A0A0A0]/30">STANDBY // SECURE LINKS</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 transition-all duration-300">
                    {bootOverlayStage >= 4 ? (
                      <>
                        <span className="text-primary font-bold">✓</span>
                        <span className="text-primary font-bold">INTELLIGENCE LAYER ACTIVE</span>
                      </>
                    ) : bootOverlayStage === 3 ? (
                      <>
                        <span className="text-info animate-ping">▶</span>
                        <span className="text-info font-medium">INTELLIGENCE LAYER ACTIVE...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[#A0A0A0]/30">■</span>
                        <span className="text-[#A0A0A0]/30">STANDBY // INTELLIGENCE LAYER</span>
                      </>
                    )}
                  </div>
                </div>

                {bootOverlayStage < 4 && (
                  <div className="mt-3 border-t border-border/40 pt-2 flex items-center justify-between text-[0.65rem] text-[#A0A0A0]/40">
                    <span>LOADING PROTOCOLS...</span>
                    <span className="h-1.5 w-1.5 bg-primary rounded-full animate-ping" />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Cyber Grid Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 107, 0, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 107, 0, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 50%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 50%, transparent 90%)"
        }}
      />

      {/* Cyber City Blueprint Silhouette Backdrop */}
      <div className="absolute inset-x-0 bottom-0 top-[25%] pointer-events-none opacity-[0.05] z-0 overflow-hidden flex items-end justify-center">
        <svg className="w-full max-w-[1400px] h-[55%] text-primary" viewBox="0 0 1200 400" fill="none">
          <path d="M 0 400 L 0 350 L 40 350 L 40 280 L 100 280 L 100 370 L 140 370 L 140 220 L 220 220 L 220 310 L 250 310 L 250 250 L 320 250 L 320 400" stroke="currentColor" strokeWidth="1" strokeDasharray="4,4" />
          <path d="M 320 400 L 320 300 L 370 300 L 370 180 L 420 180 L 420 350 L 490 350 L 490 120 L 580 120 L 580 280 L 630 280 L 630 210 L 700 210 L 700 400" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 700 400 L 700 290 L 760 290 L 760 230 L 840 230 L 840 310 L 890 310 L 890 150 L 980 150 L 980 290 L 1050 290 L 1050 340 L 1120 340 L 1120 240 L 1200 240 L 1200 400" stroke="currentColor" strokeWidth="1" strokeDasharray="5,2" />
          
          <line x1="220" y1="220" x2="220" y2="40" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,5" />
          <circle cx="220" cy="40" r="3" fill="currentColor" />
          <line x1="535" y1="120" x2="535" y2="20" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,5" />
          <circle cx="535" cy="20" r="3.5" fill="currentColor" className="animate-pulse" />
          <line x1="935" y1="150" x2="935" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,5" />
          <circle cx="935" cy="50" r="3" fill="currentColor" />
          
          <path d="M 220 40 L 535 20 L 935 50" stroke="rgba(255,107,0,0.35)" strokeWidth="0.8" />
        </svg>
      </div>

      {/* Repeating linear gradient background overlay (skyline/grid overlay scan lines) */}
      <div 
        className="pointer-events-none absolute inset-0 z-1 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255, 107, 0, 0.03) 0px, rgba(255, 107, 0, 0.03) 1px, transparent 1px, transparent 4px)",
        }}
      />

      <EmberSparks />

      {/* HERO SECTION */}
      <section className="relative min-h-[110vh] flex items-center pt-20 pb-24 overflow-hidden z-10">
        
        {/* HUD margin lines */}
        <div className="absolute top-20 left-6 bottom-6 w-[1px] bg-primary/10 hidden xl:block">
          <div className="absolute top-0 left-0 w-3 h-[1px] bg-primary/30" />
          <div className="absolute bottom-0 left-0 w-3 h-[1px] bg-primary/30" />
          <div className="absolute top-1/2 left-0 -translate-y-1/2 font-mono text-[0.45rem] tracking-[0.25em] text-[#A0A0A0]/45 rotate-270 origin-left">
            SEC_GRID_ESTABLISHED // NODE_ONLINE
          </div>
        </div>
        <div className="absolute top-20 right-6 bottom-6 w-[1px] bg-primary/10 hidden xl:block">
          <div className="absolute top-0 right-0 w-3 h-[1px] bg-primary/30" />
          <div className="absolute bottom-0 right-0 w-3 h-[1px] bg-primary/30" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 font-mono text-[0.45rem] tracking-[0.25em] text-[#A0A0A0]/45 -rotate-270 origin-right">
            PHOENIX_INTELLIGENCE // PORT_LINK
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] w-full px-6 grid grid-cols-1 items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] relative">
          
          {/* Dynamic connecting data streams */}
          <div className="absolute inset-y-0 left-[41%] right-[44%] pointer-events-none hidden lg:block z-0 flex items-center">
            <svg className="w-full h-44 text-primary" viewBox="0 0 200 100" preserveAspectRatio="none">
              <path 
                d="M 0 30 H 70 Q 140 30 170 48" 
                fill="none" 
                stroke="rgba(255, 107, 0, 0.15)" 
                strokeWidth="1" 
                className="transition-opacity duration-1000"
                style={{ opacity: bootStage >= 2 ? 1 : 0 }}
              />
              <path 
                d="M 0 30 H 70 Q 140 30 170 48" 
                fill="none" 
                stroke="#FF6B00" 
                strokeWidth="1.5" 
                strokeDasharray="10, 30" 
                style={{ 
                  opacity: bootStage >= 3 ? 0.85 : 0,
                  animation: "dash-pulse 3.5s linear infinite"
                }}
              />
              <path 
                d="M 0 70 H 95 Q 135 70 170 52" 
                fill="none" 
                stroke="rgba(0, 170, 255, 0.12)" 
                strokeWidth="0.8" 
                className="transition-opacity duration-1000"
                style={{ opacity: bootStage >= 3 ? 1 : 0 }}
              />
              <path 
                d="M 0 70 H 95 Q 135 70 170 52" 
                fill="none" 
                stroke="#00AAFF" 
                strokeWidth="1.2" 
                strokeDasharray="6, 25" 
                style={{ 
                  opacity: bootStage >= 4 ? 0.7 : 0,
                  animation: "dash-pulse-reverse 4.5s linear infinite"
                }}
              />
            </svg>
          </div>

          {/* Left Column: Brand HUD */}
          <div className="relative z-10 flex flex-col items-start">
            
            {/* HUD Status Header */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 border border-primary/20 bg-black/40 px-3 py-1.5 rounded-sm font-mono text-[0.55rem] tracking-[0.25em] text-[#A0A0A0] mb-6"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              <span className="text-primary font-bold">SYSTEM ACTIVE</span>
              <span className="text-[#A0A0A0]/40">|</span>
              <span>HOST: 0xFD91A</span>
              <span className="text-[#A0A0A0]/40">|</span>
              <span className="text-info font-medium">NEURAL OK</span>
            </motion.div>

            {/* Title exact copy / font style */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[clamp(5rem,11vw,9rem)] leading-none tracking-[0.25em] text-[#F5F5F5] font-bold select-none"
            >
              VAELOR<span className="text-primary">A</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-3 font-mono text-xs sm:text-sm tracking-[0.22em] uppercase text-[#F5F5F5] font-bold"
            >
              LEARN. HACK. BUILD. <span className="text-primary animate-pulse">ASCEND.</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 max-w-lg text-sm font-light leading-relaxed text-[#A0A0A0] tracking-wide"
            >
              The advanced intelligence ecosystem for cybersecurity and technology explorers.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-2 max-w-lg text-xs leading-relaxed text-[#A0A0A0]/60 font-mono uppercase tracking-widest"
            >
              Powered by AI. Driven by curiosity.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                to={user ? "/dashboard" : "/auth"}
                className="relative inline-flex items-center gap-2.5 rounded border border-primary bg-black/40 px-6 py-3.5 font-mono text-[0.7rem] uppercase tracking-widest font-bold text-[#F5F5F5] transition-all hover:bg-primary hover:text-[#0A0A0A] hover:shadow-[0_0_20px_rgba(255,107,0,0.35)] cursor-pointer"
              >
                ENTER THE SYSTEM <ArrowRight className="h-3.5 w-3.5 text-primary" />
              </Link>
              
              <Link
                to="/courses"
                className="relative inline-flex items-center gap-2.5 px-6 py-3.5 font-mono text-[0.7rem] uppercase tracking-widest font-bold text-[#F5F5F5] hover:text-primary transition-colors cursor-pointer group"
              >
                <span className="p-1 rounded-full border border-[#F5F5F5]/30 flex items-center justify-center text-primary bg-black/20">
                  <Play className="w-3.5 h-3.5 fill-primary text-primary" />
                </span>
                EXPLORE ACADEMY
              </Link>
            </motion.div>

            {/* Trusted explorers info bubble */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-10 flex items-center gap-4 border-t border-border/30 pt-6 max-w-sm w-full font-mono"
            >
              <div className="flex -space-x-2 shrink-0">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border border-background bg-zinc-800 flex items-center justify-center text-[0.6rem] font-bold text-primary"
                    style={{ 
                      backgroundImage: `linear-gradient(135deg, #111111, #1A1A1A)`, 
                      boxShadow: `0 0 8px rgba(255,107,0,0.05)`,
                      opacity: 1 - i * 0.1
                    }}
                  >
                    0{i+1}
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[0.55rem] text-[#A0A0A0]/60 uppercase tracking-widest">TRUSTED BY EXPLORERS WORLDWIDE</span>
                <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider mt-0.5">
                  +12.8K <span className="text-[#F5F5F5] font-normal text-[0.65rem]">Operatives Connected</span>
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Holographic Phoenix Reactor (Centralized) */}
          <div className="relative flex items-center justify-center min-h-[460px]">
            {/* Cinematic Gradient Radial Glow Field */}
            <div 
              className="absolute pointer-events-none w-[900px] h-[900px] rounded-full blur-3xl opacity-35 z-0"
              style={{
                background: "radial-gradient(circle, rgba(255, 107, 0, 0.35) 0%, rgba(255, 107, 0, 0.05) 50%, transparent 70%)"
              }}
            />

            {/* Surrounding concentric orbits */}
            <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
              <div className="w-[490px] h-[490px] rounded-full border border-[#FF6B00]/5 absolute animate-spin-slow" style={{ animationDuration: "60s" }} />
              <div className="w-[450px] h-[450px] rounded-full border border-dashed border-[#FF6B00]/5 absolute animate-spin-slow" style={{ animationDuration: "50s", animationDirection: "reverse" }} />
              
              <div className="absolute top-2 right-12 font-mono text-[0.45rem] text-[#A0A0A0]/30 hidden sm:block">
                RADAR_GRID_SCAN: 0xFD42
              </div>
              <div className="absolute bottom-2 left-12 font-mono text-[0.45rem] text-[#A0A0A0]/30 hidden sm:block">
                PHX_ESTIMATION: 99.88%
              </div>
            </div>

            {/* React HUD Orb containing Phoenix */}
            <div className="relative z-10">
              <Orb size={420} bootStage={bootStage} />
            </div>

            {/* Corner ticks */}
            <div className="absolute top-6 left-6 w-3 h-3 border-t border-l border-primary/45 hidden sm:block" />
            <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-primary/45 hidden sm:block" />

            {/* Holographic protocol tags nested in the right column */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
              <div className="flex items-center gap-2 border border-primary/20 bg-black/60 px-4 py-2 rounded text-[0.6rem] font-mono text-[#F5F5F5]">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                <span>PHOENIX PROTOCOL</span>
                <span className="text-[#A0A0A0]/45">//</span>
                <span className="text-primary font-bold">AI Guardian Active</span>
              </div>
              <div className="flex items-center gap-2 border border-border bg-black/60 px-4 py-2 rounded text-[0.6rem] font-mono text-[#F5F5F5]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-success)] animate-pulse" />
                <span>SYSTEM STATUS</span>
                <span className="text-[#A0A0A0]/45">//</span>
                <span className="text-info font-bold">ALL SYSTEMS OPERATIONAL</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* DOMAIN CARDS SECTION */}
      <section className="border-t border-border/60 bg-[#111111] py-24 relative z-10">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-40" />
        
        <div className="mx-auto max-w-[1600px] px-6">
          <Reveal>
            <div className="text-center mb-12">
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">// EXPLORE DOMAINS //</span>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((dom, i) => {
              const Icon = dom.icon;
              return (
                <Reveal key={dom.title} delay={i * 0.06}>
                  <Link
                    to="/courses"
                    hash={dom.hash}
                    className={`group relative flex flex-col justify-between h-52 rounded-[var(--radius-lg)] border bg-[#1A1A1A] p-6 hover-lift select-none cursor-pointer ${
                      dom.color === "red" 
                        ? "border-red-500/10 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                        : dom.color === "orange" 
                        ? "border-primary/10 hover:border-primary hover:shadow-[0_0_15px_rgba(255,107,0,0.2)]" 
                        : "border-info/10 hover:border-info hover:shadow-[0_0_15px_rgba(0,170,255,0.2)]"
                    }`}
                  >
                    {/* Corner accents */}
                    <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-all duration-300 ${dom.color === "red" ? "border-red-500/20 group-hover:border-red-500" : dom.color === "orange" ? "border-primary/20 group-hover:border-primary" : "border-info/20 group-hover:border-info"}`} />
                    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-all duration-300 ${dom.color === "red" ? "border-red-500/20 group-hover:border-red-500" : dom.color === "orange" ? "border-primary/20 group-hover:border-primary" : "border-info/20 group-hover:border-info"}`} />

                    <div>
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-lg bg-black/40 border transition-all duration-300 ${
                          dom.color === "red"
                            ? "border-red-500/30 text-red-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] group-hover:border-red-500"
                            : dom.color === "orange" 
                            ? "border-primary/30 text-primary group-hover:shadow-[0_0_15px_rgba(255,107,0,0.25)] group-hover:border-primary" 
                            : "border-info/30 text-info group-hover:shadow-[0_0_15px_rgba(0,170,255,0.25)] group-hover:border-info"
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                      <h3 className="mt-5 text-lg font-semibold tracking-wide text-[#F5F5F5] group-hover:text-primary transition-colors">
                        {dom.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#A0A0A0] line-clamp-2">
                        {dom.desc}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[#A0A0A0] bg-black/30 border border-border/80 px-2.5 py-1 rounded">
                        {dom.paths}
                      </span>
                      <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[#A0A0A0] group-hover:text-primary transition-all flex items-center gap-1">
                        Connect <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW / COMMAND CENTER */}
      <section className="py-24 border-t border-border/60 relative z-10">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr_1fr]">
            
            {/* COLUMN 1: YOUR JOURNEY */}
            <Reveal className="h-full">
              <div className="h-full rounded-[var(--radius-lg)] border border-border bg-[#111111] p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />
                
                <div>
                  <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[#A0A0A0]">YOUR JOURNEY</span>
                  </div>

                  {/* Rank Header */}
                  <div className="mt-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-primary/30 bg-black/40 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(255,107,0,0.15)] overflow-hidden">
                      <img src={logo} alt="Phoenix Crest" className="w-7 h-7 object-contain filter drop-shadow-[0_0_5px_rgba(255,107,0,0.5)]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-wide text-[#F5F5F5] uppercase">{rankTitle}</h4>
                      <p className="font-mono text-[0.65rem] text-primary uppercase tracking-widest mt-0.5">Rank {rankNum}</p>
                    </div>
                  </div>

                  {/* Rank Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between font-mono text-[0.6rem] text-[#A0A0A0] uppercase">
                      <span>{progressVal.toLocaleString()} / {maxProgress.toLocaleString()} Progress</span>
                    </div>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black border border-border">
                      <div 
                        className="h-full bg-primary shadow-[0_0_10px_#FF6B00] transition-all duration-1000" 
                        style={{ width: `${(progressVal / maxProgress) * 100}%` }} 
                      />
                    </div>
                  </div>

                  {/* Recent Operations */}
                  <div className="mt-6 space-y-3">
                    <span className="font-mono text-[0.55rem] uppercase tracking-wider text-[#A0A0A0] block">// RECENT ACTIVITY</span>
                    <div className="space-y-2">
                      {activeLogs.map((log, i) => (
                        <div key={i} className="flex items-center justify-between bg-black/30 border border-border/50 px-3 py-2 rounded text-[0.7rem] font-mono">
                          <div className="flex items-center gap-2">
                            <span className="h-1 w-1 bg-primary rounded-full" />
                            <span className="text-[#F5F5F5]">{log.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[0.6rem] text-[#A0A0A0]/60 uppercase">{log.status}</span>
                            <span className="text-primary font-semibold">{log.points}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-border/60 pt-4">
                  <Link to="/courses" className="font-mono text-[0.65rem] text-primary uppercase tracking-wider hover:underline flex items-center gap-1">
                    View Full Progress <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* COLUMN 2: PHOENIX CORE TERMINAL */}
            <Reveal delay={0.08} className="h-full">
              <div className="h-full rounded-[var(--radius-lg)] border border-primary/20 bg-[#111111] p-6 flex flex-col justify-between relative overflow-hidden shadow-[0_0_30px_rgba(255,107,0,0.06)]">
                <div className="absolute top-0 inset-x-0 h-1 bg-primary shadow-[0_0_10px_#FF6B00]" />
                
                <div>
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[#F5F5F5]">PHOENIX CORE</span>
                  </div>

                  {/* Concentric Radar */}
                  <div className="relative h-36 flex items-center justify-center my-4">
                    <div className="absolute w-28 h-28 rounded-full border border-primary/10 animate-spin-slow" />
                    <div className="absolute w-24 h-24 rounded-full border border-dashed border-primary/20 animate-pulse" />
                    <div className="absolute w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5 shadow-[0_0_15px_rgba(255,107,0,0.1)]">
                      <Flame className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                  </div>

                  {/* Bubble msg */}
                  <div className="bg-black/30 border border-primary/10 p-3 rounded font-mono text-[0.65rem] leading-relaxed text-[#A0A0A0]">
                    <div className="flex items-center gap-2 mb-1.5 text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                      <span>INTELLIGENCE LAYER ACTIVE</span>
                    </div>
                    <p className="text-[#F5F5F5] font-light">
                      "I am Phoenix, Vaelora's active core intelligence. Authorized connection required to sync database telemetry."
                    </p>
                  </div>
                </div>

                {/* Input prompt - Lockout with Restrict Status */}
                <div className="mt-6 relative">
                  <div className="relative flex items-center">
                    <input 
                      type="text"
                      disabled
                      placeholder="AGENT AUTHORIZATION REQUIRED"
                      className="w-full bg-black/20 border border-red-500/30 rounded px-3 py-2.5 font-mono text-[0.65rem] text-red-500/60 placeholder-red-500/40 focus:outline-none cursor-not-allowed pr-10"
                    />
                    <button type="button" disabled className="absolute right-3 text-red-500/40 cursor-not-allowed">
                      <Lock className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* COLUMN 3: LIVE SYSTEM FEED */}
            <Reveal delay={0.16} className="h-full">
              <div className="h-full rounded-[var(--radius-lg)] border border-border bg-[#111111] p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10" />
                
                <div>
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-[#A0A0A0]">LIVE SYSTEM FEED</span>
                    <span className="font-mono text-[0.55rem] text-[#A0A0A0]/40 uppercase tracking-widest hover:underline cursor-pointer">View All Logs</span>
                  </div>

                  {/* System Event Logs */}
                  <div className="mt-6 space-y-3.5">
                    {[
                      { type: "New Challenge Available", desc: "Web Exploitation Lab", time: "2m ago", color: "green" },
                      { type: "System Update", desc: "AI Engine v2.4.1 Deployed", time: "8m ago", color: "blue" },
                      { type: "CTF Event Live", desc: "24H Cyber Siege", time: "15m ago", color: "orange" },
                      { type: "Vulnerability Alert", desc: "CVE-2024-3094 Critical", time: "22m ago", color: "red" },
                      { type: "Community Achievement", desc: "Aarav solved 50 challenges", time: "35m ago", color: "green" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0 font-mono text-[0.65rem]">
                        <div className="flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            item.color === "red" 
                              ? "bg-[var(--status-danger)] shadow-[0_0_6px_#FF3B3B]" 
                              : item.color === "orange" 
                              ? "bg-primary shadow-[0_0_6px_#FF6B00]" 
                              : item.color === "blue"
                              ? "bg-info shadow-[0_0_6px_#00AAFF]"
                              : "bg-[var(--status-success)] shadow-[0_0_6px_#00FF88]"
                          }`} />
                          <div className="flex flex-col">
                            <span className="text-[#F5F5F5] font-semibold">{item.type}</span>
                            <span className="text-[#A0A0A0] text-[0.6rem] mt-0.5">{item.desc}</span>
                          </div>
                        </div>
                        <span className="text-[#A0A0A0]/40 text-[0.55rem]">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-border/60 pt-4 flex justify-between items-center">
                  <span className="font-mono text-[0.55rem] text-[#A0A0A0]/40 uppercase tracking-wider">ALL HOSTS STABLE</span>
                  <span className="font-mono text-[0.55rem] text-primary uppercase tracking-widest animate-pulse">ACTIVE BROADCAST</span>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* BY THE NUMBERS & GLOBAL CONNECTIVITY MAP */}
      <section className="py-24 border-t border-border/60 bg-[#111111] relative overflow-hidden z-10">
        {/* World Map */}
        <div className="absolute inset-0 z-0 opacity-10 flex items-center justify-center pointer-events-none select-none">
          <svg viewBox="0 0 1000 500" className="w-full h-full max-w-[1100px] text-primary">
            <circle cx="200" cy="150" r="1.5" fill="currentColor" />
            <circle cx="220" cy="160" r="1.5" fill="currentColor" />
            <circle cx="240" cy="140" r="1.5" fill="currentColor" />
            <circle cx="260" cy="130" r="1.5" fill="currentColor" />
            <circle cx="280" cy="145" r="1.5" fill="currentColor" />
            <circle cx="300" cy="160" r="1.5" fill="currentColor" />
            <circle cx="320" cy="170" r="1.5" fill="currentColor" />
            <circle cx="340" cy="190" r="1.5" fill="currentColor" />
            
            <circle cx="150" cy="180" r="2" fill="currentColor" className="animate-pulse" />
            <circle cx="180" cy="220" r="1.5" fill="currentColor" />
            <circle cx="210" cy="240" r="2.5" fill="currentColor" />
            <circle cx="220" cy="260" r="1.5" fill="currentColor" />
            <circle cx="250" cy="210" r="3" fill="currentColor" className="text-primary animate-ping" />
            <circle cx="270" cy="230" r="1.5" fill="currentColor" />
            <circle cx="300" cy="220" r="2" fill="currentColor" />

            <circle cx="480" cy="160" r="2" fill="currentColor" />
            <circle cx="510" cy="170" r="2.5" fill="currentColor" />
            <circle cx="530" cy="190" r="1.5" fill="currentColor" />
            <circle cx="550" cy="180" r="3" fill="currentColor" className="text-primary animate-ping" />
            <circle cx="570" cy="210" r="2" fill="currentColor" />
            
            <circle cx="650" cy="210" r="2" fill="currentColor" />
            <circle cx="700" cy="230" r="2.5" fill="currentColor" />
            <circle cx="720" cy="260" r="1.5" fill="currentColor" />
            <circle cx="750" cy="240" r="3.5" fill="currentColor" className="text-primary animate-ping" />
            <circle cx="780" cy="280" r="2" fill="currentColor" />
            <circle cx="810" cy="220" r="2" fill="currentColor" />
            <circle cx="830" cy="250" r="1.5" fill="currentColor" />
            <circle cx="860" cy="290" r="2" fill="currentColor" />

            <path d="M 250 210 Q 380 180 550 180" fill="none" stroke="rgba(255,107,0,0.3)" strokeWidth="1" strokeDasharray="3,3" />
            <path d="M 550 180 Q 650 210 750 240" fill="none" stroke="rgba(255,107,0,0.3)" strokeWidth="1" strokeDasharray="3,3" />
            <path d="M 750 240 Q 500 300 250 210" fill="none" stroke="rgba(255,107,0,0.3)" strokeWidth="1.5" strokeDasharray="3,3" />
            
            <path d="M 250 210 Q 500 100 750 240" fill="none" stroke="rgba(0,170,255,0.25)" strokeWidth="1.2" />
          </svg>
        </div>

        <div className="mx-auto max-w-[1600px] px-6 relative z-10 grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          
          {/* Numbers Grid */}
          <div>
            <Reveal>
              <h3 className="text-[clamp(1.5rem,3vw,2.5rem)] font-display tracking-wider uppercase text-[#F5F5F5]">
                BY THE NUMBERS
              </h3>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-8">
              {[
                { label: "Operatives Connected", val: "12.8K+" },
                { label: "Intelligence Paths", val: "250+" },
                { label: "Hands-on Labs", val: "1.2K+" },
                { label: "Success Rate", val: "98.7%" }
              ].map((item, index) => (
                <Reveal key={index} delay={index * 0.08}>
                  <div className="border-l-2 border-primary/40 pl-4 py-2">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[#A0A0A0]">
                      {item.label}
                    </span>
                    <p className="text-3xl font-bold tracking-tight text-[#F5F5F5] mt-1 font-mono">
                      {item.val}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3} className="mt-10">
              <Link
                to={user ? "/dashboard" : "/auth"}
                className="relative inline-flex items-center gap-2.5 rounded border border-primary px-6 py-3.5 font-mono text-[0.7rem] uppercase tracking-widest font-bold text-[#F5F5F5] transition-all hover:bg-primary hover:text-[#0A0A0A] hover:shadow-[0_0_20px_rgba(255,107,0,0.35)] cursor-pointer"
              >
                JOIN THE COMMUNITY <ArrowRight className="h-3.5 w-3.5 text-primary" />
              </Link>
            </Reveal>
          </div>

          {/* Dystopian Gateway CTA */}
          <Reveal delay={0.15} className="flex flex-col justify-center">
            <div className="relative rounded-[var(--radius-lg)] border border-border bg-black/50 p-8 flex flex-col md:flex-row gap-8 items-center overflow-hidden">
              
              {/* Glowing Gate Image */}
              <div className="w-full md:w-44 h-44 rounded-md border border-primary/20 overflow-hidden relative shrink-0">
                <img 
                  src={systemGateway} 
                  alt="System Gateway Portal" 
                  className="w-full h-full object-cover filter drop-shadow-[0_0_15px_rgba(255,107,0,0.4)]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>

              {/* Action content */}
              <div>
                <h4 className="font-display text-3xl tracking-wide uppercase text-foreground">
                  FROM CURIOSITY TO MASTERY
                </h4>
                <p className="mt-2 text-xs text-[#A0A0A0] leading-relaxed">
                  Every expert was once a beginner. Start your journey. The system is ready.
                </p>
                <div className="mt-5">
                  <Link
                    to={user ? "/dashboard" : "/auth"}
                    className="inline-flex items-center gap-2 rounded bg-primary px-6 py-3.5 font-mono text-[0.7rem] uppercase tracking-widest font-bold text-[#0A0A0A] hover:bg-[#FF8C00] transition-all hover:shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 cursor-pointer"
                  >
                    ENTER THE SYSTEM <ArrowRight className="h-3.5 w-3.5 text-inherit" />
                  </Link>
                </div>
              </div>

            </div>
          </Reveal>

        </div>
      </section>

      <Footer />

      {/* Styled connection animation lines */}
      <style>{`
        @keyframes dash-pulse {
          to { stroke-dashoffset: -100; }
        }
        @keyframes dash-pulse-reverse {
          to { stroke-dashoffset: 100; }
        }
        .animate-dash-pulse {
          animation: dash-pulse 4s linear infinite;
        }
        .animate-dash-pulse-reverse {
          animation: dash-pulse-reverse 5s linear infinite;
        }
      `}</style>
    </main>
  );
}
