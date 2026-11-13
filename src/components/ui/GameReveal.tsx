"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { REDUCED_MOTION_QUERY } from "@/lib/perf";
import { registerGsap } from "@/lib/scroll";

/**
 * Scroll motion for the story, kept to a few deliberate moments instead of animating every box:
 *  - `data-reveal="title"`: the chapter label fades in, a hairline draws across, the heading
 *    rises out of a mask. Played once.
 *  - `data-read`: a paragraph "reads itself" — its words brighten in order as you scroll past.
 *  - `data-timeline`: the line draws down with the scroll and each entry lights up as it's reached.
 *  - `data-reveal="card"`: a short, plain rise for the few standalone panels.
 * Everything starts from the finished state, so with JS off or reduced motion the page is simply there.
 */
export function GameReveal() {
  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-reveal="title"]').forEach((el) => {
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        });
        tl.from(el.querySelectorAll("[data-kicker]"), { opacity: 0, x: -12, duration: 0.6 })
          .from(el.querySelectorAll("[data-rule]"), { scaleX: 0, duration: 1.2 }, 0.05)
          .from(el.querySelectorAll("[data-rise]"), { yPercent: 115, duration: 1 }, 0.12);
      });

      gsap.utils.toArray<HTMLElement>("[data-read]").forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll("[data-word]"),
          { opacity: 0.22 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 58%", scrub: 0.5 },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-timeline]").forEach((list) => {
        // The attribute switches on the "not reached yet" dimming in CSS, so it only applies with JS.
        list.setAttribute("data-timeline", "live");
        gsap.fromTo(
          list.querySelectorAll("[data-timeline-fill]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: list, start: "top 62%", end: "bottom 62%", scrub: 0.4 },
          },
        );
        list.querySelectorAll<HTMLElement>("[data-timeline-item]").forEach((item) => {
          ScrollTrigger.create({
            trigger: item,
            start: "top 62%",
            onEnter: () => item.setAttribute("data-lit", ""),
            onLeaveBack: () => item.removeAttribute("data-lit"),
          });
        });
      });

      ScrollTrigger.batch('[data-reveal="card"]', {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.from(batch, {
            y: 22,
            opacity: 0,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.09,
            clearProps: "transform,opacity",
          }),
      });
    });
    ScrollTrigger.refresh();
    return () => {
      ctx.revert();
      document.querySelectorAll("[data-timeline]").forEach((el) => el.setAttribute("data-timeline", ""));
      document.querySelectorAll("[data-lit]").forEach((el) => el.removeAttribute("data-lit"));
    };
  }, []);

  return null;
}
