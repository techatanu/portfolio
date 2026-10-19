/**
 * Uniforms shared by World B (the code singularity). Mutated once per frame by
 * SceneDirector; every Vortex material references this one object.
 */
import * as THREE from "three";

export const vortexUniforms = {
  uTime: { value: 0 },
  /** 0 = World B hidden, 1 = fully visible (ramps in across the Experience chapter). */
  uMix: { value: 0 },
  /** World position of the black hole's centre (kept ahead of the camera). */
  uCenter: { value: new THREE.Vector3(0, 0, -40) },
  /** How far in front of the centre (towards the camera) the code streams start. */
  uFront: { value: 14 },
  uAmber: { value: new THREE.Color("#ffb36b") }, // --accent-amber
  uGlow: { value: new THREE.Color("#cfe3ff") }, // --glow
};
