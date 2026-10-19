import { skills } from "@content/data";
import { ChapterShell } from "./ChapterShell";

/** Skill groups as a grid of panels; each group has its own accent colour (dot + chip borders). */
export function Skills() {
  return (
    <ChapterShell id="skills">
      <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group, i) => (
          <div key={group.group} className={`accent-${group.accent} bg-bg/90 p-6 md:p-8`}>
            <h3 className="flex items-center justify-between gap-3 font-mono text-xs tracking-[0.12em] text-fg uppercase">
              <span className="flex items-center gap-2.5">
                <span aria-hidden="true" className="accent-dot" />
                {group.group}
              </span>
              <span aria-hidden="true" className="text-fg-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
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
