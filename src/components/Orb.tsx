import { cn } from "@/lib/utils";

/** Glowing ember orb — pure CSS, evokes the phoenix's core flame. */
export function Orb({ className, size = 380 }: { className?: string; size?: number }) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {/* Outer glow */}
      <div
        className="absolute inset-0 animate-orb-pulse rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,140,0,0.55), rgba(255,59,59,0.25) 45%, transparent 70%)" }}
      />
      {/* Core sphere */}
      <div
        className="absolute inset-[12%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #FFD9A0 0%, #FF8C00 25%, #FF6B00 50%, #7a2400 85%, #1a0a00 100%)",
          boxShadow: "inset -30px -30px 60px rgba(0,0,0,0.6), 0 0 80px rgba(255,107,0,0.35)",
        }}
      />
      {/* Rotating ring */}
      <div
        className="absolute inset-[2%] animate-spin-slow rounded-full border border-primary/30"
        style={{ borderTopColor: "rgba(255,107,0,0.8)", borderRightColor: "transparent" }}
      />
      <div
        className="absolute inset-[-6%] animate-spin-slow rounded-full border border-primary/10"
        style={{ animationDuration: "28s", borderBottomColor: "rgba(255,140,0,0.4)" }}
      />
    </div>
  );
}
