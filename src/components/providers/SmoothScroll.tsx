"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CHAPTERS } from "@/lib/chapters";
import { REDUCED_MOTION_QUERY } from "@/lib/perf";
import { registerGsap, setLenis } from "@/lib/scroll";
import { useExperience } from "@/lib/store";

/**
 * Lenis → gsap.ticker → ScrollTrigger → store (spec §4.1).
 * Under prefers-reduced-motion Lenis is skipped and the page scrolls natively;
 * the progress triggers still run so the HUD keeps working.
 */
export function SmoothScroll() {
  useEffect(() => {
    registerGsap();
    const { set } = useExperience.getState();
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    const startLenis = () => {
      if (lenis) return;
      lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.1 });
      lenis.on("scroll", ScrollTrigger.update);
      setLenis(lenis);
      gsap.ticker.add(tick);
    };
    const stopLenis = () => {
      if (!lenis) return;
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenis = null;
      setLenis(null);
    };
    const applyMotionPref = () => (motionQuery.matches ? stopLenis() : startLenis());

    gsap.ticker.lagSmoothing(0);
    applyMotionPref();
    motionQuery.addEventListener("change", applyMotionPref);

    // One trigger per chapter. Ranges meet at the viewport centre so exactly one
    // chapter is active; the first starts at the top, the last ends at max scroll.
    const last = CHAPTERS.length - 1;
    const chapterTriggers = CHAPTERS.map((chapter, i) =>
      ScrollTrigger.create({
        trigger: `#${chapter.id}`,
        start: i === 0 ? "top top" : "top center",
        end: i === last ? "bottom bottom" : "bottom center",
        onToggle: (self) => {
          if (self.isActive) set({ chapter: i, chapterProgress: self.progress });
        },
        onUpdate: (self) => {
          if (useExperience.getState().chapter === i) set({ chapterProgress: self.progress });
        },
      }),
    );
    const globalTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => set({ globalProgress: self.progress }),
    });

    const onPointerMove = (e: PointerEvent) => {
      set({ pointer: { x: (e.clientX / window.innerWidth) * 2 - 1, y: -((e.clientY / window.innerHeight) * 2 - 1) } });
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Web fonts change section heights; re-measure once they're in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      motionQuery.removeEventListener("change", applyMotionPref);
      chapterTriggers.forEach((t) => t.kill());
      globalTrigger.kill();
      stopLenis();
    };
  }, []);

  return null;
}
