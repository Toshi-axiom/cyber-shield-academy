import { Link } from "@tanstack/react-router";
import logo from "@/assets/vaelora-logo.png";

const cols = [
  {
    title: "Learn",
    links: [
      { label: "Curriculum", to: "/courses" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Labs", to: "/courses" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Discord", to: "/" },
      { label: "GitHub", to: "/" },
      { label: "Contribute", to: "/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/" },
      { label: "Terms", to: "/" },
      { label: "Code of Conduct", to: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-[var(--bg-secondary)]">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Vaelora" className="h-9 w-9 object-contain" />
              <span className="font-display text-2xl tracking-[0.18em]">VAELORA</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Free, hands-on cybersecurity education. No paywalls. No gatekeeping. Just defenders.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-[1280px] px-6 py-6 text-center font-mono text-xs text-[var(--text-muted)]">
          © 2025 Vaelora — Building Defenders for the AI Era. Free forever. Open source.
        </p>
      </div>
    </footer>
  );
}
