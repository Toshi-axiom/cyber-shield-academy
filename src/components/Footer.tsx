import { Link } from "@tanstack/react-router";
import logo from "@/assets/vaelora-logo.png";

const columns = [
  {
    title: "Academy",
    links: [
      { label: "All Courses", to: "/courses" },
      { label: "Learning Paths", to: "/courses" },
      { label: "Skill Roadmap", to: "/courses" },
      { label: "Hands-on Labs", to: "/courses" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", to: "/courses" },
      { label: "Cheat Sheets", to: "/courses" },
      { label: "Blog", to: "/courses" },
      { label: "Guides", to: "/courses" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Forum", to: "/dashboard" },
      { label: "Discord", to: "/dashboard" },
      { label: "Events", to: "/dashboard" },
      { label: "Leaderboard", to: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/" },
      { label: "Careers", to: "/" },
      { label: "Contact", to: "/" },
      { label: "Privacy", to: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#111111] relative z-20">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1.5fr]">
          {/* Logo Column */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Vaelora" className="h-9 w-9 object-contain" />
              <span className="font-orbitron text-2xl tracking-[0.18em] text-[#F5F5F5]">VAELORA</span>
            </Link>
            <p className="mt-4 max-w-xs text-xs text-[#A0A0A0] leading-relaxed">
              Intelligence. Integrity. Impact.
            </p>
          </div>

          {/* Links Columns */}
          {columns.map((c) => (
            <div key={c.title} className="col-span-1">
              <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-[#F5F5F5]">{c.title}</h4>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-xs text-[#A0A0A0] transition-colors hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Stay Connected Column */}
          <div className="col-span-1 md:col-span-1 flex flex-col items-start">
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-[#F5F5F5]">Stay Connected</h4>
            <div className="mt-4 flex gap-3">
              {/* Discord */}
              <a href="#" className="w-8 h-8 rounded-full bg-black/40 border border-border flex items-center justify-center text-[#A0A0A0] hover:text-primary hover:border-primary transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 127.14 96.36">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.8,6.83,77.19,77.19,0,0,0,49.5,0,105.15,105.15,0,0,0,19.06,8.07C-3.41,41.91-1,75,10.67,92.57A105.52,105.52,0,0,0,41.87,96.36a77.37,77.37,0,0,0,8.8-14.3,68.43,68.43,0,0,1-13.85-6.67c1.16-.85,2.28-1.74,3.35-2.67a75,75,0,0,0,73.5,0c1.07.93,2.19,1.82,3.35,2.67a68.61,68.61,0,0,1-13.86,6.67,77.37,77.37,0,0,0,8.8,14.3,105.52,105.52,0,0,0,31.2-3.79C128.41,75,130.63,41.91,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
                </svg>
              </a>
              {/* Twitter */}
              <a href="#" className="w-8 h-8 rounded-full bg-black/40 border border-border flex items-center justify-center text-[#A0A0A0] hover:text-primary hover:border-primary transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* GitHub */}
              <a href="#" className="w-8 h-8 rounded-full bg-black/40 border border-border flex items-center justify-center text-[#A0A0A0] hover:text-primary hover:border-primary transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" className="w-8 h-8 rounded-full bg-black/40 border border-border flex items-center justify-center text-[#A0A0A0] hover:text-primary hover:border-primary transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.556a3.003 3.003 0 0 0-2.11 2.107C0 8.018 0 12 0 12s0 3.982.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.556a3.003 3.003 0 0 0 2.11-2.107C24 15.982 24 12 24 12s0-3.982-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border/40 py-6">
        <p className="mx-auto max-w-[1280px] px-6 text-center font-mono text-[0.65rem] text-[#A0A0A0]/40">
          © 2024 Vaelora. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
