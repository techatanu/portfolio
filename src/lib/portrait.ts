/**
 * Portrait → pixel-cell data for the hero "pixel dissolve" (PortraitParticles).
 *
 * The monochrome cut-out is cut into a grid of `step × step` cells; each
 * non-transparent cell becomes one square particle carrying the cell's average
 * brightness and coverage (true pixelation, not a single sampled pixel).
 * `delay` decides when a cell blinks out during the dissolve: mostly random,
 * clumped a little by value noise and a gentle bottom-to-top sweep, so the
 * photo breaks up in scattered pixels and the face goes last.
 */
import type { PerfTier } from "./store";

export const PORTRAIT_SRC = "/images/atanu-hero.webp";

/** Cell size in source pixels (~5 CSS px on desktop). ≈ 12k cells at 5, ≈ 8k at 6. */
export const PORTRAIT_STEP: Record<PerfTier, number> = { high: 5, medium: 5, low: 6 };

export type PortraitData = {
  count: number;
  /** Source image size in pixels. */
  width: number;
  height: number;
  step: number;
  /** xyz per cell: x,y = uv of the cell centre (0–1, y down), z unused. Used as `position` so three has bounds. */
  position: Float32Array;
  lum: Float32Array;
  alpha: Float32Array;
  seed: Float32Array;
  delay: Float32Array;
};

/** Deterministic PRNG so the dissolve pattern is the same on every visit. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hash of an integer lattice point → 0..1. */
function hash2(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/** Smooth 2D value noise, 0..1. */
function valueNoise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi);
  const b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1);
  const d = hash2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export async function samplePortrait(src: string, step: number): Promise<PortraitData> {
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  await img.decode();

  const width = img.naturalWidth;
  const height = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2D canvas unavailable");
  ctx.drawImage(img, 0, 0);
  const px = ctx.getImageData(0, 0, width, height).data;

  const max = Math.ceil(width / step) * Math.ceil(height / step);
  const position = new Float32Array(max * 3);
  const lum = new Float32Array(max);
  const alpha = new Float32Array(max);
  const seed = new Float32Array(max);
  const delay = new Float32Array(max);
  const rand = mulberry32(0x5eed);

  let n = 0;
  let minDelay = Infinity;
  let maxDelay = -Infinity;
  for (let y0 = 0; y0 < height; y0 += step) {
    for (let x0 = 0; x0 < width; x0 += step) {
      // Average the cell: coverage = mean alpha, brightness = alpha-weighted mean luminance.
      let aSum = 0;
      let lSum = 0;
      let samples = 0;
      for (let y = y0; y < Math.min(y0 + step, height); y++) {
        for (let x = x0; x < Math.min(x0 + step, width); x++) {
          const i = (y * width + x) * 4;
          const a = px[i + 3] / 255;
          aSum += a;
          lSum += (px[i] / 255) * a; // greyscale cut-out, so R = luminance
          samples++;
        }
      }
      const a = aSum / samples;
      if (a < 0.12) continue; // mostly background → no cell

      const cw = Math.min(step, width - x0);
      const ch = Math.min(step, height - y0);
      const u = (x0 + cw / 2) / width;
      const v = (y0 + ch / 2) / height;
      const r = rand();
      // Mostly random order (pixels blink out individually), lightly clumped by noise,
      // with a soft bottom → top sweep so the face is among the last to go.
      const noise = valueNoise(u * 9, v * 9);
      const d = r * 0.55 + noise * 0.2 + (1 - v) * 0.25;

      position[n * 3] = u;
      position[n * 3 + 1] = v;
      lum[n] = lSum / aSum;
      alpha[n] = a;
      seed[n] = rand();
      delay[n] = d;
      minDelay = Math.min(minDelay, d);
      maxDelay = Math.max(maxDelay, d);
      n++;
    }
  }

  // Normalise delays to 0..1 so progress 0→1 always covers every cell.
  const span = maxDelay - minDelay || 1;
  for (let k = 0; k < n; k++) delay[k] = (delay[k] - minDelay) / span;

  return {
    count: n,
    width,
    height,
    step,
    position: position.subarray(0, n * 3),
    lum: lum.subarray(0, n),
    alpha: alpha.subarray(0, n),
    seed: seed.subarray(0, n),
    delay: delay.subarray(0, n),
  };
}
