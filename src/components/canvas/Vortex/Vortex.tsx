"use client";

import type { PerfTier } from "@/lib/store";
import { Starfield } from "./Starfield";

const STARS: Record<PerfTier, number> = { high: 2500, medium: 1600, low: 900 };

/**
 * The page's 3D background: a quiet starfield you drift through as you scroll.
 * The black hole, code streams and warp speed lines were removed at Atanu's request (Nov 2026).
 */
export function Vortex({ tier }: { tier: PerfTier }) {
  return (
    <group name="vortex">
      <Starfield count={STARS[tier]} />
    </group>
  );
}
