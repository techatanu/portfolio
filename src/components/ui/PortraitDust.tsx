"use client";

import { useEffect, useRef } from "react";
import { REDUCED_MOTION_QUERY } from "@/lib/perf";

type Props = { src: string; alt: string; width: number; height: number; className?: string };

/**
 * The photo's "snap" dissolve, on a plain 2D canvas (no WebGL):
 *  - when the photo first scrolls into view, small square pieces drift in and assemble it,
 *  - as you scroll on past it, it breaks into pieces that blow away up and to the right,
 *  - scrolling back re-forms it.
 * The real <img> stays in the page and visible if JS is off, under reduced motion, or on error.
 * The image fills its frame like `object-cover`.
 */
export function PortraitDust({ src, alt, width, height, className = "" }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const box = frame.current;
    const image = img.current;
    if (!box || !image || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const canvas = document.createElement("canvas");
    canvas.className = "portrait-dust";
    canvas.setAttribute("aria-hidden", "true");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Piece = {
      x: number;
      y: number;
      sx: number;
      sy: number;
      ss: number;
      t: number;
      dx: number;
      dy: number;
      w: number;
    };
    let pieces: Piece[] = [];
    let W = 0;
    let H = 0;
    let PAD = 0;
    let CELL = 6;
    let enterP = 1; // 1 = scattered, 0 = assembled (the arrival animation)
    let scrollP = 0;
    let drawn = -1;
    let raf = 0;
    let entered = false;

    const build = () => {
      const r = box.getBoundingClientRect();
      W = r.width;
      H = r.height;
      if (!W || !H) return false;
      PAD = Math.round(W * 0.7);
      CELL = W < 320 ? 6 : 7;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      Object.assign(canvas.style, {
        left: `${-PAD}px`,
        top: `${-PAD}px`,
        width: `${W + PAD * 2}px`,
        height: `${H + PAD}px`,
      });
      canvas.width = Math.round((W + PAD * 2) * dpr);
      canvas.height = Math.round((H + PAD) * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // object-cover crop: scale the image to cover the frame, centred.
      const scale = Math.max(W / image.naturalWidth, H / image.naturalHeight);
      const ox = (image.naturalWidth - W / scale) / 2;
      const oy = (image.naturalHeight - H / scale) / 2;

      let seed = 11;
      const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
      pieces = [];
      for (let y = 0; y < H; y += CELL) {
        for (let x = 0; x < W; x += CELL) {
          const u = x / W;
          const v = y / H;
          pieces.push({
            x,
            y,
            sx: ox + x / scale,
            sy: oy + y / scale,
            ss: CELL / scale,
            // Breaks from the top-right first, with noise so the edge is ragged.
            t: 0.55 * (1 - u) + 0.25 * v + 0.35 * rand(),
            dx: 110 + rand() * 260,
            dy: -(60 + rand() * 200),
            w: rand() * Math.PI * 2,
          });
        }
      }
      drawn = -1;
      return true;
    };

    const draw = (p: number) => {
      if (Math.abs(p - drawn) < 0.0005) return;
      drawn = p;
      ctx.clearRect(0, 0, W + PAD * 2, H + PAD);
      for (const q of pieces) {
        let k = (p * 1.6 - q.t) / 0.45;
        if (k >= 1) continue; // gone
        if (k < 0) k = 0;
        const e = k * k;
        const s = CELL * (1 - 0.5 * k) + 0.5; // +0.5 hides hairline seams while assembled
        ctx.globalAlpha = 1 - k;
        ctx.drawImage(
          image,
          q.sx,
          q.sy,
          q.ss,
          q.ss,
          PAD + q.x + q.dx * e + Math.sin(q.w + k * 4) * 10 * k,
          PAD + q.y + q.dy * e,
          s,
          s,
        );
      }
      ctx.globalAlpha = 1;
    };

    const readScroll = () => {
      const r = box.getBoundingClientRect();
      // 0 while the photo is on screen; 1 once it has scrolled most of the way off the top.
      scrollP = Math.min(1, Math.max(0, (64 + 40 - r.top) / (r.height * 0.85)));
    };
    const render = () => {
      raf = 0;
      draw(Math.max(enterP, scrollP));
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };

    const arrive = () => {
      if (entered) return;
      entered = true;
      const t0 = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / 1600);
        enterP = Math.pow(1 - t, 3);
        draw(Math.max(enterP, scrollP));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    let io: IntersectionObserver | null = null;
    let resizeTimer = 0;
    const onScroll = () => {
      readScroll();
      request();
    };
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => build() && request(), 150);
    };

    const start = () => {
      try {
        if (!build()) return;
        box.appendChild(canvas);
        image.style.visibility = "hidden";
        readScroll();
        draw(1);
        // Assemble when it first comes into view (or at once if it's already on screen).
        io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && arrive(), {
          threshold: 0.25,
        });
        io.observe(box);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
      } catch {
        image.style.visibility = "";
        canvas.remove();
      }
    };

    if (image.complete && image.naturalWidth) start();
    else image.addEventListener("load", start, { once: true });

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      image.removeEventListener("load", start);
      if (raf) cancelAnimationFrame(raf);
      canvas.remove();
      image.style.visibility = "";
    };
  }, []);

  return (
    <div ref={frame} className={`relative ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, image is pre-optimised */}
      <img
        ref={img}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="size-full rounded-[8px] object-cover grayscale"
      />
    </div>
  );
}
