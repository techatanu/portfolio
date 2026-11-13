import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { nav, profile, quickView } from "@content/data";

/** Initials for the logo square, from the name in data.ts. */
export const initials = profile.name
  .split(" ")
  .map((w) => w[0])
  .join("");

type Props = {
  /** Section links. Home uses in-page anchors; the plain pages link back to the home page. */
  links?: { label: string; href: string; mobile?: boolean }[];
  homeHref?: string;
};

/** Sticky paper header: yellow initials square left, section links and the résumé pill right. */
export function Nav({ links = nav.links, homeHref = "#hero" }: Props) {
  return (
    <header className="site-rule sticky top-0 z-50 bg-bg/90 backdrop-blur-md print:hidden">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <a
          href={homeHref}
          aria-label={`${profile.name} — home`}
          className="grid size-9 place-items-center rounded-[8px] border-[1.5px] border-fg bg-yellow text-sm font-bold tracking-tight shadow-[2px_2px_0_var(--fg)] transition-transform hover:-translate-x-px hover:-translate-y-px"
        >
          {initials}
        </a>
        <nav aria-label="Primary" className="flex items-center gap-5 md:gap-7">
          <ul className="flex items-center gap-4 text-sm md:gap-6">
            {links.map((link) => (
              <li key={link.href} className={link.mobile === false ? "hidden lg:block" : ""}>
                <a href={link.href} className="link-underline text-fg-body transition-colors hover:text-fg">
                  {link.label}
                </a>
              </li>
            ))}
            <li className="hidden sm:block">
              <Link href={quickView.href} className="link-underline text-fg-body transition-colors hover:text-fg">
                {quickView.navLabel}
              </Link>
            </li>
          </ul>
          <a
            href={nav.resume.href}
            download={profile.resumeFileName}
            className="btn-ghost hidden min-h-9 px-4 text-xs md:inline-flex"
          >
            {nav.resume.label} PDF
            <ArrowDown aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
          </a>
        </nav>
      </div>
    </header>
  );
}
