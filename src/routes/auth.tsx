import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Lock, Mail, User } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Authenticate — Cyber Shield Academy" },
      { name: "description", content: "Sign in or create a secure academy profile to save your training progress, XP, and achievements." },
    ],
  }),
  component: AuthPage,
});

const loginSchema = z.object({
  email: z.string().email("Enter a valid secure email address"),
  password: z.string().min(6, "Passphrase must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be under 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed"),
  email: z.string().email("Enter a valid secure email address"),
  password: z.string().min(6, "Passphrase must be at least 6 characters"),
});

function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      toast.success("Identity decrypted. Access granted.");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (data: z.infer<typeof registerSchema>) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
          },
        },
      });

      if (error) throw error;

      toast.success("Account created successfully!");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize identity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grain min-h-[calc(100vh-4rem)] flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative overflow-hidden">
        {/* Glow backdrops */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -top-20 -left-20 animate-orb-pulse" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -bottom-20 -right-20 animate-orb-pulse" />

        <div className="max-w-[420px] w-full z-10">
          <div className="text-center mb-8">
            <span className="font-mono text-[0.65rem] tracking-[0.3em] text-primary uppercase">
              Vaelora Security Gate
            </span>
            <h1 className="mt-2 font-display text-4xl tracking-wider text-foreground">
              {tab === "login" ? "IDENTITY VERIFICATION" : "INITIALIZE AGENT ID"}
            </h1>
            <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground tracking-wide uppercase">
              {tab === "login"
                ? "Establish secure connection to sync academy progress"
                : "Create a cryptographic account to save your training records"}
            </p>
          </div>

          <div className="glass rounded-[var(--radius-lg)] border border-border p-6 shadow-glow relative overflow-hidden">
            {/* Corner cyber ticks */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/45" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/45" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/45" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/45" />

            {/* Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-lg border border-border/50 mb-6 font-mono text-[0.7rem]">
              <button
                onClick={() => setTab("login")}
                className={`py-2 rounded-md uppercase tracking-wider transition-colors cursor-pointer ${
                  tab === "login"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab("register")}
                className={`py-2 rounded-md uppercase tracking-wider transition-colors cursor-pointer ${
                  tab === "register"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Register
              </button>
            </div>

            <AnimatePresence mode="wait">
              {tab === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLoginSubmit(onLogin)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-mono text-[0.65rem] tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                      <Mail className="size-3.5 text-primary/70" /> Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="agent@vaelora.academy"
                      className="bg-black/20 border-border/75 font-mono text-sm tracking-wide text-foreground focus-visible:ring-primary focus-visible:border-primary/60"
                      disabled={loading}
                      {...loginRegister("email")}
                    />
                    {loginErrors.email && (
                      <p className="font-mono text-[0.6rem] text-destructive uppercase tracking-wider">
                        {loginErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passphrase" className="font-mono text-[0.65rem] tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                      <Lock className="size-3.5 text-primary/70" /> Passphrase
                    </Label>
                    <Input
                      id="passphrase"
                      type="password"
                      placeholder="••••••••••••"
                      className="bg-black/20 border-border/75 font-mono text-sm tracking-wide text-foreground focus-visible:ring-primary focus-visible:border-primary/60"
                      disabled={loading}
                      {...loginRegister("password")}
                    />
                    {loginErrors.password && (
                      <p className="font-mono text-[0.6rem] text-destructive uppercase tracking-wider">
                        {loginErrors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary/95 text-primary-foreground hover:bg-primary hover:shadow-glow font-mono uppercase tracking-widest text-xs py-5 mt-6 cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? "Decrypting..." : "Initiate Verification"}
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="register"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleRegisterSubmit(onRegister)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="username" className="font-mono text-[0.65rem] tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                      <User className="size-3.5 text-primary/70" /> Codename (Username)
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="cyber_defender"
                      className="bg-black/20 border-border/75 font-mono text-sm tracking-wide text-foreground focus-visible:ring-primary focus-visible:border-primary/60"
                      disabled={loading}
                      {...registerRegister("username")}
                    />
                    {registerErrors.username && (
                      <p className="font-mono text-[0.6rem] text-destructive uppercase tracking-wider">
                        {registerErrors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="font-mono text-[0.65rem] tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                      <Mail className="size-3.5 text-primary/70" /> Email Address
                    </Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="agent@vaelora.academy"
                      className="bg-black/20 border-border/75 font-mono text-sm tracking-wide text-foreground focus-visible:ring-primary focus-visible:border-primary/60"
                      disabled={loading}
                      {...registerRegister("email")}
                    />
                    {registerErrors.email && (
                      <p className="font-mono text-[0.6rem] text-destructive uppercase tracking-wider">
                        {registerErrors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-passphrase" className="font-mono text-[0.65rem] tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                      <Lock className="size-3.5 text-primary/70" /> Passphrase
                    </Label>
                    <Input
                      id="reg-passphrase"
                      type="password"
                      placeholder="••••••••••••"
                      className="bg-black/20 border-border/75 font-mono text-sm tracking-wide text-foreground focus-visible:ring-primary focus-visible:border-primary/60"
                      disabled={loading}
                      {...registerRegister("password")}
                    />
                    {registerErrors.password && (
                      <p className="font-mono text-[0.6rem] text-destructive uppercase tracking-wider">
                        {registerErrors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary/95 text-primary-foreground hover:bg-primary hover:shadow-glow font-mono uppercase tracking-widest text-xs py-5 mt-6 cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? "Creating Profile..." : "Initialize Agent"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
