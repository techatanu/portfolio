import { manifesto } from "@content/data";
import { ChapterShell } from "./ChapterShell";

/** What I'm looking for: the ask first (yellow card), then what backs it up. */
export function Singularity() {
  return (
    <ChapterShell id="singularity" alt>
      <div className="grid gap-5 md:grid-cols-2">
        {manifesto.map((item, i) => (
          <div
            key={item.label}
            data-reveal="card"
            className={`rounded-arch border-[1.5px] border-fg p-6 md:p-8 ${i === 0 ? "bg-yellow shadow-[4px_4px_0_var(--fg)]" : "bg-bg-elev"}`}
          >
            <p className="eyebrow text-fg">{item.label}</p>
            <p
              className={`mt-3 leading-snug tracking-[-0.01em] ${i === 0 ? "text-xl font-bold md:text-2xl" : "text-lg font-medium"}`}
            >
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </ChapterShell>
  );
}
