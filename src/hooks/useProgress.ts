import { useEffect, useState, useCallback } from "react";

export interface Progress {
  completedModules: string[]; // module ids
  xp: number;
  streak: number;
  lastActive: string | null;
}

const KEY = "vaelora_progress";
const XP_PER_MODULE = 50;

const empty: Progress = { completedModules: [], xp: 0, streak: 1, lastActive: null };

function read(): Progress {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

let listeners: Array<() => void> = [];
function notify() {
  listeners.forEach((l) => l());
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(empty);

  useEffect(() => {
    setProgress(read());
    const update = () => setProgress(read());
    listeners.push(update);
    return () => {
      listeners = listeners.filter((l) => l !== update);
    };
  }, []);

  const completeModule = useCallback((moduleId: string) => {
    const cur = read();
    if (cur.completedModules.includes(moduleId)) return false;
    const next: Progress = {
      ...cur,
      completedModules: [...cur.completedModules, moduleId],
      xp: cur.xp + XP_PER_MODULE,
      lastActive: new Date().toISOString(),
    };
    localStorage.setItem(KEY, JSON.stringify(next));
    notify();
    return true;
  }, []);

  const addXp = useCallback((amount: number) => {
    const cur = read();
    const next = { ...cur, xp: cur.xp + amount, lastActive: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(next));
    notify();
  }, []);

  const isComplete = useCallback(
    (moduleId: string) => progress.completedModules.includes(moduleId),
    [progress.completedModules],
  );

  return { progress, completeModule, addXp, isComplete, XP_PER_MODULE };
}
