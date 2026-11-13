import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { nav, profile, quickView } from "@content/data";

/** Fixed top bar on the shared `.shell` grid: name left, section links + résumé right. */
export function Nav() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 border-b border-line/50 bg-bg/75 backdrop-blur-md">
      <div className="shell flex items-center justify-between py-3.5 md:py-4">
        <a
          href="#hero"
          className="pointer-events-auto font-display text-lg font-semibold tracking-[-0.02em] transition-colors hover:text-accent-teal"
        >
          {profile.name}
        </a>
        <nav aria-label="Primary" className="pointer-events-auto flex items-center gap-6">
          <ul className="flex gap-3 text-sm sm:gap-4 md:gap-7">
            {nav.links.map((link) => (
              <li key={link.href} className={link.mobile ? "" : "hidden lg:block"}>
                <a href={link.href} className="link-underline text-fg-muted transition-colors hover:text-fg">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <Link href={quickView.href} className="link-underline text-fg-muted transition-colors hover:text-fg">
                {quickView.navLabel}
              </Link>
            </li>
          </ul>
          <a
            href={nav.resume.href}
            download={profile.resumeFileName}
            className="hidden items-center gap-1.5 rounded-arch border border-line px-3 py-1.5 text-sm text-fg transition-colors hover:border-fg-muted md:inline-flex"
          >
            {nav.resume.label}
            <ArrowDown aria-hidden="true" className="size-3" strokeWidth={1.5} />
          </a>
        </nav>
      </div>
    </header>
  );
}
