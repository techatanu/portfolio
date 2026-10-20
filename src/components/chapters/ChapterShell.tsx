import type { ReactNode } from "react";
import { chapterById, type ChapterId } from "@/lib/chapters";

type Props = {
  id: ChapterId;
  children: ReactNode;
  /** Classes for the full-width <section> (scroll length, flex placement). */
  className?: string;
  /** Classes for the inner `.shell` that holds the content. */
  innerClassName?: string;
  /** Hero and Contact render their own heading; every other chapter gets kicker + h2. */
  heading?: boolean;
};

/**
 * One scroll chapter. The <section> spans the viewport and reserves its scroll
 * length (chapters.ts); everything inside sits in `.shell`, the same grid the
 * nav uses, so every chapter shares one left edge.
 */
export function ChapterShell({ id, children, className = "", innerClassName = "", heading = true }: Props) {
  const chapter = chapterById(id);
  const headingId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-chapter={chapter.index}
      style={{ minHeight: `${chapter.minHeight}svh` }}
      className={`relative py-24 md:py-32 ${className}`}
    >
      <div className={`shell ${innerClassName}`}>
        {heading && (
          <header data-reveal="title" className="mb-12 md:mb-16">
            <p className="kicker">{chapter.hud}</p>
            <h2
              id={headingId}
              className="mt-4 font-display text-display leading-[0.95] font-semibold tracking-[-0.03em]"
            >
              {chapter.title}
            </h2>
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
