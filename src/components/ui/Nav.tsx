import { nav } from "@content/data";
import { Hud } from "./Hud";

/** Fixed top bar: chapter HUD on the left, section links on the right. */
export function Nav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 md:px-8 md:py-6">
      <Hud />
      <nav aria-label="Primary" className="pointer-events-auto">
        <ul className="flex gap-4 font-mono text-[0.6875rem] tracking-[0.12em] uppercase md:gap-8">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="link-underline text-fg-muted transition-colors hover:text-fg">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
