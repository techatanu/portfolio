import type { ReactNode } from "react";
import { Backdrop } from "@/components/ui/Backdrop";
import { SiteHeader } from "@/components/ui/SiteHeader";

/** Plain pages (quick view, case studies): paper backdrop, no smooth scroll. */
export default function PagesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Backdrop />
      <SiteHeader />
      <main id="main" className="pt-12 pb-24 md:pt-16">
        {children}
      </main>
    </>
  );
}
