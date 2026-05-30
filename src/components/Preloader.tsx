import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function Preloader() {
  const [show, setShow] = useState(true);
  const [percent, setPercent] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [phase, setPhase] = useState<"loading" | "playing" | "done">("loading");
  const videoRef = useRef<HTMLVideoElement>(null);
  // Track percent in a ref so the canplay handler can read the latest value
  const percentRef = useRef(0);
  const phaseRef = useRef<"loading" | "playing" | "done">("loading");

  // Lock scroll on mount and force muted via DOM ref (React SSR strips the attribute)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Cyber percentage counter incrementation
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (phase === "loading") {
      interval = setInterval(() => {
        setPercent((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            percentRef.current = 100;
            return 100;
          }
          // Dynamic random increment for realistic cyber-boot simulation
          const increment = Math.floor(Math.random() * 10) + 5;
          const next = Math.min(prev + increment, 100);
          percentRef.current = next;
          return next;
        });
      }, 70);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [phase]);

  // Keep phaseRef in sync
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // Synchronize loading percent and video buffering readiness
  useEffect(() => {
    if (percent === 100 && phase === "loading") {
      if (videoReady) {
        startVideo();
      } else {
        // Wait up to 6s for video buffering, otherwise bypass to prevent lockout
        const timeout = setTimeout(() => {
          bypassOrStart();
        }, 6000);
        return () => clearTimeout(timeout);
      }
    }
  }, [percent, videoReady, phase]);

  const startVideo = () => {
    if (phaseRef.current !== "loading") return;
    phaseRef.current = "playing";
    setPhase("playing");
    const vid = videoRef.current;
    if (vid) {
      vid.muted = true; // ensure muted before play (required for autoplay)
      vid.currentTime = 0;
      vid.play().catch((err) => {
        console.error("Preloader video playback failed:", err);
        dismiss();
      });
    }
  };

  const bypassOrStart = () => {
    if (videoReady) {
      startVideo();
    } else {
      dismiss();
    }
  };

  const dismiss = () => {
    document.body.style.overflow = "";
    setShow(false);
    setPhase("done");
  };

  const getLoadingMessage = (p: number) => {
    if (p < 25) return "Initializing Secure Sandbox...";
    if (p < 50) return "Decrypting Learning Modules...";
    if (p < 75) return "Establishing Core Handshake...";
    if (p < 95) return "Stabilizing Firewall Controls...";
    return "Access Granted. Booting System...";
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0A0A] select-none overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          {/* The Video Element */}
          <video
            ref={videoRef}
            src="/media/preloader.mp4"
            muted
            playsInline
            preload="auto"
            onCanPlay={() => {
              setVideoReady(true);
              // If percent already reached 100 while buffering, start immediately
              if (percentRef.current >= 100 && phaseRef.current === "loading") {
                startVideo();
              }
            }}
            onEnded={dismiss}
            className={`h-full w-full object-cover transition-opacity duration-700 ${
              phase === "playing" ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Vignette + grain to blend video/loader into the brand */}
          <div className="pointer-events-none absolute inset-0 grain opacity-60" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, transparent 45%, #0A0A0A 100%)" }}
          />

          {/* Glitchy Cyber Loader UI */}
          <AnimatePresence>
            {phase === "loading" && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A]"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
              >
                <div className="relative flex flex-col items-center max-w-xs w-full px-6">
                  {/* Glowing background aura */}
                  <div className="absolute w-48 h-48 rounded-full bg-primary/10 blur-2xl animate-orb-pulse" />
                  
                  {/* Cyber shield badge icon */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="relative w-16 h-16 border-t-2 border-r-2 border-primary rounded-full mb-6 flex items-center justify-center"
                  >
                    <div className="w-10 h-10 border-b-2 border-l-2 border-primary/50 rounded-full animate-pulse" />
                  </motion.div>

                  {/* Percentage Counter */}
                  <h2 className="font-mono text-4xl font-bold tracking-widest text-primary mb-2">
                    {percent}%
                  </h2>

                  {/* Progress Line */}
                  <div className="w-full h-[2px] bg-muted/30 rounded-full overflow-hidden mb-4 relative">
                    <motion.div
                      className="h-full bg-primary shadow-[0_0_10px_#FF6B00]"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Tech status message */}
                  <p className="font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground text-center uppercase min-h-[16px] animate-pulse">
                    {getLoadingMessage(percent)}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Brand mark + tagline reveal (shows during video playback, delayed) */}
          {phase === "playing" && (
            <motion.div
              className="absolute inset-x-0 bottom-[12%] flex flex-col items-center text-center pointer-events-none"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 1 }}
            >
              <h1 className="font-display text-6xl tracking-[0.25em] text-foreground md:text-8xl">
                VAELORA
              </h1>
              <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.35em] text-muted-foreground">
                Building Defenders for the <span className="text-primary">AI Era</span>
              </p>
            </motion.div>
          )}

          {/* Skip Button */}
          <motion.button
            onClick={dismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-7 right-7 z-10 rounded-md border border-border bg-black/40 backdrop-blur-sm px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            Skip intro →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
