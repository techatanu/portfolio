import { ArrowUpRight } from "lucide-react";
import { labels, projects, type Project } from "@content/data";
import { copy, copyList, todoAttr } from "@/lib/content";
import { ChapterShell } from "./ChapterShell";

const pad = (n: number) => String(n).padStart(2, "0");

function Bullets({ items, className = "" }: { items: string[]; className?: string }) {
  const shown = copyList(items);
  if (!shown.length) return null;
  return (
    <ul className={`space-y-2 ${className}`}>
      {shown.map((item) => (
        <li key={item} className="flex gap-3 text-fg-muted" {...todoAttr(item)}>
          <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-fg-muted" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Links({ project }: { project: Project }) {
  const note = copy(project.demoNote);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={project.repo} className="btn-ghost" target="_blank" rel="noreferrer">
        {labels.repo}
        <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
        <span className="sr-only">— {project.title}</span>
      </a>
      {project.live ? (
        <a href={project.live} className="btn-ghost" target="_blank" rel="noreferrer">
          {labels.live}
          <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
          <span className="sr-only">— {project.title}</span>
        </a>
      ) : note ? (
        <span className="font-mono text-[0.6875rem] tracking-[0.06em] text-fg-muted" {...todoAttr(note)}>
          {note}
        </span>
      ) : null}
    </div>
  );
}

function Stack({ items }: { items: string[] }) {
  return (
    <ul aria-label={labels.stack} className="flex flex-wrap gap-2">
      {items.map((s) => (
        <li key={s} className="chip">
          {s}
        </li>
      ))}
    </ul>
  );
}

function FeaturedExhibit({ project, index, total }: { project: Project; index: number; total: number }) {
  const sections = [
    { label: labels.approach, items: project.approach },
    { label: labels.results, items: project.results },
    { label: labels.next, items: project.next },
  ];
  const problem = copy(project.problem);
  const role = copy(project.role);
  return (
    <article aria-labelledby={`${project.slug}-title`} className="exhibit p-6 md:p-10 lg:p-12">
      <div className="flex items-center justify-between font-mono text-[0.6875rem] tracking-[0.12em] text-fg-muted uppercase">
        <span className="text-accent-amber">{labels.featured}</span>
        <span>
          {pad(index + 1)} / {pad(total)}
        </span>
      </div>
      <p className="mt-8 font-mono text-xs tracking-[0.08em] text-fg-muted uppercase">{project.tags}</p>
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
              <p className="mt-3 text-fg-muted" {...todoAttr(problem)}>
                {problem}
              </p>
            </div>
          )}
          {role && (
            <div>
              <h4 className="eyebrow">{labels.role}</h4>
              <p className="mt-3 text-fg-muted" {...todoAttr(role)}>
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
                <Bullets items={s.items} className="mt-3" />
              </div>
            ) : null,
          )}
        </div>
      </div>

      <div className="mt-10 border-t border-line pt-6">
        <Links project={project} />
      </div>
    </article>
  );
}

function Exhibit({ project, index, total }: { project: Project; index: number; total: number }) {
  return (
    <article aria-labelledby={`${project.slug}-title`} className="exhibit flex flex-col p-6 md:p-8">
      <div className="flex items-center justify-between font-mono text-[0.6875rem] tracking-[0.12em] text-fg-muted uppercase">
        <span>{project.tags}</span>
        <span aria-hidden="true">
          {pad(index + 1)} / {pad(total)}
        </span>
      </div>
      <h3
        id={`${project.slug}-title`}
        className="mt-6 font-display text-2xl font-semibold tracking-[-0.02em] md:text-3xl"
      >
        {project.title}
      </h3>
      <p className="mt-3 text-fg">{project.oneLiner}</p>
      <Bullets items={project.approach.slice(0, 3)} className="mt-5 text-sm" />
      <div className="mt-6">
        <Stack items={project.stack} />
      </div>
      <div className="mt-auto pt-8">
        <Links project={project} />
      </div>
    </article>
  );
}

export function Artifacts() {
  const ordered = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];
  const [featured, ...rest] = ordered;
  return (
    <ChapterShell id="artifacts">
      {/* Phase 5 turns this into the pinned horizontal gallery; the list stays as the no-JS layout. */}
      <div className="space-y-6">
        {featured && <FeaturedExhibit project={featured} index={0} total={ordered.length} />}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((p, i) => (
            <Exhibit key={p.slug} project={p} index={i + 1} total={ordered.length} />
          ))}
        </div>
      </div>
    </ChapterShell>
  );
}
