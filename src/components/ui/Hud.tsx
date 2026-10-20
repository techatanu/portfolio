"use client";

import { useEffect, useRef } from "react";
import { labels } from "@content/data";
import { CHAPTERS } from "@/lib/chapters";
import { useExperience } from "@/lib/store";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Game-style level HUD: `LV 02 · SKILLS` plus an XP bar for the whole page.
 * Updated by direct DOM writes from the store — never re-renders on scroll.
 */
export function Hud() {
  const levelRef = useRef<HTMLSpanElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const xpRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const unsubLevel = useExperience.subscribe(
      (s) => s.chapter,
      (chapter) => {
        if (levelRef.current) levelRef.current.textContent = pad(chapter);
        if (nameRef.current) nameRef.current.textContent = CHAPTERS[chapter].level;
      },
      { fireImmediately: true },
    );
    const unsubXp = useExperience.subscribe(
      (s) => s.globalProgress,
      (p) => {
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
        if (xpRef.current) xpRef.current.textContent = `${Math.round(p * 100)}%`;
      },
      { fireImmediately: true },
    );
    return () => {
      unsubLevel();
      unsubXp();
    };
  }, []);

  return (
    <p
      aria-hidden="true"
      className="flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.12em] text-fg-muted uppercase"
    >
      <span className="rounded-arch border border-accent-blue/50 bg-accent-blue/10 px-1.5 py-0.5 text-accent-blue">
        {labels.levelShort} <span ref={levelRef}>00</span>
      </span>
      <span ref={nameRef} className="text-fg">
        {CHAPTERS[0].level}
      </span>
      {/* XP bar: hidden on phones so the HUD and nav fit on one line. */}
      <span className="hidden items-center gap-2 sm:flex">
        <span className="relative h-1 w-24 overflow-hidden rounded-full bg-line">
          <span
            ref={barRef}
            className="xp-fill absolute inset-0 origin-left"
            // Inline transform, not Tailwind scale-x-0: that sets the CSS `scale` property, which
            // multiplies with the transform written on scroll and would pin the bar at zero.
            style={{ transform: "scaleX(0)" }}
          />
        </span>
        <span>
          {labels.xp}{" "}
          <span ref={xpRef} className="inline-block w-[4ch] tabular-nums text-fg">
            0%
          </span>
        </span>
      </span>
    </p>
  );
}
