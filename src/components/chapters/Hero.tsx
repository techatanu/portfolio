import { ArrowDown, ArrowUpRight } from "lucide-react";
import { contact, hero, profile } from "@content/data";
import { chapterById } from "@/lib/chapters";
import { HeroPortrait } from "@/components/ui/HeroPortrait";
import { ChapterShell } from "./ChapterShell";

export function Hero() {
  const [first, ...rest] = hero.name.split(" ");
  return (
    <ChapterShell
      id="hero"
      heading={false}
      className="isolate flex flex-col justify-end overflow-hidden pt-28 pb-10 md:pb-14"
    >
      {/* Portrait: behind the name on mobile, to the right on desktop. Dissolves into particles on scroll. */}
      <HeroPortrait />

      <p className="eyebrow">{chapterById("hero").hud}</p>

      <h1 id="hero-title" className="mt-6 font-display text-hero leading-[0.86] font-semibold tracking-[-0.045em]">
        <span className="block">{first}</span>
        <span className="block">{rest.join(" ")}</span>
      </h1>

      <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl space-y-5">
          <p className="text-lg text-fg md:text-2xl">{hero.role}</p>
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

        <a href="#origin" className="eyebrow flex items-center gap-3 self-start hover:text-fg md:self-end">
          <ArrowDown aria-hidden="true" className="scroll-cue size-3.5" strokeWidth={1.5} />
          {hero.scrollCue}
        </a>
      </div>
    </ChapterShell>
  );
}
