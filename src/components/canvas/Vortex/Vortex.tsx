"use client";

import type { PerfTier } from "@/lib/store";
import { BlackHole } from "./BlackHole";
import { CodeStream } from "./CodeStream";
import { Starfield } from "./Starfield";
import { WarpLines } from "./WarpLines";

const STARS: Record<PerfTier, number> = { high: 2500, medium: 1600, low: 900 };

/**
 * The code singularity — the page's background from top to bottom: lines of code
 * spiralling into a black hole, with warp speed lines that streak when you scroll fast.
 * An original, procedural composition (references are mood only, never used here).
 */
export function Vortex({ tier }: { tier: PerfTier }) {
  return (
    <group name="vortex">
      <Starfield count={STARS[tier]} />
      <WarpLines tier={tier} />
      <CodeStream tier={tier} />
      <BlackHole />
    </group>
  );
}
