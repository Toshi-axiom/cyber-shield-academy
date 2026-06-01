import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export interface Progress {
  completedModules: string[]; // module ids
  xp: number;
  streak: number;
  lastActive: string | null;
}

const KEY = "vaelora_progress";
const XP_PER_MODULE = 50;

const empty: Progress = { completedModules: [], xp: 0, streak: 1, lastActive: null };

// Global state cache to synchronize updates across multiple hook instances
let globalProgress: Progress = empty;
let globalUserId: string | null = null;
let isInitialized = false;

// Read local guest progress
function readLocal(): Progress {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

// Write local guest progress
function writeLocal(progress: Progress) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(progress));
}

let listeners: Array<() => void> = [];
function notify() {
  listeners.forEach((l) => l());
}

// Helper to fetch user data from Supabase
async function fetchSupabaseProgress(userId: string): Promise<Progress> {
  try {
    const { data: stats, error: statsErr } = await supabase
      .from("user_stats")
      .select("xp, current_streak, last_active")
      .eq("user_id", userId)
      .maybeSingle();

    if (statsErr) throw statsErr;

    const { data: modules, error: modulesErr } = await supabase
      .from("user_progress")
      .select("module_id")
      .eq("user_id", userId);

    if (modulesErr) throw modulesErr;

    return {
      completedModules: modules ? modules.map((m) => m.module_id) : [],
      xp: stats?.xp ?? 0,
      streak: stats?.current_streak ?? 1,
      lastActive: stats?.last_active ? new Date(stats.last_active).toISOString() : null,
    };
  } catch (err) {
    console.error("Error fetching Supabase progress:", err);
    return empty;
  }
}

// Helper to migrate guest local progress to Supabase on login
async function syncGuestProgress(userId: string) {
  const local = readLocal();
  if (local.completedModules.length === 0) return;

  try {
    // Sync guest progress securely via database RPC, discarding client-provided XP
    const { data, error } = await (supabase as any).rpc("sync_guest_progress_secure", {
      p_module_ids: local.completedModules,
    });

    if (error) throw error;

    // Clear local guest progress
    localStorage.removeItem(KEY);
    console.log("[Supabase] Guest progress successfully synced to cloud.");
  } catch (err) {
    console.error("Failed to sync guest progress:", err);
  }
}

export function useProgress() {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState<Progress>(globalProgress);

  // Synchronize component state with globalProgress cache
  useEffect(() => {
    const update = () => setProgress(globalProgress);
    listeners.push(update);
    return () => {
      listeners = listeners.filter((l) => l !== update);
    };
  }, []);

  // Fetch or load whenever user state changes
  useEffect(() => {
    if (authLoading) return;

    const initialize = async () => {
      if (user) {
        if (globalUserId !== user.id) {
          globalUserId = user.id;
          
          // Sync any local guest progress first
          await syncGuestProgress(user.id);
          
          // Fetch the final merged progress
          const fetched = await fetchSupabaseProgress(user.id);
          globalProgress = fetched;
          isInitialized = true;
          notify();
        }
      } else {
        if (globalUserId !== null || !isInitialized) {
          globalUserId = null;
          globalProgress = readLocal();
          isInitialized = true;
          notify();
        }
      }
    };

    initialize();
  }, [user, authLoading]);

  const completeModule = useCallback(
    async (moduleId: string) => {
      if (user) {
        if (globalProgress.completedModules.includes(moduleId)) return false;

        try {
          // Call the secure RPC to complete module and calculate XP
          const { data, error } = await (supabase as any).rpc("complete_module_secure", {
            p_module_id: moduleId,
          });

          if (error) throw error;
          
          const result = data as { success: boolean; awarded: boolean; xp_total: number };
          if (!result || !result.success) return false;

          // Update local cache
          globalProgress = {
            ...globalProgress,
            completedModules: [...globalProgress.completedModules, moduleId],
            xp: result.xp_total,
            lastActive: new Date().toISOString(),
          };
          notify();
          return result.awarded;
        } catch (err) {
          console.error("Error saving completed module to DB:", err);
          return false;
        }
      } else {
        // Guest mode fallback
        const cur = readLocal();
        if (cur.completedModules.includes(moduleId)) return false;
        const next: Progress = {
          ...cur,
          completedModules: [...cur.completedModules, moduleId],
          xp: cur.xp + XP_PER_MODULE,
          lastActive: new Date().toISOString(),
        };
        writeLocal(next);
        globalProgress = next;
        notify();
        return true;
      }
    },
    [user]
  );

  const submitQuiz = useCallback(
    async (phaseId: string, score: number, total: number) => {
      if (user) {
        try {
          const { data, error } = await (supabase as any).rpc("submit_quiz_secure", {
            p_phase_id: phaseId,
            p_score: score,
            p_total: total,
          });

          if (error) throw error;

          const result = data as { success: boolean; xp_earned: number; xp_total: number };
          if (result && result.success) {
            globalProgress = {
              ...globalProgress,
              xp: result.xp_total,
              lastActive: new Date().toISOString(),
            };
            notify();
            return result;
          }
        } catch (err) {
          console.error("Error submitting quiz:", err);
        }
      } else {
        // Guest mode fallback
        const xpEarned = score * 20;
        const cur = readLocal();
        const next = {
          ...cur,
          xp: cur.xp + xpEarned,
          lastActive: new Date().toISOString(),
        };
        writeLocal(next);
        globalProgress = next;
        notify();
        return { success: true, xp_earned: xpEarned, xp_total: next.xp };
      }
      return { success: false, xp_earned: 0, xp_total: globalProgress.xp };
    },
    [user]
  );

  const submitFlag = useCallback(
    async (moduleId: string, flag: string) => {
      if (user) {
        try {
          const { data, error } = await (supabase as any).rpc("submit_lab_flag_secure", {
            p_module_id: moduleId,
            p_flag: flag,
          });

          if (error) throw error;

          const result = data as {
            success: boolean;
            message: string;
            flag_newly_captured: boolean;
            module_newly_completed: boolean;
            xp_earned: number;
            xp_total: number;
          };

          if (result && result.success) {
            globalProgress = {
              ...globalProgress,
              completedModules: result.module_newly_completed 
                ? [...globalProgress.completedModules, moduleId]
                : globalProgress.completedModules,
              xp: result.xp_total,
              lastActive: new Date().toISOString(),
            };
            notify();
          }
          return result;
        } catch (err) {
          console.error("Error submitting flag:", err);
          return { success: false, message: "Server connection failed." };
        }
      } else {
        // Guest mode fallback (always auto-succeeds locally with mock flag)
        const cur = readLocal();
        const isAlreadyComplete = cur.completedModules.includes(moduleId);
        const xpEarned = isAlreadyComplete ? 0 : 100; // 50 flag + 50 module completion
        const next = {
          ...cur,
          completedModules: isAlreadyComplete 
            ? cur.completedModules 
            : [...cur.completedModules, moduleId],
          xp: cur.xp + xpEarned,
          lastActive: new Date().toISOString(),
        };
        writeLocal(next);
        globalProgress = next;
        notify();
        return {
          success: true,
          message: "Guest Mode: Flag accepted locally!",
          xp_earned: xpEarned,
          xp_total: next.xp,
        };
      }
    },
    [user]
  );

  const isComplete = useCallback(
    (moduleId: string) => progress.completedModules.includes(moduleId),
    [progress.completedModules]
  );

  return { progress, completeModule, submitQuiz, submitFlag, isComplete, XP_PER_MODULE };
}
