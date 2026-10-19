import { MapPin } from "lucide-react";
import { origin, profile } from "@content/data";
import { copy, todoAttr } from "@/lib/content";
import { ChapterShell } from "./ChapterShell";

export function Origin() {
  return (
    <ChapterShell id="origin">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="flex items-start gap-2 font-mono text-xs tracking-[0.08em] text-fg-muted uppercase">
            <MapPin aria-hidden="true" className="mt-px size-3.5 shrink-0" strokeWidth={1.5} />
            <span>
              {profile.location}
              <br />
              <span className="text-fg-muted/70">{origin.locationTag}</span>
            </span>
          </p>
        </div>
        <div className="space-y-6 md:col-span-8 lg:col-span-7">
          {origin.paragraphs.map((p) =>
            copy(p) ? (
              <p key={p} className="text-xl leading-relaxed text-fg md:text-2xl" {...todoAttr(p)}>
                {p}
              </p>
            ) : null,
          )}
        </div>
      </div>
    </ChapterShell>
  );
}
