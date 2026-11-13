import type { ReactNode } from "react";
import { Experience } from "@/components/canvas/Experience";
import { PerfProvider } from "@/components/providers/PerfProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Ambient } from "@/components/ui/Ambient";
import { Backdrop } from "@/components/ui/Backdrop";
import { GameReveal } from "@/components/ui/GameReveal";
import { Nav } from "@/components/ui/Nav";
import { ProgressRail } from "@/components/ui/ProgressRail";
import "lenis/dist/lenis.css";

/**
 * The cinematic home page: smooth scroll, the WebGL starfield and the scroll motion.
 * Only this route group pays for them; /quick/ and /projects/* use (pages)/layout.tsx.
 */
export default function JourneyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Backdrop />
      <SmoothScroll />
      <PerfProvider />
      <Experience />
      <Ambient />
      <Nav />
      <ProgressRail />
      <main id="main">{children}</main>
      <GameReveal />
    </>
  );
}
