import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";

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

const forgotSchema = z.object({
  email: z.string().email("Enter a valid secure email address"),
});

function AuthPage() {
  const [tab, setTab] = useState<"login" | "register" | "forgot">("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const {
    register: forgotRegister,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
  } = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
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

  const onForgot = async (data: z.infer<typeof forgotSchema>) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success("Recovery protocol initiated. Check your email.");
      setTab("login");
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate recovery.");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate Google authentication.");
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
            <h1 className="mt-2 font-orbitron text-4xl tracking-wider text-foreground">
              {tab === "login" ? "IDENTITY VERIFICATION" : tab === "register" ? "INITIALIZE AGENT ID" : "RECOVER ACCESS"}
            </h1>
            <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground tracking-wide uppercase">
              {tab === "login"
                ? "Establish secure connection to sync academy progress"
                : tab === "register"
                ? "Create a cryptographic account to save your training records"
                : "Initiate password recovery protocol via email"}
            </p>
          </div>

          <div className="glass rounded-[var(--radius-lg)] border border-border p-6 shadow-glow relative overflow-hidden">
            {/* Corner cyber ticks */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/45" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/45" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/45" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/45" />

            {/* Selector Tabs */}
            {tab !== "forgot" ? (
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
            ) : (
              <div className="mb-6">
                <button
                  onClick={() => setTab("login")}
                  className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                >
                  ← BACK TO SIGN IN
                </button>
              </div>
            )}

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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="passphrase" className="font-mono text-[0.65rem] tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                        <Lock className="size-3.5 text-primary/70" /> Passphrase
                      </Label>
                      <button
                        type="button"
                        onClick={() => setTab("forgot")}
                        className="font-mono text-[0.6rem] text-primary hover:underline uppercase tracking-wider cursor-pointer"
                        tabIndex={-1}
                      >
                        Forgot Passphrase?
                      </button>
                    </div>
                    <div className="relative">
                      <Input
                        id="passphrase"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        className="bg-black/20 border-border/75 font-mono text-sm tracking-wide text-foreground focus-visible:ring-primary focus-visible:border-primary/60 pr-10"
                        disabled={loading}
                        {...loginRegister("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
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

                  <div className="flex items-center my-4 gap-3">
                    <div className="flex-1 h-[1px] bg-border/50" />
                    <span className="text-muted-foreground font-mono text-[0.6rem] tracking-widest uppercase">
                      OR SECURE IDENTITY
                    </span>
                    <div className="flex-1 h-[1px] bg-border/50" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-black/20 border-border/75 text-foreground hover:bg-white/5 font-mono uppercase tracking-widest text-[0.65rem] py-5 cursor-pointer flex items-center justify-center gap-2"
                    onClick={onGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </motion.form>
              ) : tab === "register" ? (
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
                    <div className="relative">
                      <Input
                        id="reg-passphrase"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••••••"
                        className="bg-black/20 border-border/75 font-mono text-sm tracking-wide text-foreground focus-visible:ring-primary focus-visible:border-primary/60 pr-10"
                        disabled={loading}
                        {...registerRegister("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
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

                  <div className="flex items-center my-4 gap-3">
                    <div className="flex-1 h-[1px] bg-border/50" />
                    <span className="text-muted-foreground font-mono text-[0.6rem] tracking-widest uppercase">
                      OR SECURE IDENTITY
                    </span>
                    <div className="flex-1 h-[1px] bg-border/50" />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-black/20 border-border/75 text-foreground hover:bg-white/5 font-mono uppercase tracking-widest text-[0.65rem] py-5 cursor-pointer flex items-center justify-center gap-2"
                    onClick={onGoogleSignIn}
                    disabled={loading}
                  >
                    <svg className="h-4 w-4 mr-1" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="forgot"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleForgotSubmit(onForgot)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email" className="font-mono text-[0.65rem] tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                      <Mail className="size-3.5 text-primary/70" /> Email Address
                    </Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="agent@vaelora.academy"
                      className="bg-black/20 border-border/75 font-mono text-sm tracking-wide text-foreground focus-visible:ring-primary focus-visible:border-primary/60"
                      disabled={loading}
                      {...forgotRegister("email")}
                    />
                    {forgotErrors.email && (
                      <p className="font-mono text-[0.6rem] text-destructive uppercase tracking-wider">
                        {forgotErrors.email.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary/95 text-primary-foreground hover:bg-primary hover:shadow-glow font-mono uppercase tracking-widest text-xs py-5 mt-6 cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? "Initiating Protocol..." : "Send Recovery Link"}
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
