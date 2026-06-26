import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [{ title: "Privacy Policy — Vaelora Academy" }],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <main className="grain min-h-screen bg-[#0A0A0A] overflow-hidden">
      <div className="mx-auto max-w-[800px] px-6 py-24 relative z-10">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#FF3B3B] flex items-center gap-3">
            <span className="w-8 h-[1px] bg-[#FF3B3B]/40"></span>
            LEGAL
          </span>
          <h1 className="mt-6 font-orbitron text-4xl text-foreground mb-8">
            Privacy Policy
          </h1>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              <strong>Last Updated:</strong> October 2024
            </p>
            <p>
              At Vaelora Academy, your privacy and data security are paramount. This policy outlines how we collect, use, and protect your information.
            </p>
            <h2 className="font-orbitron text-xl text-white mt-8 mb-4">1. Data Collection</h2>
            <p>
              We collect minimal data required to provide you with an optimal learning experience. This includes account credentials, progress data, and lab environment interactions.
            </p>
            <h2 className="font-orbitron text-xl text-white mt-8 mb-4">2. Data Usage</h2>
            <p>
              Your data is strictly used for platform functionality, maintaining your progress (XP, completed labs), and improving our curriculum. We do not sell your personal data to third parties.
            </p>
            <h2 className="font-orbitron text-xl text-white mt-8 mb-4">3. Security</h2>
            <p>
              As a cybersecurity platform, we implement rigorous security controls to protect your data, including encryption at rest and in transit.
            </p>
          </div>
        </Reveal>
      </div>
      <Footer />
    </main>
  );
}
