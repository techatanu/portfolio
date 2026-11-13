import type { ReactNode } from "react";
import { Backdrop } from "@/components/ui/Backdrop";
import { SiteHeader } from "@/components/ui/SiteHeader";

/** Plain pages (quick view, case studies): CSS backdrop only — no WebGL, no smooth scroll. */
export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Backdrop />
      <SiteHeader />
      <main id="main" className="pt-28 pb-24 md:pt-36">
        {children}
      </main>
    </>
  );
}
