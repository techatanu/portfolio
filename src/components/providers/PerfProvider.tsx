"use client";

import { useEffect } from "react";
import { guessPerfTier, REDUCED_MOTION_QUERY } from "@/lib/perf";
import { useExperience } from "@/lib/store";

/** Seeds `perfTier` and keeps `reducedMotion` in sync with the OS setting. */
export function PerfProvider() {
  useEffect(() => {
    const { set } = useExperience.getState();
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => set({ reducedMotion: motionQuery.matches });

    set({ perfTier: guessPerfTier() });
    sync();
    motionQuery.addEventListener("change", sync);
    return () => motionQuery.removeEventListener("change", sync);
  }, []);

  return null;
}
