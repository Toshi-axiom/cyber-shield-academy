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
    // 1. Sync modules
    const moduleInserts = local.completedModules.map((mid) => ({
      user_id: userId,
      module_id: mid,
    }));
    const { error: modErr } = await supabase
      .from("user_progress")
      .upsert(moduleInserts, { onConflict: "user_id,module_id" });

    if (modErr) throw modErr;

    // 2. Fetch current stats
    const { data: stats } = await supabase
      .from("user_stats")
      .select("xp")
      .eq("user_id", userId)
      .maybeSingle();

    // 3. Update stats with cumulative XP
    const newXp = (stats?.xp ?? 0) + local.xp;
    const { error: statsErr } = await supabase
      .from("user_stats")
      .update({ xp: newXp, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (statsErr) throw statsErr;

    // 4. Clear local guest progress
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
          // 1. Insert module completion
          const { error: modErr } = await supabase
            .from("user_progress")
            .insert({ user_id: user.id, module_id: moduleId });

          if (modErr) throw modErr;

          // 2. Increment XP on user stats
          const newXp = globalProgress.xp + XP_PER_MODULE;
          const { error: statsErr } = await supabase
            .from("user_stats")
            .update({ xp: newXp, updated_at: new Date().toISOString() })
            .eq("user_id", user.id);

          if (statsErr) throw statsErr;

          // 3. Update local cache
          globalProgress = {
            ...globalProgress,
            completedModules: [...globalProgress.completedModules, moduleId],
            xp: newXp,
            lastActive: new Date().toISOString(),
          };
          notify();
          return true;
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

  const addXp = useCallback(
    async (amount: number) => {
      if (user) {
        try {
          const newXp = globalProgress.xp + amount;
          const { error } = await supabase
            .from("user_stats")
            .update({ xp: newXp, updated_at: new Date().toISOString() })
            .eq("user_id", user.id);

          if (error) throw error;

          globalProgress = {
            ...globalProgress,
            xp: newXp,
            lastActive: new Date().toISOString(),
          };
          notify();
        } catch (err) {
          console.error("Error adding XP to DB:", err);
        }
      } else {
        // Guest mode fallback
        const cur = readLocal();
        const next = {
          ...cur,
          xp: cur.xp + amount,
          lastActive: new Date().toISOString(),
        };
        writeLocal(next);
        globalProgress = next;
        notify();
      }
    },
    [user]
  );

  const isComplete = useCallback(
    (moduleId: string) => progress.completedModules.includes(moduleId),
    [progress.completedModules]
  );

  return { progress, completeModule, addXp, isComplete, XP_PER_MODULE };
}
