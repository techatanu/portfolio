import type { ReactNode } from "react";
import { chapterById, type ChapterId } from "@/lib/chapters";

type Props = {
  id: ChapterId;
  children: ReactNode;
  /** Classes for the full-width <section>. */
  className?: string;
  /** Classes for the inner `.shell` that holds the content. */
  innerClassName?: string;
  /** Hero and Contact render their own heading; every other section gets label + h2. */
  heading?: boolean;
  /** Every other section sits on the darker paper band. */
  alt?: boolean;
};

/**
 * One page section on the shared `.shell` grid. The header is a small spaced-caps label with
 * a hairline after it, then the heading — the same on every section so the page reads as one system.
 */
export function ChapterShell({
  id,
  children,
  className = "",
  innerClassName = "",
  heading = true,
  alt = false,
}: Props) {
  const chapter = chapterById(id);
  const headingId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-chapter={chapter.index}
      className={`relative scroll-mt-16 py-20 md:py-28 ${alt ? "band-alt" : ""} ${className}`}
    >
      <div className={`shell ${innerClassName}`}>
        {heading && (
          <header data-reveal="title" className="mb-10 md:mb-14">
            <div className="flex max-w-sm items-center gap-4">
              <p data-kicker className="kicker shrink-0">
                {chapter.title}
              </p>
              <span data-rule aria-hidden="true" className="h-px flex-1 origin-left bg-fg/25" />
            </div>
            <h2 id={headingId} className="mt-4 font-display text-display leading-[1.05] font-bold tracking-[-0.03em]">
              <span className="line-mask">
                <span data-rise className="block">
                  {chapter.heading}
                </span>
              </span>
            </h2>
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
