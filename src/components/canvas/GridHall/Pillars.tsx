"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { HALL } from "@/lib/hall";
import { hallCommon, hallUniforms } from "./uniforms";

const vertex = /* glsl */ `
  ${hallCommon}
  attribute float aIndex; // position along the row (0 = entrance)

  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vHeight; // 0 at the floor, 1 at the ceiling
  varying float vIndex;

  void main() {
    vec4 world = modelMatrix * instanceMatrix * vec4(position, 1.0);
    // Instance translation z is the pillar's base slot; wrap it around the camera.
    float baseZ = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).z;
    world.z += wrapZ(baseZ) - baseZ;

    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix * instanceMatrix) * normal);
    vHeight = clamp(world.y / ${HALL.height.toFixed(1)}, 0.0, 1.0);
    vIndex = aIndex;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragment = /* glsl */ `
  ${hallCommon}
  varying vec3 vWorld;
  varying vec3 vNormal;
  varying float vHeight;
  varying float vIndex;

  void main() {
    // Board-formed concrete: low-frequency blotches + fine grain + faint horizontal pour lines.
    vec2 uv = vec2(vWorld.x + vWorld.z, vWorld.y);
    float concrete = 0.13 + 0.07 * fbm(uv * 0.9) + 0.03 * vnoise(uv * 14.0);
    concrete *= 0.92 + 0.08 * smoothstep(0.0, 0.04, abs(fract(vWorld.y * 0.85) - 0.5));

    // Light comes from the ceiling strips above the aisle: faces turned to the centre
    // catch it, and it falls off towards the floor.
    vec3 toLight = normalize(vec3(-sign(vWorld.x) * 1.0, 1.4, 0.0));
    float diffuse = 0.18 + 0.82 * max(dot(vNormal, toLight), 0.0);
    float falloff = mix(0.28, 1.0, pow(vHeight, 0.8));
    vec3 col = concrete * diffuse * falloff * vec3(0.82, 0.88, 1.0) * 1.6;

    // A cold glow grazing the top of each pillar where it meets the light strips.
    col += uGlow * smoothstep(0.86, 1.0, vHeight) * 0.18 * diffuse;

    // Skills chapter: pillars near the camera light a thin ring at their base.
    float near = 1.0 - smoothstep(4.0, 22.0, abs(vWorld.z - uCamPos.z + 8.0));
    float ring = smoothstep(0.035, 0.03, abs(vHeight - 0.05)) * near * uSkillGlow;
    col += uGlow * ring * 2.4;

    // Intro: this pillar's row switches on (dark until then, with a flicker).
    col *= mix(0.05, 1.0, rowLight(vIndex));

    float dist = length(vWorld - uCamPos);
    gl_FragColor = vec4(applyFog(col, dist), 1.0);
    #include <colorspace_fragment>
  }
`;

/** Two rows of instanced concrete pillars, recycled in the vertex shader so the hall is endless. */
export function Pillars() {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = HALL.pillarsPerRow * 2;

  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(HALL.pillarSize, HALL.height, HALL.pillarSize);
    g.translate(0, HALL.height / 2, 0); // stand on the floor
    const index = new Float32Array(count);
    for (let i = 0; i < count; i++) index[i] = i % HALL.pillarsPerRow;
    g.setAttribute("aIndex", new THREE.InstancedBufferAttribute(index, 1));
    return g;
  }, [count]);

  const material = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms: hallUniforms }),
    [],
  );

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const t = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      const side = i < HALL.pillarsPerRow ? -1 : 1;
      const slot = i % HALL.pillarsPerRow;
      t.makeTranslation(side * HALL.rowX, 0, HALL.startZ - slot * HALL.spacing);
      m.setMatrixAt(i, t);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [count]);

  return <instancedMesh ref={mesh} args={[geometry, material, count]} frustumCulled={false} />;
}
