"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { labels } from "@content/data";

/**
 * Custom cursor (spec §2.4): a ring that trails the pointer above everything,
 * including the WebGL layer, grows over links/buttons and reads "VIEW" over
 * project exhibits (`data-cursor="view"`). The native cursor stays visible —
 * the ring is a companion, not a replacement. Off on touch / coarse pointers.
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ring.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : 0.35;
    const xTo = gsap.quickTo(el, "x", { duration, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration, ease: "power3.out" });
    let shown = false;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.dataset.visible = "";
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target instanceof Element ? e.target : null;
      const view = target?.closest('[data-cursor="view"]');
      const interactive = target?.closest("a, button, [role='button'], input, textarea, select, label");
      el.dataset.state = view ? "view" : interactive ? "link" : "";
    };
    const onLeave = () => {
      delete el.dataset.visible;
      shown = false;
    };
    const onDown = () => (el.dataset.pressed = "");
    const onUp = () => delete el.dataset.pressed;

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={ring} aria-hidden="true" className="cursor-ring">
      <span ref={label} className="cursor-label">
        {labels.view}
      </span>
    </div>
  );
}
