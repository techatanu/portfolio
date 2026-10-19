"use client";

import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import type { PerfTier } from "@/lib/store";

const CA_OFFSET = new THREE.Vector2(0.0006, 0.0006);

/**
 * Post FX per tier (spec §4.5):
 *   high   Bloom + Chromatic aberration + Noise + Vignette
 *   medium Bloom + Vignette
 *   low    Bloom at half resolution
 * The bloom threshold sits above the portrait's brightest skin tones so only
 * emissive things (light strips, seams, pulses) glow.
 */
export function Effects({ tier }: { tier: PerfTier }) {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <Bloom
        mipmapBlur
        intensity={tier === "low" ? 0.7 : 0.95}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.25}
        resolutionScale={tier === "low" ? 0.5 : 1}
      />
      {tier === "high" && <ChromaticAberration offset={CA_OFFSET} radialModulation modulationOffset={0.25} />}
      {tier === "high" && <Noise opacity={0.045} premultiply blendFunction={BlendFunction.SCREEN} />}
      {tier !== "low" && <Vignette offset={0.28} darkness={0.75} />}
    </EffectComposer>
  );
}
