import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { labels, type Project } from "@content/data";
import { copy, todoAttr } from "@/lib/content";

/** Compact project card for the quick view. */
export function QuickProjectCard({ project: p }: { project: Project }) {
  const demoNote = copy(p.demoNote);
  const role = copy(p.role);
  const headline = copy(p.headline);
  return (
    <li className="quick-card exhibit flex flex-col gap-3 p-5">
      <p className="eyebrow">{p.tags}</p>
      <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">{p.title}</h3>
      <p className="text-sm leading-relaxed text-fg-body">{p.oneLiner}</p>
      {headline ? (
        <p className="border-l-2 border-accent-amber pl-3 font-mono text-xs leading-relaxed text-fg">{headline}</p>
      ) : null}
      {role ? (
        <p className="text-sm text-fg-muted" {...todoAttr(p.role)}>
          <span className="eyebrow mr-2">{labels.role}</span>
          {role}
        </p>
      ) : null}
      <ul className="flex flex-wrap gap-1.5" aria-label={labels.stack}>
        {p.stack.slice(0, 5).map((s) => (
          <li key={s} className="chip">
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 font-mono text-xs tracking-[0.08em] uppercase">
        <a href={p.repo} target="_blank" rel="noreferrer" className="link-underline inline-flex items-center gap-1">
          {labels.repo}
          <ArrowUpRight aria-hidden="true" className="size-3" strokeWidth={1.5} />
        </a>
        {p.live ? (
          <a href={p.live} target="_blank" rel="noreferrer" className="link-underline inline-flex items-center gap-1">
            {labels.live}
            <ArrowUpRight aria-hidden="true" className="size-3" strokeWidth={1.5} />
          </a>
        ) : demoNote ? (
          <span className="text-fg-muted normal-case" {...todoAttr(p.demoNote)}>
            {demoNote}
          </span>
        ) : null}
        <Link
          href={`/projects/${p.slug}/`}
          className="link-underline quick-no-print inline-flex items-center gap-1 text-glow"
        >
          {labels.caseStudy}
          <ArrowRight aria-hidden="true" className="size-3" strokeWidth={1.5} />
        </Link>
      </div>
    </li>
  );
}
