import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
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
import { 
  IconCyberSecurity, 
  IconPenetration, 
  IconWebDev, 
  IconProgramming, 
  IconAI, 
  IconCloud 
} from "@/components/icons/CyberIcons";
import { PhoenixArtwork } from "@/components/PhoenixArtwork";
import { Reveal } from "@/components/Reveal";
import { Footer } from "@/components/Footer";
import { EmberSparks } from "@/components/EmberSparks";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import systemGateway from "@/assets/system_gateway.png";
import logo from "@/assets/vaelora-logo.png";
import risingExplorerLogo from "@/assets/rising_explorer.png";
import aiLogo from "@/assets/ai.png";
import continentsMap from "@/assets/continents.png";

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
      title: "Offensive Security",
      desc: "Recon, exploit, and escalate. Think like the adversary.",
      paths: "3 Modules",
      icon: IconPenetration,
      color: "red",
      hash: "offense-fundamentals"
    },
    {
      title: "Blue Team & SOC",
      desc: "Detect, hunt, and respond. Run the defense.",
      paths: "3 Modules",
      icon: IconCyberSecurity,
      color: "blue",
      hash: "soc"
    },
    {
      title: "Web App Security",
      desc: "OWASP Top 10, APIs, and modern web exploits.",
      paths: "2 Modules",
      icon: IconWebDev,
      color: "orange",
      hash: "web"
    },
    {
      title: "Mobile & Hardware",
      desc: "Reverse engineering, firmware, and IoT exploits.",
      paths: "2 Modules",
      icon: IconProgramming,
      color: "cyan",
      hash: "mobile-iot"
    },
    {
      title: "AI Security",
      desc: "Defend LLMs. Poison models. Break the guardrails.",
      paths: "2 Modules",
      icon: IconAI,
      color: "purple",
      hash: "ai-security"
    },
    {
      title: "Cloud Security",
      desc: "AWS, Kubernetes, and pipeline poisoning.",
      paths: "3 Modules",
      icon: IconCloud,
      color: "electric-blue",
      hash: "cloud"
    }
  ];

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

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

      {/* BACKGROUND & ARTWORK (Layers 1-5) */}
      <PhoenixArtwork />

      {/* HERO CONTENT (Layer 6) */}
      <section className="relative min-h-[110vh] flex items-center pt-20 pb-24 z-20 pointer-events-none">
        <div className="mx-auto max-w-[1600px] w-full px-6 grid grid-cols-1 lg:grid-cols-[42%_58%] items-center gap-12 relative pointer-events-auto">
          
          {/* Left Column: Brand HUD (42%) */}
          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 flex flex-col items-start pt-12"
          >
            
            {/* HUD Status Header */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 border border-primary/20 bg-black/40 px-3 py-1.5 rounded-sm font-mono text-[0.55rem] tracking-[0.25em] text-muted-foreground mb-6 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
              <span className="text-primary font-bold">SYSTEM ACTIVE</span>
              <span className="text-muted-foreground/40">|</span>
              <span>HOST: 0xFD91A</span>
              <span className="text-muted-foreground/40">|</span>
              <span className="text-blue-primary font-medium">NEURAL OK</span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-orbitron text-[clamp(3.5rem,6.5vw,5.5rem)] leading-[0.85] tracking-[0.1em] text-foreground font-bold select-none drop-shadow-lg"
            >
              VAELOR<span className="text-primary">A</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-4 font-orbitron font-normal text-[1.7rem] tracking-[0.06em] text-foreground uppercase drop-shadow-md"
            >
              LEARN. HACK. BUILD. <span className="text-primary">ASCEND.</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 max-w-lg text-sm font-light leading-relaxed text-muted-foreground tracking-wide"
            >
              The advanced intelligence ecosystem for cybersecurity and technology explorers.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-2 max-w-lg text-xs leading-relaxed text-muted-foreground/60 font-mono uppercase tracking-widest"
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
                className="relative inline-flex items-center gap-2.5 rounded border border-primary bg-black/40 px-8 py-4 font-mono text-[0.75rem] uppercase tracking-widest font-bold text-foreground transition-all hover:bg-primary hover:text-black shadow-[0_0_20px_rgba(255,90,31,0.4)] cursor-pointer backdrop-blur-md"
              >
                ENTER THE SYSTEM <ArrowRight className="h-4 w-4" />
              </Link>
              
              <Link
                to="/courses"
                className="relative inline-flex items-center gap-2.5 px-6 py-4 font-mono text-[0.75rem] uppercase tracking-widest font-bold text-foreground hover:text-primary transition-colors cursor-pointer group"
              >
                <span className="p-1 rounded-full border border-foreground/30 flex items-center justify-center text-primary bg-black/20 group-hover:border-primary group-hover:shadow-[0_0_10px_rgba(255,90,31,0.4)] transition-all">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </span>
                EXPLORE ACADEMY
              </Link>
            </motion.div>

            {/* Trusted explorers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 flex items-center gap-4 border-t border-border pt-6 max-w-sm w-full font-mono"
            >
              <div className="flex -space-x-2 shrink-0">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border border-background bg-zinc-900 flex items-center justify-center text-[0.6rem] font-bold text-primary"
                    style={{ 
                      boxShadow: `0 0 8px rgba(255,90,31,0.1)`,
                    }}
                  >
                    0{i+1}
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[0.55rem] text-muted-foreground/60 uppercase tracking-widest">TRUSTED BY EXPLORERS WORLDWIDE</span>
                <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider mt-0.5">
                  +12.8K <span className="text-foreground font-normal text-[0.65rem]">Operatives Connected</span>
                </span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Column: Empty space (58%) for the Phoenix Artwork to shine through */}
          <div className="hidden lg:block relative h-full pointer-events-none">
          </div>

        </div>
      </section>

      {/* DOMAIN CARDS SECTION */}
      <section className="border-t border-border/60 bg-[#06080D] py-16 relative z-10 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_rgba(0,207,255,0.03)_0%,_transparent_70%)]" />
        
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 relative">
          <Reveal>
            <div className="text-center mb-10 flex flex-col items-center">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground/80 mb-2 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-primary/40"></span>
                SELECT SPECIALIZATION TRACK
                <span className="w-4 h-[1px] bg-primary/40"></span>
              </span>
              <h2 className="font-orbitron font-normal text-xl md:text-2xl tracking-wide text-foreground uppercase drop-shadow-md">
                Intelligence Modules
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 relative z-10">
            {domains.map((dom, i) => {
              const Icon = dom.icon;
              
              // Map custom colors to tailwind classes for borders and glows
              let hoverBorderClass = "";
              let hoverShadowClass = "";
              let defaultShadowClass = "";
              let iconColorClass = "";
              
              switch(dom.color) {
                case "red":
                  hoverBorderClass = "hover:border-[#FF3B3B]";
                  hoverShadowClass = "hover:shadow-[0_0_25px_rgba(255,59,59,0.25)]";
                  defaultShadowClass = "shadow-[0_0_15px_rgba(255,59,59,0.05)]";
                  iconColorClass = "text-[#FF3B3B]";
                  break;
                case "orange":
                  hoverBorderClass = "hover:border-[#FF5A1F]";
                  hoverShadowClass = "hover:shadow-[0_0_25px_rgba(255,90,31,0.25)]";
                  defaultShadowClass = "shadow-[0_0_15px_rgba(255,90,31,0.05)]";
                  iconColorClass = "text-[#FF5A1F]";
                  break;
                case "blue":
                  hoverBorderClass = "hover:border-[#3B82F6]";
                  hoverShadowClass = "hover:shadow-[0_0_25px_rgba(59,130,246,0.25)]";
                  defaultShadowClass = "shadow-[0_0_15px_rgba(59,130,246,0.05)]";
                  iconColorClass = "text-[#3B82F6]";
                  break;
                case "cyan":
                  hoverBorderClass = "hover:border-[#00CFFF]";
                  hoverShadowClass = "hover:shadow-[0_0_25px_rgba(0,207,255,0.25)]";
                  defaultShadowClass = "shadow-[0_0_15px_rgba(0,207,255,0.05)]";
                  iconColorClass = "text-[#00CFFF]";
                  break;
                case "purple":
                  hoverBorderClass = "hover:border-[#A855F7]";
                  hoverShadowClass = "hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]";
                  defaultShadowClass = "shadow-[0_0_15px_rgba(168,85,247,0.05)]";
                  iconColorClass = "text-[#A855F7]";
                  break;
                case "electric-blue":
                  hoverBorderClass = "hover:border-[#0EA5E9]";
                  hoverShadowClass = "hover:shadow-[0_0_25px_rgba(14,165,233,0.25)]";
                  defaultShadowClass = "shadow-[0_0_15px_rgba(14,165,233,0.05)]";
                  iconColorClass = "text-[#0EA5E9]";
                  break;
                default:
                  hoverBorderClass = "hover:border-primary";
                  hoverShadowClass = "hover:shadow-[0_0_25px_rgba(255,90,31,0.25)]";
                  defaultShadowClass = "shadow-[0_0_15px_rgba(255,90,31,0.05)]";
                  iconColorClass = "text-primary";
              }

              return (
                <Reveal key={dom.title} delay={i * 0.05} className="flex h-full">
                  <Link
                    to="/courses"
                    hash={dom.hash}
                    className={`group relative flex flex-col justify-between w-full h-[220px] rounded-sm border border-white/5 bg-black/40 backdrop-blur-sm p-5 hover:-translate-y-1 transition-all duration-300 select-none cursor-pointer overflow-hidden ${defaultShadowClass} ${hoverBorderClass} ${hoverShadowClass}`}
                  >
                    {/* Glowing backplate for the icon */}
                    <div className={`absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity duration-500 bg-current ${iconColorClass}`} />
                    
                    {/* Micro grid background fragment */}
                    <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none transition-opacity duration-500 group-hover:opacity-20"
                         style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)", backgroundSize: "16px 16px" }} />
                    
                    {/* HUD Corner Brackets */}
                    <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors duration-300 border-white/10 group-hover:border-t-current group-hover:border-l-current ${iconColorClass}`} />
                    <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors duration-300 border-white/10 group-hover:border-b-current group-hover:border-r-current ${iconColorClass}`} />

                    <div className="relative z-10 flex-grow flex flex-col">
                      <div className="flex items-start">
                        <div className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${iconColorClass} drop-shadow-[0_0_5px_currentColor] group-hover:drop-shadow-[0_0_12px_currentColor]`}>
                          <Icon className="w-full h-full" />
                        </div>
                      </div>
                      
                      <div className="mt-auto pt-4">
                        <h3 className="text-sm font-bold tracking-wide text-foreground uppercase group-hover:text-white transition-colors line-clamp-1">
                          {dom.title}
                        </h3>
                        <p className="mt-1 text-[0.65rem] leading-snug text-muted-foreground line-clamp-2">
                          {dom.desc}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 relative z-10 flex items-center justify-between">
                      <span className="font-mono text-[0.55rem] uppercase tracking-widest text-muted-foreground/80">
                        {dom.paths}
                      </span>
                      <span className={`font-mono text-[0.6rem] uppercase tracking-wider flex items-center gap-1 transition-colors duration-300 text-muted-foreground/60 group-hover:${iconColorClass}`}>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* MISSION CONTROL / COMMAND CENTER */}
      <section className="py-24 border-t border-border/60 relative z-10 bg-[#05070D]">
        <div className="mx-auto max-w-[1600px] px-6 relative z-10">
          
          <div className="text-center mb-12">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary flex items-center justify-center gap-3">
              <span className="w-12 h-[1px] bg-primary/40"></span>
              MISSION CONTROL
              <span className="w-12 h-[1px] bg-primary/40"></span>
            </span>
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            
            {/* COLUMN 1: YOUR JOURNEY */}
            <Reveal className="h-full">
              <div className="h-full rounded-sm border border-white/10 bg-[rgba(5,7,13,0.55)] backdrop-blur-md p-6 flex flex-col justify-between relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                
                {/* HUD Details */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-screen pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)", backgroundSize: "16px 16px" }} />
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20" />
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-6">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[#A0A0A0]">YOUR JOURNEY</span>
                    <span className="flex gap-1"><span className="w-1 h-1 bg-primary/50"></span><span className="w-1 h-1 bg-primary/50"></span><span className="w-1 h-1 bg-primary"></span></span>
                  </div>

                  {/* Rank Insignia */}
                  <div className="flex items-center gap-5">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border border-primary/20 border-dashed animate-spin-slow" />
                      <div className="absolute inset-1 rounded-full border border-primary/40" />
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-md" />
                      <div className="w-10 h-10 rounded-full overflow-hidden z-10">
                        <img src={risingExplorerLogo} alt="Rising Explorer Insignia" className="w-full h-full object-cover filter contrast-125 sepia-[0.3]" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold tracking-widest text-[#F5F5F5] uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{rankTitle}</h4>
                      <p className="font-mono text-[0.7rem] text-primary uppercase tracking-[0.3em] mt-1 shadow-primary/20">Level {rankNum}</p>
                    </div>
                  </div>

                  {/* Tech HUD Progress Bar */}
                  <div className="mt-8">
                    <div className="flex justify-between font-mono text-[0.55rem] text-[#A0A0A0] uppercase mb-1.5 tracking-wider">
                      <span>Sync Progress</span>
                      <span className="text-primary">{progressVal.toLocaleString()} / {maxProgress.toLocaleString()} XP</span>
                    </div>
                    <div className="relative h-[2px] w-full bg-white/5">
                      <div 
                        className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_8px_#FF6B00] transition-all duration-1000" 
                        style={{ width: `${(progressVal / maxProgress) * 100}%` }} 
                      />
                      {/* Tech ticks */}
                      <div className="absolute inset-0 flex justify-between px-[20%] opacity-20 pointer-events-none">
                        <div className="w-[1px] h-2 -mt-[3px] bg-white" />
                        <div className="w-[1px] h-2 -mt-[3px] bg-white" />
                        <div className="w-[1px] h-2 -mt-[3px] bg-white" />
                      </div>
                    </div>
                  </div>

                  {/* Mission Logs */}
                  <div className="mt-8">
                    <span className="font-mono text-[0.5rem] uppercase tracking-[0.2em] text-[#A0A0A0]/70 mb-3 block border-l-2 border-primary/40 pl-2">MISSION LOG</span>
                    <div className="space-y-1.5">
                      {activeLogs.map((log, i) => (
                        <div key={i} className="flex items-center justify-between bg-black/40 border border-white/5 px-2.5 py-1.5 font-mono text-[0.6rem] hover:border-primary/20 transition-colors">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="h-[2px] w-[2px] bg-primary" />
                            <span className="text-[#E0E0E0] truncate whitespace-nowrap">{log.name}</span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 ml-2">
                            <span className="text-[0.55rem] text-[#A0A0A0]/50 uppercase">{log.status}</span>
                            <span className="text-primary font-bold">{log.points}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-white/5 pt-3 relative z-10 flex justify-end">
                  <Link to="/courses" className="font-mono text-[0.55rem] text-[#A0A0A0] uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center gap-1 group">
                    View Full Profile <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* COLUMN 2: AI PHOENIX (CENTERPIECE) */}
            <Reveal delay={0.08} className="h-full">
              <div className="h-full rounded-sm border border-primary/20 bg-[rgba(5,7,13,0.7)] backdrop-blur-md p-6 flex flex-col justify-between relative overflow-hidden shadow-[0_0_50px_rgba(255,90,31,0.1)]">
                
                {/* HUD Details */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-primary shadow-[0_0_15px_#FF6B00]" />
                <div className="absolute inset-0 opacity-[0.04] mix-blend-screen pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #FF6B00 1px, transparent 0)", backgroundSize: "24px 24px" }} />
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/50" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/50" />
                
                <div className="relative z-10 flex flex-col items-center flex-grow">
                  
                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 mb-6 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-sm shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                    <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22C55E]" />
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-green-500 font-bold">AI GUARDIAN ONLINE</span>
                  </div>

                  {/* 6-Layer AI Reactor Core */}
                  <div className="relative flex items-center justify-center my-auto w-72 h-72">
                    {/* Layer 1: Core Glow */}
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                    
                    {/* Layer 2: Outer Ring */}
                    <div className="absolute w-72 h-72 rounded-full border border-primary/10 animate-[spin_15s_linear_infinite]" />
                    
                    {/* Layer 3: Segmented Ring */}
                    <svg className="absolute w-64 h-64 animate-[spin_20s_linear_reverse_infinite] opacity-30" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="48" fill="none" stroke="#FF6B00" strokeWidth="0.5" strokeDasharray="4 8" />
                    </svg>

                    {/* Layer 4: Technical Tick Marks */}
                    <div className="absolute w-56 h-56 rounded-full border-[0.5px] border-primary/20" />
                    
                    {/* Layer 5: Targeting Circle */}
                    <svg className="absolute w-48 h-48 animate-[spin_10s_linear_infinite] opacity-50" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="48" fill="none" stroke="#FF6B00" strokeWidth="1" strokeDasharray="60 40 20 40" />
                    </svg>
                    
                    {/* Layer 6: Phoenix Emblem */}
                    <div className="absolute w-40 h-40 rounded-full flex items-center justify-center bg-black/60 border border-primary/30 shadow-[0_0_30px_rgba(255,107,0,0.2)] z-10 backdrop-blur-sm overflow-hidden">
                      <img src={aiLogo} alt="Phoenix AI" className="w-full h-full object-cover filter drop-shadow-[0_0_8px_rgba(255,107,0,0.8)] animate-pulse" />
                    </div>
                  </div>

                  {/* AI Description */}
                  <div className="text-center mt-6">
                    <p className="font-mono text-[0.65rem] leading-loose text-[#E0E0E0]">
                      I am Phoenix,<br/>your AI mentor and guardian.<br/>
                      <span className="text-primary">Ask me anything. I'm here to help you ascend.</span>
                    </p>
                  </div>
                </div>

                {/* Tactical Input Terminal */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!aiInput.trim()) return;
                    window.dispatchEvent(
                      new CustomEvent("open-phoenix-chat", {
                        detail: { initialMessage: aiInput }
                      })
                    );
                    setAiInput("");
                  }}
                  className="mt-6 relative z-10"
                >
                  <div className="relative group">
                    <input 
                      type="text"
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Ask Phoenix anything..."
                      className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 font-mono text-[0.65rem] text-white placeholder-white/30 focus:outline-none focus:border-primary/60 focus:bg-primary/5 transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] group-hover:border-white/20"
                    />
                    <button 
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-sm bg-white/5 border border-white/10 text-white/40 cursor-pointer hover:bg-primary/20 hover:text-primary hover:border-primary/40 transition-colors"
                    >
                      <Terminal className="w-3 h-3" />
                    </button>
                  </div>
                </form>
              </div>
            </Reveal>

            {/* COLUMN 3: LIVE SYSTEM FEED */}
            <Reveal delay={0.16} className="h-full">
              <div className="h-full rounded-sm border border-white/10 bg-[rgba(5,7,13,0.55)] backdrop-blur-md p-6 flex flex-col justify-between relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                
                {/* HUD Details */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-screen pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)", backgroundSize: "16px 16px" }} />
                <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20" />
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-6">
                    <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-[#A0A0A0]">LIVE SYSTEM FEED</span>
                    <span className="font-mono text-[0.45rem] text-[#A0A0A0]/40 uppercase tracking-[0.2em] border border-white/10 px-1.5 py-0.5 rounded-sm">V.2.4.1</span>
                  </div>

                  {/* System Event Logs (Mini HUD Enclosures) */}
                  <div className="space-y-2 flex-grow">
                    {[
                      { type: "Community Achievement", desc: "User solved 50 challenges", time: "2m ago", color: "green" },
                      { type: "System Update", desc: "AI Engine v2.4.1 Deployed", time: "8m ago", color: "blue" },
                      { type: "CTF Event Live", desc: "24h Cyber Siege", time: "15m ago", color: "orange" },
                      { type: "Vulnerability Alert", desc: "Critical CVE Detected", time: "22m ago", color: "red" },
                      { type: "New Challenge", desc: "Web Exploitation Lab", time: "35m ago", color: "green" }
                    ].map((item, index) => {
                      // Color mapping
                      let dotColor = "";
                      let shadowColor = "";
                      let borderColor = "";
                      
                      switch(item.color) {
                        case "green":
                          dotColor = "bg-green-500";
                          shadowColor = "shadow-[0_0_8px_#22C55E]";
                          borderColor = "border-green-500/20";
                          break;
                        case "blue":
                          dotColor = "bg-blue-500";
                          shadowColor = "shadow-[0_0_8px_#3B82F6]";
                          borderColor = "border-blue-500/20";
                          break;
                        case "orange":
                          dotColor = "bg-primary";
                          shadowColor = "shadow-[0_0_8px_#FF6B00]";
                          borderColor = "border-primary/20";
                          break;
                        case "red":
                          dotColor = "bg-red-500";
                          shadowColor = "shadow-[0_0_8px_#EF4444]";
                          borderColor = "border-red-500/20";
                          break;
                      }

                      return (
                        <div key={index} className={`flex items-start gap-3 bg-black/40 border border-white/5 hover:${borderColor} p-2.5 rounded-sm transition-colors group cursor-default`}>
                          <div className="mt-1 shrink-0">
                            <span className={`block h-[3px] w-[3px] rounded-full ${dotColor} ${shadowColor}`} />
                          </div>
                          <div className="flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-0.5">
                              <span className="font-mono text-[0.6rem] font-bold text-[#F5F5F5] uppercase tracking-wide group-hover:text-white transition-colors">{item.type}</span>
                              <span className="font-mono text-[0.45rem] text-[#A0A0A0]/50 tracking-wider shrink-0">{item.time}</span>
                            </div>
                            <span className="font-sans text-[0.65rem] text-[#A0A0A0] leading-snug">{item.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6 border-t border-white/5 pt-3 flex justify-between items-center">
                    <span className="font-mono text-[0.5rem] text-[#A0A0A0]/50 uppercase tracking-[0.2em] flex items-center gap-1">
                      <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                      SECURE LINK
                    </span>
                    <span className="font-mono text-[0.5rem] text-primary uppercase tracking-[0.2em] cursor-pointer hover:underline">
                      VIEW ALL LOGS
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* CINEMATIC GLOBAL IMPACT SECTION */}
      <section className="py-24 relative z-10 bg-[#03050A]">
        <div className="mx-auto max-w-[1800px] px-6">
          
          {/* Main Intelligence Panel Container */}
          <div className="relative rounded-[28px] border border-[#FF7800]/15 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]"
               style={{ background: 'linear-gradient(180deg, rgba(7,10,18,0.98), rgba(3,5,12,0.98))' }}>
            
            {/* Global Environmental FX */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-screen" 
                 style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            
            {/* Scanning Line Sweep */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
              <div className="w-[150%] h-full bg-gradient-to-r from-transparent via-[#FF7800]/5 to-transparent animate-scan-sweep" />
            </div>

            {/* Faint Circuitry / Particles (Simulated with radial noise) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] animate-pulse" style={{ animationDuration: '4s' }} />

            {/* HUD Corners */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-[#FF7800]/40 z-20 pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#FF7800]/40 z-20 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#FF7800]/40 z-20 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-[#FF7800]/40 z-20 pointer-events-none" />

            {/* HUD Telemetry Labels Scattered */}
            <span className="absolute top-6 left-1/3 font-mono text-[0.4rem] text-[#FF7800]/50 uppercase tracking-[0.3em] z-20">SYS.OP.2099</span>
            <span className="absolute bottom-6 left-2/3 font-mono text-[0.4rem] text-white/30 uppercase tracking-[0.3em] z-20">TRT-SEC-ACTIVE</span>
            
            {/* 3-Zone Grid Layout */}
            <div className="grid lg:grid-cols-[22%_48%_30%] min-h-[550px] relative z-20">
              
              {/* ZONE 1: GLOBAL METRICS (22%) */}
              <div className="p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5 relative">
                <div className="flex flex-col gap-12">
                  
                  {/* Heading */}
                  <div>
                    <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-white/50 flex items-center gap-3">
                      <span className="text-[#FF7800] tracking-tighter">///</span> BY THE NUMBERS
                    </h3>
                  </div>

                  {/* 2x2 Stats Grid */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-10">
                    {[
                      { label: "Learners", val: "12.8K+" },
                      { label: "Learning Paths", val: "250+" },
                      { label: "Labs", val: "1.2K+" },
                      { label: "Success Rate", val: "98.7%" }
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col gap-1 group">
                        <p className="text-[32px] font-[800] text-[#FF7A00] leading-none tracking-tight drop-shadow-[0_0_15px_rgba(255,122,0,0.4)] transition-all duration-300 group-hover:drop-shadow-[0_0_25px_rgba(255,122,0,0.8)] group-hover:scale-105 origin-left">
                          {item.val}
                        </p>
                        <span className="font-sans text-[0.75rem] font-medium text-white/65 mt-1">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="mt-4">
                    <Link
                      to={user ? "/dashboard" : "/auth"}
                      className="relative inline-flex items-center gap-3 rounded-md border border-[#FF7800]/30 bg-white/5 backdrop-blur-md px-6 py-4 font-mono text-[0.7rem] uppercase tracking-widest font-bold text-white transition-all overflow-hidden group hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,120,0,0.4)] hover:border-[#FF7800]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine-sweep" />
                      JOIN THE COMMUNITY <ArrowRight className="h-4 w-4 text-[#FF7800] group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                </div>
              </div>

              {/* ZONE 2: GLOBAL NETWORK MAP (48%) */}
              <div className="relative flex items-center justify-center p-8 overflow-hidden bg-black/20 border-b lg:border-b-0 lg:border-r border-white/5">
                
                {/* Continents Base */}
                <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none z-10">
                  <img src={continentsMap} alt="World Map" className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(255,122,0,0.15)]" />
                </div>
                
                {/* Micro HUD Status */}
                <div className="absolute bottom-8 left-8 flex flex-col gap-2 pointer-events-none z-20">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#FF7A00] rounded-full animate-pulse shadow-[0_0_8px_#ff7a00]" />
                    <span className="font-mono text-[0.5rem] text-[#FF7A00]/80 uppercase tracking-widest">NETWORK ONLINE</span>
                  </div>
                  <div className="flex items-center gap-2 pl-[14px]">
                    <span className="font-mono text-[0.45rem] text-white/40 uppercase tracking-widest">SIGNAL ACTIVE // GLOBAL REACH</span>
                  </div>
                </div>

              </div>

              {/* ZONE 3: TRANSFORMATION PANEL (30%) */}
              <div className="relative p-10 flex flex-col justify-center overflow-hidden">
                
                {/* Ambient Orange Bloom */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,120,0,0.1)_0%,transparent_70%)] pointer-events-none z-0" />
                
                {/* Phoenix Gateway Image Integration */}
                <div className="absolute right-0 bottom-0 h-full w-[130%] pointer-events-none z-0"
                     style={{ 
                       maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 15%, transparent 80%)',
                       WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 15%, transparent 80%)'
                     }}>
                  <img 
                    src={systemGateway} 
                    alt="Transformation Portal" 
                    className="w-full h-full object-cover object-right opacity-60 mix-blend-screen filter contrast-125 saturate-150"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-start gap-8">
                  
                  <div>
                    <h4 className="font-orbitron text-4xl lg:text-5xl tracking-wide uppercase text-white leading-[0.9] drop-shadow-md">
                      FROM CURIOSITY<br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7a00] to-[#ffb347] drop-shadow-[0_0_15px_rgba(255,122,0,0.5)]">
                        TO MASTERY
                      </span>
                    </h4>
                    
                    <p className="mt-5 text-[0.8rem] text-white/70 leading-relaxed font-sans max-w-[280px]">
                      Every expert was once a beginner. <br/>
                      Start your journey. <br/>
                      The system is ready.
                    </p>
                  </div>

                  <div className="w-full xl:w-auto">
                    <Link
                      to={user ? "/dashboard" : "/auth"}
                      className="group relative inline-flex w-full xl:w-auto justify-center items-center gap-3 rounded-md bg-[#FF7800] px-8 py-5 font-mono text-[0.75rem] uppercase tracking-widest font-bold text-[#05070D] transition-all overflow-hidden hover:bg-white hover:shadow-[0_0_40px_rgba(255,120,0,0.6)] hover:-translate-y-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shine-sweep" />
                      ENTER THE SYSTEM <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>

                </div>
              </div>

            </div>
          </div>
          
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
