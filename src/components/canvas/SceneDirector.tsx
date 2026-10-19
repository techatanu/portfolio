"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { chapterById } from "@/lib/chapters";
import { cameraZForScroll, HALL } from "@/lib/hall";
import { useExperience } from "@/lib/store";
import { hallUniforms } from "./GridHall/uniforms";
import { RESOLUTION } from "./Vortex/CodeStream";
import { vortexUniforms } from "./Vortex/uniforms";

const SKILLS = chapterById("skills").index;
const TIMELINE = chapterById("timeline").index;

/** World A → B crossfade happens across the Experience chapter (spec CH.04 transition). */
const worldBMix = (s: number) => THREE.MathUtils.smoothstep(s, TIMELINE + 0.15, TIMELINE + 0.9);
/** Then the camera drifts towards the core through "What I'm looking for" and Contact. */
const approach = (s: number) => THREE.MathUtils.smoothstep(s, TIMELINE + 0.6, TIMELINE + 2.8);
const DEG = Math.PI / 180;

/** Exponential damping: frame-rate independent ease towards a target. */
const damp = (current: number, target: number, lambda: number, dt: number) =>
  THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));

/**
 * Reads the store every frame (spec §4.1) and drives the camera dolly, pointer
 * sway and the shared hall uniforms. Never causes a React render.
 */
export function SceneDirector() {
  // Camera/scene are mutable three objects: read them via get()/frame state, not as hook values.
  const get = useThree((s) => s.get);
  const sway = useRef({ x: 0, y: 0 });
  const worlds = useRef<{ hall?: THREE.Object3D; vortex?: THREE.Object3D }>({});

  useEffect(() => {
    const { camera, scene } = get();
    // The void behind the fog: match the fog colour so the hall dissolves into it seamlessly.
    scene.background = hallUniforms.uFogColor.value;
    camera.rotation.order = "YXZ";
    camera.position.set(0, HALL.eyeHeight, HALL.startZ);

    // Intro: lights flicker on row by row (spec CH.00).
    hallUniforms.uLights.value = 0;
    const tween = gsap.to(hallUniforms.uLights, { value: 1, duration: 2.8, delay: 0.25, ease: "power1.inOut" });
    return () => {
      tween.kill();
      scene.background = null;
    };
  }, [get]);

  useFrame(({ camera, scene, size }, rawDelta) => {
    const dt = Math.min(rawDelta, 0.1); // clamp after tab switches
    const { chapter, chapterProgress, pointer } = useExperience.getState();
    const s = chapter + chapterProgress;

    // Dolly: scroll position → hall depth, eased so the camera glides rather than snaps.
    const targetZ = cameraZForScroll(chapter + chapterProgress);
    camera.position.z = damp(camera.position.z, targetZ, 3.5, dt);

    // Gentle pointer sway (±2° yaw, ±1.2° pitch) plus a slow breathing bob.
    sway.current.x = damp(sway.current.x, pointer.x, 2.5, dt);
    sway.current.y = damp(sway.current.y, pointer.y, 2.5, dt);
    camera.rotation.y = -sway.current.x * 2 * DEG;
    camera.rotation.x = sway.current.y * 1.2 * DEG;
    hallUniforms.uTime.value += dt;
    camera.position.y = HALL.eyeHeight + Math.sin(hallUniforms.uTime.value * 0.6) * 0.03;

    hallUniforms.uCamPos.value.copy(camera.position);

    // World A ↔ B. Damped so jumping via the nav still fades instead of popping.
    const mix = damp(vortexUniforms.uMix.value, worldBMix(s), 3, dt);
    vortexUniforms.uMix.value = mix;
    hallUniforms.uHallFade.value = 1 - mix;
    const w = worlds.current;
    w.hall ??= scene.getObjectByName("hall");
    w.vortex ??= scene.getObjectByName("vortex");
    if (w.hall) w.hall.visible = mix < 0.999; // skip drawing a fully faded world
    if (w.vortex) w.vortex.visible = mix > 0.001;

    // The singularity sits ahead of the camera, a little right of centre (clear of the
    // left-aligned text), and draws closer as you read on.
    const dist = THREE.MathUtils.lerp(46, 20, approach(s));
    vortexUniforms.uCenter.value.set(camera.position.x + 4.5, camera.position.y + 0.6, camera.position.z - dist);
    vortexUniforms.uFront.value = Math.min(10, dist * 0.35); // streams start well in front of the camera
    vortexUniforms.uTime.value = hallUniforms.uTime.value;
    RESOLUTION.value.set(size.width, size.height);
    hallUniforms.uSkillGlow.value = damp(hallUniforms.uSkillGlow.value, chapter === SKILLS ? 1 : 0, 2, dt);
  });

  return null;
}
