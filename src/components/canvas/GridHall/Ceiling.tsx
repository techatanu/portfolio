"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { HALL } from "@/lib/hall";
import { hallCommon, hallUniforms } from "./uniforms";

const vertex = /* glsl */ `
  ${hallCommon}
  varying vec3 vWorld;
  void main() {
    // The plane rides along with the camera; the pattern is in world space so it doesn't slide.
    vec4 world = modelMatrix * vec4(position, 1.0);
    world.z += uCamPos.z;
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragment = /* glsl */ `
  ${hallCommon}
  varying vec3 vWorld;

  // Distance to the nearest line of a repeating grid, in world units.
  float gridDist(float v, float period) {
    return abs(fract(v / period + 0.5) - 0.5) * period;
  }

  void main() {
    float rowX = ${HALL.rowX.toFixed(2)};
    float x = vWorld.x;

    // Coffers: dark recessed panels framed by beams across the hall at every pillar.
    float beam = 1.0 - smoothstep(0.22, 0.3, gridDist(vWorld.z, uSpacing));
    float rail = 1.0 - smoothstep(0.22, 0.3, abs(abs(x) - rowX));
    vec3 col = vec3(0.025, 0.028, 0.034) + vec3(0.03) * max(beam, rail) + 0.012 * vnoise(vWorld.xz * 3.0);

    // Light strips: thin cold-white tubes along each beam, between the rows, plus one down the centre.
    float rowsAway = floor((${HALL.startZ.toFixed(1)} - vWorld.z) / uSpacing + 0.5);
    float onBeam = (1.0 - smoothstep(0.02, 0.05, gridDist(vWorld.z, uSpacing))) * step(abs(x), rowX - 0.6);
    float centre = (1.0 - smoothstep(0.02, 0.05, abs(x))) * (1.0 - beam);
    float strip = max(onBeam, centre * 0.8) * rowLight(max(rowsAway, 0.0));
    col += uGlow * strip * 3.2;

    float dist = length(vWorld - uCamPos);
    gl_FragColor = vec4(applyFog(col, dist), 1.0);
    #include <colorspace_fragment>
  }
`;

/** Coffered ceiling with emissive light strips; one large plane that follows the camera. */
export function Ceiling() {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(HALL.rowX * 2 + 6, 160, 1, 1);
    g.rotateX(Math.PI / 2); // face down
    g.translate(0, HALL.height, -60); // mostly ahead of the camera
    return g;
  }, []);
  const material = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms: hallUniforms }),
    [],
  );
  return <mesh geometry={geometry} material={material} frustumCulled={false} />;
}
