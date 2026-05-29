import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, ShieldCheck, Terminal, Cpu, Cloud } from "lucide-react";
import { Orb } from "@/components/Orb";
import { Reveal } from "@/components/Reveal";
import { StatCard } from "@/components/StatCard";
import { PhaseCard } from "@/components/PhaseCard";
import { Footer } from "@/components/Footer";
import { phases, totalModules, totalLabs } from "@/data/curriculum";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vaelora — Free Cybersecurity Education for the AI Era" },
      { name: "description", content: "Learn offensive and defensive cybersecurity for free. 9 phases, hands-on labs, AI security, SOC operations, and career prep. No paywalls." },
      { property: "og:title", content: "Vaelora — Building Defenders for the AI Era" },
      { property: "og:description", content: "Free, hands-on cybersecurity education. No paywalls, no gatekeeping." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="grain relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[1280px] grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] bg-[var(--accent-muted)] px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> 100% Free Forever
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 font-display text-[clamp(4.5rem,13vw,11rem)] leading-[0.85] tracking-[-0.02em] text-foreground"
            >
              DEFEND.
              <br />
              <span className="text-gradient-ember">DETECT.</span>
              <br />
              DOMINATE.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 max-w-md text-lg font-light text-muted-foreground"
            >
              Building Defenders for the AI Era. Free cybersecurity education —
              no paywalls, no gatekeeping. Just labs, mastery, and momentum.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] hover:shadow-[var(--shadow-glow-lg)]"
              >
                Start Learning <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border-accent)] px-6 py-3 font-medium text-foreground transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-muted)]"
              >
                View Curriculum
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-8 flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background"
                    style={{ background: `linear-gradient(135deg, #FF8C00, #FF3B3B)`, opacity: 1 - i * 0.18 }}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-muted-foreground">2,400+ students learning for free</span>
            </motion.div>
          </div>

          {/* Orb + floating cards */}
          <div className="relative mx-auto hidden h-[460px] w-full max-w-[460px] items-center justify-center lg:flex">
            <Orb size={400} />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute bottom-6 left-0 w-48 animate-float-slow rounded-[var(--radius-md)] glass p-4"
            >
              <div className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">MTTD</div>
              <div className="mt-1 font-display text-3xl text-foreground">4.2 min</div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                <div className="h-full w-3/4 bg-primary" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute bottom-2 right-0 w-52 animate-float-slow rounded-[var(--radius-md)] glass p-4"
              style={{ animationDelay: "1.5s" }}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">Module 08</span>
                <CheckCircle2 className="h-4 w-4 text-[var(--status-success)]" />
              </div>
              <div className="mt-1 text-sm font-medium text-foreground">SOC Engineering</div>
              <div className="mt-1 font-mono text-[0.65rem] text-[var(--status-success)]">Free access unlocked</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* RECOGNIZED BY strip */}
      <section className="border-y border-border bg-[var(--bg-secondary)]">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 px-6 py-8 md:flex-row md:justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Built for real-world roles</span>
          <div className="flex flex-wrap items-center justify-center gap-8 font-mono text-sm uppercase tracking-[0.15em] text-muted-foreground">
            {["SOC Analyst", "Pentester", "Cloud Sec", "Red Team", "AI Security"].map((r) => (
              <span key={r} className="opacity-50 transition-opacity hover:opacity-100">{r}</span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          <Reveal><StatCard value={9} suffix=" Phases" label="Curriculum modules" /></Reveal>
          <Reveal delay={0.08}><StatCard value={totalLabs()} suffix="+ Labs" label="Hands-on exercises" /></Reveal>
          <Reveal delay={0.16}><StatCard value={100} suffix="%" label="Free forever" /></Reveal>
          <Reveal delay={0.24}><StatCard value={2400} suffix="+" label="Active learners" /></Reveal>
        </div>
      </section>

      {/* WHY / FEATURE */}
      <section className="border-y border-border bg-[var(--bg-overlay)]">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="font-display text-5xl tracking-wide text-foreground md:text-6xl">
              Theory you <span className="text-gradient-ember">never</span> sit through.
            </h2>
            <p className="mt-5 max-w-lg text-muted-foreground">
              Every concept is paired with a lab. You read for two minutes, then you break
              something, fix it, and earn XP. No passive videos. No boredom. Just the loop
              that actually builds skill.
            </p>
            <div className="mt-8 space-y-5">
              {[
                { label: "Learn-by-doing", pct: 92 },
                { label: "Lab coverage", pct: 100 },
                { label: "Job-ready focus", pct: 88 },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-muted-foreground">{b.label}</span>
                    <span className="text-primary">{b.pct}%</span>
                  </div>
                  <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--bg-elevated)]">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${b.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.15} className="grid gap-5 sm:grid-cols-2">
            {[
              { icon: Terminal, title: "Live Labs", text: "Hands-on terminals & guided challenges in every module." },
              { icon: Cpu, title: "AI Security", text: "Prompt injection, adversarial ML, and LLM defense." },
              { icon: ShieldCheck, title: "Blue & Red", text: "Attack and defend — the full kill chain, both sides." },
              { icon: Cloud, title: "Cloud-Native", text: "Kubernetes, CI/CD, serverless — 2025+ infrastructure." },
            ].map((f) => (
              <div key={f.title} className="rounded-[var(--radius-lg)] border border-border bg-[var(--bg-secondary)] p-6 hover-lift">
                <f.icon className="h-7 w-7 text-primary" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CURRICULUM PHASES */}
      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <Reveal className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">The Curriculum</span>
            <h2 className="mt-2 font-display text-5xl tracking-wide text-foreground md:text-6xl">
              Nine phases. One defender.
            </h2>
          </div>
          <Link to="/courses" className="inline-flex items-center gap-2 font-mono text-sm text-primary hover:underline">
            Explore all {totalModules()} modules <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {phases.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08}>
              <PhaseCard phase={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border">
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-ember)" }} />
        <div className="relative mx-auto max-w-[1280px] px-6 py-24 text-center">
          <Reveal>
            <h2 className="font-display text-5xl tracking-wide text-foreground md:text-7xl">
              Rise as a defender.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands learning to secure the AI era — completely free. Start your first lab today.
            </p>
            <Link
              to="/courses"
              className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-primary px-8 py-4 text-lg font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] hover:shadow-[var(--shadow-glow-lg)]"
            >
              Begin Phase 01 <ArrowRight className="h-5 w-5" />
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
