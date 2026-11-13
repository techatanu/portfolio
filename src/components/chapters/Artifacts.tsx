import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { caseStudy, labels, projects, type Project } from "@content/data";
import { copy, todoAttr } from "@/lib/content";
import { ProjectCover } from "@/components/project/ProjectCover";
import { Stack } from "@/components/project/parts";
import { ChapterShell } from "./ChapterShell";

const pad = (n: number) => String(n).padStart(2, "0");

/** One project as a row: the cover in a framed card, the write-up beside it. Rows alternate sides. */
function ProjectRow({ project, index }: { project: Project; index: number }) {
  const headline = copy(project.headline);
  const flip = index % 2 === 1;
  const href = `/projects/${project.slug}/`;
  return (
    <article aria-labelledby={`${project.slug}-title`} className="grid items-center gap-8 md:grid-cols-12 md:gap-12">
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        className={`exhibit block p-2.5 md:col-span-7 ${flip ? "md:order-2" : ""}`}
      >
        <ProjectCover project={project} className="rounded-[6px] border-0" />
      </Link>

      <div data-reveal="card" className={`md:col-span-5 ${flip ? "md:order-1" : ""}`}>
        <p className="text-xs text-fg-muted">
          <span className="font-medium text-fg">{pad(index + 1)}</span> · {caseStudy.categories[project.category]}
        </p>
        <h3
          id={`${project.slug}-title`}
          className="mt-2 text-3xl leading-tight font-bold tracking-[-0.03em] md:text-4xl"
        >
          {project.title}
        </h3>
        <p className="mt-3 leading-relaxed text-fg-body">{project.oneLiner}</p>
        {headline && (
          <p className="badge mt-5" {...todoAttr(headline)}>
            {headline}
          </p>
        )}
        <div className="mt-5">
          <Stack items={project.stack} />
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link href={href} className="btn-ghost">
            {labels.caseStudy}
            <ArrowRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
            <span className="sr-only">— {project.title}</span>
          </Link>
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="link-underline inline-flex items-center gap-1.5 text-sm"
          >
            {labels.repo}
            <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
            <span className="sr-only">— {project.title}</span>
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="link-underline inline-flex items-center gap-1.5 text-sm"
            >
              {labels.live}
              <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.75} />
              <span className="sr-only">— {project.title}</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/** Only the repos pinned on GitHub (see `pinnedRepos` in data.ts), in profile order. */
export function Artifacts() {
  return (
    <ChapterShell id="artifacts">
      <div className="space-y-20 md:space-y-28">
        {projects.map((p, i) => (
          <ProjectRow key={p.slug} project={p} index={i} />
        ))}
      </div>
    </ChapterShell>
  );
}
