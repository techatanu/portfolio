import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { labels, projects, type Project } from "@content/data";
import { copy, copyList, todoAttr } from "@/lib/content";
import { ProjectCover } from "@/components/project/ProjectCover";
import { Bullets, ProjectLinks, Stack } from "@/components/project/parts";
import { ChapterShell } from "./ChapterShell";

const pad = (n: number) => String(n).padStart(2, "0");

/** Link to the project's case-study page (trailingSlash export). */
function CaseStudyLink({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}/`} className="link-underline inline-flex items-center gap-2 text-fg">
      {labels.caseStudy}
      <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
      <span className="sr-only">— {project.title}</span>
    </Link>
  );
}

function FeaturedExhibit({ project, index, total }: { project: Project; index: number; total: number }) {
  const sections = [
    { label: labels.approach, items: project.approach, highlight: false },
    { label: labels.results, items: project.results, highlight: true },
    { label: labels.next, items: project.next, highlight: false },
  ];
  const problem = copy(project.problem);
  const role = copy(project.role);
  return (
    <article aria-labelledby={`${project.slug}-title`} data-cursor="view" className="exhibit p-6 md:p-10 lg:p-12">
      <ProjectCover project={project} banner className="mb-8" />
      <div className="flex items-center justify-between font-mono text-[0.6875rem] tracking-[0.12em] text-fg-muted uppercase">
        <span className="text-accent-amber">{labels.featured}</span>
        <span>
          {pad(index + 1)} / {pad(total)}
        </span>
      </div>
      <p className="mt-8 font-mono text-xs tracking-[0.08em] text-accent-teal uppercase">{project.tags}</p>
      <h3
        id={`${project.slug}-title`}
        className="mt-3 font-display text-4xl font-semibold tracking-[-0.03em] md:text-6xl"
      >
        {project.title}
      </h3>
      <p className="mt-4 max-w-3xl text-lg text-fg md:text-xl">{project.oneLiner}</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-5">
          {problem && (
            <div>
              <h4 className="eyebrow">{labels.problem}</h4>
              <p className="mt-3 text-fg-body" {...todoAttr(problem)}>
                {problem}
              </p>
            </div>
          )}
          {role && (
            <div>
              <h4 className="eyebrow">{labels.role}</h4>
              <p className="mt-3 text-fg-body" {...todoAttr(role)}>
                {role}
              </p>
            </div>
          )}
          <div>
            <h4 className="eyebrow">{labels.stack}</h4>
            <div className="mt-3">
              <Stack items={project.stack} />
            </div>
          </div>
        </div>
        <div className="space-y-8 lg:col-span-7">
          {sections.map((s) =>
            copyList(s.items).length ? (
              <div key={s.label}>
                <h4 className="eyebrow">{s.label}</h4>
                <Bullets items={s.items} highlight={s.highlight} className="mt-3" />
              </div>
            ) : null,
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <ProjectLinks project={project} />
        <CaseStudyLink project={project} />
      </div>
    </article>
  );
}

function Exhibit({
  project,
  index,
  total,
  className = "",
}: {
  project: Project;
  index: number;
  total: number;
  className?: string;
}) {
  const headline = copy(project.headline);
  return (
    <article
      aria-labelledby={`${project.slug}-title`}
      data-cursor="view"
      className={`exhibit flex flex-col p-6 md:p-8 ${className}`}
    >
      <ProjectCover project={project} className="mb-6" />
      <div className="flex items-center justify-between font-mono text-[0.6875rem] tracking-[0.12em] text-fg-muted uppercase">
        <span className="text-accent-teal">{project.tags}</span>
        <span aria-hidden="true">
          {pad(index + 1)} / {pad(total)}
        </span>
      </div>
      <h3 id={`${project.slug}-title`} className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em]">
        {project.title}
      </h3>
      <p className="mt-3 text-fg-body">{project.oneLiner}</p>
      {/* The one number worth remembering; method and details live on the case-study page. */}
      {headline && (
        <p className="mt-5 border-l-2 border-accent-teal pl-3 text-fg" {...todoAttr(headline)}>
          {headline}
        </p>
      )}
      <div className="mt-6">
        <Stack items={project.stack} />
      </div>
      <div className="mt-auto space-y-4 pt-8">
        <ProjectLinks project={project} />
        <CaseStudyLink project={project} />
      </div>
    </article>
  );
}

/**
 * Grid spans for the cards under the featured one, so no row is left with a hole:
 * rows of three, and a leftover pair or single is widened to fill its row.
 * (md is two columns, xl is six tracks: a third = 2 tracks, a half = 3, full = 6.)
 */
function span(i: number, count: number) {
  const tail = count % 3;
  const inTail = i >= count - tail;
  const xl = inTail ? (tail === 2 ? "xl:col-span-3" : "xl:col-span-6") : "xl:col-span-2";
  const md = count % 2 === 1 && i === count - 1 ? "md:col-span-2" : "";
  return `${md} ${xl}`;
}

/** Only the repos pinned on GitHub (see `pinnedRepos` in data.ts): the featured one, then the rest. */
export function Artifacts() {
  const ordered = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];
  const [featured, ...rest] = ordered;
  return (
    <ChapterShell id="artifacts">
      <div className="space-y-6">
        {featured && <FeaturedExhibit project={featured} index={0} total={ordered.length} />}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-6">
          {rest.map((p, i) => (
            <Exhibit key={p.slug} project={p} index={i + 1} total={ordered.length} className={span(i, rest.length)} />
          ))}
        </div>
      </div>
    </ChapterShell>
  );
}
