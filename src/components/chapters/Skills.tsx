import { skills } from "@content/data";
import { ChapterShell } from "./ChapterShell";

export function Skills() {
  return (
    <ChapterShell id="skills">
      <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {skills.map((group, i) => (
          <div key={group.group} className="bg-bg p-6 md:p-8">
            <h3 className="flex items-baseline justify-between font-mono text-xs tracking-[0.12em] text-fg-muted uppercase">
              {group.group}
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            </h3>
            <ul className="mt-6 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item} className="chip">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </ChapterShell>
  );
}
