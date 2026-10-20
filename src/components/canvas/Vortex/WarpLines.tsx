"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/random";
import type { PerfTier } from "@/lib/store";
import { RESOLUTION } from "./CodeStream";
import { vortexUniforms } from "./uniforms";

const COUNT: Record<PerfTier, number> = { high: 700, medium: 450, low: 240 };

const vertex = /* glsl */ `
  uniform float uTravel;
  uniform float uWarp;
  uniform float uMix;
  uniform vec2 uResolution;

  attribute vec2 aPolar;  // angle, radius around the flight axis
  attribute float aZ0;    // starting depth offset
  attribute float aSeed;

  varying float vAlpha;
  varying float vAlong;
  varying float vAmber;

  vec2 toPixels(vec4 clip) { return clip.xy / clip.w * 0.5 * uResolution; }

  void main() {
    // Lines live in a tube around the camera and fly towards it, wrapping at the far end.
    float z = -125.0 + mod(aZ0 + uTravel * (0.6 + 0.8 * aSeed), 124.0);
    vec3 head = cameraPosition + vec3(cos(aPolar.x) * aPolar.y, sin(aPolar.x) * aPolar.y * 0.7, z);
    // Streak length grows with scroll speed: dots when idle, long streaks in warp.
    float len = 0.3 + uWarp * (5.0 + 9.0 * aSeed);
    vec3 tail = head - vec3(0.0, 0.0, len);

    mat4 vp = projectionMatrix * viewMatrix;
    vec4 ch = vp * vec4(head, 1.0);
    vec4 ct = vp * vec4(tail, 1.0);
    vec2 ph = toPixels(ch);
    vec2 pt = toPixels(ct);
    vec2 dir = ph - pt;
    float L = length(dir);
    dir = L > 1e-3 ? dir / L : vec2(0.0, 1.0);
    vec2 perp = vec2(-dir.y, dir.x);

    // position.y: −0.5 (tail) → 0.5 (head); position.x: across, in pixels.
    float along = position.y + 0.5;
    vec4 clip = mix(ct, ch, along);
    vec2 px = mix(pt, ph, along) + perp * position.x * (1.0 + 1.2 * aSeed);
    gl_Position = vec4(px / (0.5 * uResolution) * clip.w, clip.z, clip.w);

    float fade = smoothstep(-125.0, -85.0, z) * (1.0 - smoothstep(-6.0, -1.0, z));
    vAlpha = uMix * fade * (0.12 + 0.88 * uWarp);
    vAlong = along;
    vAmber = step(0.86, aSeed);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uGlow;
  uniform vec3 uAmber;
  varying float vAlpha;
  varying float vAlong;
  varying float vAmber;
  void main() {
    // Transparent tail → bright head, like light streaking past.
    vec3 col = mix(uGlow, uAmber, vAmber) * (0.4 + 1.6 * vAlong);
    gl_FragColor = vec4(col * vAlpha * vAlong, 1.0);
    #include <colorspace_fragment>
  }
`;

/** Warp speed lines: dots drifting by at rest, long streaks when you scroll fast. */
export function WarpLines({ tier }: { tier: PerfTier }) {
  const count = COUNT[tier];
  const geometry = useMemo(() => {
    const quad = new THREE.PlaneGeometry(1, 1);
    const g = new THREE.InstancedBufferGeometry();
    g.index = quad.index;
    g.setAttribute("position", quad.getAttribute("position"));
    const polar = new Float32Array(count * 2);
    const z0 = new Float32Array(count);
    const seed = new Float32Array(count);
    const rand = mulberry32(0x3a7f);
    for (let i = 0; i < count; i++) {
      polar[i * 2] = rand() * Math.PI * 2;
      polar[i * 2 + 1] = 2.5 + Math.pow(rand(), 0.7) * 16; // keep a clear hole down the middle
      z0[i] = rand() * 124;
      seed[i] = rand();
    }
    g.setAttribute("aPolar", new THREE.InstancedBufferAttribute(polar, 2));
    g.setAttribute("aZ0", new THREE.InstancedBufferAttribute(z0, 1));
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seed, 1));
    g.instanceCount = count;
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: { ...vortexUniforms, uResolution: RESOLUTION },
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  return <mesh geometry={geometry} material={material} frustumCulled={false} renderOrder={1} />;
}
