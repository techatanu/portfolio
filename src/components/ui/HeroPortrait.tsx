"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { hero } from "@content/data";
import { registerGsap } from "@/lib/scroll";

/**
 * Hero photo, three layers:
 *  - frame:  position + responsive opacity (dimmer behind the name on small screens)
 *  - reveal: CSS fade-in after ~1.4s, so the photo always appears even with no JS/WebGL
 *  - img:    per-frame opacity. PortraitParticles owns it once `data-portrait="particles"`
 *            is set on the reveal layer; until then (or with reduced motion / no WebGL)
 *            this component fades it out as you scroll past the hero.
 */
export function HeroPortrait() {
  const reveal = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    registerGsap();
    const trigger = ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      end: "60% top",
      onUpdate: (self) => {
        if (!img.current || reveal.current?.dataset.portrait === "particles") return;
        img.current.style.opacity = (1 - self.progress).toFixed(3);
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <div
      id="hero-portrait-frame"
      className="pointer-events-none absolute right-0 bottom-0 -z-10 h-[78svh] opacity-45 select-none md:right-[4%] md:h-[88svh] md:opacity-55 lg:right-[6%] lg:opacity-90"
    >
      <div id="hero-portrait-reveal" ref={reveal} className="portrait-reveal h-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, image is pre-optimised */}
        <img
          id="hero-portrait"
          ref={img}
          src="/images/atanu-hero.webp"
          alt={hero.portraitAlt}
          width={651}
          height={826}
          fetchPriority="high"
          className="h-full w-auto max-w-none object-contain object-bottom"
        />
      </div>
    </div>
  );
}
