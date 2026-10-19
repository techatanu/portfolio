"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { HALL } from "@/lib/hall";
import { hallCommon, hallUniforms } from "./uniforms";

const vertex = /* glsl */ `
  ${hallCommon}
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    world.z += uCamPos.z; // ride with the camera; pattern stays fixed in world space
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragment = /* glsl */ `
  ${hallCommon}
  varying vec3 vWorld;

  float lineMask(float d, float w) {
    return 1.0 - smoothstep(w * 0.5, w, d);
  }

  void main() {
    vec2 p = vWorld.xz;
    float rowX = ${HALL.rowX.toFixed(2)};

    // Dark polished concrete.
    vec3 col = vec3(0.018, 0.02, 0.024) + 0.02 * fbm(p * 0.7) + 0.006 * vnoise(p * 20.0);

    // Seams: a grid of slabs. Long seams run down the hall every 1.7 m, cross seams every half pillar.
    float lane = floor(p.x / 1.7 + 0.5);
    float dLong = abs(fract(p.x / 1.7 + 0.5) - 0.5) * 1.7;
    float dCross = abs(fract(p.y / (uSpacing * 0.5) + 0.5) - 0.5) * uSpacing * 0.5;
    float seam = max(lineMask(dLong, 0.025), lineMask(dCross, 0.025));
    col += uGlow * seam * 0.07;

    // Data packets: short bright pulses racing forward (−z) along the long seams.
    float lanePhase = hash12(vec2(lane, 3.0));
    float pulse = smoothstep(0.93, 1.0, fract(p.y * 0.035 + uTime * (0.22 + 0.12 * lanePhase) + lanePhase));
    col += mix(uGlow, uBlue, 0.35) * lineMask(dLong, 0.03) * pulse * 1.6;

    // Hairline cracks: ridges of low-frequency noise, faintly lit.
    float n = fbm(p * 0.35 + 11.0);
    float crack = lineMask(abs(n - 0.5), 0.012) * smoothstep(0.45, 0.7, vnoise(p * 0.2));
    col += uGlow * crack * 0.05;

    // Sparse "circuit" glyphs: tiny lit squares in a fine grid, blinking slowly.
    vec2 cell = floor(p / 0.45);
    float pick = step(0.987, hash12(cell));
    vec2 inCell = fract(p / 0.45) - 0.5;
    float glyph = step(max(abs(inCell.x), abs(inCell.y)), 0.12) * pick;
    float blink = 0.5 + 0.5 * sin(uTime * 1.3 + hash12(cell + 7.0) * 6.28);
    col += uGlow * glyph * blink * 0.35;

    // Fake glossy reflection of the ceiling strips, strongest at grazing angles.
    vec3 view = normalize(vWorld - uCamPos);
    float fresnel = pow(1.0 - abs(view.y), 4.0);
    float dz = abs(fract(p.y / uSpacing + 0.5) - 0.5) * uSpacing;
    float under = step(abs(p.x), rowX - 0.6);
    float rowsAway = max(floor((${HALL.startZ.toFixed(1)} - p.y) / uSpacing + 0.5), 0.0);
    col += uGlow * exp(-dz * dz * 6.0) * under * fresnel * 0.22 * rowLight(rowsAway);

    // Pools of light under each pillar row line.
    col += uGlow * 0.012 * (1.0 - smoothstep(0.0, 2.5, abs(abs(p.x) - rowX)));

    float dist = length(vWorld - uCamPos);
    gl_FragColor = vec4(applyFog(col, dist), 1.0);
    #include <colorspace_fragment>
  }
`;

/** Cracked concrete floor with glowing seams, forward-racing data pulses and circuit glyphs. */
export function Floor() {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(HALL.rowX * 2 + 14, 160, 1, 1);
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0, -60);
    return g;
  }, []);
  const material = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms: hallUniforms }),
    [],
  );
  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}
