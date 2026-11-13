import { Nav } from "./Nav";

const links = [
  { label: "About", href: "/#origin", mobile: false },
  { label: "Projects", href: "/#artifacts" },
  { label: "Contact", href: "/#contact", mobile: false },
];

/** Header for the plain pages (quick view, case studies): the same bar, linking back to the home page. */
export function SiteHeader() {
  return <Nav links={links} homeHref="/" />;
}
