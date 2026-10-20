"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { CHAPTERS } from "@/lib/chapters";
import { useExperience } from "@/lib/store";
import { RESOLUTION } from "./Vortex/CodeStream";
import { vortexUniforms } from "./Vortex/uniforms";

const DEG = Math.PI / 180;
const LAST = CHAPTERS.length - 1;
const FOV = 55;

/** Exponential damping: frame-rate independent ease towards a target. */
const damp = (current: number, target: number, lambda: number, dt: number) =>
  THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));

/**
 * Reads the store every frame (spec §4.1) and drives the "warp flight":
 *  - scroll position → how close the black hole is (far and small at the top, filling
 *    the view by Contact),
 *  - scroll speed → warp: speed lines stretch, code streams speed up, the camera's field
 *    of view punches out and it shakes slightly — like boosting in a game.
 * Never causes a React render.
 */
export function SceneDirector() {
  // Camera/scene are mutable three objects: read them via get()/frame state, not as hook values.
  const get = useThree((s) => s.get);
  const flight = useRef({ lastS: 0, warp: 0, swayX: 0, swayY: 0 });

  useEffect(() => {
    const { camera, scene } = get();
    scene.background = new THREE.Color("#050506"); // --bg
    camera.rotation.order = "YXZ";
    camera.position.set(0, 0, 6);
    // Fade the singularity in on load.
    vortexUniforms.uMix.value = 0;
    const tween = gsap.to(vortexUniforms.uMix, { value: 1, duration: 2.2, delay: 0.2, ease: "power2.out" });
    return () => {
      tween.kill();
      scene.background = null;
    };
  }, [get]);

  useFrame(({ camera, size }, rawDelta) => {
    const dt = Math.min(rawDelta, 0.1); // clamp after tab switches
    const { chapter, chapterProgress, pointer } = useExperience.getState();
    const s = chapter + chapterProgress;
    const f = flight.current;
    const u = vortexUniforms;

    // Warp: scroll speed in chapters/second → 0..1. Builds fast, eases off slowly.
    const speed = Math.abs(s - f.lastS) / Math.max(dt, 1e-3);
    f.lastS = s;
    const target = Math.min(speed * 1.5, 1);
    f.warp = damp(f.warp, target, target > f.warp ? 9 : 2.2, dt);
    u.uWarp.value = f.warp;
    u.uTime.value += dt * (1 + f.warp * 5);
    u.uTravel.value += dt * (3 + f.warp * 120);

    // Approach: the black hole is a distant spark in the hero and fills the view by Contact.
    const p = THREE.MathUtils.smootherstep(s / LAST, 0, 1);
    const dist = THREE.MathUtils.lerp(120, 20, p);
    u.uCenter.value.set(4.5 * (0.4 + 0.6 * p), 0.4, camera.position.z - dist);
    u.uFront.value = Math.min(10, dist * 0.35);

    // Camera: gentle pointer sway (±2°), a field-of-view punch and a little shake in warp.
    f.swayX = damp(f.swayX, pointer.x, 2.5, dt);
    f.swayY = damp(f.swayY, pointer.y, 2.5, dt);
    const shake = f.warp * f.warp * 0.004;
    camera.rotation.y = -f.swayX * 2 * DEG + (Math.random() - 0.5) * shake;
    camera.rotation.x = f.swayY * 1.2 * DEG + (Math.random() - 0.5) * shake;
    const cam = camera as THREE.PerspectiveCamera;
    const fov = FOV + f.warp * 12;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    RESOLUTION.value.set(size.width, size.height);
  });

  return null;
}
