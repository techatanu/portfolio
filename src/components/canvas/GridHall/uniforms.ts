/**
 * Uniforms shared by every Grid Hall shader. One object, mutated once per frame
 * by SceneDirector, referenced by each material — so time, camera and fog stay
 * in lock-step without per-material updates.
 */
import * as THREE from "three";
import { HALL, HALL_LENGTH } from "@/lib/hall";

/** sRGB hex → linear colour (shaders work in linear; three encodes for the screen). */
const linear = (hex: string) => new THREE.Color(hex);

export const hallUniforms = {
  uTime: { value: 0 },
  uCamPos: { value: new THREE.Vector3(0, HALL.eyeHeight, HALL.startZ) },
  /** Intro: 0 = hall dark, 1 = every light on. Rows switch on with a flicker as it rises. */
  uLights: { value: 0 },
  /** 1 = hall fully visible, 0 = faded into the void (World A → B transition). */
  uHallFade: { value: 1 },
  /** 0 → 1 while the Skills chapter is on screen: pillars near the camera light their base ring. */
  uSkillGlow: { value: 0 },
  uFogColor: { value: linear("#06070a") },
  uFogDensity: { value: 0.03 },
  uGlow: { value: linear("#cfe3ff") }, // --glow
  uBlue: { value: linear("#5b8cff") }, // --accent-blue
  uRowLength: { value: HALL_LENGTH },
  uSpacing: { value: HALL.spacing },
  uBehind: { value: HALL.behind },
};

export type HallUniforms = typeof hallUniforms;

/** GLSL shared by the hall shaders: uniform declarations, noise, fog, pillar recycling. */
export const hallCommon = /* glsl */ `
  uniform float uTime;
  uniform vec3 uCamPos;
  uniform float uLights;
  uniform float uHallFade;
  uniform float uSkillGlow;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform vec3 uGlow;
  uniform vec3 uBlue;
  uniform float uRowLength;
  uniform float uSpacing;
  uniform float uBehind;

  float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash12(i);
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * vnoise(p);
      p *= 2.03;
      a *= 0.5;
    }
    return v;
  }

  // Exponential-squared fog towards near-black (spec: "exponential fog to near-black").
  // Also applies the World A → B fade: the whole hall sinks into the fog colour.
  vec3 applyFog(vec3 col, float dist) {
    float f = 1.0 - exp(-pow(uFogDensity * dist, 2.0));
    return mix(uFogColor, mix(col, uFogColor, clamp(f, 0.0, 1.0)), uHallFade);
  }

  // Intro light state for something rowsAway rows from the entrance: rows switch
  // on one after another, each with a brief flicker before it settles.
  float rowLight(float rowsAway) {
    float t = clamp(uLights * 1.6 - rowsAway * 0.045, 0.0, 1.0);
    float flicker = step(0.45, fract(sin(rowsAway * 91.7 + floor(uTime * 24.0)) * 43758.5));
    return t >= 1.0 ? 1.0 : t * flicker;
  }

  // Recycle a pillar/strip: z wraps into (cam.z + behind − rowLength, cam.z + behind].
  float wrapZ(float baseZ) {
    float t = mod(uCamPos.z + uBehind - baseZ, uRowLength);
    return uCamPos.z + uBehind - t;
  }
`;
