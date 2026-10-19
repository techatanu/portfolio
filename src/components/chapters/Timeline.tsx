import { timeline } from "@content/data";
import { copy, todoAttr } from "@/lib/content";
import { ChapterShell } from "./ChapterShell";

export function Timeline() {
  return (
    <ChapterShell id="timeline">
      <ol className="relative max-w-3xl border-l border-line md:ml-[16.666%]">
        {timeline.map((item) => {
          const date = copy(item.date);
          const org = copy(item.org);
          const detail = copy(item.detail);
          return (
            <li key={`${item.title}-${item.date}`} className="relative pb-12 pl-8 last:pb-0 md:pl-12">
              <span aria-hidden="true" className="timeline-node" />
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.12em] text-fg-muted uppercase">
                {date && <span {...todoAttr(date)}>{date}</span>}
                <span className="text-accent-blue">{item.kind}</span>
              </p>
              <h3 className="mt-2 font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">{item.title}</h3>
              {org && (
                <p className="mt-1 text-fg-muted" {...todoAttr(org)}>
                  {org}
                </p>
              )}
              {detail && (
                <p className="mt-3 text-fg" {...todoAttr(detail)}>
                  {detail}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </ChapterShell>
  );
}
