import { ArrowDown } from "lucide-react";
import { nav } from "@content/data";
import { Hud } from "./Hud";

/** Fixed top bar on the shared `.shell` grid: chapter HUD left, section links + résumé right. */
export function Nav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-bg/80 to-transparent">
      <div className="shell flex items-center justify-between py-4 md:py-6">
        <Hud />
        <nav aria-label="Primary" className="pointer-events-auto flex items-center gap-6">
          <ul className="flex gap-4 font-mono text-[0.6875rem] tracking-[0.12em] uppercase md:gap-7">
            {nav.links.map((link) => (
              <li key={link.href} className={link.mobile ? "" : "hidden lg:block"}>
                <a href={link.href} className="link-underline text-fg-muted transition-colors hover:text-fg">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={nav.resume.href}
            download=""
            className="hidden items-center gap-1.5 rounded-arch border border-line px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.12em] text-fg uppercase transition-colors hover:border-fg-muted md:inline-flex"
          >
            {nav.resume.label}
            <ArrowDown aria-hidden="true" className="size-3" strokeWidth={1.5} />
          </a>
        </nav>
      </div>
    </header>
  );
}
