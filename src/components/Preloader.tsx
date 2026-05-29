import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const PRELOADER_KEY = "vaelora_intro_seen";

export function Preloader() {
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = sessionStorage.getItem(PRELOADER_KEY);
    if (!seen) {
      setShow(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(PRELOADER_KEY, "1");
    document.body.style.overflow = "";
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <video
            ref={videoRef}
            src="/media/preloader.mp4"
            autoPlay
            muted
            playsInline
            onCanPlay={() => setReady(true)}
            onEnded={dismiss}
            className="h-full w-full object-cover"
          />

          {/* Vignette + grain to blend video into the brand */}
          <div className="pointer-events-none absolute inset-0 grain opacity-60" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, transparent 45%, #0A0A0A 100%)" }}
          />

          {/* Brand mark + tagline reveal */}
          <motion.div
            className="absolute inset-x-0 bottom-[12%] flex flex-col items-center text-center"
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

          {/* Skip */}
          <motion.button
            onClick={dismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-7 right-7 z-10 rounded-md border border-border px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            Skip intro →
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
