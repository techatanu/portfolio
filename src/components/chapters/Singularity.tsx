import { manifesto } from "@content/data";
import { ChapterShell } from "./ChapterShell";

export function Singularity() {
  return (
    <ChapterShell id="singularity" className="flex flex-col justify-center">
      <div className="max-w-4xl space-y-8 md:ml-[16.666%]">
        {manifesto.map((line, i) => (
          <p
            key={line}
            className={`font-display leading-[1.15] tracking-[-0.02em] ${
              i === manifesto.length - 1 ? "text-3xl text-glow md:text-5xl" : "text-2xl text-fg md:text-4xl"
            }`}
          >
            {line}
          </p>
        ))}
      </div>
    </ChapterShell>
  );
}
