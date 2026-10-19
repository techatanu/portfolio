"use client";

import { useEffect } from "react";
import { detectPerfTier, guessPerfTier, REDUCED_MOTION_QUERY } from "@/lib/perf";
import { useExperience } from "@/lib/store";

/** Seeds `perfTier` and keeps `reducedMotion` in sync with the OS setting. */
export function PerfProvider() {
  useEffect(() => {
    const { set } = useExperience.getState();
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => set({ reducedMotion: motionQuery.matches });

    set({ perfTier: guessPerfTier() });
    // Refine with real GPU benchmarks; the canvas re-reads the tier when it changes.
    let alive = true;
    detectPerfTier().then((tier) => {
      if (alive && tier) set({ perfTier: tier });
    });
    sync();
    motionQuery.addEventListener("change", sync);
    return () => {
      alive = false;
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  return null;
}
