"use client";

import type { PerfTier } from "@/lib/store";
import { BlackHole } from "./BlackHole";
import { CodeStream } from "./CodeStream";
import { Starfield } from "./Starfield";

const STARS: Record<PerfTier, number> = { high: 2500, medium: 1600, low: 900 };

/**
 * World B — the code singularity: lines of code spiralling into a black hole.
 * An original, procedural composition (references are mood only, never used here).
 * SceneDirector hides the group entirely while `uMix` is 0.
 */
export function Vortex({ tier }: { tier: PerfTier }) {
  return (
    <group name="vortex">
      <Starfield count={STARS[tier]} />
      <CodeStream tier={tier} />
      <BlackHole />
    </group>
  );
}
