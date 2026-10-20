"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CHAPTERS } from "@/lib/chapters";
import { registerGsap } from "@/lib/scroll";
import { useExperience } from "@/lib/store";

/** Thin right-edge progress line with a tick at the start of each chapter. */
export function ProgressRail() {
  const fillRef = useRef<HTMLDivElement>(null);
  const [ticks, setTicks] = useState<number[]>([]);

  useEffect(
    () =>
      useExperience.subscribe(
        (s) => s.globalProgress,
        (p) => {
          if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
        },
        { fireImmediately: true },
      ),
    [],
  );

  // Tick positions only change when layout does, so they're measured on refresh.
  useEffect(() => {
    registerGsap();
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      setTicks(
        CHAPTERS.map((c) => {
          const el = document.getElementById(c.id);
          return el ? Math.min(el.offsetTop / max, 1) : 0;
        }),
      );
    };
    measure();
    ScrollTrigger.addEventListener("refresh", measure);
    return () => ScrollTrigger.removeEventListener("refresh", measure);
  }, []);

  return (
    <div aria-hidden="true" className="fixed top-24 right-4 bottom-24 z-40 hidden w-px bg-line md:block lg:right-6">
      <div ref={fillRef} className="absolute inset-0 origin-top bg-glow" style={{ transform: "scaleY(0)" }} />
      {ticks.map((t, i) => (
        <span
          key={CHAPTERS[i].id}
          className="absolute -left-[3px] h-px w-[7px] bg-fg-muted"
          style={{ top: `${t * 100}%` }}
        />
      ))}
    </div>
  );
}
