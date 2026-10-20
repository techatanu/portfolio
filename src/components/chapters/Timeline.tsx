import { timeline, type Accent, type TimelineItem } from "@content/data";
import { copy, todoAttr } from "@/lib/content";
import { ChapterShell } from "./ChapterShell";

const KIND_ACCENT: Record<TimelineItem["kind"], Accent> = {
  education: "glow",
  experience: "blue",
  event: "amber",
  certification: "muted",
};

/** Colour key on the left (column 1–4), the timeline on the right (column 5–12). */
export function Timeline() {
  const kinds = [...new Set(timeline.map((t) => t.kind))];
  return (
    <ChapterShell id="timeline">
      <div className="grid gap-12 md:grid-cols-12">
        <ul aria-label="Legend" className="space-y-3 border-t border-line pt-5 md:col-span-4">
          {kinds.map((k) => (
            <li
              key={k}
              className={`accent-${KIND_ACCENT[k]} flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-[0.12em] text-fg-muted uppercase`}
            >
              <span aria-hidden="true" className="accent-dot" />
              {k}
            </li>
          ))}
        </ul>

        <ol className="relative border-l border-line md:col-span-8 md:col-start-5">
          {timeline.map((item) => {
            const date = copy(item.date);
            const org = copy(item.org);
            const detail = copy(item.detail);
            return (
              <li
                key={`${item.title}-${item.date}`}
                data-reveal="card"
                className={`accent-${KIND_ACCENT[item.kind]} relative pb-12 pl-8 last:pb-0 md:pl-12`}
              >
                <span aria-hidden="true" className="timeline-node" />
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.6875rem] tracking-[0.12em] text-fg-muted uppercase">
                  {date && <span {...todoAttr(date)}>{date}</span>}
                  <span style={{ color: "var(--accent)" }}>{item.kind}</span>
                </p>
                <h3 className="mt-2 font-display text-xl font-medium tracking-[-0.01em] md:text-2xl">{item.title}</h3>
                {org && (
                  <p className="mt-1 text-fg-muted" {...todoAttr(org)}>
                    {org}
                  </p>
                )}
                {detail && (
                  <p className="mt-3 text-fg-body" {...todoAttr(detail)}>
                    {detail}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </ChapterShell>
  );
}
