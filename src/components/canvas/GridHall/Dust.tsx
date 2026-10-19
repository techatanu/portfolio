"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { HALL } from "@/lib/hall";
import { mulberry32 } from "@/lib/random";
import { hallCommon, hallUniforms } from "./uniforms";

/** Size of the box of dust that travels with the camera (it wraps, so it never runs out). */
const BOX = new THREE.Vector3(HALL.rowX * 2 + 2, HALL.height, 36);

const vertex = /* glsl */ `
  ${hallCommon}
  attribute float aSeed;
  uniform float uDpr;
  varying float vAlpha;

  void main() {
    // position = random point in a unit box; drift slowly up and sideways, then wrap around the camera.
    vec3 box = vec3(${BOX.x.toFixed(1)}, ${BOX.y.toFixed(1)}, ${BOX.z.toFixed(1)});
    vec3 drift = vec3(sin(uTime * 0.1 + aSeed * 40.0) * 0.4, uTime * (0.05 + 0.08 * aSeed), 0.0);
    vec3 p = position * box + drift;
    p.x = mod(p.x, box.x) - box.x * 0.5;
    p.y = mod(p.y, box.y);
    p.z = uCamPos.z + 2.0 - mod(uCamPos.z - p.z, box.z); // keep the box just ahead of the camera

    vec4 mv = viewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // Capped so a mote drifting right past the lens never becomes a big glowing blob.
    gl_PointSize = min((1.0 + 2.0 * aSeed) * uDpr * (6.0 / -mv.z), 5.0 * uDpr);

    float dist = -mv.z;
    vAlpha = (0.25 + 0.35 * aSeed) * (1.0 - smoothstep(10.0, 34.0, dist)) * smoothstep(0.3, 1.5, dist) * uLights * uHallFade;
  }
`;

const fragment = /* glsl */ `
  ${hallCommon}
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = vAlpha * (1.0 - smoothstep(0.1, 0.5, d));
    if (a < 0.01) discard;
    gl_FragColor = vec4(uGlow * 0.9, a);
    #include <colorspace_fragment>
  }
`;

/** Drifting dust motes catching the strip light (additive points around the camera). */
export function Dust({ count, dpr }: { count: number; dpr: number }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const rand = mulberry32(0xd057);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = rand();
      pos[i * 3 + 1] = rand();
      pos[i * 3 + 2] = rand();
      seed[i] = rand();
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: { ...hallUniforms, uDpr: { value: dpr } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [dpr],
  );

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}
