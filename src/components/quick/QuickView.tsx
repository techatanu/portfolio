import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { hero, origin, profile, projects, quickView, skills, timeline } from "@content/data";
import { copy, todoAttr } from "@/lib/content";
import { QuickActions } from "./QuickActions";
import { QuickProjectCard } from "./QuickProjectCard";

const h2 = "eyebrow border-b border-line pb-2";

/** The 60-second recruiter page: identity, key projects, skills, milestones, contact. */
export function QuickView() {
  const top = quickView.topProjects.flatMap((slug) => projects.find((p) => p.slug === slug) ?? []);
  const groups = quickView.skillGroups.flatMap((g) => skills.find((s) => s.group === g) ?? []);

  return (
    <div className="shell space-y-14 md:space-y-16">
      <section aria-labelledby="quick-title" className="space-y-5">
        <p className="kicker">{hero.credential}</p>
        <h1
          id="quick-title"
          className="font-display text-5xl leading-[0.95] font-semibold tracking-[-0.04em] md:text-7xl"
        >
          {profile.name}
        </h1>
        <p className="text-lg font-medium text-fg md:text-2xl">{profile.role}</p>
        <p className="max-w-xl text-fg-body">{quickView.intro}</p>
        <p className="badge">
          <span className="badge-dot" aria-hidden="true" />
          {hero.badge}
        </p>
        <dl className="grid max-w-3xl gap-x-8 gap-y-3 text-sm sm:grid-cols-[7rem_1fr]">
          {origin.facts.map((f) => (
            <div key={f.label} className="contents">
              <dt className="eyebrow pt-0.5">{f.label}</dt>
              <dd className="text-fg-body">{f.value}</dd>
            </div>
          ))}
        </dl>
        <QuickActions withPrint />
      </section>

      <section aria-labelledby="quick-projects" className="space-y-5">
        <h2 id="quick-projects" className={h2}>
          {quickView.sections.projects}
        </h2>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {top.map((p) => (
            <QuickProjectCard key={p.slug} project={p} />
          ))}
        </ul>
        <Link
          href="/#artifacts"
          className="link-underline quick-no-print inline-flex items-center gap-2 font-mono text-xs tracking-[0.1em] uppercase"
        >
          {quickView.allProjects} ({projects.length})
          <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
        </Link>
      </section>

      <section aria-labelledby="quick-skills" className="space-y-5">
        <h2 id="quick-skills" className={h2}>
          {quickView.sections.skills}
        </h2>
        <dl className="space-y-4">
          {groups.map((g) => (
            <div key={g.group} className="quick-entry grid gap-2 sm:grid-cols-[12rem_1fr]">
              <dt className="eyebrow pt-1">{g.group}</dt>
              <dd>
                <ul className="flex flex-wrap gap-1.5">
                  {g.items.map((item) => (
                    <li key={item} className="chip">
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="quick-experience" className="space-y-5">
        <h2 id="quick-experience" className={h2}>
          {quickView.sections.experience}
        </h2>
        <ol className="space-y-5">
          {timeline.map((t) => {
            const date = copy(t.date);
            const detail = copy(t.detail);
            const org = copy(t.org);
            return (
              <li
                key={`${t.date}-${t.title}`}
                className={`quick-entry grid gap-1 ${date ? "sm:grid-cols-[10rem_1fr] sm:gap-6" : ""}`}
              >
                {date ? (
                  <p className="eyebrow pt-1" {...todoAttr(t.date)}>
                    {date}
                  </p>
                ) : null}
                <div>
                  <h3 className="font-medium text-fg">{t.title}</h3>
                  {org ? (
                    <p className="text-sm text-fg-muted" {...todoAttr(t.org)}>
                      {org}
                    </p>
                  ) : null}
                  {detail ? (
                    <p className="mt-1 text-sm text-fg-body" {...todoAttr(t.detail)}>
                      {detail}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="quick-contact" className="space-y-5">
        <h2 id="quick-contact" className={h2}>
          {quickView.sections.contact}
        </h2>
        <p>
          <a href={`mailto:${profile.email}`} className="link-underline font-mono text-lg text-fg">
            {profile.email}
          </a>
        </p>
        <QuickActions />
        <Link
          href="/"
          className="link-underline quick-no-print inline-flex items-center gap-2 font-mono text-xs tracking-[0.1em] uppercase"
        >
          {quickView.fullSite}
          <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
        </Link>
      </section>
    </div>
  );
}
