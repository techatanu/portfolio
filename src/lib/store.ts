/**
 * Shared scroll / input / perf state (spec §4.1).
 *
 * Written by ScrollTrigger + input listeners, read by the Canvas every frame and
 * by DOM widgets through `useExperience.subscribe` (direct DOM writes). Don't
 * select scroll fields with the hook in a component — that re-renders on scroll.
 */
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type PerfTier = "high" | "medium" | "low";

type ExperienceState = {
  /** 0 → 1 across the whole page. */
  globalProgress: number;
  /** Index into CHAPTERS of the chapter that owns the viewport centre. */
  chapter: number;
  /** 0 → 1 within the active chapter. */
  chapterProgress: number;
  /** Normalised pointer, -1 → 1 on both axes, y up. */
  pointer: { x: number; y: number };
  perfTier: PerfTier;
  reducedMotion: boolean;
  set: (partial: Partial<Omit<ExperienceState, "set">>) => void;
};

export const useExperience = create<ExperienceState>()(
  subscribeWithSelector((set) => ({
    globalProgress: 0,
    chapter: 0,
    chapterProgress: 0,
    pointer: { x: 0, y: 0 },
    perfTier: "medium",
    reducedMotion: false,
    set: (partial) => set(partial),
  })),
);
