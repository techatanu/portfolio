"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/random";
import { vortexUniforms } from "./uniforms";

const vertex = /* glsl */ `
  uniform vec3 uCenter;
  attribute float aSeed;
  varying float vAlpha;
  void main() {
    // A shell of stars around the singularity, drifting slowly so the void feels alive.
    vec3 p = position;
    float a = 0.004 * uTime * (0.5 + aSeed);
    p.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * p.xz;
    vec4 mv = viewMatrix * vec4(uCenter + p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = 1.0 + 1.8 * aSeed * aSeed;
    vAlpha = (0.25 + 0.75 * aSeed) * uMix;
  }
`;

const fragment = /* glsl */ `
  uniform float uMix;
  uniform vec3 uAmber;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = vAlpha * (1.0 - smoothstep(0.15, 0.5, d));
    if (a < 0.01) discard;
    gl_FragColor = vec4(vec3(0.85, 0.88, 1.0) * a, 1.0);
    #include <colorspace_fragment>
  }
`;

/** Static-ish starfield behind the code singularity (spec: "separate static point layer"). */
export function Starfield({ count }: { count: number }) {
  const geometry = useMemo(() => {
    const rand = mulberry32(0x57a2);
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Uniform direction on a sphere, radius 60–140 world units.
      const u = rand() * 2 - 1;
      const t = rand() * Math.PI * 2;
      const r = 60 + rand() * 80;
      const k = Math.sqrt(1 - u * u);
      pos[i * 3] = k * Math.cos(t) * r;
      pos[i * 3 + 1] = u * r;
      pos[i * 3 + 2] = k * Math.sin(t) * r;
      seed[i] = rand();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: vortexUniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );
  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={0} />;
}
