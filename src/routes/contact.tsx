import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Mail, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [{ title: "Contact — Vaelora Academy" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <main className="grain min-h-screen bg-[#0A0A0A] overflow-hidden">
      <div className="mx-auto max-w-[800px] px-6 py-24 relative z-10 text-center">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#FF3B3B] flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-[#FF3B3B]/40"></span>
            COMMUNICATIONS
            <span className="w-8 h-[1px] bg-[#FF3B3B]/40"></span>
          </span>
          <h1 className="mt-6 font-orbitron text-4xl md:text-5xl text-foreground">
            Establish Contact
          </h1>
          <p className="mt-6 text-muted-foreground text-lg mb-12">
            Reach out to our support team or join our community channels.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="p-8 rounded border border-white/10 bg-black/40 hover:border-[#FF3B3B]/50 transition-colors">
              <Mail className="w-8 h-8 text-[#FF3B3B] mb-4" />
              <h3 className="font-orbitron text-xl text-white mb-2">Email Support</h3>
              <p className="text-muted-foreground text-sm mb-4">Direct channel for account issues, billing, and enterprise inquiries.</p>
              <a href="mailto:support@vaelora.com" className="font-mono text-sm text-[#FF3B3B] hover:underline">support@vaelora.com</a>
            </div>
            <div className="p-8 rounded border border-white/10 bg-black/40 hover:border-[#FF3B3B]/50 transition-colors">
              <MessageSquare className="w-8 h-8 text-[#FF3B3B] mb-4" />
              <h3 className="font-orbitron text-xl text-white mb-2">Community Discord</h3>
              <p className="text-muted-foreground text-sm mb-4">Join the squad. Get help with challenges, labs, and network with others.</p>
              <a href="#" className="font-mono text-sm text-[#FF3B3B] hover:underline">Join Discord Server</a>
            </div>
          </div>
        </Reveal>
      </div>
      <Footer />
    </main>
  );
}
