import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { contact, hero, labels, profile, projects, quickView } from "@content/data";
import { HeroPortrait } from "@/components/ui/HeroPortrait";
import { ChapterShell } from "./ChapterShell";

export function Hero() {
  const [first, ...rest] = hero.name.split(" ");
  // Counted from data.ts so the numbers can never drift from the project list.
  const stats = [
    `${projects.length} ${labels.projectCount}`,
    `${projects.filter((p) => p.live).length} ${labels.liveCount}`,
    profile.location,
  ];

  return (
    <ChapterShell
      id="hero"
      heading={false}
      className="isolate flex flex-col justify-end overflow-hidden pt-28 pb-10 md:pb-14"
    >
      {/* Portrait: behind the name on mobile, to the right on desktop. Breaks into pixels on scroll. */}
      <HeroPortrait />

      <p className="kicker hero-in">{hero.credential}</p>

      <h1 id="hero-title" className="mt-6 font-display text-hero leading-[0.86] font-semibold tracking-[-0.045em]">
        {/* Each line rises out of its own mask on load (CSS only, so it runs without JS). */}
        <span className="line-mask">
          <span className="hero-line block">{first}</span>
        </span>
        <span className="line-mask">
          <span className="hero-line block [--d:0.32s]">{rest.join(" ")}</span>
        </span>
      </h1>

      <div className="hero-in mt-8 max-w-2xl space-y-5 [--d:0.6s] md:mt-10">
        <p className="text-lg font-medium text-fg md:text-2xl">{hero.role}</p>
        {/* Hidden on phones so name, role, badge and contact stay above the fold (recruiter test). */}
        <p className="hidden max-w-xl text-base leading-relaxed text-fg-body sm:block md:text-lg">{hero.summary}</p>
        <p className="badge">
          <span className="badge-dot" aria-hidden="true" />
          {hero.badge}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a href={`mailto:${profile.email}`} className="btn-primary">
            {hero.primaryCta}
            <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.5} />
          </a>
          {contact.links.slice(0, 2).map((link) => (
            <a key={link.label} href={link.href} className="btn-ghost" target="_blank" rel="noreferrer">
              {link.label}
              <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </div>

      <div className="hero-in mt-10 flex flex-col gap-4 border-t border-line pt-5 [--d:0.8s] md:flex-row md:items-center md:justify-between">
        <ul className="hidden flex-wrap gap-x-6 gap-y-2 font-mono text-[0.6875rem] tracking-[0.12em] text-fg-muted uppercase sm:flex">
          {stats.map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span aria-hidden="true" className="size-1 bg-accent-teal" />
              {s}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href={quickView.href} className="eyebrow link-underline flex items-center gap-2 hover:text-fg">
            {quickView.heroLink}
            <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
          </Link>
          <a href="#origin" className="eyebrow hidden items-center gap-3 hover:text-fg sm:flex">
            <ArrowDown aria-hidden="true" className="scroll-cue size-3.5" strokeWidth={1.5} />
            {hero.scrollCue}
          </a>
        </div>
      </div>
    </ChapterShell>
  );
}
