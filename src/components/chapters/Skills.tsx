"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { projects, skills, skillsUi } from "@content/data";
import { ChapterShell } from "./ChapterShell";

type Used = { slug: string; title: string };

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9.+#]+/g, " ")
    .trim();
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Which projects use a skill: listed in the project's stack, or named in its write-up.
 * Derived from data.ts, so it can never claim a project the copy doesn't support.
 */
function usedIn(skill: string): Used[] {
  const key = norm(skill);
  const word = new RegExp(`(^|[^a-z0-9])${escape(key)}([^a-z0-9]|$)`);
  // "Llama 3.x (Groq)" in the skills list is "Groq · Llama 3.3" in a stack.
  const llama = key.startsWith("llama");
  return projects
    .filter((p) => {
      if (p.stack.some((s) => norm(s) === key || (llama && norm(s).includes("llama")))) return true;
      const text = norm([p.oneLiner, p.tags, p.problem, ...p.approach].join(" "));
      return word.test(text);
    })
    .map((p) => ({ slug: p.slug, title: p.title }));
}

const USAGE = new Map(skills.flatMap((g) => g.items.map((item) => [item, usedIn(item)] as const)));
const GROUP_OF = new Map(skills.flatMap((g) => g.items.map((item) => [item, g.group] as const)));

/**
 * Skills as a ledger you can inspect: hover, focus or tap a skill and it turns yellow,
 * the rest step back, and the bar on top says which of my projects use it (with links).
 * Clicking pins a skill; Esc or clicking it again clears it. Works the same by keyboard.
 */
export function Skills() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hovered ?? pinned;
  const used = active ? (USAGE.get(active) ?? []) : [];

  const clear = useCallback(() => setPinned(null), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && clear();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clear]);

  return (
    <ChapterShell id="skills" alt>
      {/* Inspector: stays under the nav while you browse the panels. */}
      <div
        aria-live="polite"
        className="skill-inspector sticky top-20 z-10 mb-8 flex min-h-16 flex-col gap-2 rounded-arch border-[1.5px] border-fg px-5 py-4 md:flex-row md:items-center md:justify-between md:gap-6"
        data-active={active ? "" : undefined}
      >
        {active ? (
          <>
            <p className="flex min-w-0 items-baseline gap-3">
              <span className="text-lg font-bold">{active}</span>
              <span className="eyebrow truncate">{GROUP_OF.get(active)}</span>
            </p>
            {used.length ? (
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-body">
                <span className="text-fg-muted">{skillsUi.usedIn}</span>
                {used.map((u) => (
                  <Link
                    key={u.slug}
                    href={`/projects/${u.slug}/`}
                    className="link-underline inline-flex items-center gap-1.5 font-medium text-fg"
                  >
                    {u.title}
                    <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={1.5} />
                  </Link>
                ))}
              </p>
            ) : (
              <p className="text-sm text-fg-muted">{skillsUi.notInProjects}</p>
            )}
          </>
        ) : (
          <p className="text-sm text-fg-muted">{skillsUi.hint}</p>
        )}
      </div>

      {/* One row per group: the label on the left, the tags on the right, ruled like a ledger. */}
      <div
        className="skill-grid border-t-[1.5px] border-fg"
        data-active={active ? "" : undefined}
        onPointerLeave={() => setHovered(null)}
      >
        {skills.map((group, gi) => (
          <section
            key={group.group}
            aria-labelledby={`skill-group-${gi}`}
            className="grid gap-3 border-b border-fg/15 py-5 md:grid-cols-12 md:gap-6"
          >
            <h3 id={`skill-group-${gi}`} className="eyebrow pt-2 md:col-span-3">
              {group.group}
            </h3>
            <ul className="flex flex-wrap gap-2 md:col-span-9">
              {group.items.map((item) => {
                const count = USAGE.get(item)?.length ?? 0;
                return (
                  <li key={item}>
                    <button
                      type="button"
                      className="skill-chip"
                      data-on={active === item ? "" : undefined}
                      aria-pressed={pinned === item}
                      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(item)}
                      onFocus={() => setHovered(item)}
                      onBlur={() => setHovered(null)}
                      onClick={() => setPinned((p) => (p === item ? null : item))}
                    >
                      {item}
                      {count > 0 && (
                        <span className="skill-count" aria-label={`, used in ${count} project${count > 1 ? "s" : ""}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </ChapterShell>
  );
}
