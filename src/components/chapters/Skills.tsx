"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills } from "@content/data";
import { REDUCED_MOTION_QUERY } from "@/lib/perf";
import { registerGsap } from "@/lib/scroll";
import { ChapterShell } from "./ChapterShell";

/** Where the deck sticks (below the fixed nav) and how far each card sits below the previous one. */
const STACK_TOP = 104;
const STACK_STEP = 22;

/**
 * Skills as a stacking deck: every group is a card that sticks under the nav;
 * the next card slides up over it and the covered ones shrink and dim a little,
 * so the stack grows as you scroll. Sticky positioning does the stacking (works
 * with JS off); GSAP only adds the scale/dim, and skips it under reduced motion.
 */
export function Skills() {
  const deck = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const root = deck.current;
    if (!root || window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    registerGsap();
    const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", root);
    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        // While the next card travels from the bottom of the screen to its stuck position,
        // push this one back: smaller and dimmer, like a card further down the deck.
        gsap.fromTo(
          card,
          { scale: 1, filter: "brightness(1)" },
          {
            scale: 0.94,
            filter: "brightness(0.55)",
            ease: "none",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: `top ${STACK_TOP + (i + 1) * STACK_STEP}px`,
              scrub: true,
            },
          },
        );
      });
      // Chips arrive with a short stagger as each card comes into view.
      cards.forEach((card) => {
        gsap.from(card.querySelectorAll(".chip"), {
          y: 10,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.025,
          scrollTrigger: { trigger: card, start: "top 85%", once: true },
        });
      });
    }, root);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <ChapterShell id="skills">
      <ol ref={deck} className="relative pb-[18vh]">
        {skills.map((group, i) => (
          <li
            key={group.group}
            data-stack-card=""
            style={{ top: STACK_TOP + i * STACK_STEP, zIndex: i + 1 }}
            className={`accent-${group.accent} sticky mb-[22vh] origin-top last:mb-0`}
          >
            <div className="rounded-arch border border-line bg-bg-elev p-6 shadow-[0_-12px_40px_rgba(0,0,0,0.55)] md:p-10">
              <h3 className="flex items-center justify-between gap-3 font-mono text-xs tracking-[0.12em] text-fg uppercase">
                <span className="flex items-center gap-3">
                  <span aria-hidden="true" className="text-fg-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span aria-hidden="true" className="accent-dot" />
                  {group.group}
                </span>
                <span className="text-fg-muted">{group.items.length}</span>
              </h3>
              <ul className="mt-6 flex flex-wrap gap-2 md:mt-8 md:gap-2.5">
                {group.items.map((item) => (
                  <li key={item} className="chip md:text-xs">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </ChapterShell>
  );
}
