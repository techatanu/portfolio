import { origin } from "@content/data";
import { copy, todoAttr } from "@/lib/content";
import { ChapterShell } from "./ChapterShell";

/** About: "at a glance" facts on the left (column 1–4), prose on the right (column 5–12). */
export function Origin() {
  return (
    <ChapterShell id="origin">
      <div className="grid gap-12 md:grid-cols-12">
        <dl data-reveal="card" className="space-y-5 border-t border-line pt-5 md:col-span-4">
          {origin.facts.map((f) => (
            <div key={f.label}>
              <dt className="eyebrow">{f.label}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-fg">{f.value}</dd>
            </div>
          ))}
        </dl>
        <div className="space-y-6 md:col-span-8 md:col-start-5">
          {origin.paragraphs.map((p, i) =>
            copy(p) ? (
              <p
                key={p}
                data-reveal="card"
                className={`leading-relaxed ${i === 0 ? "text-xl text-fg md:text-2xl" : "text-lg text-fg-body md:text-xl"}`}
                {...todoAttr(p)}
              >
                {p}
              </p>
            ) : null,
          )}
        </div>
      </div>
    </ChapterShell>
  );
}
