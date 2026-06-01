import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Lock, Eye, EyeOff } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Reset Passphrase — Cyber Shield Academy" }],
  }),
  component: ResetPasswordPage,
});

const resetSchema = z.object({
  password: z.string().min(6, "Passphrase must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Passphrase must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passphrases do not match",
  path: ["confirmPassword"],
});

function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: z.infer<typeof resetSchema>) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      toast.success("Passphrase successfully updated.");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Failed to update passphrase.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grain min-h-[calc(100vh-4rem)] flex flex-col justify-between bg-[#0A0A0A]">
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px] pointer-events-none animate-orb-pulse" />

        <div className="max-w-[420px] w-full z-10">
          <div className="text-center mb-8">
            <span className="font-mono text-[0.65rem] tracking-[0.3em] text-primary uppercase">
              Vaelora Security Gate
            </span>
            <h1 className="mt-2 font-orbitron text-4xl tracking-wider text-foreground">
              ESTABLISH NEW KEY
            </h1>
            <p className="mt-2 font-mono text-[0.7rem] text-muted-foreground tracking-wide uppercase">
              Enter a new secure passphrase for your identity.
            </p>
          </div>

          <div className="glass rounded-[var(--radius-lg)] border border-primary/30 p-6 shadow-glow relative overflow-hidden bg-black/60 backdrop-blur-xl">
            {/* Corner cyber ticks */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-primary/80" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-primary/80" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-primary/80" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/80" />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="password" className="font-mono text-[0.65rem] tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                  <Lock className="size-3.5 text-primary/70" /> New Passphrase
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="bg-black/40 border-white/10 font-mono text-sm tracking-wide text-foreground focus-visible:ring-primary focus-visible:border-primary/60 pr-10"
                    disabled={loading}
                    {...register("password")}
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
                {errors.password && (
                  <p className="font-mono text-[0.6rem] text-destructive uppercase tracking-wider">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-mono text-[0.65rem] tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
                  <Lock className="size-3.5 text-primary/70" /> Confirm Passphrase
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="bg-black/40 border-white/10 font-mono text-sm tracking-wide text-foreground focus-visible:ring-primary focus-visible:border-primary/60 pr-10"
                    disabled={loading}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="font-mono text-[0.6rem] text-destructive uppercase tracking-wider">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary/95 text-primary-foreground hover:bg-primary hover:shadow-glow font-mono uppercase tracking-widest text-xs py-5 mt-6 cursor-pointer"
                disabled={loading}
              >
                {loading ? "Encrypting..." : "Update Passphrase"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
