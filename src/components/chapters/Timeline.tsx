"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { timeline } from "@content/data";
import { copy, todoAttr } from "@/lib/content";
import { ChapterShell } from "./ChapterShell";

/**
 * Experience as tabs: the milestones listed on the left, the selected one open in a card on the right.
 * Arrow keys move between tabs (WAI-ARIA tabs pattern). On phones the list sits above the card.
 */
export function Timeline() {
  const [index, setIndex] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const item = timeline[index];
  const date = copy(item.date);
  const org = copy(item.org);
  const detail = copy(item.detail);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step =
      e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + timeline.length) % timeline.length;
    setIndex(next);
    tabs.current[next]?.focus();
  };

  return (
    <ChapterShell id="timeline" alt>
      <div className="grid gap-8 md:grid-cols-12 md:gap-10">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Milestones"
          onKeyDown={onKey}
          className="md:col-span-4"
        >
          {timeline.map((t, i) => {
            const tDate = copy(t.date);
            return (
              <button
                key={`${t.title}-${t.date}`}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`exp-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-controls="exp-panel"
                tabIndex={i === index ? 0 : -1}
                onClick={() => setIndex(i)}
                className="exp-tab flex w-full items-start gap-3 rounded-[8px] px-3 py-3 text-left"
              >
                <span
                  aria-hidden="true"
                  className="exp-dot mt-1.5 size-2.5 shrink-0 rounded-full border border-fg/40"
                />
                <span className="min-w-0">
                  <span className="block text-sm leading-snug font-medium">{t.title}</span>
                  <span className="mt-0.5 block text-xs text-fg-muted capitalize">
                    {t.kind}
                    {tDate ? ` · ${tDate}` : ""}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          id="exp-panel"
          role="tabpanel"
          aria-labelledby={`exp-tab-${index}`}
          className="exhibit self-start p-6 hover:translate-x-0 hover:translate-y-0 md:col-span-8 md:p-9"
        >
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {date && (
              <span className="font-medium" {...todoAttr(date)}>
                {date}
              </span>
            )}
            <span className="text-fg-muted capitalize">{item.kind}</span>
          </p>
          <h3 className="mt-3 text-2xl leading-tight font-bold tracking-[-0.02em] md:text-3xl">{item.title}</h3>
          {org && (
            <p className="mt-2 text-fg-muted" {...todoAttr(org)}>
              {org}
            </p>
          )}
          {detail && (
            <p className="mt-6 flex gap-3 leading-relaxed text-fg-body" {...todoAttr(detail)}>
              <span aria-hidden="true" className="mt-2 size-2 shrink-0 rounded-[2px] border border-fg bg-yellow" />
              {detail}
            </p>
          )}
        </div>
      </div>
    </ChapterShell>
  );
}
