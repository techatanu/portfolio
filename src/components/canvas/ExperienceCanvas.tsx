"use client";

import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import gsap from "gsap";
import type { PerfTier } from "@/lib/store";
import { useExperience } from "@/lib/store";
import { PortraitParticles } from "./PortraitParticles";

const DPR: Record<PerfTier, [number, number]> = { high: [1, 2], medium: [1, 1.5], low: [1, 1.25] };

/**
 * Renders the canvas from gsap.ticker, the same clock Lenis and ScrollTrigger run
 * on, so particles never lag a frame behind the DOM they're pinned to.
 */
function TickerLoop() {
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    // R3F derives frame delta from this timestamp, so pass seconds (not ms).
    const tick = () => advance(performance.now() / 1000);
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [advance]);
  return null;
}

/**
 * The one fixed, full-viewport WebGL layer behind all DOM content (spec §4.1).
 * Lazy-loaded by <Experience>. Phase 3 adds the Grid Hall + SceneDirector here.
 */
export default function ExperienceCanvas() {
  const tier = useExperience.getState().perfTier;
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-[5]">
      <Canvas
        frameloop="never"
        dpr={DPR[tier]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <TickerLoop />
        <PortraitParticles />
      </Canvas>
    </div>
  );
}
