"use client";

import { useEffect, useState, type ComponentType } from "react";
import { REDUCED_MOTION_QUERY } from "@/lib/perf";
import { useExperience } from "@/lib/store";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Gate for the WebGL layer: lazy-loads three.js after hydration (keeps it out of
 * the initial bundle) and only when motion is allowed and WebGL works. Otherwise
 * the CSS backdrop and plain DOM image stay as the fallback (spec §4.5).
 */
export function Experience() {
  const [Scene, setScene] = useState<ComponentType | null>(null);
  const reducedMotion = useExperience((s) => s.reducedMotion);

  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches || !hasWebGL()) return;
    let alive = true;
    import("./ExperienceCanvas").then((m) => {
      if (alive) setScene(() => m.default);
    });
    return () => {
      alive = false;
    };
  }, []);

  return Scene && !reducedMotion ? <Scene /> : null;
}
