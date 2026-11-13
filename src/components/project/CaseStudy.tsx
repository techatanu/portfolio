import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { caseStudy, labels, type Project } from "@content/data";
import { copy, copyList, todoAttr } from "@/lib/content";
import { ProjectCover } from "./ProjectCover";
import { Bullets, ProjectLinks, Stack } from "./parts";

function Section({
  title,
  children,
  highlight = false,
}: {
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <section
      aria-label={title}
      className={highlight ? "rounded-arch border border-accent-teal/40 bg-accent-teal/5 p-6 md:p-8" : ""}
    >
      <h2 className="eyebrow">{title}</h2>
      <div className="mt-4 text-lg">{children}</div>
    </section>
  );
}

function Neighbour({ project, label, dir }: { project: Project; label: string; dir: "prev" | "next" }) {
  return (
    <Link
      href={`/projects/${project.slug}/`}
      className={`exhibit group block p-6 transition-colors hover:border-accent-teal ${dir === "next" ? "md:text-right" : ""}`}
    >
      <span className={`eyebrow flex items-center gap-2 ${dir === "next" ? "md:justify-end" : ""}`}>
        {dir === "prev" && <ArrowLeft aria-hidden="true" className="size-3.5" strokeWidth={1.5} />}
        {label}
        {dir === "next" && <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />}
      </span>
      <span className="mt-3 block font-display text-2xl font-semibold tracking-[-0.02em]">{project.title}</span>
    </Link>
  );
}

/** Case-study page body: problem -> role -> approach -> results -> next. Plain HTML, no motion. */
export function CaseStudy({ project, prev, next }: { project: Project; prev: Project; next: Project }) {
  const problem = copy(project.problem);
  const role = copy(project.role);
  const headline = copy(project.headline);
  const hasApproach = copyList(project.approach).length > 0;
  const hasResults = copyList(project.results).length > 0;
  const hasNext = copyList(project.next).length > 0;

  return (
    <article className="shell">
      <Link href="/#artifacts" className="link-underline inline-flex items-center gap-2 text-sm text-fg-body">
        <ArrowLeft aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
        {caseStudy.back}
      </Link>

      <header className="mt-8 max-w-4xl">
        <p className="font-mono text-xs tracking-[0.08em] text-accent-teal uppercase">{project.tags}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em] md:text-6xl">{project.title}</h1>
        <p className="mt-4 text-lg text-fg md:text-xl">{project.oneLiner}</p>
        <div className="mt-6">
          <ProjectLinks project={project} />
        </div>
      </header>

      <div className="mt-10">
        <ProjectCover project={project} priority banner />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-8">
          {problem && (
            <Section title={labels.problem}>
              <p className="text-fg-body" {...todoAttr(problem)}>
                {problem}
              </p>
            </Section>
          )}
          {role && (
            <Section title={labels.role}>
              <p className="text-fg-body" {...todoAttr(role)}>
                {role}
              </p>
            </Section>
          )}
          {hasApproach && (
            <Section title={labels.approach}>
              <Bullets items={project.approach} />
            </Section>
          )}
          <Section title={labels.results} highlight>
            {hasResults ? (
              <Bullets items={project.results} highlight />
            ) : (
              <p className="text-fg-muted">{caseStudy.noMetrics}</p>
            )}
          </Section>
          {hasNext && (
            <Section title={labels.next}>
              <Bullets items={project.next} />
            </Section>
          )}
        </div>

        <aside aria-label={caseStudy.glance} className="lg:col-span-4">
          <div className="exhibit space-y-6 p-6 lg:sticky lg:top-28">
            <h2 className="eyebrow">{caseStudy.glance}</h2>
            {headline && (
              <p className="border-l-2 border-accent-teal pl-3 font-display text-xl text-fg" {...todoAttr(headline)}>
                {headline}
              </p>
            )}
            <dl className="space-y-5">
              <div>
                <dt className="eyebrow">{caseStudy.category}</dt>
                <dd className="mt-2 text-fg-body">{caseStudy.categories[project.category]}</dd>
              </div>
              {role && (
                <div>
                  <dt className="eyebrow">{labels.role}</dt>
                  <dd className="mt-2 text-fg-body" {...todoAttr(role)}>
                    {role}
                  </dd>
                </div>
              )}
              <div>
                <dt className="eyebrow">{labels.stack}</dt>
                <dd className="mt-2">
                  <Stack items={project.stack} />
                </dd>
              </div>
            </dl>
            <ProjectLinks project={project} />
          </div>
        </aside>
      </div>

      <nav aria-label={caseStudy.moreProjects} className="mt-16 grid gap-4 border-t border-line pt-10 md:grid-cols-2">
        <Neighbour project={prev} label={caseStudy.prev} dir="prev" />
        <Neighbour project={next} label={caseStudy.next} dir="next" />
      </nav>
    </article>
  );
}
