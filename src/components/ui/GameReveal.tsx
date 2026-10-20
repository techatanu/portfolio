"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { REDUCED_MOTION_QUERY } from "@/lib/perf";
import { registerGsap } from "@/lib/scroll";

/**
 * Game-UI entrances, played once as things scroll into view:
 *  - `data-reveal="title"`: chapter headings wipe in from the left with a bright flash.
 *  - `data-reveal="card"`:  cards slide up out of a scan-wipe, slightly skewed, in a quick stagger.
 * Uses gsap.from, so with JS off (or under reduced motion) everything is simply visible.
 */
export function GameReveal() {
  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal="title"]').forEach((el) => {
        gsap.from(el, {
          clipPath: "inset(0 100% 0 0)",
          x: -28,
          filter: "brightness(2.6)",
          duration: 0.75,
          ease: "expo.out",
          clearProps: "clipPath,filter,transform",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      ScrollTrigger.batch('[data-reveal="card"]', {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.from(batch, {
            y: 46,
            skewY: 2,
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
            filter: "brightness(2)",
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.08,
            clearProps: "clipPath,filter,transform,opacity",
          }),
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return null;
}
