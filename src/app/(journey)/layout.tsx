import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { GameReveal } from "@/components/ui/GameReveal";
import { Nav } from "@/components/ui/Nav";
import "lenis/dist/lenis.css";

/** The home page: smooth scroll and the scroll motion. No WebGL in this design. */
export default function JourneyLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main id="main">{children}</main>
      <GameReveal />
    </>
  );
}
