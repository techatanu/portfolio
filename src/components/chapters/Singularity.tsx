import { manifesto } from "@content/data";
import { ChapterShell } from "./ChapterShell";

/** What I'm looking for: the first card is the ask (highlighted), the rest back it up.
 *  Cards are translucent so the singularity glows through behind them. */
export function Singularity() {
  return (
    <ChapterShell id="singularity" className="flex flex-col justify-center">
      <div className="grid gap-px overflow-hidden border border-line bg-line/50 md:grid-cols-2">
        {manifesto.map((item, i) => (
          <div
            key={item.label}
            className={`bg-bg/70 p-6 backdrop-blur-[3px] md:p-10 ${i === 0 ? "accent-blue" : "accent-muted"}`}
          >
            <p className="flex items-center gap-2.5 font-mono text-[0.6875rem] tracking-[0.12em] text-fg-muted uppercase">
              <span aria-hidden="true" className="accent-dot" />
              {item.label}
            </p>
            <p
              className={`mt-4 font-display leading-[1.2] tracking-[-0.015em] ${
                i === 0 ? "text-2xl text-glow md:text-3xl" : "text-xl text-fg md:text-2xl"
              }`}
            >
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </ChapterShell>
  );
}
