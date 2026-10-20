"use client";

import { useEffect } from "react";
import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import gsap from "gsap";
import type { PerfTier } from "@/lib/store";
import { useExperience } from "@/lib/store";
import { Effects } from "./Effects";
import { PortraitParticles } from "./PortraitParticles";
import { SceneDirector } from "./SceneDirector";
import { Vortex } from "./Vortex/Vortex";

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

const DOWNGRADE: Record<PerfTier, PerfTier> = { high: "medium", medium: "low", low: "low" };

/**
 * The one fixed, full-viewport WebGL layer behind all DOM content (spec §4.1).
 * Lazy-loaded by <Experience>. The code singularity (whole-page background) and the
 * hero portrait. Re-renders only when the perf tier changes.
 */
export default function ExperienceCanvas() {
  const tier = useExperience((s) => s.perfTier);
  const [minDpr, maxDpr] = DPR[tier];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-[5]">
      <Canvas
        frameloop="never"
        flat
        dpr={[minDpr, maxDpr]}
        camera={{ fov: 55, near: 0.1, far: 300, position: [0, 0, 6] }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <TickerLoop />
        {/* Sustained low fps → step down one tier (fewer particles, cheaper post FX, lower DPR). */}
        <PerformanceMonitor
          flipflops={2}
          onDecline={() => {
            const { perfTier, set } = useExperience.getState();
            set({ perfTier: DOWNGRADE[perfTier] });
          }}
        />
        <SceneDirector />
        <Vortex tier={tier} />
        <PortraitParticles />
        <Effects tier={tier} />
      </Canvas>
    </div>
  );
}
