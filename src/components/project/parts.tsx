import { ArrowUpRight } from "lucide-react";
import { labels, type Project } from "@content/data";
import { copy, copyList, todoAttr } from "@/lib/content";

/** Dash-marked list. Shared by the home-page exhibits and the case-study pages. */
export function Bullets({
  items,
  className = "",
  highlight = false,
}: {
  items: string[];
  className?: string;
  /** Results: brighter text and an accent marker so outcomes stand out from method. */
  highlight?: boolean;
}) {
  const shown = copyList(items);
  if (!shown.length) return null;
  return (
    <ul className={`space-y-2 ${className}`}>
      {shown.map((item) => (
        <li key={item} className={`flex gap-3 ${highlight ? "text-fg" : "text-fg-body"}`} {...todoAttr(item)}>
          <span
            aria-hidden="true"
            className={`mt-[0.7em] h-px w-3 shrink-0 ${highlight ? "bg-accent-teal" : "bg-fg-muted"}`}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Repo button plus live-demo button (or the "no demo yet" note). */
export function ProjectLinks({ project }: { project: Project }) {
  const note = copy(project.demoNote);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={project.repo} className="btn-ghost" target="_blank" rel="noreferrer">
        {labels.repo}
        <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
        <span className="sr-only">— {project.title}</span>
      </a>
      {project.live ? (
        <a href={project.live} className="btn-accent" target="_blank" rel="noreferrer">
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

/** Tech-stack chips. */
export function Stack({ items }: { items: string[] }) {
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
