"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { labels } from "@content/data";
import { CHAPTERS } from "@/lib/chapters";
import { REDUCED_MOTION_QUERY } from "@/lib/perf";
import { useExperience } from "@/lib/store";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "LEVEL 02 — SKILLS UNLOCKED": a short game-style banner each time you scroll into a
 * new chapter for the first time. Decorative (the chapter headings carry the content),
 * so it's aria-hidden. Skipped entirely under reduced motion.
 */
export function LevelBanner() {
  const root = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    const seen = new Set<number>([0]); // the hero is where you start, not an unlock
    let tl: gsap.core.Timeline | null = null;

    const unsub = useExperience.subscribe(
      (s) => s.chapter,
      (chapter) => {
        if (seen.has(chapter)) return;
        seen.add(chapter);
        if (levelRef.current) levelRef.current.textContent = pad(chapter);
        if (nameRef.current) nameRef.current.textContent = CHAPTERS[chapter].level;

        tl?.kill();
        tl = gsap
          .timeline()
          // Wipe in from the left with a bright flash, glitch-jitter, hold, wipe out.
          .fromTo(
            el,
            { clipPath: "inset(0 100% 0 0)", opacity: 1, x: -16, filter: "brightness(2.4)" },
            { clipPath: "inset(0 0% 0 0)", x: 0, filter: "brightness(1)", duration: 0.45, ease: "expo.out" },
          )
          .to(el, { x: 3, duration: 0.04, repeat: 3, yoyo: true, ease: "none" }, "-=0.1")
          .to(el, { clipPath: "inset(0 0 0 100%)", duration: 0.4, ease: "expo.in" }, "+=1.1")
          .set(el, { opacity: 0 });
      },
    );
    return () => {
      unsub();
      tl?.kill();
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="level-banner pointer-events-none fixed top-20 left-1/2 z-[60] -translate-x-1/2 opacity-0 md:top-24"
    >
      <span className="text-accent-blue">
        {labels.level} <span ref={levelRef}>01</span>
      </span>
      <span className="mx-3 text-fg-muted">—</span>
      <span ref={nameRef} className="text-fg">
        {CHAPTERS[1].level}
      </span>{" "}
      <span className="text-accent-amber">{labels.unlocked}</span>
    </div>
  );
}
