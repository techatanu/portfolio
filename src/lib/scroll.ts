/**
 * GSAP + Lenis wiring (spec §4.1): Lenis → gsap.ticker → ScrollTrigger.
 * Client-only; import from "use client" modules.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

let registered = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export const getLenis = () => lenis;

/** Scroll to an element or selector — smooth via Lenis when it's running, native otherwise. */
export function scrollToTarget(target: string | HTMLElement) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6 });
    return;
  }
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  el?.scrollIntoView({ behavior: "auto", block: "start" });
}
