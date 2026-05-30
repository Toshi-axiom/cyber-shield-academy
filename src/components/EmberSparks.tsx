import { useEffect, useRef } from "react";

export function EmberSparks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
      type: "ember" | "networkNode";
      color: string;
      wobble: number;
      wobbleSpeed: number;
    }> = [];

    const emberColors = [
      "rgba(255, 107, 0, ",  // Primary orange
      "rgba(255, 140, 0, ",  // Light orange
      "rgba(255, 59, 59, ",   // Soft red
    ];

    const createParticle = (isInitial = false, forceType?: "ember" | "networkNode") => {
      const type = forceType || (Math.random() > 0.4 ? "networkNode" : "ember");
      
      const size = type === "networkNode" ? Math.random() * 1.5 + 1.2 : Math.random() * 2.2 + 0.8;
      const x = Math.random() * width;
      const y = isInitial ? Math.random() * height : height + 10;
      
      // Network nodes float slowly inside the screen area (including downwards/upwards)
      const speedY = type === "networkNode" 
        ? (Math.random() - 0.5) * 0.2 
        : -(Math.random() * 0.7 + 0.3);
      
      const speedX = type === "networkNode"
        ? (Math.random() - 0.5) * 0.2
        : (Math.random() - 0.5) * 0.15;
        
      const opacity = Math.random() * 0.5 + 0.25;
      const fadeSpeed = type === "networkNode" ? 0 : Math.random() * 0.0015 + 0.0008;
      
      const color = type === "networkNode"
        ? (Math.random() > 0.85 ? "rgba(0, 170, 255, " : "rgba(255, 107, 0, ") // 10% Blue nodes, 90% Orange
        : emberColors[Math.floor(Math.random() * emberColors.length)];
        
      const wobble = Math.random() * 100;
      const wobbleSpeed = Math.random() * 0.015 + 0.005;

      return { x, y, size, speedY, speedX, opacity, fadeSpeed, type, color, wobble, wobbleSpeed };
    };

    // Populate initial particles
    const particleCount = Math.min(65, Math.floor((width * height) / 18000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(true));
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw and update nodes/embers
      particles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX;
        
        if (p.type === "ember") {
          p.wobble += p.wobbleSpeed;
          p.x += Math.sin(p.wobble) * 0.12;
          p.opacity -= p.fadeSpeed;
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        
        if (p.type === "ember") {
          ctx.shadowColor = p.color.includes("255, 59") ? "#FF3B3B" : "#FF6B00";
          ctx.shadowBlur = p.size * 3;
        }
        ctx.fill();
        ctx.shadowBlur = 0; // Reset

        // Recycle particle if out of boundaries
        if (p.type === "ember") {
          if (p.y < -10 || p.opacity <= 0 || p.x < -10 || p.x > width + 10) {
            particles[index] = createParticle(false, "ember");
          }
        } else {
          // Network nodes loop or wrap around screen margins
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }
      });

      // 2. Draw Network Lines between close networkNodes
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.type !== "networkNode") continue;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.type !== "networkNode") continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect if close enough
          const maxDist = 120;
          if (dist < maxDist) {
            const lineOpacity = (1 - dist / maxDist) * 0.12;
            const isBlue = p1.color.includes("0, 170") || p2.color.includes("0, 170");
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isBlue 
              ? `rgba(0, 170, 255, ${lineOpacity})` 
              : `rgba(255, 107, 0, ${lineOpacity})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60 z-0"
    />
  );
}
