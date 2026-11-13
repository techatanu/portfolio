import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { hero, nav, profile, quickView } from "@content/data";

const links = [
  { label: "Projects", href: "/#artifacts" },
  { label: quickView.navLabel, href: quickView.href },
  { label: "Contact", href: "/#contact" },
];

/** Header for the plain pages: same `.shell` grid as the journey Nav, with the availability chip. */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/50 bg-bg/75 backdrop-blur-md print:hidden">
      <div className="shell flex items-center justify-between gap-4 py-3.5 md:py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-display text-lg font-semibold tracking-[-0.02em] hover:text-accent-teal">
            {profile.name}
          </Link>
          <span className="badge hidden lg:inline-flex">
            <span className="badge-dot" aria-hidden="true" />
            {hero.badge}
          </span>
        </div>
        <nav aria-label="Primary" className="flex items-center gap-6">
          <ul className="flex gap-4 text-sm md:gap-7">
            {links.map((link) => (
              <li key={link.href} className={link.label === "Contact" ? "hidden sm:block" : ""}>
                <Link href={link.href} className="link-underline text-fg-muted transition-colors hover:text-fg">
                  {link.label}
                </Link>
              </li>
            ))}
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
