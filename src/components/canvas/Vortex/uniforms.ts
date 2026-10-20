/**
 * Uniforms shared by the code singularity (the site's one 3D world). Mutated
 * once per frame by SceneDirector; every Vortex material references this object.
 */
import * as THREE from "three";

export const vortexUniforms = {
  /** Animation clock. Runs faster while you scroll fast (warp). */
  uTime: { value: 0 },
  /** 0 → 1 fade-in on load. */
  uMix: { value: 0 },
  /** World position of the black hole's centre: far away at the top, close by Contact. */
  uCenter: { value: new THREE.Vector3(0, 0, -120) },
  /** How far in front of the centre (towards the camera) the code streams start. */
  uFront: { value: 10 },
  /** 0 = idle, 1 = scrolling fast: drives speed lines, stream speed and camera punch. */
  uWarp: { value: 0 },
  /** Distance travelled by the speed lines (accumulates; faster while warping). */
  uTravel: { value: 0 },
  uAmber: { value: new THREE.Color("#ffb36b") }, // --accent-amber
  uGlow: { value: new THREE.Color("#cfe3ff") }, // --glow
};
