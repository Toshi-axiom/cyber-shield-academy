import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import logo from "@/assets/vaelora-logo.png";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Academy" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/labs", label: "Labs" },
  { to: "/challenges", label: "Challenges" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  const username = user?.user_metadata?.username || user?.email?.split("@")[0] || "Agent";

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Vaelora" className="h-9 w-9 object-contain" />
          <span className="font-orbitron text-2xl tracking-[0.18em] text-foreground">VAELORA</span>
          <span className="hidden lg:flex items-center gap-1.5 font-mono text-[0.6rem] tracking-[0.2em] text-primary border-l border-border/60 pl-3 ml-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#FF6B00]" />
            PHOENIX ONLINE
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="group relative font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-[#F5F5F5]"
              activeProps={{ className: "text-[#F5F5F5]" }}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          
          <div className="flex items-center ml-2 border-l border-border/60 pl-6">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded border border-border bg-black/40 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-success)] animate-pulse" />
                  <span className="text-foreground font-medium">{username}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/auth"
                  className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-muted-foreground hover:text-[#F5F5F5] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="rounded bg-primary px-5 py-2 font-mono text-[0.7rem] uppercase tracking-wider font-semibold text-[#0A0A0A] hover:bg-[#FF8C00] hover:shadow-[0_0_15px_rgba(255,107,0,0.4)] transition-all"
                >
                  Enter System
                </Link>
              </div>
            )}
          </div>
        </div>

        <button className="lg:hidden text-foreground" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-border bg-background px-6 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground"
              >
                {l.label}
              </Link>
            ))}
            
            {user ? (
              <div className="flex flex-col gap-3 pt-3 border-t border-border/50">
                <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Logged in as: <span className="text-foreground font-semibold">{username}</span>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                  className="rounded border border-border/80 text-center py-2 text-xs font-medium text-destructive hover:bg-destructive/5 font-mono uppercase tracking-wider cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-3 border-t border-border/50">
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="rounded border border-border text-center py-2 text-xs font-medium text-foreground hover:bg-white/5 font-mono uppercase tracking-wider"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="rounded bg-primary text-center py-2 text-xs font-semibold text-[#0A0A0A] hover:bg-[#FF8C00] font-mono uppercase tracking-wider"
                >
                  Enter System
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
