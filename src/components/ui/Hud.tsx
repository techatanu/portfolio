"use client";

import { useEffect, useRef } from "react";
import { CHAPTERS } from "@/lib/chapters";
import { useExperience } from "@/lib/store";

/** `CH.02 / THE GRID / 37.4%` — updated by direct DOM writes, never re-renders on scroll. */
export function Hud() {
  const labelRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(
    () =>
      useExperience.subscribe(
        (s) => [s.chapter, s.chapterProgress] as const,
        ([chapter, progress]) => {
          if (labelRef.current) labelRef.current.textContent = CHAPTERS[chapter].hud;
          if (pctRef.current) pctRef.current.textContent = `${(progress * 100).toFixed(1)}%`;
        },
        { equalityFn: (a, b) => a[0] === b[0] && a[1] === b[1], fireImmediately: true },
      ),
    [],
  );

  return (
    <p aria-hidden="true" className="font-mono text-[0.6875rem] tracking-[0.12em] text-fg-muted uppercase">
      <span ref={labelRef}>{CHAPTERS[0].hud}</span>
      {/* Percentage hidden on phones so the HUD and nav fit on one line at 375px. */}
      <span className="mx-2 hidden text-line-strong sm:inline">/</span>
      <span ref={pctRef} className="hidden w-[6ch] tabular-nums text-fg sm:inline-block">
        0.0%
      </span>
    </p>
  );
}
