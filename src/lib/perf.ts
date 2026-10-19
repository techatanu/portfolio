import { getGPUTier } from "detect-gpu";
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

/**
 * Spec §4.5 tiers from detect-gpu: mobile or GPU tier 0 → low, tier 1 → medium,
 * desktop tier ≥ 2 → high. Benchmarks are self-hosted (scripts/copy-gpu-benchmarks.mjs).
 * Returns null if detection fails, so the caller keeps its first guess.
 */
export async function detectPerfTier(): Promise<PerfTier | null> {
  try {
    const gpu = await getGPUTier({ benchmarksURL: "/gpu-benchmarks" });
    if (gpu.isMobile || gpu.tier <= 0) return "low";
    if (gpu.tier === 1) return "medium";
    return "high";
  } catch {
    return null;
  }
}
