import type { PerfTier } from "./store";

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * First-guess tier from cheap device hints, available synchronously on mount.
 * Phase 3 refines it with detect-gpu + drei PerformanceMonitor (spec §4.5).
 */
export function guessPerfTier(): PerfTier {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  if (coarse || cores <= 4 || memory <= 2) return "low";
  if (cores >= 8 && memory >= 8) return "high";
  return "medium";
}
