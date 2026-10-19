"use client";

import type { PerfTier } from "@/lib/store";
import { Ceiling } from "./Ceiling";
import { Dust } from "./Dust";
import { Floor } from "./Floor";
import { Pillars } from "./Pillars";

const DUST: Record<PerfTier, number> = { high: 3500, medium: 2200, low: 1200 };

/** World A (spec §2.2): the endless lit concrete hall. */
export function GridHall({ tier, dpr }: { tier: PerfTier; dpr: number }) {
  return (
    <group name="hall">
      <Floor />
      <Ceiling />
      <Pillars />
      <Dust count={DUST[tier]} dpr={dpr} />
    </group>
  );
}
