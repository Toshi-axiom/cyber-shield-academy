import { useEffect, useState, useRef } from "react";
import { Terminal } from "lucide-react";

interface Line {
  text: string;
  type: "cmd" | "log" | "success" | "flag" | "error";
}

const script: Line[] = [
  { text: "guest@vaelora:~$ nmap -sV -F 10.0.4.88", type: "cmd" },
  { text: "[SYS] Initializing network sweep...", type: "log" },
  { text: "[SCAN] Port 80/TCP open [Service: Apache HTTPD]", type: "log" },
  { text: "[SCAN] Port 22/TCP open [Service: OpenSSH 8.2p1]", type: "log" },
  { text: "[WARN] CVE-2021-41773 vulnerability detected on Port 80.", type: "error" },
  { text: "guest@vaelora:~$ exploit-engine -t 10.0.4.88 -p 80", type: "cmd" },
  { text: "[EXPL] Sending path traversal payload...", type: "log" },
  { text: "[EXPL] Injecting reverse shell listener...", type: "log" },
  { text: "[EXPL] Handshake established. Spawning interactive TTY...", type: "success" },
  { text: "root@target:~# cat /root/flag.txt", type: "cmd" },
  { text: "FLAG{PH03N1X_R151NG_FR0M_THE_A5HE5}", type: "flag" },
  { text: "[TASK] Challenge completed! Reward: +150 XP", type: "success" },
];

export function CyberTerminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentLineIndex >= script.length) {
      const timeout = setTimeout(() => {
        setLines([]);
        setCurrentLineIndex(0);
        setCurrentText("");
      }, 5000); // 5 seconds pause before loop restart
      return () => clearTimeout(timeout);
    }

    const currentLine = script[currentLineIndex];
    
    if (currentLine.type === "cmd") {
      let charIndex = 0;
      const interval = setInterval(() => {
        setCurrentText((prev) => prev + currentLine.text[charIndex]);
        charIndex++;
        if (charIndex >= currentLine.text.length) {
          clearInterval(interval);
          setTimeout(() => {
            setLines((prev) => [...prev, currentLine]);
            setCurrentText("");
            setCurrentLineIndex((prev) => prev + 1);
          }, 500);
        }
      }, 50);
      return () => clearInterval(interval);
    } else {
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev, currentLine]);
        setCurrentLineIndex((prev) => prev + 1);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex]);

  // Auto-scroll output container
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines, currentText]);

  return (
    <div className="glass rounded-[var(--radius-lg)] border border-border bg-black/75 shadow-glow w-full flex flex-col overflow-hidden font-mono text-[0.7rem] leading-relaxed relative">
      {/* Corner cyber ticks */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/30" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/30" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/30" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/30" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/80 bg-black/50 px-4 py-2 h-9 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-[0.6rem] tracking-[0.25em] uppercase text-muted-foreground font-semibold">Active Lab Sandbox</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500/70" />
          <span className="h-2 w-2 rounded-full bg-yellow-500/70" />
          <span className="h-2 w-2 rounded-full bg-green-500/70" />
        </div>
      </div>

      {/* Output Console */}
      <div
        ref={containerRef}
        className="p-4 h-[215px] overflow-y-auto space-y-1.5 scrollbar-thin select-text"
      >
        {lines.map((l, i) => (
          <div
            key={i}
            className={
              l.type === "cmd"
                ? "text-foreground font-medium"
                : l.type === "success"
                ? "text-[var(--status-success)]"
                : l.type === "flag"
                ? "text-primary font-bold shadow-[0_0_10px_rgba(255,107,0,0.2)] bg-primary/10 px-2 py-0.5 rounded border border-primary/20 inline-block animate-pulse"
                : l.type === "error"
                ? "text-red-400 font-semibold"
                : "text-muted-foreground"
            }
          >
            {l.text}
          </div>
        ))}
        {currentLineIndex < script.length && script[currentLineIndex].type === "cmd" && (
          <div className="text-foreground font-medium">
            {currentText}
            <span className="inline-block w-1.5 h-3.5 bg-primary ml-0.5 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}
