"use client";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { mulberry32 } from "@/lib/random";
import type { PerfTier } from "@/lib/store";
import { CODE_LINES } from "./codeLines";
import { vortexUniforms } from "./uniforms";

/** Printable ASCII laid out in a 16 × 6 atlas (code 32 = space … 126 = ~). */
const COLS = 16;
const ROWS = 6;
const CELL_W = 32;
const CELL_H = 48;

/** Streams (lines of code in flight) × characters per stream, per tier. */
const SIZE: Record<PerfTier, { streams: number; chars: number }> = {
  high: { streams: 120, chars: 96 },
  medium: { streams: 80, chars: 80 },
  low: { streams: 48, chars: 64 },
};

/** Render every glyph once into a canvas texture, in the site's mono font (JetBrains Mono). */
async function makeAtlas(): Promise<THREE.CanvasTexture> {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains").trim() || "monospace";
  const font = `500 34px ${family}`;
  await document.fonts?.load(font).catch(() => undefined);

  const canvas = document.createElement("canvas");
  canvas.width = COLS * CELL_W;
  canvas.height = ROWS * CELL_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  ctx.fillStyle = "#fff";
  ctx.font = font;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let code = 32; code <= 126; code++) {
    const i = code - 32;
    ctx.fillText(
      String.fromCharCode(code),
      (i % COLS) * CELL_W + CELL_W / 2,
      Math.floor(i / COLS) * CELL_H + CELL_H / 2,
    );
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.anisotropy = 4;
  return tex;
}

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec3 uCenter;
  uniform float uFront;
  uniform vec2 uResolution;

  attribute float aStream;  // 0..1 across the sheet of streams
  attribute float aChar;    // character index within the line (0 = head, nearest the hole)
  attribute float aGlyph;   // atlas cell
  attribute float aSeed;    // per-stream random

  varying vec2 vUv;
  varying float vS;
  varying float vSeed;

  const float R_OUT = 17.0;  // where a stream enters (world units from the centre)
  const float R_IN = 0.9;    // where it vanishes, just outside the horizon
  const float GAP = 0.0055;  // spacing between characters along the path (in s)

  // Point on the funnel for path parameter s (0 = far out, 1 = at the horizon):
  // a log spiral that tightens and speeds up as it falls in, starting in front of the
  // hole (towards the camera) and sinking into it.
  vec3 pathAt(float s, float theta0, float lift) {
    float r = R_OUT * exp(log(R_IN / R_OUT) * s);
    float th = theta0 + 3.2 * pow(s, 1.7);
    float z = uFront * pow(1.0 - s, 1.6);
    return uCenter + vec3(cos(th) * r, sin(th) * r * 0.62 + lift * r * 0.08, z);
  }

  vec2 toPixels(vec4 clip) {
    return clip.xy / clip.w * 0.5 * uResolution;
  }

  void main() {
    // Streams fan out from the lower right and wrap counter-clockwise into the hole.
    float theta0 = mix(-2.5, 0.35, aStream) + (aSeed - 0.5) * 0.3;
    float lift = (aSeed - 0.5) * 2.0;
    float speed = 0.028 + 0.02 * aSeed;
    float s = fract(aSeed * 7.0 + uTime * speed - aChar * GAP);

    vec3 world = pathAt(s, theta0, lift);
    vec3 behind = pathAt(max(s - 0.004, 0.0), theta0, lift); // towards the tail: reading direction

    mat4 vp = projectionMatrix * viewMatrix;
    vec4 c0 = vp * vec4(world, 1.0);
    vec4 c1 = vp * vec4(behind, 1.0);
    vec2 dir = toPixels(c1) - toPixels(c0);
    dir = length(dir) > 1e-4 ? normalize(dir) : vec2(1.0, 0.0);
    // No flipping: on the far side of the funnel text runs upside down, like lettering on
    // the back of a spinning cylinder. (Flipping keeps glyphs upright but reverses the words.)
    vec2 perp = vec2(-dir.y, dir.x);

    // Glyph size in world units shrinks with radius, so characters compress as they fall in.
    float r = R_OUT * exp(log(R_IN / R_OUT) * s);
    float worldH = 0.05 + r * 0.022;
    float focal = projectionMatrix[1][1] * 0.5 * uResolution.y;
    float px = worldH * focal / c0.w;

    // position.xy is the unit quad corner (−0.5..0.5); mono glyphs are ~0.6 as wide as tall.
    vec2 offset = (position.x * 0.62 * dir + position.y * perp) * px;
    gl_Position = vec4((toPixels(c0) + offset) / (0.5 * uResolution) * c0.w, c0.z, c0.w);

    float cell = aGlyph;
    vec2 cellXY = vec2(mod(cell, ${COLS}.0), floor(cell / ${COLS}.0));
    vec2 corner = position.xy + 0.5;
    vUv = (cellXY + vec2(corner.x, 1.0 - corner.y)) / vec2(${COLS}.0, ${ROWS}.0);
    vS = s;
    vSeed = aSeed;
  }
`;

const fragment = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform float uMix;
  uniform float uTime;
  uniform vec3 uAmber;
  uniform vec3 uGlow;
  varying vec2 vUv;
  varying float vS;
  varying float vSeed;

  void main() {
    float ink = texture2D(uAtlas, vec2(vUv.x, 1.0 - vUv.y)).a;
    if (ink < 0.02) discard;

    // Fade in as a line enters, burn out at the horizon.
    float life = smoothstep(0.05, 0.22, vS) * (1.0 - smoothstep(0.86, 0.985, vS));
    // Silver-blue far out, white-hot then amber near the hole (matches the disk).
    vec3 cold = mix(vec3(0.55, 0.6, 0.72), uGlow, 0.5);
    vec3 col = mix(cold, vec3(1.0), smoothstep(0.35, 0.7, vS));
    col = mix(col, uAmber * 1.6, smoothstep(0.7, 0.95, vS));
    float brightness = mix(0.4, 2.2, pow(vS, 2.0)) * (0.8 + 0.2 * sin(uTime * 3.0 + vSeed * 40.0));

    gl_FragColor = vec4(col * brightness * ink * life * uMix, 1.0);
    #include <colorspace_fragment>
  }
`;

/** Lines of code pouring down a spiral funnel into the black hole (instanced glyph quads). */
export function CodeStream({ tier }: { tier: PerfTier }) {
  const [atlas, setAtlas] = useState<THREE.CanvasTexture | null>(null);
  const { streams, chars } = SIZE[tier];

  useEffect(() => {
    let alive = true;
    let made: THREE.CanvasTexture | null = null;
    makeAtlas().then((t) => {
      made = t;
      if (alive) setAtlas(t);
      else t.dispose();
    });
    return () => {
      alive = false;
      made?.dispose();
    };
  }, []);

  const geometry = useMemo(() => {
    const quad = new THREE.PlaneGeometry(1, 1);
    const g = new THREE.InstancedBufferGeometry();
    g.index = quad.index;
    g.setAttribute("position", quad.getAttribute("position"));
    const count = streams * chars;
    const aStream = new Float32Array(count);
    const aChar = new Float32Array(count);
    const aGlyph = new Float32Array(count);
    const aSeed = new Float32Array(count);
    const rand = mulberry32(0xc0de);
    let n = 0;
    for (let i = 0; i < streams; i++) {
      const seed = rand();
      const lane = (i + rand() * 0.6) / streams; // same for every character of this stream
      // Each stream is a whole line of code repeated, read from the head (index 0).
      const line = CODE_LINES[Math.floor(rand() * CODE_LINES.length)] + "    ";
      for (let c = 0; c < chars; c++) {
        const ch = line.charCodeAt(c % line.length);
        aStream[n] = lane;
        aChar[n] = c;
        aGlyph[n] = Math.min(Math.max(ch, 32), 126) - 32;
        aSeed[n] = seed;
        n++;
      }
    }
    g.setAttribute("aStream", new THREE.InstancedBufferAttribute(aStream, 1));
    g.setAttribute("aChar", new THREE.InstancedBufferAttribute(aChar, 1));
    g.setAttribute("aGlyph", new THREE.InstancedBufferAttribute(aGlyph, 1));
    g.setAttribute("aSeed", new THREE.InstancedBufferAttribute(aSeed, 1));
    g.instanceCount = count;
    return g;
  }, [streams, chars]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const material = useMemo(
    () =>
      atlas
        ? new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: { ...vortexUniforms, uAtlas: { value: atlas }, uResolution: RESOLUTION },
            transparent: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
          })
        : null,
    [atlas],
  );

  if (!material) return null;
  return <mesh geometry={geometry} material={material} frustumCulled={false} renderOrder={1} />;
}

/** Canvas size in CSS px, written by SceneDirector (shared by every CodeStream material). */
export const RESOLUTION = { value: new THREE.Vector2(1, 1) };
