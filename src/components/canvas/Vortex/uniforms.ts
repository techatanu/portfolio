/**
 * Uniforms for the starfield (the site's one 3D layer). Mutated once per frame by SceneDirector.
 */
import * as THREE from "three";

export const vortexUniforms = {
  /** Animation clock. */
  uTime: { value: 0 },
  /** 0 → 1 fade-in on load. */
  uMix: { value: 0 },
  /** Centre of the star shell: far ahead at the top, close by Contact, so you drift into the stars. */
  uCenter: { value: new THREE.Vector3(0, 0, -120) },
};
