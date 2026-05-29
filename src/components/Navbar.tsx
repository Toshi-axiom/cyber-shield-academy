import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import logo from "@/assets/vaelora-logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Curriculum" },
  { to: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Vaelora" className="h-9 w-9 object-contain" />
          <span className="font-display text-2xl tracking-[0.18em] text-foreground">VAELORA</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="group relative font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <Link
            to="/courses"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-[var(--accent-hover)] hover:shadow-[var(--shadow-glow)]"
          >
            Start Learning
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/courses"
              onClick={() => setOpen(false)}
              className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground"
            >
              Start Learning
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
