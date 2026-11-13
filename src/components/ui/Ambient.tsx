"use client";

import { useEffect, useRef } from "react";
import { useExperience } from "@/lib/store";

/**
 * Ambient light over the starfield, in plain CSS so it also works without WebGL:
 *  - a cool glow from the top that hands over to a warm one from below as the page
 *    progresses, so the mood shifts with the story instead of an object growing on screen;
 *  - a soft spotlight that follows the pointer (hidden on touch screens);
 *  - fine film grain, which keeps the large dark areas from looking flat or banded.
 * Driven by CSS variables written straight from the store — never re-renders on scroll.
 */
export function Ambient() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const unsubProgress = useExperience.subscribe(
      (s) => s.globalProgress,
      (p) => el.style.setProperty("--p", p.toFixed(3)),
      { fireImmediately: true },
    );
    const unsubPointer = useExperience.subscribe(
      (s) => s.pointer,
      ({ x, y }) => {
        el.style.setProperty("--mx", `${((x + 1) * 50).toFixed(2)}%`);
        el.style.setProperty("--my", `${((1 - y) * 50).toFixed(2)}%`);
      },
    );
    return () => {
      unsubProgress();
      unsubPointer();
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="ambient pointer-events-none fixed inset-0 -z-[4]">
      <div className="ambient-cool" />
      <div className="ambient-warm" />
      <div className="ambient-spot" />
      <div className="ambient-grain" />
    </div>
  );
}
