import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { hero, profile, quickView } from "@content/data";

/**
 * Hero: the name set very large on grid paper, one statement under it, and two actions.
 * Enters once on load (CSS only, so it also runs without JS).
 */
export function Hero() {
  const [first, ...rest] = profile.name.split(" ");
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      data-chapter={0}
      className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden py-16 md:py-20"
    >
      <div aria-hidden="true" className="grid-paper absolute inset-0 -z-10" />
      <div className="shell">
        <div className="hero-in flex max-w-sm items-center gap-4 [--d:0s]">
          <p className="kicker shrink-0">{hero.place}</p>
          <span aria-hidden="true" className="h-px flex-1 bg-fg/25" />
        </div>

        <h1
          id="hero-title"
          className="mt-6 font-display text-hero leading-[0.88] font-bold tracking-[-0.03em] uppercase"
        >
          <span className="line-mask">
            <span className="hero-line block">{first}</span>
          </span>
          <span className="line-mask">
            <span className="hero-line block [--d:0.14s]">{rest.join(" ")}</span>
          </span>
        </h1>

        <p className="hero-in mt-8 max-w-3xl text-[clamp(1.5rem,3.4vw,2.6rem)] leading-[1.15] font-medium tracking-[-0.02em] [--d:0.45s]">
          {hero.statement.map((part) =>
            part.strong ? (
              <strong key={part.text} className="font-bold">
                {part.text}
              </strong>
            ) : (
              <span key={part.text}>{part.text}</span>
            ),
          )}
        </p>

        <div className="hero-in mt-10 flex flex-wrap items-center gap-4 [--d:0.6s]">
          <a href="#artifacts" className="btn-ghost gap-3 pr-1.5">
            {hero.projectsCta}
            <span className="grid size-8 place-items-center rounded-full border-[1.5px] border-fg bg-yellow">
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
            </span>
          </a>
          <p className="inline-flex min-h-11 flex-wrap items-center gap-3 rounded-full border-[1.5px] border-dashed border-fg/40 px-4 py-1.5 text-sm text-fg-body">
            <span aria-hidden="true" className="size-2 rounded-full border border-fg bg-yellow" />
            {hero.badge}
            <Link
              href={quickView.href}
              className="badge rounded-full py-0.5 text-[0.6875rem] hover:bg-fg hover:text-bg"
            >
              {hero.quickTag}
            </Link>
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="link-underline inline-flex items-center gap-1.5 text-sm font-medium"
          >
            {hero.primaryCta}
            <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </section>
  );
}
