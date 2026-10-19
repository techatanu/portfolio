import type { ReactNode } from "react";
import { chapterById, type ChapterId } from "@/lib/chapters";

type Props = {
  id: ChapterId;
  children: ReactNode;
  className?: string;
  /** Hero renders its own h1; every other chapter gets the standard eyebrow + h2. */
  heading?: boolean;
};

/** One scroll chapter: reserves its scroll length from chapters.ts and labels itself for AT. */
export function ChapterShell({ id, children, className = "", heading = true }: Props) {
  const chapter = chapterById(id);
  const headingId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      data-chapter={chapter.index}
      style={{ minHeight: `${chapter.minHeight}svh` }}
      className={`relative px-4 py-24 md:px-12 md:py-32 lg:px-20 ${className}`}
    >
      {heading && (
        <header className="mb-12 md:mb-16">
          <p className="eyebrow">{chapter.hud}</p>
          <h2 id={headingId} className="mt-4 font-display text-display leading-[0.95] font-semibold tracking-[-0.03em]">
            {chapter.title}
          </h2>
        </header>
      )}
      {children}
    </section>
  );
}
