"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { vortexUniforms } from "./uniforms";

/** World-space radius of the billboard; the horizon is ~22% of it. */
const SIZE = 9;

const vertex = /* glsl */ `
  uniform vec3 uCenter;
  varying vec2 vP;
  void main() {
    // Camera-facing billboard: offset the corners in view space.
    vec4 mv = viewMatrix * vec4(uCenter, 1.0);
    mv.xy += position.xy * ${SIZE.toFixed(1)};
    vP = position.xy; // -1..1
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform float uTime;
  uniform float uMix;
  uniform vec3 uAmber;
  uniform vec3 uGlow;
  varying vec2 vP;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash12(i), hash12(i + vec2(1, 0)), u.x), mix(hash12(i + vec2(0, 1)), hash12(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * vnoise(p); p *= 2.1; a *= 0.5; }
    return v;
  }

  // Accretion disk seen at a steep tilt: an ellipse in the billboard plane.
  // Returns emitted light (HDR) for a point p, given the ellipse squash and a brightness.
  vec3 disk(vec2 p, float squash, float gain) {
    vec2 q = vec2(p.x, p.y / squash);
    float r = length(q);
    float a = atan(q.y, q.x);
    float band = smoothstep(0.24, 0.3, r) * (1.0 - smoothstep(0.42, 0.95, r));
    // Turbulent streaks that orbit (faster near the centre).
    float swirl = fbm(vec2(a * 3.0 - uTime * (0.9 / max(r, 0.25)), r * 7.0));
    float streaks = 0.35 + 0.9 * swirl;
    // Doppler beaming: the side moving towards us is brighter.
    float doppler = 0.55 + 0.45 * cos(a + 0.6);
    float heat = band * streaks * doppler * gain;
    // Hot white inner edge → amber → deep orange outskirts.
    vec3 col = mix(uAmber * vec3(1.0, 0.55, 0.3), uAmber, smoothstep(0.0, 0.5, heat));
    col = mix(col, vec3(1.0, 0.95, 0.88), smoothstep(0.7, 1.4, heat));
    return col * heat;
  }

  void main() {
    vec2 p = vP;
    float r = length(p);
    float horizon = 0.22;

    float hole = 1.0 - smoothstep(horizon - 0.01, horizon, r);

    // Behind the hole: the lensed far side of the disk bent up and over the top,
    // the thin photon ring hugging the horizon, and a soft halo. The horizon hides these.
    vec3 back = disk(vec2(p.x, p.y - 0.02), 0.95, 1.5) * smoothstep(-0.02, 0.06, p.y)
              * (1.0 - smoothstep(0.25, 0.55, r));
    float ring = exp(-pow((r - horizon - 0.012) / 0.012, 2.0));
    back += mix(uAmber, vec3(1.0), 0.6) * ring * 2.4;
    back += uAmber * 0.08 * exp(-r * 4.0);

    // The near half of the flat disk (lower half on screen) crosses in front of the hole;
    // its far half is behind it.
    vec3 nearDisk = disk(p, 0.24, 2.8); // ("flat" is a reserved word in GLSL ES 3)
    float inFront = 1.0 - smoothstep(-0.01, 0.01, p.y);
    vec3 light = (back + nearDisk * (1.0 - inFront)) * (1.0 - hole) + nearDisk * inFront;

    float edge = 1.0 - smoothstep(0.75, 1.0, r); // fade the billboard's square edge
    light *= edge * uMix;
    // Premultiplied output: colour adds light, alpha blacks out the horizon.
    gl_FragColor = vec4(light, hole * uMix);
    #include <colorspace_fragment>
  }
`;

/** The black hole at the centre of the code singularity (procedural, original). */
export function BlackHole() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: vortexUniforms,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        // Premultiplied: dst = src.rgb + dst × (1 − src.a). Light adds; the horizon occludes.
        blending: THREE.CustomBlending,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor,
      }),
    [],
  );
  return <mesh material={material} frustumCulled={false} renderOrder={2} geometry={PLANE} />;
}

const PLANE = new THREE.PlaneGeometry(2, 2);
