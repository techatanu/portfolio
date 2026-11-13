"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { CHAPTERS } from "@/lib/chapters";
import { useExperience } from "@/lib/store";
import { vortexUniforms } from "./Vortex/uniforms";

const DEG = Math.PI / 180;
const LAST = CHAPTERS.length - 1;

/** Exponential damping: frame-rate independent ease towards a target. */
const damp = (current: number, target: number, lambda: number, dt: number) =>
  THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));

/**
 * Reads the store every frame (spec §4.1) and moves the background, quietly:
 *  - scroll position → how deep into the starfield you are (it starts far ahead and
 *    surrounds you by Contact),
 *  - pointer → a very small camera sway.
 * Never causes a React render.
 */
export function SceneDirector() {
  // Camera/scene are mutable three objects: read them via get()/frame state, not as hook values.
  const get = useThree((s) => s.get);
  const sway = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const { camera, scene } = get();
    scene.background = new THREE.Color("#0a192f"); // --bg
    camera.rotation.order = "YXZ";
    camera.position.set(0, 0, 6);
    // Fade the stars in on load.
    vortexUniforms.uMix.value = 0;
    const tween = gsap.to(vortexUniforms.uMix, { value: 1, duration: 2.2, delay: 0.2, ease: "power2.out" });
    return () => {
      tween.kill();
      scene.background = null;
    };
  }, [get]);

  useFrame(({ camera }, rawDelta) => {
    const dt = Math.min(rawDelta, 0.1); // clamp after tab switches
    const { chapter, chapterProgress, pointer } = useExperience.getState();
    const u = vortexUniforms;
    u.uTime.value += dt;

    // Approach: the star shell starts far ahead and closes in around the camera by Contact.
    const p = THREE.MathUtils.smootherstep((chapter + chapterProgress) / LAST, 0, 1);
    const dist = THREE.MathUtils.lerp(120, 20, p);
    u.uCenter.value.set(4.5 * (0.4 + 0.6 * p), 0.4, camera.position.z - dist);

    // Camera: gentle pointer sway (±2°).
    const s = sway.current;
    s.x = damp(s.x, pointer.x, 2.5, dt);
    s.y = damp(s.y, pointer.y, 2.5, dt);
    camera.rotation.y = -s.x * 2 * DEG;
    camera.rotation.x = s.y * 1.2 * DEG;
  });

  return null;
}
